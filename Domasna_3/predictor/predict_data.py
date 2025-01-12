import datetime
import os
import logging
import numpy as np
from flask import Flask, jsonify, request
from tf_keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor
import psycopg2
from flask_cors import CORS
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5174"])
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

LOOK_BACK = 60


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
    ORDER BY date DESC
    LIMIT %s;
    """
    try:
        with get_database_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, (stock_id, LOOK_BACK))
                results = cursor.fetchall()
                df = pd.DataFrame([clean_and_convert_row(row) for row in results])
                if not df.empty:
                    df['date'] = pd.to_datetime(df['date'])
                return df
    except psycopg2.Error as e:
        logging.error(f"Database error: {e}")
        return pd.DataFrame()


def prepare_prediction_data(df, feature_column='last_transaction_price'):
    # Scale the price column
    price_scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_prices = price_scaler.fit_transform(df[[feature_column]])

    input_data = scaled_prices[-LOOK_BACK:]
    input_data = input_data.reshape(1, LOOK_BACK, 1)

    return input_data, price_scaler


@app.route('/predict/<int:ticker_id>', methods=['GET'])
def predict_price(ticker_id):
    model_path = os.path.join("models", f"stock_{ticker_id}", f"stock_{ticker_id}.h5")

    if not os.path.exists(model_path):
        return jsonify({"error": f"Model for Stock ID {ticker_id} not found"}), 404

    try:
        model = load_model(model_path)

        data = get_ticker_data(ticker_id)
        if data.empty or len(data) < 60:
            return jsonify({"error": "Insufficient data for prediction"}), 400

        data['sentiment'] = data.get('sentiment', 'Neutral')
        data['mapped_sentiment'] = data['sentiment'].map({'Positive': 1, 'Neutral': 0, 'Negative': -1}).fillna(0)

        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_prices = scaler.fit_transform(data[['last_transaction_price']].tail(60))
        combined_features = np.hstack([scaled_prices, data['mapped_sentiment'].tail(60).values.reshape(-1, 1)])

        input_data = combined_features.reshape(1, 60, 2)

        predicted_scaled_price = model.predict(input_data)
        predicted_price = scaler.inverse_transform(predicted_scaled_price.reshape(-1, 1))[0, 0]

        return jsonify({
            "id": ticker_id,
            "price_tomorrow": float(predicted_price)  # Convert to native float
        })

    except Exception as e:
        logging.error(f"Error predicting price for Stock ID {ticker_id}: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
