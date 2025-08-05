// News article interface
export interface NewsArticle {
  id: string;
  title: string;
  author?: string;
  description?: string;
  date: string;
  url: string;
  image_url?: string;
  publication?: string;
  positivity_score: string;
  category?: "entertainment" | "health" | "science" | "sports" | "technology" | null;
}

// API response interface
export interface NewsApiResponse {
  articles: NewsArticle[];
  hasNextPage: boolean;
}

// Parameters for news API requests
export interface NewsApiParams {
  keyword?: string;
  category?: string;
  pageSize?: number;
  page?: number;
  sortBy?: "date" | "title" | "publication" | "category" | "positivity_score";
  sortOrder?: "asc" | "desc";
} 