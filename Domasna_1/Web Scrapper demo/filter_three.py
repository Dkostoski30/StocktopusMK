from datetime import datetime, timedelta, date
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from dotenv import load_dotenv

load_dotenv()


def fetch_historic_data_bs4(ticker, start_date):
    base_url = f"https://www.mse.mk/mk/stats/symbolhistory/{ticker}"
    historic_data = []
    date_to = date.today() - timedelta(days=1)

    while date_to >= start_date:
        date_from = max(start_date, date_to - timedelta(days=365))

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

        date_to = date_from - timedelta(days=1)

    return historic_data


if __name__ == "__main__":
    start_date = datetime(2024, 10, 31).date()
    start_time = time.time()
    df = pd.DataFrame(fetch_historic_data_bs4("adin", start_date),
                      columns=["Datum", "Posl. trans", "max", "min", "avg", "%", "kol.", "vol", "total vol"])
    end_time = time.time()
    print("Execution time:", end_time - start_time)
    print(df.tail())
