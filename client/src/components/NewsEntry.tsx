import React from "react";
import {
  Box,
  Flex,
  Heading,
  Image,
  Tag,
  Text,
  VStack,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { NewsArticle } from "../types/news";

const placeholderImage = "placeholderimage.png";

function NewsEntry({
  title,
  author,
  description,
  date,
  url,
  image_url,
  publication,
  category,
}: NewsArticle) {
  const formatedTitle = formatTitle(title);
  const formatedDate = formatDate(date);
  const formatedAuthor = formatAuthor(author);

  const categoryInfo = getCategoryInfo(category);

  const handleClick = () => {
    window.open(url, "_blank");
  };

  return (
    <Box
      bg="white"
      borderRadius="xl"
      boxShadow="md"
      overflow="hidden"
      cursor="pointer"
      transition="transform 0.2s"
      _hover={{ transform: "scale(1.02)" }}
      onClick={handleClick}
      maxW="500px"
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Image
        src={image_url || placeholderImage}
        alt={formatedTitle}
        w="100%"
        h="200px"
        objectFit="cover"
      />
      
      <VStack spacing={3} p={4} align="stretch" flex="1">
        <Heading
          as="h3"
          size="md"
          fontFamily="Quicksand"
          fontWeight="600"
          lineHeight="1.3"
          noOfLines={3}
        >
          {formatedTitle}
        </Heading>
        
        <Spacer />
        
        <Divider />
        
        <Flex justify="space-between" align="center" mt="auto">
          <Flex gap={2} align="center">
            {category && (
              <Tag
                size="md"
                colorScheme={categoryInfo.colorScheme}
                borderRadius="full"
              >
                {categoryInfo.label}
              </Tag>
            )}
            {author && (
              <Text fontSize="sm" color="gray.600" noOfLines={1} maxW="120px">
                {formatedAuthor}
              </Text>
            )}
          </Flex>
          <Text fontSize="sm" color="gray.500">
            {formatedDate}
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
}

function formatTitle(title: string): string {
  return title.split(" - ").slice(0, -1).join(" - ");
}

function formatAuthor(author: string | undefined): string {
  if (!author) {
    return "";
  }
  const authorList = author
    .split(",")
    .map((name) => capitalizeName(name.trim()));
  
  return authorList[0];
}

function capitalizeName(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInS = (now.getTime() - date.getTime()) / 1000;

  const diffInMinutes = Math.floor(diffInS / 60);
  const diffInHours = Math.floor(diffInS / (60 * 60));
  const diffInDays = Math.floor(diffInS / (60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) {
    return "Now";
  } else if (diffInHours < 1) {
    return `${diffInMinutes}m ago`;
  } else if (diffInDays < 1) {
    return `${diffInHours}h ago`;
  } else if (diffInWeeks < 1) {
    return `${diffInDays}d ago`;
  } else if (diffInMonths < 1) {
    return `${diffInWeeks}w ago`;
  } else if (diffInYears < 1) {
    return `${diffInMonths}mo ago`;
  } else {
    return `${diffInYears}y ago`;
  }
}

function getCategoryInfo(category: NewsArticle['category']): { label: string, colorScheme: string } {
  switch (category) {
    case 'entertainment':
      return { label: 'Entertainment', colorScheme: 'purple' };
    case 'health':
      return { label: 'Health', colorScheme: 'green' };
    case 'science':
      return { label: 'Science', colorScheme: 'blue' };
    case 'sports':
      return { label: 'Sports', colorScheme: 'orange' };
    case 'technology':
      return { label: 'Technology', colorScheme: 'gray' };
    default:
      return { label: '', colorScheme: 'gray' };
  }
}

export default NewsEntry; 