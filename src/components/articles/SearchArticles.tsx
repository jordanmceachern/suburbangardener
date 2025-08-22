"use client";

import React, { useState, useEffect, useRef } from "react";
import { mockArticles } from "../../mock_data/articles";
import type { ArticleDisplayData } from "./ArticleDisplayCard";

interface SearchArticlesProps {
  className?: string;
  onSearchResults?: (results: ArticleDisplayData[]) => void;
}

export default function SearchArticles({
  className = "",
  onSearchResults,
}: SearchArticlesProps) {
  const [articles, setArticles] = useState<ArticleDisplayData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique categories from articles
  const categories = [
    "All Categories",
    ...Array.from(new Set(articles.map(article => article.category))),
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

  useEffect(() => {
    // Load all articles for searching
    const loadArticles = () => {
      setArticles(mockArticles);
    };

    loadArticles();
  }, []);

  // Filter articles based on search term and category
  useEffect(() => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        article => article.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        article =>
          article.title.toLowerCase().includes(term) ||
          article.excerpt.toLowerCase().includes(term) ||
          article.category.toLowerCase().includes(term) ||
          article.author.toLowerCase().includes(term)
      );
    }

    if (onSearchResults) {
      onSearchResults(filtered);
    }
  }, [searchTerm, selectedCategory, articles, onSearchResults]);

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
        Search Articles
      </h3>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-slate-900 dark:text-slate-100"
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
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="block w-full pl-9 pr-3 py-2.5 h-10 text-base border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-900 dark:placeholder-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-text hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
            style={{ appearance: "none" }}
          />
        </div>

        {/* Category Filter */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-3 py-2.5 h-10 text-base border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors text-left flex items-center justify-between"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-label="Select category"
          >
            <span className="truncate">{selectedCategory}</span>
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
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left text-base hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-600 transition-colors first:rounded-t-md last:rounded-b-md ${
                    selectedCategory === category
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      : "text-slate-900 dark:text-slate-100"
                  }`}
                  role="option"
                  aria-selected={selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="text-xs text-slate-600 dark:text-slate-400">
          {searchTerm || selectedCategory !== "All Categories" ? (
            <span>
              Found{" "}
              {
                articles.filter(article => {
                  let filtered = articles;
                  if (selectedCategory !== "All Categories") {
                    filtered = filtered.filter(
                      a => a.category === selectedCategory
                    );
                  }
                  if (searchTerm.trim()) {
                    const term = searchTerm.toLowerCase();
                    filtered = filtered.filter(
                      a =>
                        a.title.toLowerCase().includes(term) ||
                        a.excerpt.toLowerCase().includes(term) ||
                        a.category.toLowerCase().includes(term) ||
                        a.author.toLowerCase().includes(term)
                    );
                  }
                  return filtered.includes(article);
                }).length
              }{" "}
              articles
            </span>
          ) : (
            <span>{articles.length} total articles</span>
          )}
        </div>
      </div>
    </div>
  );
}
