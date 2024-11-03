from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from bs4 import BeautifulSoup
import time
import re
import psycopg2
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
            dbname='postgres',
            user='postgres',
            password='1234',
            host='localhost',
            port='5432'
        )

        #TODO:
        #Da se dodajt uslov da se kreirat tabela Stocks(stock_id, tiker) ako vekje ne postojt

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

if __name__ == '__main__':
    tikeri = fetch_tikeri_bs()
    insert_into_db(tikeri)