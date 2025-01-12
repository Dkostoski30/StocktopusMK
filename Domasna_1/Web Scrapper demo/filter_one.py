import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2 import pool
import logging
import os
import json
from dotenv import load_dotenv

load_dotenv()

def has_num(shifra):
    return any(char.isdigit() for char in shifra)

def check_table(table_name, conn):
    try:
        with conn.cursor() as cur:
            cur.execute(f"SELECT COUNT(*) FROM {table_name};")
            row_count = cur.fetchone()[0]
            return row_count == 0
    except Exception as e:
        logging.error(f"Error checking table {table_name}: {e}")
        return False

def fetch_tikeri_bs():
    url = 'https://www.mse.mk/mk/stats/symbolhistory/kmb'
    response = requests.get(url)

    if response.status_code != 200:
        logging.error("Failed to retrieve the page")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    dropdown = soup.find('select', {'id': 'Code'})
    options = dropdown.find_all('option') if dropdown else []

    if not options:
        url = 'https://www.mse.mk/en/stats/current-schedule'
        response = requests.get(url)
        if response.status_code != 200:
            logging.error("Failed to retrieve the page")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        links = soup.select('#continuousTradingMode-table tbody a')
        tikeri = [link.text for link in links if not has_num(link.text)]
    else:
        tikeri = [option['value'] for option in options if not has_num(option['value'])]

    return tikeri

def save_to_json(shifri_list):
    os.makedirs('./data', exist_ok=True)
    stocks_data = [{"stock_name": shifra} for shifra in shifri_list]
    try:
        with open('./data/stocks.json', 'w') as json_file:
            json.dump(stocks_data, json_file, indent=4)
        print("Stocks data saved to './data/stocks.json'")
    except Exception as e:
        logging.error(f"Error saving to JSON: {e}")

def get_all_tickers():
    query_all = "SELECT stock_name FROM stocks"
    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute(query_all)
            all_tickers = cursor.fetchall()
        return [ticker[0] for ticker in all_tickers]
    except Exception as e:
        logging.error(f"Error fetching tickers: {e}")
        return []
    finally:
        if conn:
            db_pool.putconn(conn)

def insert_into_db(shifri_list):
    conn = None
    try:
        conn = db_pool.getconn()
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
    finally:
        if conn:
            db_pool.putconn(conn)

def init():
    conn = None
    try:
        conn = db_pool.getconn()
        if check_table('stocks', conn):
            tikeri = fetch_tikeri_bs()
            save_to_json(tikeri)
            insert_into_db(tikeri)
            return tikeri
        else:
            return get_all_tickers()
    except Exception as e:
        logging.error(f"Error during initialization: {e}")
        return []
    finally:
        if conn:
            db_pool.putconn(conn)

db_pool = psycopg2.pool.SimpleConnectionPool(
    1,
    2,
    dbname=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT")
)

if __name__ == "__main__":
    try:
        tickers = init()
        print(f"Fetched tickers: {tickers}")
    except Exception as e:
        logging.error(f"Error in main execution: {e}")
    finally:
        if db_pool:
            db_pool.closeall()