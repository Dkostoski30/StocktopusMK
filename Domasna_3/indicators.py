import os
import datetime
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor, execute_values
from dotenv import load_dotenv
import ta
import logging

load_dotenv()


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def get_database_connection():

    return psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

def get_all_tickers():

    query_all = "SELECT stock_id FROM stocks"
    try:
        with get_database_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query_all)
                return [row[0] for row in cursor.fetchall()]
    except psycopg2.Error as e:
        logging.error(f"Database error: {e}")
        return []

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
    query = """
    SELECT date, last_transaction_price, max_price, min_price, 
           average_price, percentage_change, quantity, trade_volume, total_volume
    FROM stockdetails
    WHERE stock_id = %s
    ORDER BY date DESC;
    """
    try:
        with get_database_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, (stock_id,))
                results = cursor.fetchall()
                df = pd.DataFrame([clean_and_convert_row(row) for row in results])
                if not df.empty:
                    df['date'] = pd.to_datetime(df['date'])
                return df
    except psycopg2.Error as e:
        logging.error(f"Database error: {e}")
        return pd.DataFrame()


def calculate_indicators(df, timeframe='daily'):
    if df.empty:
        logging.warning("No data available to calculate indicators.")
        return pd.DataFrame()

    if not isinstance(df.index, pd.DatetimeIndex):
        logging.error("DataFrame index must be a DatetimeIndex for resampling.")
        return pd.DataFrame()

    df.fillna(0, inplace=True)
    df.replace(0, 1e-10, inplace=True)

    if timeframe == 'weekly':
        df = df.resample('W').mean()
    elif timeframe == 'monthly':
        df = df.resample('M').mean()

    if 'last_transaction_price' not in df.columns:
        logging.error("Missing 'last_transaction_price' column for indicator calculations.")
        return pd.DataFrame()

    df['SMA_50'] = df['last_transaction_price'].rolling(window=50).mean()
    df['EMA_50'] = df['last_transaction_price'].ewm(span=50, adjust=False).mean()
    df['SMA_200'] = df['last_transaction_price'].rolling(window=200).mean()
    df['EMA_200'] = df['last_transaction_price'].ewm(span=200, adjust=False).mean()

    df['RSI'] = ta.momentum.RSIIndicator(df['last_transaction_price'], window=14).rsi()
    df['MACD'] = ta.trend.MACD(df['last_transaction_price']).macd()
    df['Stochastic_Oscillator'] = ta.momentum.StochasticOscillator(
        high=df['max_price'], low=df['min_price'], close=df['last_transaction_price'], window=14
    ).stoch()
    df['CCI'] = ta.trend.CCIIndicator(
        high=df['max_price'], low=df['min_price'], close=df['last_transaction_price'], window=20
    ).cci()
    df['Williams_R'] = ta.momentum.WilliamsRIndicator(
        high=df['max_price'], low=df['min_price'], close=df['last_transaction_price'], lbp=14
    ).williams_r()

    bb = ta.volatility.BollingerBands(df['last_transaction_price'])
    df['Bollinger High'] = bb.bollinger_hband()
    df['Bollinger Low'] = bb.bollinger_lband()

    return df


def generate_signals(df):
    if df.empty:
        logging.warning("No data available to generate signals.")
        return df

    df['signal'] = 'Hold'

    df.loc[df['RSI'] < 30, 'signal'] = 'Buy'
    df.loc[df['RSI'] > 70, 'signal'] = 'Sell'


    df.loc[df['MACD'] > 0, 'signal'] = 'Buy'
    df.loc[df['MACD'] < 0, 'signal'] = 'Sell'


    df.loc[df['CCI'] > 100, 'signal'] = 'Sell'
    df.loc[df['CCI'] < -100, 'signal'] = 'Buy'

    return df

def store_predictions_to_db(df, stock_id, timeframe):

    if df.empty:
        logging.warning("No data to store in the database.")
        return

    try:
        with get_database_connection() as conn:
            with conn.cursor() as cursor:
                create_table_query = """
                CREATE TABLE IF NOT EXISTS stocks_indicators (
                    id SERIAL PRIMARY KEY,
                    stock_id INT NOT NULL,
                    date TIMESTAMP NOT NULL,
                    timeframe VARCHAR(10),
                    sma_50 FLOAT, 
                    sma_200 FLOAT,
                    ema_50 FLOAT,
                    ema_200 FLOAT,
                    rsi FLOAT,
                    macd FLOAT,
                    stochastic_oscillator FLOAT,
                    cci FLOAT,
                    williams_r FLOAT,
                    bollinger_high FLOAT,
                    bollinger_low FLOAT,
                    signal VARCHAR(10)
                );
                """
                cursor.execute(create_table_query)

                df.columns = df.columns.str.replace(' ', '_')

                insert_query = """
                INSERT INTO stocks_indicators (
                    stock_id, date, timeframe, sma_50, sma_200, ema_50, ema_200,
                    rsi, macd, stochastic_oscillator, cci, williams_r,
                    bollinger_high, bollinger_low, signal
                ) VALUES %s
                """

                records = [
                    (
                        stock_id,
                        row.Index,
                        timeframe,
                        row.SMA_50, row.SMA_200, row.EMA_50, row.EMA_200,
                        row.RSI, row.MACD, row.Stochastic_Oscillator,
                        row.CCI, row.Williams_R, row.Bollinger_High, row.Bollinger_Low,
                        row.signal
                    )
                    for row in df.itertuples()
                ]
                execute_values(cursor, insert_query, records)
                conn.commit()
                logging.info("Data inserted into `stocks_indicators` successfully.")
    except psycopg2.Error as e:
        logging.error(f"Database error: {e}")

def main():
    ticker_ids = get_all_tickers()
    timeframes = ['daily', 'weekly', 'monthly']

    for ticker_id in ticker_ids:
        for timeframe in timeframes:
            data = get_ticker_data(ticker_id)
            if not data.empty:
                data.set_index('date', inplace=True)
                df = calculate_indicators(data, timeframe)
                df = generate_signals(df)
                store_predictions_to_db(df, ticker_id, timeframe)
                logging.info(f"Processed and stored data for stock {ticker_id} ({timeframe}).")
