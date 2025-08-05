import { pipeline } from "@xenova/transformers";

class SentimentAnalyzer {
  constructor() {
    this.classifier = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      this.classifier = await pipeline(
        "sentiment-analysis",
        "spkalva3/news-sentiment-model"
      );

      this.isInitialized = true;
      console.log("Sentiment analyzer initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize sentiment analyzer:", error);
      throw error;
    }
  }

  async scoreSentiment(text) {
    const scores = await this.scoreSentiments([text]);
    return scores[0];
  }

  async scoreSentiments(texts) {
    if (!this.isInitialized) {
      throw new Error(
        "Sentiment analyzer not initialized. Call initialize() first."
      );
    }

    const results = await this.classifier(texts);
    return results.map((result) =>
      result.label === "POSITIVE" ? result.score : 1 - result.score
    );
  }
}

const sentimentAnalyzer = new SentimentAnalyzer();
export default sentimentAnalyzer;
