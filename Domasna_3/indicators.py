import os
import datetime
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor, execute_values
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import ta
import logging


load_dotenv()


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def get_all_tickers():
    query_all = """
        SELECT stock_id
        FROM stocks
    """
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    cursor = conn.cursor()
    cursor.execute(query_all)
    all_tickers = cursor.fetchall()
    conn.close()
    return all_tickers

def clean_and_convert_row(row):
    def clean_value(value):
        if value == "":
            return None
        if isinstance(value, (int, float, datetime.datetime)):
            return value
        if isinstance(value, str):
            value = value.replace('.', '').replace(',', '.')
            try:
                return float(value) if '.' in value else int(value)
            except ValueError:
                return value
        return value

    return {key: clean_value(val) for key, val in row.items()}


def get_ticker_data(stock_id):
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
        SELECT date, last_transaction_price, max_price, min_price, 
               average_price, percentage_change, quantity, trade_volume, total_volume
        FROM stockdetails
        WHERE stock_id = %s
        ORDER BY date DESC;
        """
        cursor.execute(query, (stock_id,))
        results = cursor.fetchall()

        cleaned_results = [clean_and_convert_row(row) for row in results]

        cursor.close()
        conn.close()

        return pd.DataFrame(cleaned_results)

    except psycopg2.Error as e:
        logging.error(f"Database error: {e}")
        return None


def calculate_indicators(df, timeframe='daily'):
    if df.empty:
        logging.warning("No data available to calculate indicators.")
        return None

    df.fillna(0, inplace=True)
    if timeframe == 'weekly':
        df = df.resample('W').mean()
    elif timeframe == 'monthly':
        df = df.resample('ME').mean()


    if 'last_transaction_price' not in df.columns:
        logging.error("Missing 'last_transaction_price' column for indicator calculations.")
        return None

    df['SMA_50'] = df['last_transaction_price'].rolling(window=50).mean()
    df['EMA_50'] = df['last_transaction_price'].ewm(span=50, adjust=False).mean()
    df['RSI'] = ta.momentum.RSIIndicator(df['last_transaction_price'], window=14).rsi()
    macd = ta.trend.MACD(df['last_transaction_price'])
    df['MACD'] = macd.macd()
    df['Signal'] = macd.macd_signal()
    df['Bollinger High'] = ta.volatility.BollingerBands(df['last_transaction_price']).bollinger_hband()
    df['Bollinger Low'] = ta.volatility.BollingerBands(df['last_transaction_price']).bollinger_lband()

    return df


def generate_signals(df):

    df['Signal_Value'] = df['Signal']
    df['Decision'] = 'Hold'


    df.loc[df['RSI'] < 30, 'Decision'] = 'Buy'
    df.loc[df['RSI'] > 70, 'Decision'] = 'Sell'

    df.loc[df['MACD'] > df['Signal_Value'], 'Decision'] = 'Buy'
    df.loc[df['MACD'] < df['Signal_Value'], 'Decision'] = 'Sell'

    return df


def store_predictions_to_db(df, stock_id, timeframe):
    if df.empty:
        logging.warning("No data to store in the database.")
        return

    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        conn.autocommit = True  # Enable autocommit for table creation
        cursor = conn.cursor()

        create_table_query = """
        CREATE TABLE IF NOT EXISTS stocks_indicators (
            id SERIAL PRIMARY KEY,
            stock_id INT NOT NULL,
            date TIMESTAMP NOT NULL,
            timeframe VARCHAR(10),
            sma_50 FLOAT,
            ema_50 FLOAT,
            rsi FLOAT,
            macd FLOAT,
            signal_value FLOAT,
            decision VARCHAR(10)
        );
        """
        cursor.execute(create_table_query)
        logging.info("Table `stocks_indicators` created or already exists.")

        insert_query = """
        INSERT INTO stocks_indicators (
            stock_id, date, timeframe, sma_50, ema_50, rsi, macd, signal_value, decision
        ) VALUES %s
        """
        records = [
            (
                stock_id,
                row.Index,
                timeframe,
                row.SMA_50 if not pd.isna(row.SMA_50) else None,
                row.EMA_50 if not pd.isna(row.EMA_50) else None,
                row.RSI if not pd.isna(row.RSI) else None,
                row.MACD if not pd.isna(row.MACD) else None,
                row.Signal_Value if not pd.isna(row.Signal_Value) else None,
                row.Decision
            )
            for row in df.itertuples()
        ]

        execute_values(cursor, insert_query, records)
        conn.commit()
        logging.info("Data inserted into `stocks_indicators` successfully.")

    except psycopg2.Error as e:
        logging.error(f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    ticker_ids = get_all_tickers()
    timeframes = ['daily', 'weekly', 'monthly']

    for ticker_id in ticker_ids:
        for timeframe in timeframes:
            data = get_ticker_data(ticker_id)
            if data is not None:
                data.set_index('date', inplace=True)
                df = calculate_indicators(data, timeframe)
                df = generate_signals(df)

                store_predictions_to_db(df, ticker_id, timeframe)
                print(df)
