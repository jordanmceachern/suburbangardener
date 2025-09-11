"use client";

import React, { useState, useEffect, useRef } from "react";
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
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
        Search Articles
      </h3>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={localSearchTerm}
            onChange={e => setLocalSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="block w-full pl-3 pr-12 py-2.5 h-10 text-base border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-900 dark:placeholder-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-text hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
          />
          <button
            onClick={handleSearch}
            disabled={
              localSearchTerm.trim().length > 0 &&
              localSearchTerm.trim().length < 4
            }
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-900 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="h-4 w-4"
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

        {/* Category Filter */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={toggleCategoryFilter}
            className="w-full px-3 py-2.5 h-10 text-base border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors text-left flex items-center justify-between"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-label="Select category"
          >
            <span className="truncate">{state.selectedCategory}</span>
            <svg
              className={`h-4 w-4 text-slate-900 dark:text-slate-100 transition-transform ${
                isDropdownOpen ? "transform rotate-180" : ""
              }`}
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
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md max-h-60 overflow-auto shadow-lg">
              {categories.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full px-3 py-2.5 text-left text-base hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-600 transition-colors first:rounded-t-md last:rounded-b-md ${
                    state.selectedCategory === category
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      : "text-slate-900 dark:text-slate-100"
                  }`}
                  role="option"
                  aria-selected={state.selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="text-xs text-slate-600 dark:text-slate-300">
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
