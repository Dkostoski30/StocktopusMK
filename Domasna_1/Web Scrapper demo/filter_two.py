import calendar
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
import os
import psycopg2
import requests
from bs4 import BeautifulSoup

NUM_OF_YEARS = 10

def fetch_historic_data_bs4(ticker):
    base_url = f"https://www.mse.mk/mk/stats/symbolhistory/{ticker.lower()}"
    historic_data = []
    date_to = datetime.now()

    for _ in range(NUM_OF_YEARS):
        year = date_to.year
        if _ == 0:
            date_from = date_to - timedelta(days=364)
        else:
            if calendar.isleap(year):
                date_from = date_to - timedelta(days=366)
            else:
                date_from = date_to - timedelta(days=365)

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


        date_to = date_from

    return historic_data

def fetch_tickers():
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB", "postgres"),
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "1234"),
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432")
    )
    cursor = conn.cursor()

    cursor.execute("""
               SELECT EXISTS (
                   SELECT FROM stocks
               );
           """)
    if cursor.fetchone()[0]:
        cursor.execute("SELECT stock_name FROM stocks")
        stocks = cursor.fetchall()
        stocks = [element[0] for element in stocks]
        return stocks
    else:
        print("Table 'Stocks' does not exist.")
        return []


def insert_data_toDB(tiker, data):

    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='1234',
        host='localhost',
        port='5432'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM Stocks WHERE stock_name = %s;", (tiker,))
    result = cursor.fetchone()
    stock_id = result[0]
    data_with_id = [[stock_id] + row for row in data]
    for row in data_with_id:
        cursor.execute(
            """
            INSERT INTO stockdetails (stock_id, date, last_transaction_price, max_price, min_price, 
                                      average_price, percentage_change, quantity, trade_volume, total_volume)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (stock_id, date) DO NOTHING;
            """,
            row
        )

    conn.commit()

def start_thread(tiker):
    data = fetch_historic_data_bs4(tiker)
    insert_data_toDB(tiker, data)

def init():
    start_time = time.time()
    tickers = fetch_tickers()

    print(tickers)

    max_workers = 10
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(start_thread, tickers)
    end_time = time.time()
    print(end_time - start_time)

