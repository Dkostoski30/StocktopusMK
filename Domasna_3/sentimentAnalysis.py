import os

import psycopg2
import torch
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModelForSequenceClassification

load_dotenv()

model_name = "agentlans/multilingual-e5-small-aligned-sentiment"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

def sentiment(text):

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True).to(device)
    with torch.no_grad():
        logits = model(**inputs).logits.squeeze().cpu()
    return logits.tolist()

def analyze_sentiment(text,news_id):
    score = sentiment(text)

    # print(f'Sentiment score for news with id: {news_id} is {score}')
    if score < 0:
        sentiment_label = "Negative"
    elif score == 0 or score < 0.5:
        sentiment_label = "Neutral"
    else:
        sentiment_label = "Positive"

    return sentiment_label

def update_sentiment(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, text FROM latest_news WHERE sentiment is NULL;")
        rows = cursor.fetchall()

        for row in rows:
            news_id, text = row
            sentiment = analyze_sentiment(text,news_id)
            cursor.execute("UPDATE latest_news SET sentiment = %s WHERE id = %s;", (sentiment, news_id))

        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Failed to update sentiment: {e}")
    finally:
        cursor.close()

def init():
    print("Updating sentiment analysis...")

    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT")
        )

        update_sentiment(conn)

    finally:
        conn.close()

if __name__ == "__main__":
    init()
