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
import json
load_dotenv()

MAX_WORKERS = 10

NUM_OF_YEARS = 10


def convert_date(date_str):
    return datetime.strptime(date_str, "%d.%m.%Y").strftime("%Y-%m-%d")



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
                 row[2], row[3],
                 row[4], row[5],
                 row[6], row[7],
                 row[8], row[9])
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


def save_data_to_json(ticker, data):
    start_time = time.time()
    directory = './data/stockdetails'
    file_path = os.path.join(directory, f'{ticker}.json')
    try:
        os.makedirs(directory, exist_ok=True)
    except Exception as e:
        print(f"Failed to create directory '{directory}': {e}")
        return
    data_json = []
    for row in data:
        if len(row) != 9:
            print(f"Skipping row with unexpected format for {ticker}: {row}")
            continue
        try:
            data_json.append({
                "date": row[0].strftime('%Y-%m-%d') if isinstance(row[1], datetime) else row[1],
                "open": row[1],
                "high": row[2],
                "low": row[3],
                "close": row[4],
                "volume": row[5],
                "adjusted_close": row[6],
                "other_field_1": row[7],
                "other_field_2": row[8]
            })
        except Exception as e:
            print(f"Error processing row {row} for {ticker}: {e}")
            continue
    try:
        with open(file_path, 'w') as json_file:
            json.dump(data_json, json_file, indent=4)
        print(f"Data saved successfully for ticker: {ticker} in {file_path}")
    except Exception as e:
        print(f"Failed to save data for ticker '{ticker}': {e}")
    finally:
        end_time = time.time()
        print(f"Saving to JSON took {end_time - start_time:.2f} seconds")

def start_thread(tiker, conn, session):
    print(f'Executing thread for {tiker}\n')
    data = fetch_historic_data_bs4(tiker, session)
    save_data_to_json(tiker, data)
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
                last_transaction_price VARCHAR(255),
                max_price VARCHAR(255),
                min_price VARCHAR(255),
                average_price VARCHAR(255),
                percentage_change VARCHAR(255),
                quantity VARCHAR(255),
                trade_volume VARCHAR(255),
                total_volume VARCHAR(255),
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