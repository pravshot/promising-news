import mongoose from "mongoose";
import NewsEntry from "../models/newsEntry.js";
import NewsAPI from "newsapi";
import dotenv from "dotenv";
import sentimentAnalyzer from "../services/sentimentAnalyzer.js";

dotenv.config();

const POSITIVE_SENTIMENT_THRESHOLD = 0.9;
const CATEGORIES = [
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];
const FETCH_SIZE_PER_CATEGORY = 80;

/**
 * Get news articles with filtering, sorting, and pagination support
 *
 * Query Parameters:
 * - keyword (string, optional): Search term for title/author/publication/description
 * - category (string, optional): #-separated list of categories to filter by (e.g., "health#technology")
 * - pageSize (number, default: 15): Number of articles per page
 * - page (number, default: 1): Page number for pagination
 * - sortBy (string, default: "date"): Sort field - "date", "title", "publication", "category", "positivity_score"
 * - sortOrder (string, default: "desc"): Sort order - "asc" or "desc"
 *
 * Returns:
 * - articles: Array of news articles for the requested page
 * - hasNextPage: Boolean indicating if there's a next page
 */
export const getNews = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const {
      keyword = "",
      category = "",
      pageSize = 15,
      page = 1,
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    // Parse and validate pagination parameters
    const parsedPageSize = Math.min(Math.max(parseInt(pageSize) || 15, 1), 100); // Limit page size between 1-100
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const skip = (parsedPage - 1) * parsedPageSize;

    // Build MongoDB query object
    const query = {};

    // Add keyword search if provided
    if (keyword && keyword.trim() !== "") {
      const keywordLower = keyword.toLowerCase().trim();
      query.$or = [
        { title: { $regex: keywordLower, $options: "i" } },
        { author: { $regex: keywordLower, $options: "i" } },
        { publication: { $regex: keywordLower, $options: "i" } },
        { description: { $regex: keywordLower, $options: "i" } },
      ];
    }

    // Add category filter if provided
    if (category && category.trim() !== "") {
      const categories = category
        .split("#")
        .map((cat) => cat.trim())
        .filter((cat) => cat);
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // Build sort object
    const sortField = [
      "date",
      "title",
      "publication",
      "category",
      "positivity_score",
    ].includes(sortBy)
      ? sortBy
      : "date";
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sort = { [sortField]: sortDirection };

    // Fetch one extra to check if there's a next page
    const articles = await NewsEntry.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parsedPageSize + 1)
      .lean();

    const hasNextPage = articles.length > parsedPageSize;
    if (hasNextPage) {
      articles.pop();
    }

    res.status(200).json({
      articles,
      hasNextPage,
    });
  } catch (error) {
    console.error("Error in getNews:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getNewsEntry = async (req, res) => {
  try {
    const newsEntry = await NewsEntry.findById(req.params.id);
    res.status(200).json(newsEntry);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createNewsEntry = async (req, res) => {
  const {
    title,
    author,
    description,
    date,
    url,
    image_url,
    publication,
    category,
    positivity_score,
  } = req.body;
  // check to see if this news entry already exists
  try {
    const entry = await NewsEntry.findOne({ url: url });
    if (entry) {
      res.status(400).json({ message: "This news entry already exists" });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  const newEntry = new NewsEntry({
    title,
    author,
    description,
    date,
    url,
    image_url,
    publication,
    category,
    positivity_score,
  });
  try {
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNewsEntry = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    author,
    description,
    date,
    url,
    image_url,
    publication,
    category,
    positivity_score,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedEntry = new NewsEntry({
    title,
    author,
    description,
    date,
    url,
    image_url,
    publication,
    category,
    positivity_score,
    _id: id,
  });

  const ret = await NewsEntry.findByIdAndUpdate(id, updatedEntry, {
    new: true,
  });
  res.json(ret);
};

export const deleteNewsEntry = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await NewsEntry.findByIdAndRemove(id);
  res.json({ message: "Post deleted successfully." });
};

export const dailyUpdate = async (req, res) => {
  try {
    const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

    // Initialize sentiment analyzer if not already done
    if (!sentimentAnalyzer.isInitialized) {
      await sentimentAnalyzer.initialize();
    }

    let newlySavedArticles = 0;
    let positiveArticles = 0;

    for (const category of CATEGORIES) {
      try {
        console.log(`Fetching articles for category: ${category}`);

        const results = await newsapi.v2.topHeadlines({
          language: "en",
          country: "us",
          category: category,
          page_size: FETCH_SIZE_PER_CATEGORY,
          page: 1,
        });
        const articles = results.articles;

        const titles = articles.map((a) => a.title);
        const sentimentScores = await sentimentAnalyzer.scoreSentiments(titles);

        for (let i = 0; i < articles.length; i++) {
          const article = articles[i];
          const sentimentScore = sentimentScores[i];

          console.log(`Category: ${category}, Title: ${article.title}`);
          console.log(`Sentiment score: ${sentimentScore}`);

          if (sentimentScore > POSITIVE_SENTIMENT_THRESHOLD) {
            positiveArticles++;
            const newsEntry = new NewsEntry({
              title: article.title,
              author: article.author,
              description: article.description,
              date: article.publishedAt,
              url: article.url,
              image_url: article.urlToImage,
              publication: article.source.name,
              category: category,
              positivity_score: sentimentScore,
            });
            try {
              if (!(await NewsEntry.findOne({ url: article.url }))) {
                await newsEntry.save();
                newlySavedArticles++;
              }
            } catch (error) {
              console.log("Failed to save article:", error);
            }
          }
        }
      } catch (error) {
        console.error(
          `Error fetching articles for category ${category}:`,
          error
        );
      }
    }

    res.status(200).json({
      message: "Daily update executed for all categories",
      newlySavedArticles: newlySavedArticles,
      positiveArticles: positiveArticles,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
