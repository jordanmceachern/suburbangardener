"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn, searchStyles } from "../../lib/tailwind";
import { useArticles } from "../../contexts/ArticleContext";

interface SearchArticlesProps {
  className?: string;
}

export default function SearchArticles({
  className = "",
}: SearchArticlesProps) {
  const { state, searchArticles, setSelectedCategory } = useArticles();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique categories from articles
  const categories = [
    "All Categories",
    ...Array.from(new Set(state.articles.map(article => article.category))),
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (
      localSearchTerm.trim().length >= 4 ||
      localSearchTerm.trim().length === 0
    ) {
      await searchArticles(localSearchTerm.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const filteredArticles = state.articles.filter(article => {
    if (state.selectedCategory === "All Categories") return true;
    return article.category === state.selectedCategory;
  });

  const toggleCategoryFilter = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className={className}>
      <h3 className={searchStyles.title}>Search Articles</h3>

      <div className={searchStyles.container}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={localSearchTerm}
            onChange={e => setLocalSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className={searchStyles.input}
          />
          <button
            onClick={handleSearch}
            disabled={
              localSearchTerm.trim().length > 0 &&
              localSearchTerm.trim().length < 4
            }
            className={searchStyles.searchButton}
          >
            <svg
              className={searchStyles.inputIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={toggleCategoryFilter}
            className={searchStyles.dropdownButton}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-label="Select category"
          >
            <span className="truncate">{state.selectedCategory}</span>
            <svg
              className={cn(
                searchStyles.dropdownIcon,
                isDropdownOpen ? "transform rotate-180" : "",
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 8l4 4 4-4"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className={searchStyles.dropdownMenu}>
              {categories.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    searchStyles.dropdownItem,
                    state.selectedCategory === category
                      ? searchStyles.dropdownItemActive
                      : searchStyles.dropdownItemInactive,
                  )}
                  role="option"
                  aria-selected={state.selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={searchStyles.results}>
          {state.searchTerm || state.selectedCategory !== "All Categories" ? (
            <span>
              Found {filteredArticles.length} articles
              {state.searchTerm && ` for "${state.searchTerm}"`}
            </span>
          ) : (
            <span>{state.total} total articles</span>
          )}
        </div>
      </div>
    </div>
  );
}
