import tensorflow as tf
from tensorflow import keras
from nltk.corpus import stopwords
import requests
from requests.adapters import HTTPAdapter, Retry
from newsapi import NewsApiClient
import pandas as pd

# load the model
model = keras.models.load_model(
    "./news_sentiment_model"
)

# preprocess text before putting into model
def preprocess(text):
    # lowercase
    text = tf.strings.lower(text)
    # remove punctuation
    text = tf.strings.regex_replace(text, "[^\w\s]", "")
    # remove stop_words
    text = tf.strings.regex_replace(
        text, r"\b(" + r"|".join(stopwords.words("english")) + r")\b\s*", ""
    )
    return text


# get the latest news
newsapi = NewsApiClient(api_key="")
top_headlines = newsapi.get_top_headlines(language='en', country='us', page_size=100, page=1)

API_URL = "https://promising-news.uc.r.appspot.com/news"

s = requests.Session()
retries = Retry(total=2, backoff_factor=0.1)
s.mount("https://", HTTPAdapter(max_retries=retries))

request_hist = pd.DataFrame(columns=["article", "status_code"])
for article in top_headlines["articles"]:
    title = article["title"]
    score = model.predict(preprocess([title]))[0][0]
    if score > 0.5:
        # make http post request to database
        payload = dict(
            title=title,
            author=article["author"],
            description=article["description"],
            date=article["publishedAt"],
            url=article["url"],
            image_url=article["urlToImage"],
            publication=article["source"]["name"],
            positivity_score=score,
        )
        r = s.post(API_URL, data=payload)
        request_hist.loc[len(request_hist.index)] = [title, r.status_code]

print(request_hist["status_code"].value_counts())
