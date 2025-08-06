import React, { useState, useEffect, useCallback } from "react";
import { Box, Flex, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
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
  const [showSearchBar, setShowSearchBar] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [accumulatedScroll, setAccumulatedScroll] = useState<number>(0);

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

  const handleScrollDirection = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - lastScrollY;
    
    const currentDirection = scrollDifference > 0 ? 'down' : scrollDifference < 0 ? 'up' : null;
    
    // Reset accumulated scroll if direction changes
    if (currentDirection !== scrollDirection && currentDirection !== null) {
      setAccumulatedScroll(0);
      setScrollDirection(currentDirection);
    }
    
    if (currentDirection) {
      setAccumulatedScroll(prev => prev + Math.abs(scrollDifference));
    }
    
    if (scrollDirection === 'up' && accumulatedScroll > 50) {
      setShowSearchBar(true);
      setAccumulatedScroll(0);
    } else if (scrollDirection === 'down' && currentScrollY > 100) {
      setShowSearchBar(false);
      setAccumulatedScroll(0);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY, scrollDirection, accumulatedScroll]);

  const handleScroll = useCallback(() => {
    // Handle lazy loading
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
    const combinedScrollHandler = () => {
      handleScroll();
      handleScrollDirection();
    };
    
    window.addEventListener("scroll", combinedScrollHandler);
    return () => window.removeEventListener("scroll", combinedScrollHandler);
  }, [handleScroll, handleScrollDirection]);

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
        py={2}
        px={8}
      >
        <Flex justify="center">
          <Heading 
            as="h1" 
            size="lg" 
            fontFamily="Quicksand" 
            fontWeight="800" 
            color="gray.800"
            cursor="pointer"
            onClick={() => window.location.reload()}
            _hover={{ textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
          >
            Promising News
          </Heading>
        </Flex>
      </Box>

      <Box
        position="fixed"
        top="50px"
        left={0}
        right={0}
        zIndex={999}
        bg="#F9F6F1"
        py={2}
        px={8}
        borderBottom="1px"
        borderColor="gray.200"
        transform={showSearchBar ? "translateY(0)" : "translateY(-100%)"}
        transition="all 0.2s ease-in-out"
      >
        <Flex 
          gap={4} 
          align="center" 
          justify="center"
          direction={{ base: "column", md: "row" }}
          width="100%"
        >
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          <CategoryFilter 
            selectedCategories={selectedCategories} 
            setSelectedCategories={setSelectedCategories} 
          />
        </Flex>
      </Box>
      
      <Box 
        as="main" 
        pt={{ base: "140px", md: "120px" }} 
        px={{ base: 4, md: 8 }} 
        pb={8}
      >
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

    </Box>
  );
}

export default App; 