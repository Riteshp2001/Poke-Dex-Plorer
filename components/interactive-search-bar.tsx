"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent, useRef } from "react"; // Added KeyboardEvent, useRef
import { useRouter } from "next/navigation";
import { fetchAllPokemonNamesForSuggestions } from "@/lib/pokemon"; // Import the new function

export function InteractiveSearchBar() {
  const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(-1); // For keyboard navigation
  const searchContainerRef = useRef<HTMLDivElement>(null); // Ref for click outside
  const [isFocused, setIsFocused] = useState(false); // To control suggestion visibility

  // Fetch all pokemon names once
  useEffect(() => {
    const loadPokemonNames = async () => {
      const names = await fetchAllPokemonNamesForSuggestions();
      setAllPokemonNames(names);
    };
    loadPokemonNames();
  }, []);

  // Update suggestions when query changes
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    // Show all related Pokémon whose names start with the query (prioritize startsWith), then includes
    const startsWithMatches = allPokemonNames.filter((name) =>
      name.toLowerCase().startsWith(lowerCaseQuery)
    );
    const includesMatches = allPokemonNames.filter(
      (name) =>
        !name.toLowerCase().startsWith(lowerCaseQuery) &&
        name.toLowerCase().includes(lowerCaseQuery)
    );
    const filtered = [...startsWithMatches, ...includesMatches];
    setSuggestions(filtered.slice(0, 10)); // Show top 10 suggestions
    setActiveIndex(-1); // Reset active index when suggestions change
  }, [query, allPokemonNames]);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false); // This will hide suggestions via conditional rendering
        setSuggestions([]);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    setSuggestions([]);
    setIsFocused(false);
    setActiveIndex(-1);
    router.push(`/search?q=${encodeURIComponent(name.toLowerCase())}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setSuggestions([]);
      setIsFocused(false);
      setActiveIndex(-1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0 && e.key !== "Enter") return; // Allow Enter to submit even if no suggestions

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
        // If Enter is pressed without a suggestion selected, submit the current query
        const trimmedQuery = query.trim().toLowerCase();
        if (trimmedQuery) {
          router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
          setSuggestions([]);
          setIsFocused(false);
          setActiveIndex(-1);
        }
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setIsFocused(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      {" "}
      {/* Added ref */}
      <form onSubmit={handleSubmit}>
        <input
          id="search-interactive"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown} // Added keydown handler
          className="w-full p-3 pr-10 border border-border rounded-lg shadow-sm focus:ring-primary focus:border-primary text-lg bg-background text-foreground placeholder-muted-foreground"
          placeholder="Search Pokémon by name or ID..."
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
      {isFocused &&
        suggestions.length > 0 && ( // Conditionally render based on isFocused
          <ul className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((name, index) => (
              <li
                key={name}
                className={`p-3 cursor-pointer text-foreground capitalize ${
                  index === activeIndex ? "bg-muted" : "hover:bg-muted"
                }`}
                onClick={() => handleSuggestionClick(name)}
                onMouseDown={(e) => e.preventDefault()} // Prevents input blur before click
              >
                {name}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
