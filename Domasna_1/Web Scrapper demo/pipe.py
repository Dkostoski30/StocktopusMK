import filter_one
import filter_two
import pandas as pd
import time
import psycopg2
import requests
from bs4 import BeautifulSoup





if __name__ == '__main__':
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='1234',
        host='localhost',
        port='5432'
    )
    start_time = time.time()
    tickers = filter_one.init()
    filter_two.init(tickers, conn)
    end_time = time.time()
    print(end_time - start_time)