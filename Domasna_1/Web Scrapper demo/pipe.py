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

def main():
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
                details_id SERIAL PRIMARY KEY,
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
                FOREIGN KEY (stock_id) REFERENCES Stocks(stock_id)
            );
    """
    cursor.execute(create_table_sql)

    create_users_table_sql = """
        CREATE TABLE IF NOT EXISTS stocktopus_users (
            username VARCHAR(255) NOT NULL PRIMARY KEY,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            is_account_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
            is_account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
            is_credentials_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
            is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
            role VARCHAR(255) NOT NULL
        );
    """
    cursor.execute(create_users_table_sql)

    create_favorite_stocks_table_sql = """
        CREATE TABLE IF NOT EXISTS favorite_stocks (
            id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            username VARCHAR(255) NOT NULL,
            stock_id BIGINT NOT NULL,
            CONSTRAINT fk_user FOREIGN KEY (username) REFERENCES stocktopus_users(username),
            CONSTRAINT fk_stock FOREIGN KEY (stock_id) REFERENCES Stocks(stock_id),
            CONSTRAINT unique_user_stock_pair UNIQUE (stock_id, username)
        );
    """
    cursor.execute(create_favorite_stocks_table_sql)

    conn.commit()
    tickers = filter_one.init()
    conn.close()
    print('Creating stockdetails, stocktopus_users, and favorite_stocks tables and fetching historic data for each ticker')
    latest_data = filter_two.init(tickers)

    filter_three.init(latest_data)

    end_time = time.time()

    print(f'Time taken from start to finish: {end_time-start_time:.2f}')
    print(f'Script executed..')

def scheduled_main():
    while True:
        now = datetime.datetime.now()
        target_time = now.replace(hour=14, minute=41, second=0, microsecond=0)

        if now > target_time:
            target_time += datetime.timedelta(days=1)

        time_to_wait = (target_time - now).total_seconds()
        print(
            f"Waiting for {time_to_wait // 60:.0f} minutes and {time_to_wait % 60:.0f} seconds to execute the script...")

        time.sleep(time_to_wait)

        main()

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
                details_id SERIAL PRIMARY KEY,
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
                FOREIGN KEY (stock_id) REFERENCES Stocks(stock_id)
            );
    """
    cursor.execute(create_table_sql)

    create_users_table_sql = """
        CREATE TABLE IF NOT EXISTS stocktopus_users (
            username VARCHAR(255) NOT NULL PRIMARY KEY,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            is_account_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
            is_account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
            is_credentials_non_expired BOOLEAN NOT NULL DEFAULT TRUE,
            is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
            role VARCHAR(255) NOT NULL
        );
    """
    cursor.execute(create_users_table_sql)

    create_favorite_stocks_table_sql = """
        CREATE TABLE IF NOT EXISTS favorite_stocks (
            id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            username VARCHAR(255) NOT NULL,
            stock_id BIGINT NOT NULL,
            CONSTRAINT fk_user FOREIGN KEY (username) REFERENCES stocktopus_users(username),
            CONSTRAINT fk_stock FOREIGN KEY (stock_id) REFERENCES Stocks(stock_id)
        );
    """
    cursor.execute(create_favorite_stocks_table_sql)

    conn.commit()
    tickers = filter_one.init()
    conn.close()
    print('Creating stockdetails, stocktopus_users, and favorite_stocks tables and fetching historic data for each ticker')
    latest_data = filter_two.init(tickers)
    end_time = time.time()

    print(f'Time taken from start to finish: {end_time - start_time:.2f}')
    print(f'Script executed..')


    while True:
        try:

            now = datetime.datetime.now()

            target_time = now.replace(hour=12, minute=25, second=0, microsecond=0)

            if now > target_time:
                target_time += datetime.timedelta(days=1)

            time_to_wait = (target_time - now).total_seconds()
            print(
                f"Waiting for {time_to_wait // 60:.0f} minutes and {time_to_wait % 60:.0f} seconds to execute the script..."
            )

            time.sleep(time_to_wait)

            print("Executing scheduled_main() from pipe.py...")
            filter_three.init(latest_data)
        except Exception as e:
            print(f"An error occurred: {e}")
            time.sleep(60)
