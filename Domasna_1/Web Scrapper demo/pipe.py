import time

import psycopg2

import filter_one
import filter_two
import filter_three
import os
from dotenv import load_dotenv

load_dotenv()

def check_table(table_name, conn):
    cur = conn.cursor()
    count_query = f"SELECT COUNT(*) FROM {table_name};"
    cur.execute(count_query)
    row_count = cur.fetchone()[0]
    return row_count == 0

if __name__ == '__main__':
    start_time = time.time()
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

    tickers = []

    if not check_table('stocks', conn) or not check_table('stockdetails', conn):
        print('Creating stocks table and fetching tickers')
        tickers = filter_one.init()

    print('Creating stockdetails table and fetching historic data for each ticker')
    latest_data = filter_two.init(tickers, conn)
    conn.close()
    filter_three.init(latest_data)


    end_time = time.time()
    print(f'Time taken from start to finish: {end_time - start_time:.2f}')
    print(f'Script executed..')