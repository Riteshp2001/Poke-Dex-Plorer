"use client";

import type React from "react";
import {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fetchAllPokemonNamesForSuggestions } from "@/lib/pokemon";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPokemonNames = async () => {
      const names = await fetchAllPokemonNamesForSuggestions();
      setAllPokemonNames(names);
    };
    loadPokemonNames();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }
    if (
      allPokemonNames.some(
        (name) => name.toLowerCase() === query.trim().toLowerCase()
      )
    ) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = allPokemonNames.filter((name) =>
      name.toLowerCase().includes(lowerCaseQuery)
    );
    setSuggestions(filtered.slice(0, 10));
    setActiveIndex(-1);
  }, [query, allPokemonNames]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setSuggestions([]);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setSuggestions([]);
      setIsFocused(false);
      setActiveIndex(-1);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    setSuggestions([]);
    setIsFocused(false);
    setActiveIndex(-1);
    router.push(`/search?q=${encodeURIComponent(name.toLowerCase())}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex <= 0 ? suggestions.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSuggestionClick(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setIsFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div
      className="relative w-full max-w-lg mx-auto"
      ref={searchContainerRef}
    >
      <motion.form
        onSubmit={handleSearch}
        className="flex w-full"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <motion.div
            animate={{
              scale: isFocused ? 1.02 : 1,
              boxShadow: isFocused
                ? "0 4px 20px rgba(0, 0, 0, 0.1)"
                : "0 2px 10px rgba(0, 0, 0, 0.05)",
            }}
            className="rounded-full overflow-hidden"
          >
            <Input
              type="text"
              placeholder="Search for a Pokémon by name or ID..."
              className="pl-10 rounded-full border-2 focus-visible:ring-primary w-full"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          </motion.div>
        </div>
        <Button type="submit" className="ml-2 rounded-full">
          Search
        </Button>
      </motion.form>
      {isFocused && suggestions.length > 0 && (
        <motion.ul
          className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-auto left-0 right-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {suggestions.map((name, index) => (
            <li
              key={name}
              className={`p-3 cursor-pointer text-foreground capitalize text-sm ${
                index === activeIndex ? "bg-muted" : "hover:bg-muted"
              }`}
              onClick={() => handleSuggestionClick(name)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {name}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
