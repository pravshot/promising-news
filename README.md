# 🌟 Promising News 

A full-stack web application that curates positive news articles using sentiment analysis, helping users discover uplifting stories in today's negative media.

*Not all news is bad news!*
## 🚀 Live Application

Visit the live website: **[https://promising-news.vercel.app](https://promising-news.vercel.app)**

## 🤖 Machine Learning Model

News sentiment analysis is powered by a fine-tuned DistilBERT model, deployed on Hugging Face:  
**[https://huggingface.co/spkalva3/news-sentiment-model](https://huggingface.co/spkalva3/news-sentiment-model)**

## ✨ Features

- **News Sentiment Analysis**: Automatically filters news articles to highlight positive and uplifting content
- **Category Filtering**: Browse news by specific categories (technology, health, science, etc.)
- **Daily Updates**: Fresh articles are automatically collected and analyzed daily
- **Infinite Scroll**: Seamless browsing experience with pagination and lazy loading

## 🛠️ Tech Stack

### Frontend
- **Deployed** with **Vercel**
- **React** with **TypeScript**
- **Chakra UI** for modern, accessible components

### Backend
- **Deployed** with **Google Cloud**
- **Node.js** with **Express**
- **MongoDB** to store articles and metadata
- **NewsAPI** for article aggregation
- **Xenova Transformers** for ML inference

### Machine Learning
- **DistilBERT** base model fine-tuned for news sentiment analysis
- **Hugging Face Transformers** for model deployment and inference

## 📱 Screenshots

![Screenshot 1](assets/screenshot1.png)
![Screenshot 2](assets/screenshot2.png)

## 🎯 Purpose

In an era where negative news often dominates headlines, Promising News aims to:

- **Promote Positivity**: Help users start their day with positive, uplifting news
- **Combat News Fatigue**: Reduce that overwhelming feeling that comes from constant negative media
- **Spread Innovations**: Highlight progress, breakthroughs, and positive developments happening around the world
- **Demonstrate AI for Good**: Show how machine learning can be used to improve daily life experiences

## 🏗️ Project Structure

```
promising-news/
├── client/          # React TypeScript frontend
├── server/          # Node.js Express backend
├── models/          # ML model training
└── README.md
```


## 📊 Model Performance

Our sentiment analysis model demonstrates significant improvement through fine-tuning:

| Model | Accuracy | F1 Score | Improvement |
|-------|----------|----------|-------------|
| **Base DistilBERT** | 74.0% | 76.0% | - |
| **Fine-tuned Model** | **88.5%** | **91.0%** | +14.5% / +15.0% |


<!-- Add model performance charts and confusion matrices here -->

## 📄 License

This project is licensed under the MIT License.