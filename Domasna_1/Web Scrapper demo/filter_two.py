import calendar
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
import os
from functools import partial
from psycopg2 import pool
from psycopg2.extras import execute_values
import psycopg2
import requests
from bs4 import BeautifulSoup

NUM_OF_YEARS = 10
conn_pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=162,  # Adjust based on load and resources
    dbname='postgres',
    user='postgres',
    password='1234',
    host='localhost',
    port='5432'
)
def convert_date(date_str):
    # Convert "DD.MM.YYYY" to "YYYY-MM-DD"
    return datetime.strptime(date_str, "%d.%m.%Y").strftime("%Y-%m-%d")
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

def fetch_tickers(conn):

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


def insert_data_toDB(ticker, data, conn):
    cursor = conn.cursor()

    # Get the stock_id for the ticker
    cursor.execute("SELECT stock_id FROM stocks WHERE stock_name = %s;", (ticker,))
    result = cursor.fetchone()
    if not result:
        print(f"Ticker '{ticker}' not found in the stocks table.")
        return

    stock_id = result[0]

    # Prepend stock_id to each row in data
    data_with_id = [[stock_id] + row for row in data]

    # Define the SQL statement for execute_values
    insert_sql = """
          INSERT INTO stockdetails (stock_id, date, last_transaction_price, max_price, min_price, 
                                    average_price, percentage_change, quantity, trade_volume, total_volume)
          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
          ON CONFLICT (stock_id, date) DO NOTHING;
      """

    try:
        # Use execute_values for bulk insert
        cursor.executemany(insert_sql,
                           [(data[0], convert_date(data[1]), data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9]) for data in data_with_id])
        conn.commit()
        print(f"Data inserted successfully for ticker: {ticker}")
    except Exception as e:
        conn.rollback()  # Roll back if there's an error
        print(f"Failed to insert data for ticker '{ticker}': {e}")

def start_thread(tiker):
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='1234',
        host='localhost',
        port='5432'
    )
    print(f'Executing thread for {tiker}\n')
    data = fetch_historic_data_bs4(tiker)
    insert_data_toDB(tiker, data, conn)
    return data

def init(pipe_tickers, conn):
    start_time = time.time()

    print('Connected to DB')
    cursor = conn.cursor()
    create_table_sql = ("\n"
                        "       CREATE TABLE IF NOT EXISTS stockdetails (\n"
                        "           stock_id int NOT NULL,\n"
                        "           date DATE NOT NULL,\n"
                        "           last_transaction_price VARCHAR(20),\n"
                        "           max_price VARCHAR(20),\n"
                        "           min_price VARCHAR(20),\n"
                        "           average_price VARCHAR(20),\n"
                        "           percentage_change VARCHAR(10),\n"
                        "           quantity VARCHAR(20),\n"
                        "           trade_volume VARCHAR(20),\n"
                        "           total_volume VARCHAR(20),\n"
                        "           PRIMARY KEY (stock_id, date),\n"
                        "           FOREIGN KEY (stock_id) REFERENCES Stocks(stock_id)\n"
                        "       );\n"
                        "       ")
    cursor.execute(create_table_sql)
    #cursor.execute("DELETE FROM Stocks;")
    print('Stock details table created.')
    tickers = pipe_tickers
    conn.commit()
    #print(tickers)

    max_workers = 10
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(start_thread, pipe_tickers)
    end_time = time.time()



