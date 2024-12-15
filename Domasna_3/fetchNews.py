import os
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta

import psycopg2
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from psycopg2 import pool

load_dotenv()

BASE_URL = "https://www.mse.mk/mk/announcement"
MAX_WORKERS = 10
NUM_OF_YEARS = 10
CATEGORIES = [
    "Податоци од финансиски извештаи и дивиденда",
    "Промени во сопственичка структура над 10%",
    "Ревидирани финансиски извештаи",
    "Нова емисија на Хартии од вредност"
]

insert_sql = """
    INSERT INTO announcements (date, category, title, link)
    VALUES (%s, %s, %s, %s)
"""

def convert_date(date_str):
    try:
        return datetime.strptime(date_str, "%d.%m.%Y").date()
    except ValueError as e:
        print(f"Error converting date: {date_str}, {e}")
        return None

def fetch_document_link(session, announcement_url):
    response = session.get("https://www.mse.mk/" + announcement_url)
    soup = BeautifulSoup(response.text, "html.parser")
    link_doc = soup.select_one('#announcementDetails > div:nth-child(4) > div > a')['href']
    return "https://www.mse.mk" + link_doc


def fetch_announcements(session, year_offset):
    date_to = datetime.now() - timedelta(days=year_offset * 365)
    date_from = date_to - timedelta(days=365)
    params = {
        "fromDate": date_from.strftime("%d.%m.%Y"),
        "toDate": date_to.strftime("%d.%m.%Y"),
    }

    response = session.get(BASE_URL, params=params)
    soup = BeautifulSoup(response.text, "html.parser")

    announcements = []

    table = soup.select_one('tbody')
    if table:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            title = cells[0].text.strip()
            link_tag = cells[1].find('a')
            if link_tag:
                link = link_tag['href']
                company_name = link_tag.text.strip()
                document_link = fetch_document_link(session, link)

            date_str = cells[2].text.strip()
            date = convert_date(date_str)

            announcements.append((date, company_name, title, document_link))
    return announcements


def save_announcements_to_db(announcements, conn_pool):
    with conn_pool.getconn() as conn:
        try:
            cursor = conn.cursor()
            cursor.executemany(insert_sql, announcements)
            conn.commit()
            print(f"Inserted {len(announcements)} announcements.")
        except Exception as e:
            conn.rollback()
            print(f"Failed to insert announcements: {e}")
        finally:
            conn_pool.putconn(conn)


def worker_task(year_offset, session, conn_pool):
    announcements = fetch_announcements(session, year_offset)
    save_announcements_to_db(announcements, conn_pool)


def main():
    conn_pool = psycopg2.pool.SimpleConnectionPool(1, MAX_WORKERS,
                                                   dbname=os.getenv("POSTGRES_DB"),
                                                   user=os.getenv("POSTGRES_USER"),
                                                   password=os.getenv("POSTGRES_PASSWORD"),
                                                   host=os.getenv("DB_HOST"),
                                                   port=os.getenv("DB_PORT"))

    create_table_sql = """
        CREATE TABLE IF NOT EXISTS announcements (
            id SERIAL NOT NULL,
            date DATE NOT NULL,
            category TEXT,
            title TEXT,
            link TEXT,
            PRIMARY KEY (id)
        );
    """

    with conn_pool.getconn() as conn:
        cursor = conn.cursor()
        cursor.execute(create_table_sql)
        conn.commit()
        conn_pool.putconn(conn)

    with requests.Session() as session:
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            executor.map(lambda offset: worker_task(offset, session, conn_pool), range(NUM_OF_YEARS))

    conn_pool.closeall()


if __name__ == "__main__":
    main()
