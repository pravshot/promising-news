import React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import NewsEntry from "./NewsEntry";
import { NewsArticle } from "../types/news";

interface NewsProps {
  articles: NewsArticle[];
}

function News({ articles }: NewsProps) {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={6}
      w="100%"
      justifyItems={{ base: "center", md: "stretch" }}
    >
      {articles.map((article) => (
        <NewsEntry key={article.id} {...article} />
      ))}
    </SimpleGrid>
  );
}

export default News; 