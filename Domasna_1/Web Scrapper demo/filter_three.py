import os
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import as_completed
from datetime import timedelta, date
from psycopg2 import pool
import psycopg2
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from requests import adapters

import filter_two

load_dotenv()


def fetch_historic_data_bs4(ticker, start_date):
    base_url = f"https://www.mse.mk/mk/stats/symbolhistory/{ticker}"
    historic_data = []
    date_to = date.today() - timedelta(days=1)

    print(f"Fetching historic data for {ticker} from {start_date}")

    while date_to >= start_date:
        date_from = max(start_date, date_to - timedelta(days=365))

        params = {
            "FromDate": date_from.strftime("%d.%m.%Y"),
            "ToDate": date_to.strftime("%d.%m.%Y"),
        }

        response = requests.get(base_url, params=params)
        soup = BeautifulSoup(response.text, 'html.parser')

        table = soup.select_one('#resultsTable > tbody')
        if table:
            rows = table.find_all('tr')
            for row in rows:
                data_row = [cell.text for cell in row.find_all('td')]
                historic_data.append(data_row)

        date_to = date_from - timedelta(days=1)

    return historic_data


def process_stock_entry(entry, conn_pool):
    id = entry[0]
    latest_date = entry[1]
    yesterday = date.today() - timedelta(days=1)

    if latest_date < yesterday:
        try:
            with conn_pool.getconn() as conn:
                cursor = conn.cursor()
                stockname_query = f"SELECT stock_name FROM Stocks WHERE stock_id = '{id}';"
                cursor.execute(stockname_query)
                stock_name = cursor.fetchone()[0]

                data = fetch_historic_data_bs4(stock_name, latest_date)
                filter_two.insert_data_toDB(stock_name, data, conn_pool)
                filter_two.save_data_to_json(stock_name, data)
        except Exception as e:
            pass


def get_all_tickers():
    query = """
        SELECT stock_id, stock_name
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
    cursor.execute(query)
    all_tickers = cursor.fetchall()
    conn.close()
    return all_tickers


def init(latest_data):
    all_tickers = get_all_tickers()
    num_threads = min(10, len(latest_data) + 1)
    missing_tickers = []
    if len(latest_data) != len(all_tickers):
        ld_IDs = [entry[0] for entry in latest_data]
        at_IDs = [entry[0] for entry in all_tickers]
        for ticker_id in at_IDs:
            if ticker_id not in ld_IDs:
                missing_tickers.append((ticker_id, date.today() - timedelta(days=3650)))
    if len(missing_tickers) != 0:
        print(f"Missing tickers: {[entry[0] for entry in missing_tickers]}")

    latest_data.extend(missing_tickers)
    # Connection pool
    conn_pool = psycopg2.pool.SimpleConnectionPool(1, 10,
                                                   dbname=os.getenv("POSTGRES_DB"),
                                                   user=os.getenv("POSTGRES_USER"),
                                                   password=os.getenv("POSTGRES_PASSWORD"),
                                                   host=os.getenv("DB_HOST", "localhost"),
                                                   port=os.getenv("DB_PORT"))

    with conn_pool.getconn() as conn:
        cursor = conn.cursor()
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
        conn_pool.putconn(conn)



        with ThreadPoolExecutor(max_workers=10) as executor:
            executor.map(lambda entry: process_stock_entry(entry, conn_pool), latest_data)

    conn_pool.closeall()
    print("Data initialization complete.")