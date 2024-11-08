import calendar
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
import psycopg2
import requests
from requests import adapters
from bs4 import BeautifulSoup
from psycopg2 import pool
import os
from dotenv import load_dotenv

load_dotenv()

MAX_WORKERS = 10

NUM_OF_YEARS = 10


def convert_date(date_str):
    return datetime.strptime(date_str, "%d.%m.%Y").strftime("%Y-%m-%d")


def convert_float(value):
    converted_float = None
    if value == "":
        return None
    try:
        converted_float = float(value.replace(".", "").replace(",", "."))
    except Exception as e:
        print(f"Failed to convert float : {e}")

    return converted_float


def convert_bigint(value):
    converted_int = None
    try:
        converted_int = int(value.replace(".", ""))
    except Exception as e:
        print(f"Failed to convert float : {e}")

    return converted_int


def fetch_historic_data_bs4(ticker, session):
    start = time.time()
    base_url = f"https://www.mse.mk/mk/stats/symbolhistory/{ticker.lower()}"
    historic_data = []
    date_to = datetime.now()

    for _ in range(NUM_OF_YEARS):
        year = date_to.year
        if calendar.isleap(year):
            date_from = date_to - timedelta(days=366)
        else:
            date_from = date_to - timedelta(days=365)

        params = {
            "FromDate": date_from.strftime("%d.%m.%Y"),
            "ToDate": date_to.strftime("%d.%m.%Y"),
        }

        response = session.get(base_url, params=params, timeout=(3, 10))

        soup = BeautifulSoup(response.text, 'html.parser')

        table = soup.select_one('#resultsTable > tbody')
        if table:
            rows = table.find_all('tr')
            for row in rows:
                data_row = [cell.text for cell in row.find_all('td')]
                historic_data.append(data_row)

        date_to = date_from
    end = time.time()
    print(f'Fetching took {end - start:.2f} seconds')
    return historic_data


insert_sql = """
              INSERT INTO stockdetails (stock_id, date, last_transaction_price, max_price, min_price, 
                                        average_price, percentage_change, quantity, trade_volume, total_volume)
              VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
              ON CONFLICT (stock_id, date) DO NOTHING;
          """


def batch_insert_data(data_with_id, cursor):
    BATCH_SIZE = 100
    for i in range(0, len(data_with_id), BATCH_SIZE):
        batch = data_with_id[i:i + BATCH_SIZE]
        cursor.executemany(insert_sql, batch)


def insert_data_toDB(ticker, data, conn_pool):
    start_time = time.time()
    with conn_pool.getconn() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT stock_id FROM stocks WHERE stock_name = %s;", (ticker,))
        result = cursor.fetchone()

        if not result:
            print(f"Ticker '{ticker}' not found in the stocks table.")
            conn_pool.putconn(conn)
            return

        stock_id = result[0]
        data_with_id = [[stock_id] + row for row in data]

        try:
            cursor.executemany(insert_sql, [
                (row[0], convert_date(row[1]),
                 convert_float(row[2]), convert_float(row[3]),
                 convert_float(row[4]), convert_float(row[5]),
                 convert_float(row[6]), convert_bigint(row[7]),
                 convert_bigint(row[8]), convert_bigint(row[9]))
                for row in data_with_id
            ])
            conn.commit()
            print(f"Data inserted successfully for ticker: {ticker}")
        except Exception as e:
            conn.rollback()
            print(f"Failed to insert data for ticker '{ticker}': {e}")
        finally:
            conn_pool.putconn(conn)
            end_time = time.time()
            print(f"Insertion took {end_time - start_time:.2f} seconds")


def start_thread(tiker, conn, session):
    print(f'Executing thread for {tiker}\n')
    data = fetch_historic_data_bs4(tiker, session)
    insert_data_toDB(tiker, data, conn)
    return data


def get_latestdata():
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    cursor = conn.cursor()
    query = """SELECT stock_id, MAX(date) AS latest_date
                FROM stockdetails
                GROUP BY stock_id;
        """
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    return results


def check_table(table_name, conn):
    cur = conn.cursor()
    count_query = f"SELECT COUNT(*) FROM {table_name};"
    cur.execute(count_query)
    row_count = cur.fetchone()[0]
    return row_count == 0


def init(pipe_tickers):
    print('Second filter started..')
    conn_pool = psycopg2.pool.SimpleConnectionPool(1, MAX_WORKERS,
                                                   dbname=os.getenv("POSTGRES_DB"),
                                                   user=os.getenv("POSTGRES_USER"),
                                                   password=os.getenv("POSTGRES_PASSWORD"),
                                                   host=os.getenv("DB_HOST", "localhost"),
                                                   port=os.getenv("DB_PORT")
                                                   )
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
                FOREIGN KEY (stock_id) REFERENCES Stocks(stock_id)
            );
        """
        cursor.execute(create_table_sql)
        conn.commit()
        print('Stock details table created.')

        tickers = pipe_tickers
        conn_pool.putconn(conn)
    if check_table('stockdetails', conn):
        with requests.Session() as session:
            adapter = requests.adapters.HTTPAdapter(max_retries=3)
            session.mount("https://", adapter)
            session.mount("http://", adapter)
            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                executor.map(lambda ticker: start_thread(ticker, conn_pool, session), tickers)

    conn_pool.closeall()
    return get_latestdata()
