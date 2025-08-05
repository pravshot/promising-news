import axios, { AxiosResponse } from "axios";
import { NewsApiResponse, NewsApiParams } from "../types/news";

// Export types for external use
export * from "../types/news";

// const url = "https://promising-news.uc.r.appspot.com/news";
const url: string = "http://localhost:4000/news";

export const getNewsWithParams = async (params: NewsApiParams): Promise<AxiosResponse<NewsApiResponse>> =>
  await axios.get<NewsApiResponse>(url, { params }); 