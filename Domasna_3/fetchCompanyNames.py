import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2 import pool
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


db_pool = psycopg2.pool.SimpleConnectionPool(
    1,
    10,  # Maximum connections
    dbname=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT")
)


def get_company_name(ticker_name):

    url = f"http://www.mse.mk/mk/symbol/{ticker_name}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')


        company_name_tag = soup.select_one("#izdavach .col-md-8.title")
        if company_name_tag:
            return company_name_tag.text.strip()


        alternative_name_tag = soup.select_one("#titleKonf2011.panel-heading")
        if alternative_name_tag:

            text = alternative_name_tag.text.strip()
            if " - " in text:
                return text.split(" - ", maxsplit=2)[-1]

        logging.warning(f"Company name not found for {ticker_name}")
        return None
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching data for {ticker_name}: {e}")
        return None


def update_company_name_in_db(stock_id, company_name):

    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE stocks SET full_name = %s WHERE stock_id = %s;",
                (company_name, stock_id)
            )
        conn.commit()
        logging.info(f"Updated stock_id {stock_id} with company name: {company_name}")
    except psycopg2.Error as e:
        logging.error(f"Error updating stock_id {stock_id}: {e}")
    finally:
        if conn:
            db_pool.putconn(conn)


def main():

    conn = None
    try:
        conn = db_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute("SELECT stock_id, stock_name FROM stocks WHERE stocks.full_name IS NULL;")
            stocks = cursor.fetchall()

        for stock_id, stock_name in stocks:
            company_name = get_company_name(stock_name)
            if company_name:
                update_company_name_in_db(stock_id, company_name)
    except Exception as e:
        logging.error(f"Error in main process: {e}")
    finally:
        if conn:
            db_pool.putconn(conn)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
