import psycopg2
import requests
import os
from bs4 import BeautifulSoup


def has_num(shifra):
    return any(char.isdigit() for char in shifra)

def fetch_tikeri_bs():
    url = 'https://www.mse.mk/mk/stats/symbolhistory/kmb'
    response = requests.get(url)

    if response.status_code != 200:
        print("Failed to retrieve the page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')

    dropdown = soup.find('select', {'id': 'Code'})
    options = dropdown.find_all('option') if dropdown else []

    tikeri = [option['value'] for option in options if not has_num(option['value'])]

    return tikeri
def insert_into_db(shifri_list):
    try:
        # TODO:
        #Da se smenet argumentive so env promenlivi
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB", "postgres"),
            user=os.getenv("POSTGRES_USER", "postgres"),
            password=os.getenv("POSTGRES_PASSWORD", "1234"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432")
        )

        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Stocks (
                stock_id SERIAL PRIMARY KEY,
                stock_name VARCHAR(50) UNIQUE
            );
        """)
        conn.commit()

        # TODO:
        #posle testiranjeto ovie 3 da se trgnet
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Stocks;")
        conn.commit()

        for shifra in shifri_list:
            try:
                cursor.execute("INSERT INTO Stocks (stock_name) VALUES (%s) ON CONFLICT (stock_name) DO NOTHING;", (shifra,))
            except Exception as e:
                print(f"Error inserting {shifra}: {e}")

        conn.commit()

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Database connection error: {e}")



def init():
    tikeri = fetch_tikeri_bs()
    insert_into_db(tikeri)
    return tikeri