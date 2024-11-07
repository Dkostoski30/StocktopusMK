import os
from concurrent.futures import as_completed
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta, date
from psycopg2 import pool
import psycopg2
import requests
from bs4 import BeautifulSoup
import time
from dotenv import load_dotenv
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
        except Exception as e:
            pass


def init(latest_data):

    num_threads = min(10, len(latest_data))

    conn_pool = psycopg2.pool.SimpleConnectionPool(1, num_threads + 25,
                                                   dbname=os.getenv("POSTGRES_DB"),
                                                   user=os.getenv("POSTGRES_USER"),
                                                   password=os.getenv("POSTGRES_PASSWORD"),
                                                   host=os.getenv("DB_HOST", "localhost"),
                                                   port=os.getenv("DB_PORT")
                                                   )
    with ThreadPoolExecutor(max_workers=num_threads) as executor:
        futures = [executor.submit(process_stock_entry, entry, conn_pool) for entry in latest_data]

        for future in as_completed(futures):
            try:
                future.result()  # Retrieve any exceptions raised in threads
            except Exception as e:
                print(f"Error processing stock entry: {e}")





