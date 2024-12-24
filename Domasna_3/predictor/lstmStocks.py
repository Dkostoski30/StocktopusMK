import datetime
import logging
import os

import numpy as np
import pandas as pd
import psycopg2
from dotenv import load_dotenv
from matplotlib import pyplot as plt
from psycopg2.extras import RealDictCursor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import MinMaxScaler
from tf_keras import Sequential
from tf_keras.src.layers import LSTM, Dropout, Dense

load_dotenv()


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def get_database_connection():

    try:
        return psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
    except psycopg2.Error as e:
        logging.error(f"Failed to connect to the database: {e}")
        raise


def clean_and_convert_row(row):


    def clean_value(value):
        if value == "" or value is None:
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
    SELECT date, last_transaction_price
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

def prepare_lstm_data(df, feature_column='last_transaction_price', look_back=60):

    data = df[feature_column].values.reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    lagged_data = []
    for i in range(look_back, len(scaled_data)):
        lagged_features = scaled_data[i - look_back:i].flatten()
        target_value = scaled_data[i, 0]
        lagged_data.append((lagged_features, target_value))

    lagged_data = np.array(lagged_data, dtype=object)
    x = np.stack(lagged_data[:, 0])
    y = np.array(lagged_data[:, 1], dtype=np.float64)

    return x, y, scaler

def split_data(x, y, train_ratio=0.7):

    train_size = int(len(x) * train_ratio)
    x_train, y_train = x[:train_size], y[:train_size]
    x_val, y_val = x[train_size:], y[train_size:]
    return x_train, y_train, x_val, y_val

def build_lstm(input_shape):
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(25),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def train_model(model, x_train, y_train, x_val, y_val, epochs=50, batch_size=32):
    """Train the LSTM model."""
    history = model.fit(
        x_train, y_train,
        validation_data=(x_val, y_val),
        epochs=epochs,
        batch_size=batch_size,
        verbose=1
    )
    return history
def predict_prices(model, x, scaler):
    """Predict stock prices using the trained model."""
    predictions = model.predict(x)
    return scaler.inverse_transform(predictions)

# Evaluate model performance
def evaluate_model(y_true, y_pred):

    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)
    return mse, rmse, r2

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

if __name__ == '__main__':
    look_back = 60  # Number of past days used for prediction
    tickers = get_all_tickers()  # Fetch all ticker IDs
    logging.info(f"Tickers fetched: {tickers}")

    models = {}  # Dictionary to store models for each ticker

    for ticker_id in tickers:
        logging.info(f"Processing stock ID {ticker_id}...")

        # Fetch data for the current ticker
        data = get_ticker_data(ticker_id)

        # Drop rows with missing values in the feature column
        data = data.dropna(subset=['last_transaction_price'])

        # Check if there is enough data to train the model
        if len(data) <= look_back:
            logging.warning(f"Not enough data for stock ID {ticker_id}. Skipping...")
            continue

        try:
            # Prepare LSTM data
            x, y, scaler = prepare_lstm_data(data, feature_column='last_transaction_price', look_back=look_back)
            x = x.reshape((x.shape[0], x.shape[1], 1))  # Reshape for LSTM input

            # Split the data into training and validation sets
            x_train, y_train, x_val, y_val = split_data(x, y)

            # Build and train the model
            model = build_lstm(input_shape=(x_train.shape[1], 1))
            history = train_model(model, x_train, y_train, x_val, y_val, epochs=50, batch_size=32)

            # Evaluate the model
            y_train_pred = predict_prices(model, x_train, scaler)
            y_val_pred = predict_prices(model, x_val, scaler)
            y_actual = scaler.inverse_transform(y_val.reshape(-1, 1))

            mse, rmse, r2 = evaluate_model(y_actual, y_val_pred)
            logging.info(f"Model Evaluation for Stock ID {ticker_id} - MSE: {mse}, RMSE: {rmse}, R^2: {r2}")

            # Save the trained model for the ticker
            models[ticker_id] = model

            # Plot results for the current ticker
            plt.figure(figsize=(12, 6))
            plt.plot(y_actual, label='Actual Prices')
            plt.plot(y_val_pred, label='Predicted Prices')
            plt.title(f'LSTM Stock Price Prediction for Stock ID {ticker_id}')
            plt.xlabel('Time')
            plt.ylabel('Price')
            plt.legend()
            plt.show()

        except Exception as e:
            logging.error(f"Error while processing stock ID {ticker_id}: {e}")





