import os
import psycopg2
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from datetime import datetime

import sentimentAnalysis

load_dotenv()

base_url = "https://www.mse.mk"


def fetch_soup(url):
    response = requests.get(url)
    if response.status_code == 200:
        return BeautifulSoup(response.text, 'html.parser')
    else:
        print(f"Failed to fetch URL: {url} (Status code: {response.status_code})")
        return None


def fetch_stocks(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT stock_id, stock_name, full_name FROM stocks;")
        stocks = cursor.fetchall()
        return stocks
    finally:
        cursor.close()


def get_latest_news_date(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(date) FROM latest_news;")
        latest_date = cursor.fetchone()[0]
        return latest_date
    finally:
        cursor.close()


def insert_news_data(conn, date, text):
    try:
        cursor = conn.cursor()
        insert_news_sql = """
            INSERT INTO latest_news (date, text)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            RETURNING id;
        """
        cursor.execute(insert_news_sql, (date, text))
        news_id = cursor.fetchone()
        conn.commit()
        return news_id[0] if news_id else None
    except Exception as e:
        conn.rollback()
        print(f"Failed to insert news data: {e}")
    finally:
        cursor.close()


def insert_news_and_stocks(conn, stock_id, news_id):
    try:
        cursor = conn.cursor()
        insert_news_and_stocks_sql = """
            INSERT INTO news_and_stocks (stock_id, latest_news_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING;
        """
        cursor.execute(insert_news_and_stocks_sql, (stock_id, news_id))
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Failed to insert news and stocks data: {e}")
    finally:
        cursor.close()


def fetch_latest_news(conn):
    stocks = fetch_stocks(conn)
    latest_date = get_latest_news_date(conn)

    for page_num in range(1, 6):
        page_url = f"{base_url}/mk/news/latest/{page_num}"
        print(f"Fetching page {page_num}...")

        soup = fetch_soup(page_url)
        if soup:
            rows = soup.find_all('div', class_='row')
            for row in rows:
                date_div = row.find('div', class_='col-md-1')
                link_div = row.find('div', class_='col-md-11')

                if date_div and link_div:
                    date_anchor = date_div.find('a')
                    text_anchor = link_div.find('a')

                    if date_anchor and text_anchor:
                        date_str = date_anchor.text.strip()
                        date = datetime.strptime(date_str, "%d.%m.%Y").date()

                        if latest_date and date <= latest_date:
                            return

                        relative_link = text_anchor['href']
                        link = f"{base_url}{relative_link}"

                        detail_soup = fetch_soup(link)
                        if detail_soup:
                            text_element = detail_soup.find(id="content")
                            text = text_element.text.strip() if text_element else None
                            if text:
                                news_id = insert_news_data(conn, date, text)
                                if news_id:
                                    for stock_id, stock_name, full_name in stocks:
                                        if full_name is None:
                                            full_name = stock_name
                                        if stock_name in text or full_name in text:
                                            insert_news_and_stocks(conn, stock_id, news_id)


def main():
    print("Fetching latest news...")

    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )

        try:
            cursor = conn.cursor()
            create_table_sql1 = """
                CREATE TABLE IF NOT EXISTS latest_news (
                    id SERIAL PRIMARY KEY,
                    date DATE,
                    text TEXT,
                    sentiment VARCHAR(255)
                );
            """
            create_table_sql2 = """
                CREATE TABLE IF NOT EXISTS news_and_stocks (
                    id SERIAL PRIMARY KEY,
                    stock_id INT,
                    latest_news_id INT,
                    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id),
                    FOREIGN KEY (latest_news_id) REFERENCES latest_news(id)
                );
            """
            sql3 = """
                ALTER TABLE latest_news
                ALTER COLUMN date TYPE DATE
                USING date::DATE;
            """
            cursor.execute(create_table_sql1)
            cursor.execute(create_table_sql2)
            cursor.execute(sql3)
            conn.commit()
            print('latest_news and news_and_stocks tables created.')
        finally:
            cursor.close()

        fetch_latest_news(conn)

    finally:
        conn.close()


if __name__ == "__main__":
    main()
    sentimentAnalysis.init()
