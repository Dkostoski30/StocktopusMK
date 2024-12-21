import time

import datetime
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

global time_taken

if __name__ == '__main__':
    time_taken = 0
    start_time = time.time()
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Stocks (
            stock_id SERIAL PRIMARY KEY,
            stock_name VARCHAR(50) UNIQUE
        );
    """)

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
    tickers = filter_one.init()
    conn.close()
    print('Creating stockdetails table and fetching historic data for each ticker')
    latest_data = filter_two.init(tickers)

    filter_three.init(latest_data)

    end_time = time.time()

    print(f'Time taken from start to finish: {end_time-start_time:.2f}')
    print(f'Script executed..')
