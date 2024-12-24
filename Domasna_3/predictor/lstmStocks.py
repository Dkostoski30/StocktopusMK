import datetime
import logging
import os

import numpy as np
import pandas as pd
import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor
from sklearn.metrics import mean_squared_error
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

    x, y = [], []
    for i in range(look_back, len(scaled_data)):
        x.append(scaled_data[i - look_back:i, 0])
        y.append(scaled_data[i, 0])

    x, y = np.array(x), np.array(y)
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
    """Calculate evaluation metrics."""
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    return mse, rmse

if __name__ == '__main__':
    stock_id = 62
    logging.info(f"Fetching data for stock ID {stock_id}...")

    data = get_ticker_data(stock_id)
    data = data.dropna(subset=['last_transaction_price'])  # Remove rows with missing prices

    # Prepare data
    look_back = 60
    x, y, scaler = prepare_lstm_data(data, feature_column='last_transaction_price', look_back=look_back)
    x = x.reshape((x.shape[0], x.shape[1], 1))  # Reshape for LSTM

    # Split into training and validation sets
    x_train, y_train, x_val, y_val = split_data(x, y)

    # Build and train LSTM model
    model = build_lstm(input_shape=(x_train.shape[1], 1))
    history = train_model(model, x_train, y_train, x_val, y_val, epochs=50, batch_size=32)

    # Predictions and evaluation
    y_train_pred = predict_prices(model, x_train, scaler)
    y_val_pred = predict_prices(model, x_val, scaler)
    y_actual = scaler.inverse_transform(y_val.reshape(-1, 1))

    mse, rmse = evaluate_model(y_actual, y_val_pred)
    logging.info(f"Model Evaluation - MSE: {mse}, RMSE: {rmse}")

    # Plot results
    import matplotlib.pyplot as plt

    plt.figure(figsize=(12, 6))
    plt.plot(y_actual, label='Actual Prices')
    plt.plot(y_val_pred, label='Predicted Prices')
    plt.title('LSTM Stock Price Prediction')
    plt.xlabel('Time')
    plt.ylabel('Price')
    plt.legend()
    plt.show()




