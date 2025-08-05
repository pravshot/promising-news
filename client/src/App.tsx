import React, { useState, useEffect, useCallback } from "react";
import { Box, Flex, Heading, Spinner, Text, VStack, Link, Icon } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import News from "./components/News";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import { getNewsWithParams } from "./api";
import { NewsArticle } from "./types/news";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await getNewsWithParams({
        keyword: searchQuery,
        category: selectedCategories.length > 0 ? selectedCategories.join("#") : undefined,
        page,
        pageSize: 15,
        sortBy: "date",
        sortOrder: "desc",
      });
      setArticles((prev) => [...prev, ...results.data.articles]);
      setHasNextPage(results.data.hasNextPage);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategories, page]);

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasNextPage(true);
  }, [searchQuery, selectedCategories]);

  useEffect(() => {
    if (!hasNextPage) return;
    fetchArticles();
  }, [fetchArticles, hasNextPage]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - 500 ||
      isLoading || !hasNextPage
    ) {
      return;
    }
    setPage((prev) => prev + 1);
  }, [isLoading, hasNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Box minH="100vh" bg="#F9F6F1" position="relative">
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg="#F9F6F1"
        py={3}
        px={8}
      >
        <Flex justify="space-between" align="center">
          <Heading 
            as="h1" 
            size="lg" 
            fontFamily="Quicksand" 
            fontWeight="800" 
            color="gray.800"
          >
            Promising News
          </Heading>
          <Flex gap={4} align="center">
            <SearchBar query={searchQuery} setQuery={setSearchQuery} />
            <CategoryFilter 
              selectedCategories={selectedCategories} 
              setSelectedCategories={setSelectedCategories} 
            />
          </Flex>
        </Flex>
      </Box>
      
      <Box as="main" pt="80px" px={8} pb="100px">
        {!isLoading && articles.length === 0 && (
          <VStack spacing={4} py={12} textAlign="center">
            <Text fontSize="xl" color="gray.600" fontWeight="medium">
              {searchQuery || selectedCategories.length > 0 
                ? "No articles found matching your criteria." 
                : "No articles available at the moment."}
            </Text>
            <Text fontSize="md" color="gray.500">
              Try adjusting your search terms or category filters.
            </Text>
          </VStack>
        )}
        {articles.length > 0 && <News articles={articles} />}
        {isLoading && (
          <VStack spacing={4} py={8}>
            <Spinner size="lg" color="blue.500" thickness="4px" />
            <Text color="gray.600">Loading...</Text>
          </VStack>
        )}
      </Box>
      
      <Box
        as="footer"
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="#f9f6f1"
        borderTop="1px"
        borderColor="gray.200"
        py={3}
        px={8}
        zIndex={1000}
      >
        <Flex justify="space-between" align="center">
          <Text fontSize="lg" fontStyle="italic" color="gray.600">
            Not all news is bad news!
          </Text>
          <Flex gap={4} align="center">
            <Link
              href="https://linkedin.com/in/praveen-kalva/"
              isExternal
              color="blue.500"
              _hover={{ color: "blue.600", textDecoration: "underline" }}
              display="flex"
              alignItems="center"
              gap={1}
            >
              LinkedIn
              <Icon as={ExternalLinkIcon} boxSize={3} />
            </Link>
            <Link
              href="https://github.com/pravshot"
              isExternal
              color="blue.500"
              _hover={{ color: "blue.600", textDecoration: "underline" }}
              display="flex"
              alignItems="center"
              gap={1}
            >
              GitHub
              <Icon as={ExternalLinkIcon} boxSize={3} />
            </Link>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

export default App; 