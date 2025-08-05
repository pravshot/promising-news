import React from "react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

function SearchBar({ query, setQuery }: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.toLowerCase());
  };

  return (
    <InputGroup maxW="400px" w="100%">
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.400" />
      </InputLeftElement>
      <Input
        placeholder="Search articles..."
        value={query}
        onChange={handleChange}
        bg="white"
        borderColor="gray.200"
        _hover={{ borderColor: "gray.300" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
      />
    </InputGroup>
  );
}

export default SearchBar; 