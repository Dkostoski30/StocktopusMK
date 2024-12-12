import os
import requests
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
load_dotenv()

MAX_WORKERS = 10

CATEGORIES = [
    "Податоци од финансиски извештаи и дивиденда"
]


def download_document(link, save_path):
    try:
        response = requests.get(link)
        response.raise_for_status()
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {save_path}")
    except Exception as e:
        print(f"Failed to download {link}: {e}")


def fetch_links_by_category(conn_pool, categories):
    with conn_pool.getconn() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT link, category FROM announcements
            WHERE category = ANY(%s)
        """, (categories,))
        announcements = cursor.fetchall()
        conn_pool.putconn(conn)
    return announcements


def main():
    download_dir = "documents"
    os.makedirs(download_dir, exist_ok=True)

    conn_pool = psycopg2.pool.SimpleConnectionPool(1, MAX_WORKERS,
                                                   dbname=os.getenv("POSTGRES_DB"),
                                                   user=os.getenv("POSTGRES_USER"),
                                                   password=os.getenv("POSTGRES_PASSWORD"),
                                                   host=os.getenv("DB_HOST"),
                                                   port=os.getenv("DB_PORT"))
    announcements = fetch_links_by_category(conn_pool, CATEGORIES)

    for link, category in announcements:
        file_name = link.split('/')[-1]
        file_path = os.path.join(download_dir, file_name)

        download_document(link, file_path)

    conn_pool.closeall()


if __name__ == "__main__":
    main()
