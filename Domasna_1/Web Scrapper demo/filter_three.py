import os
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, date
from psycopg2 import pool
import psycopg2
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from requests.adapters import HTTPAdapter
import json

load_dotenv()

MAX_WORKERS = 200
BATCH_SIZE = 100  # For efficient inserts

def normalize_numeric_string(value):
    """Convert a numeric string with commas to a format Python can interpret."""
    return value.replace('.', '').replace(',', '.')

# Helper function for consistent date conversion
def convert_date(date_str):
    return datetime.strptime(date_str, "%d.%m.%Y").strftime("%Y-%m-%d")


# Database connection pool initialization
def init_db_connection_pool():
    try:
        return psycopg2.pool.SimpleConnectionPool(
            1, MAX_WORKERS,
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
    except Exception as e:
        print(f"Failed to initialize database connection pool: {e}")
        raise


# Create stockdetails table if it doesn't exist
def ensure_table_exists(conn_pool):
    conn = conn_pool.getconn()
    try:
        with conn.cursor() as cursor:
            create_table_sql = """
                CREATE TABLE IF NOT EXISTS stockdetails (
                    stock_id int NOT NULL,
                    date DATE NOT NULL,
                    last_transaction_price FLOAT,
                    max_price FLOAT,
                    min_price FLOAT,
                    average_price FLOAT,
                    percentage_change FLOAT,
                    quantity BIGINT,
                    trade_volume BIGINT,
                    total_volume BIGINT,
                    PRIMARY KEY (stock_id, date),
                    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id)
                );
            """
            cursor.execute(create_table_sql)
            conn.commit()
        print("Stock details table verified/created.")
    except Exception as e:
        print(f"Error ensuring table exists: {e}")
        conn.rollback()
    finally:
        conn_pool.putconn(conn)


# Fetch historic data for a ticker using BeautifulSoup
def fetch_historic_data_bs4(ticker, start_date, session):
    base_url = f"https://www.mse.mk/mk/stats/symbolhistory/{ticker}"
    historic_data = []
    date_to = date.today() - timedelta(days=1)

    while date_to >= start_date:
        date_from = max(start_date, date_to - timedelta(days=365))

        params = {
            "FromDate": date_from.strftime("%d.%m.%Y"),
            "ToDate": date_to.strftime("%d.%m.%Y"),
        }

        try:
            response = session.get(base_url, params=params, timeout=(3, 10))
            soup = BeautifulSoup(response.text, 'html.parser')

            table = soup.select_one('#resultsTable > tbody')
            if table:
                rows = table.find_all('tr')
                for row in rows:
                    data_row = [cell.text.strip() for cell in row.find_all('td')]
                    if len(data_row) == 9:  # Ensure valid row format
                        historic_data.append(data_row)

            date_to = date_from - timedelta(days=1)

        except Exception as e:
            print(f"Error fetching data for {ticker}: {e}")
            break  # Exit loop if there's a repeated failure

    return historic_data


# Insert data into database using batch insert
def batch_insert_data(ticker, data, conn_pool):
    insert_sql = """
        INSERT INTO stockdetails (stock_id, date, last_transaction_price, max_price, min_price, 
                                  average_price, percentage_change, quantity, trade_volume, total_volume)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (stock_id, date) DO NOTHING;
    """
    conn = conn_pool.getconn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT stock_id FROM stocks WHERE stock_name = %s;", (ticker,))
            stock_id_result = cursor.fetchone()

            if not stock_id_result:
                print(f"Ticker '{ticker}' not found in stocks table.")
                return

            stock_id = stock_id_result[0]

            data_with_id = []
            try:
                for row in data:
                    normalized_row = [
                        row[i] if i > 0 else convert_date(row[i])
                        for i in range(len(row))
                    ]
                    data_with_id.append((
                        stock_id, normalized_row[0], normalized_row[1], normalized_row[2],
                        normalized_row[3], normalized_row[4], normalized_row[5],
                        normalized_row[6], normalized_row[7],normalized_row[8]
                    ))
            except ValueError as e:
                print(f"Data format issue for ticker '{ticker}': {e}")
                return

            for i in range(0, len(data_with_id), BATCH_SIZE):
                batch = data_with_id[i:i + BATCH_SIZE]
                cursor.executemany(insert_sql, batch)
            conn.commit()
            print(f"Inserted data for ticker: {ticker}")
    except Exception as e:
        print(f"Error inserting data for ticker '{ticker}': {e}")
        conn.rollback()
    finally:
        conn_pool.putconn(conn)


# Process individual stock entry
def process_stock_entry(entry, conn_pool, session):
    stock_id, latest_date = entry
    yesterday = date.today() - timedelta(days=1)

    if latest_date != yesterday:
        conn = conn_pool.getconn()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT stock_name FROM stocks WHERE stock_id = %s;", (stock_id,))
                stock_name = cursor.fetchone()[0]
                if stock_name:
                    data = fetch_historic_data_bs4(stock_name, latest_date, session)
                    batch_insert_data(stock_name, data, conn_pool)
        finally:
            conn_pool.putconn(conn)

def fetch_all_tickers_and_missing(latest_data):
    with psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    ) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT stock_id, stock_name FROM stocks;")
        all_tickers = cursor.fetchall()

        missing_tickers = [
            (ticker_id, date.today() - timedelta(days=3650))
            for ticker_id, _ in all_tickers if ticker_id not in {entry[0] for entry in latest_data}
        ]

        cursor.close()
        print(f'Missing tickers: {missing_tickers}')
        return latest_data + missing_tickers

# Main initialization
def init(latest_data):
    conn_pool = init_db_connection_pool()
    ensure_table_exists(conn_pool)

    # Combine missing and available tickers
    combined_data = fetch_all_tickers_and_missing(latest_data)

    # Setup requests session with retries
    session = requests.Session()
    adapter = HTTPAdapter(max_retries=3)
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    # Multithreading
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        executor.map(lambda entry: process_stock_entry(entry, conn_pool, session), combined_data)

    conn_pool.closeall()
    print("Data initialization complete.")
