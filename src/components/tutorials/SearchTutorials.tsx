"use client";

import React, { useState } from "react";
import { useTutorials } from "@/contexts/TutorialContext";
import { searchStyles } from "@/lib/tailwind";

export default function SearchTutorials() {
  const { searchTutorials } = useTutorials();
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const handleSearch = async () => {
    await searchTutorials(localSearchTerm.trim());
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <h3 className={searchStyles.title}>Search Tutorials</h3>
      <div className={searchStyles.container}>
        <div className={searchStyles.inputWrap}>
          <input
            type="text"
            placeholder="Search tutorials..."
            value={localSearchTerm}
            onChange={event => setLocalSearchTerm(event.target.value)}
            onKeyPress={handleKeyPress}
            className={searchStyles.input}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={
              localSearchTerm.trim().length > 0 &&
              localSearchTerm.trim().length < 4
            }
            className={searchStyles.searchButton}
            aria-label="Search tutorials"
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
      </div>
    </div>
  );
}
