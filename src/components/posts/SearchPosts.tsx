"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ALL_POST_CATEGORIES,
  DEFAULT_POST_CATEGORY,
  normalizeCategoryValue,
} from "@/lib/postSecurity";
import { cn, searchStyles } from "../../lib/tailwind";
import { usePosts } from "../../contexts/PostContext";

interface SearchPostsProps {
  className?: string;
}

// Renders the SearchPosts UI.
export default function SearchPosts({ className = "" }: SearchPostsProps) {
  const { state, searchPosts, setSelectedCategory } = usePosts();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique categories from Posts
  const categories = [
    ALL_POST_CATEGORIES,
    ...Array.from(
      new Set(
        state.Posts.map(Post =>
          normalizeCategoryValue(Post.category || DEFAULT_POST_CATEGORY)
        )
      )
    ),
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    // Handles Click Outside for the current user interaction.
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

  // Handles Search for the current user interaction.
  const handleSearch = async () => {
    if (
      localSearchTerm.trim().length >= 4 ||
      localSearchTerm.trim().length === 0
    ) {
      await searchPosts(localSearchTerm.trim());
    }
  };

  // Handles Key Press for the current user interaction.
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handles Category Change for the current user interaction.
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(normalizeCategoryValue(category));
    setIsDropdownOpen(false);
  };

  const filteredPosts = state.Posts.filter(Post => {
    if (state.selectedCategory === ALL_POST_CATEGORIES) return true;
    return (
      normalizeCategoryValue(Post.category || DEFAULT_POST_CATEGORY) ===
      state.selectedCategory
    );
  });

  // Toggles CategoryFilter to keep the UI state in sync with the user action.
  const toggleCategoryFilter = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className={className}>
      <h3 className={searchStyles.title}>Search Posts</h3>

      <div className={searchStyles.container}>
        <div className={searchStyles.inputWrap}>
          <input
            type="text"
            placeholder="Search posts..."
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

        <div ref={dropdownRef} className={searchStyles.dropdownWrap}>
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
                isDropdownOpen ? "transform rotate-180" : ""
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
                      : searchStyles.dropdownItemInactive
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

        <div className={cn(searchStyles.results, "text-base")}>
          {state.searchTerm ||
          state.selectedCategory !== ALL_POST_CATEGORIES ? (
            <span className="text-base">
              Found {filteredPosts.length} posts
              {state.searchTerm && ` for "${state.searchTerm}"`}
            </span>
          ) : (
            <span className="text-base">{state.total} total posts</span>
          )}
        </div>
      </div>
    </div>
  );
}
