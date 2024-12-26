import datetime
import logging
import os
from tf_keras.regularizers import l2
import numpy as np
import pandas as pd
import psycopg2
from dotenv import load_dotenv
from matplotlib import pyplot as plt
from psycopg2.extras import RealDictCursor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import MinMaxScaler
from tf_keras.models import Sequential
from tf_keras.layers import LSTM, Dropout, Dense, Input

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Ensure models directory exists
if not os.path.exists("models"):
    os.makedirs("models")


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


def get_sentiment_data(stock_id):
    query = """
    SELECT ln.date, ln.sentiment
    FROM latest_news ln
    JOIN news_and_stocks nas ON ln.id = nas.latest_news_id
    WHERE nas.stock_id = %s
    ORDER BY ln.date DESC;
    """
    try:
        with get_database_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, (stock_id,))
                results = cursor.fetchall()
                return pd.DataFrame([clean_and_convert_row(row) for row in results])
    except psycopg2.Error as e:
        logging.error(f"Database error fetching sentiment: {e}")
        return pd.DataFrame()


def prepare_lstm_data(df, feature_column='last_transaction_price', sentiment_column='sentiment', look_back=60):
    # Scale only the price column
    price_scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_prices = price_scaler.fit_transform(df[[feature_column]])

    # Map sentiment values to numerical representations
    df['mapped_sentiment'] = df[sentiment_column].map({'Positive': 1, 'Neutral': 0, 'Negative': -1}).fillna(0)
    sentiments = df['mapped_sentiment'].values.reshape(-1, 1)

    # Combine scaled prices and mapped sentiments
    combined_features = np.hstack([scaled_prices, sentiments])

    lagged_data = []
    for i in range(look_back, len(combined_features)):
        lagged_features = combined_features[i - look_back:i]
        target_value = scaled_prices[i, 0]  # Only target price for prediction
        lagged_data.append((lagged_features, target_value))

    lagged_data = np.array(lagged_data, dtype=object)
    x = np.stack(lagged_data[:, 0])
    y = np.array(lagged_data[:, 1], dtype=np.float64)

    return x, y, price_scaler


def split_data(x, y, train_ratio=0.7):
    train_size = int(len(x) * train_ratio)
    x_train, y_train = x[:train_size], y[:train_size]
    x_val, y_val = x[train_size:], y[train_size:]
    return x_train, y_train, x_val, y_val


def build_lstm(input_shape):
    model = Sequential([
        Input(shape=input_shape),
        LSTM(50, return_sequences=True, kernel_regularizer=l2(0.01)),
        Dropout(0.3),
        LSTM(50, return_sequences=False, kernel_regularizer=l2(0.01)),
        Dropout(0.3),
        Dense(25),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model


def train_model(model, x_train, y_train, x_val, y_val, epochs=50, batch_size=32):
    history = model.fit(
        x_train, y_train,
        validation_data=(x_val, y_val),
        epochs=epochs,
        batch_size=batch_size,
        verbose=1
    )
    return history


def predict_prices(model, x, scaler):
    predictions = model.predict(x)
    # Reshape predictions for inverse scaling
    predictions = predictions.reshape(-1, 1)
    return scaler.inverse_transform(predictions).flatten()



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


def save_model_and_plot(model, stock_id, y_actual, y_val_pred, model_dir):
    """
    Save the model and plot the predicted vs actual prices in the given directory.
    """
    # Create a directory for the model if it doesn't exist
    os.makedirs(model_dir, exist_ok=True)

    # Save the model
    model_path = os.path.join(model_dir, f"stock_{stock_id}.h5")
    model.save(model_path)
    logging.info(f"Model for Stock ID {stock_id} saved to {model_path}")

    plt.figure(figsize=(10, 6))
    plt.plot(y_actual, color='blue', label='Actual Prices')
    plt.plot(y_val_pred, color='red', label='Predicted Prices')
    plt.title(f"Actual vs Predicted Prices for Stock {stock_id}")
    plt.xlabel("Time")
    plt.ylabel("Price")
    plt.legend()
    plot_path = os.path.join(model_dir, f"stock_{stock_id}_plot.png")
    plt.savefig(plot_path)
    plt.close()
    logging.info(f"Plot for Stock ID {stock_id} saved to {plot_path}")


if __name__ == '__main__':
    look_back = 60
    tickers = get_all_tickers()
    print(tickers)
    tickers = [62]
    logging.info(f"Tickers fetched: {tickers}")

    for ticker_id in tickers:
        logging.info(f"Processing stock ID {ticker_id}...")

        # Check if the folder for the stock already exists
        model_dir = os.path.join("models", f"stock_{ticker_id}")
        if os.path.exists(model_dir):
            logging.info(f"Model directory for Stock ID {ticker_id} already exists. Skipping training...")
            continue

        # Check if a model for this stock ID already exists
        model_path = os.path.join(model_dir, f"stock_{ticker_id}.h5")
        if os.path.exists(model_path):
            logging.info(f"Model for Stock ID {ticker_id} already exists. Skipping...")
            continue

        data = get_ticker_data(ticker_id)
        sentiment_data = get_sentiment_data(ticker_id)
        data['date'] = pd.to_datetime(data['date'])
        if not sentiment_data.empty:
            sentiment_data['date'] = pd.to_datetime(sentiment_data['date'])
            data = pd.merge(data, sentiment_data, on='date', how='left')

        data['sentiment'] = data.get('sentiment', 'Neutral')
        data = data.dropna(subset=['last_transaction_price'])

        if len(data) <= look_back:
            logging.warning(f"Not enough data for stock ID {ticker_id}. Skipping...")
            continue

        try:
            x, y, scaler = prepare_lstm_data(data, feature_column='last_transaction_price',
                                             sentiment_column='sentiment', look_back=look_back)
            x = x.reshape((x.shape[0], x.shape[1], x.shape[2]))

            x_train, y_train, x_val, y_val = split_data(x, y)

            model = build_lstm(input_shape=(x_train.shape[1], x_train.shape[2]))
            train_model(model, x_train, y_train, x_val, y_val, epochs=30, batch_size=32)

            y_val_pred = predict_prices(model, x_val, scaler)
            y_actual = scaler.inverse_transform(y_val.reshape(-1, 1))

            mse, rmse, r2 = evaluate_model(y_actual, y_val_pred)
            logging.info(f"Evaluation for Stock ID {ticker_id} - MSE: {mse}, RMSE: {rmse}, R^2: {r2}")

            # Save model and plot
            save_model_and_plot(model, ticker_id, y_actual, y_val_pred, model_dir)

        except Exception as e:
            logging.error(f"Error processing stock ID {ticker_id}: {e}")
