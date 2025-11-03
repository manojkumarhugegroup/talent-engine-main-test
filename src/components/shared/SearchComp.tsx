
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number; // Time to wait after typing stops before auto-searching
}

export function SearchComp({ 
  onSearch, 
  placeholder = "Search...",
  debounceMs = 500 // Default 500ms debounce
}: SearchProps) {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const handleSearchClick = () => {
    onSearch(value); // send the current input value up on button click
  };

  // Debounce effect for automatic search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, debounceMs]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedValue !== "") {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  // Also trigger search on Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <div className="relative max-w-sm">
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="pr-10 ring-0 focus-visible:ring-0 ring-black outline-black focus-visible:border-gray-200  bg-card"
      />
      <div className="absolute inset-y-0 -right-3 flex items-center pr-3">
        <Button onClick={handleSearchClick} variant="ghost" className="p-1 cursor-pointer">
          <Search  className="text-(--labelLight)"/>
        </Button>
      </div>
    </div>
  );
}