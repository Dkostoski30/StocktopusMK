import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2 import pool
import logging
import os
from dotenv import load_dotenv

load_dotenv()


def has_num(shifra):
    return any(char.isdigit() for char in shifra)


def check_table(table_name, conn):
    cur = conn.cursor()
    count_query = f"SELECT COUNT(*) FROM {table_name};"
    cur.execute(count_query)
    row_count = cur.fetchone()[0]
    return row_count == 0


def fetch_tikeri_bs():
    url = 'https://www.mse.mk/mk/stats/symbolhistory/kmb'
    response = requests.get(url)

    if response.status_code != 200:
        logging.error("Failed to retrieve the page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')

    dropdown = soup.find('select', {'id': 'Code'})
    options = dropdown.find_all('option') if dropdown else []

    tikeri = [option['value'] for option in options if not has_num(option['value'])]

    return tikeri


def get_all_tickers():
    query_all = """
        SELECT stock_name
        FROM stocks
    """
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    cursor = conn.cursor()
    cursor.execute(query_all)
    all_tickers = cursor.fetchall()
    conn.close()
    return all_tickers


def insert_into_db(shifri_list):
    try:
        with db_pool.getconn() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS Stocks (
                        stock_id SERIAL PRIMARY KEY,
                        stock_name VARCHAR(50) UNIQUE
                    );
                """)
                conn.commit()

                if shifri_list:
                    insert_query = "INSERT INTO Stocks (stock_name) VALUES (%s) ON CONFLICT (stock_name) DO NOTHING;"
                    cursor.executemany(insert_query, [(shifra,) for shifra in shifri_list])
                    conn.commit()

    except psycopg2.DatabaseError as e:
        logging.error(f"Database error: {e}")
    except Exception as e:
        logging.error(f"Error: {e}")


def init(conn):
    if check_table('stocks', conn):
        tikeri = fetch_tikeri_bs()
        insert_into_db(tikeri)
        return tikeri
    else:
        return [entry[0] for entry in get_all_tickers()]


db_pool = psycopg2.pool.SimpleConnectionPool(
    1,
    2,
    dbname=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT")
)
