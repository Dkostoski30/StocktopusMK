import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
from datetime import datetime, timedelta

NUM_OF_YEARS = 10

def fetch_historic_data_bs4(ticker):
    base_url = f"https://www.mse.mk/mk/stats/symbolhistory/{ticker}"
    historic_data = []
    date_to = datetime.now()

    for _ in range(NUM_OF_YEARS):

        if _ == 0:
            date_from = date_to - timedelta(days=364)
        else:
            date_from = date_to - timedelta(days=365)

        #Dodaj leap year edge cases i nes slicno na to

        params = {
            "FromDate": date_from.strftime("%d.%m.%Y"),
            "ToDate": date_to.strftime("%d.%m.%Y"),
        }


        response = requests.get(base_url, params=params)

        soup = BeautifulSoup(response.text, 'html.parser')

        table = soup.select_one('#resultsTable > tbody')
        if table:
            rows = table.find_all('tr')
            for row in rows:
                data_row = [cell.text for cell in row.find_all('td')]
                historic_data.append(data_row)


        date_to = date_from

    return historic_data


#TODO: Da se implementirat funkcija za zapisvenje v baza


#Optional: thredoj
