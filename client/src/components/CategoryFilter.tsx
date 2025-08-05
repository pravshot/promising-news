import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const CATEGORIES = [
  { value: "entertainment", label: "Entertainment", colorScheme: "purple" },
  { value: "health", label: "Health", colorScheme: "green" },
  { value: "science", label: "Science", colorScheme: "blue" },
  { value: "sports", label: "Sports", colorScheme: "orange" },
  { value: "technology", label: "Technology", colorScheme: "gray" },
];

interface CategoryFilterProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

function CategoryFilter({ selectedCategories, setSelectedCategories }: CategoryFilterProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCategoryToggle = (categoryValue: string) => {
    if (selectedCategories.includes(categoryValue)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categoryValue));
    } else {
      setSelectedCategories([...selectedCategories, categoryValue]);
    }
  };

  const handleRemoveCategory = (categoryValue: string) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryValue));
  };

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button
          variant="outline"
          rightIcon={<ChevronDownIcon />}
          bg="white"
          borderColor="gray.200"
          _hover={{ borderColor: "gray.300" }}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
          minW="170px"
          justifyContent="space-between"
        >
          <Box flex="1" textAlign="left">
            {selectedCategories.length === 0 ? (
              <Text color="gray.500">All Categories</Text>
            ) : (
              <Flex wrap="wrap" gap={1}>
                {selectedCategories.slice(0, 1).map(categoryValue => {
                  const category = CATEGORIES.find(cat => cat.value === categoryValue);
                  return category ? (
                    <Tag
                      key={categoryValue}
                      size="sm"
                      colorScheme={category.colorScheme}
                      borderRadius="full"
                    >
                      <TagLabel>{category.label}</TagLabel>
                      <TagCloseButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCategory(categoryValue);
                        }}
                      />
                    </Tag>
                  ) : null;
                })}
                {selectedCategories.length > 1 && (
                  <Text fontSize="2xs" color="gray.600">
                    +{selectedCategories.length - 1} more
                  </Text>
                )}
              </Flex>
            )}
          </Box>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="200px">
        <VStack align="stretch" p={3} spacing={2}>
          {CATEGORIES.map((category) => (
            <Checkbox
              key={category.value}
              isChecked={selectedCategories.includes(category.value)}
              onChange={() => handleCategoryToggle(category.value)}
              colorScheme="blue"
            >
              <Tag
                size="sm"
                colorScheme={category.colorScheme}
                borderRadius="full"
                ml={2}
              >
                {category.label}
              </Tag>
            </Checkbox>
          ))}
        </VStack>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryFilter;