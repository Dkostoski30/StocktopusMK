from filter_one import fetch_tikeri_bs, insert_into_db
from filter_two import fetch_historic_data_bs4
import pandas as pd
import time


def main():
    tikeri = fetch_tikeri_bs()
    insert_into_db(tikeri)
    start_time = time.time()
    historic_data = fetch_historic_data_bs4("adin")
    df = pd.DataFrame(
        historic_data,
        columns=["Datum", "Posl. trans", "max", "min", "avg", "%", "kol.", "vol", "total vol"]
    )
    end_time = time.time()

    print(f"Data fetching and transformation took {end_time - start_time} seconds.")
    print(df.head())


if __name__ == '__main__':
    main()
