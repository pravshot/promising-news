import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: null },
  description: { type: String, default: null },
  date: { type: String, default: new Date().toISOString() },
  url: { type: String, required: true },
  image_url: { type: String, default: null },
  publication: { type: String, default: null },
  category: { type: String, default: null },
  positivity_score: { type: String, required: true },
});

const NewsEntry = mongoose.model("NewsEntry", newsSchema);

export default NewsEntry;
