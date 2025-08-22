"use client";

import React, { useEffect, useMemo, useState } from "react";
import { mockSidebarArticles } from "../../mock_data/articles";
import SearchArticles from "./SearchArticles";
import type { ArticleDisplayData } from "./ArticleDisplayCard";

// Use ArticleDisplayData since it has all the fields we need
type ArticleMetadata = ArticleDisplayData;

interface RecentArticlesProps {
  className?: string;
  maxArticles?: number;
}

// Placeholder API URL for production
const PRODUCTION_API_URL = "https://api.suburbangardener.com/articles/recent";

async function fetchArticles(
  maxArticles: number = 3
): Promise<ArticleMetadata[]> {
  // In production, this would make an API call
  if (process.env.NODE_ENV === "production") {
    try {
      const response = await fetch(
        `${PRODUCTION_API_URL}?limit=${maxArticles}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching articles:", error);
      // Fallback to mock data even in production if API fails
      return mockSidebarArticles.slice(0, maxArticles);
    }
  }

  // In development, use mock data
  return mockSidebarArticles.slice(0, maxArticles);
}

export default function RecentArticles({
  className = "",
  maxArticles = 3,
}: RecentArticlesProps) {
  const [articles, setArticles] = React.useState<ArticleMetadata[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Set initial state based on screen size on mount
  useEffect(() => {
    const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint
    setIsOpen(isLargeScreen);
  }, []);

  const panelClasses = useMemo(
    () =>
      `bg-slate-100 dark:bg-slate-800 shadow-lg transition-all duration-300 ease-in-out relative h-screen pb-20 sm:pb-0 ${
        isOpen
          ? "translate-x-0 opacity-100 border-l border-slate-300 dark:border-slate-600"
          : "translate-x-full lg:translate-x-0 opacity-90 lg:opacity-100"
      }`,
    [isOpen]
  );

  const collapseButtonClasses = useMemo(
    () =>
      `absolute top-8 -left-10 bg-slate-200 dark:bg-slate-700 shadow-xl cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors z-30 focus:outline-none focus:ring-2 focus:ring-primary-500 w-10 h-16 flex items-center justify-center rounded-l-md lg:hidden ${
        isOpen
          ? "border-l border-t border-b border-slate-300 dark:border-slate-600"
          : "border border-slate-300 dark:border-slate-600"
      }`,
    [isOpen]
  );

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const fetchedArticles = await fetchArticles(maxArticles);
        setArticles(fetchedArticles);
        setError(null);
      } catch (err) {
        setError("Failed to load articles");
        console.error("Error loading articles:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, [maxArticles]);

  const toggleCollapse = () => {
    // Only allow toggling on screens smaller than large breakpoint
    if (window.innerWidth < 1024) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={className}>
      <div className={panelClasses}>
        {/* Collapse Tab */}
        <button
          type="button"
          className={collapseButtonClasses}
          onClick={toggleCollapse}
          aria-label={isOpen ? "Hide recent articles" : "Show recent articles"}
        >
          <svg
            className="w-4 h-4 text-slate-600 dark:text-slate-300"
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

        {/* Panel Content */}
        <div className="p-6 pt-6 h-full overflow-y-auto">
          {/* Search Articles Component */}
          <div className="mb-8">
            <SearchArticles />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-300 dark:border-slate-600 mb-6"></div>

          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Recent Articles
          </h3>

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: maxArticles }).map((_, index) => (
                <div
                  key={index}
                  className={
                    index < maxArticles - 1
                      ? "border-b border-slate-300 dark:border-slate-600 pb-4 animate-pulse"
                      : "animate-pulse"
                  }
                >
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded mb-2" />
                  <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded mb-2" />
                  <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/3" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {articles.map((article, index) => (
                <article
                  key={article.id}
                  className={
                    index < articles.length - 1
                      ? "border-b border-slate-300 dark:border-slate-600 pb-4"
                      : ""
                  }
                >
                  <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                    {article.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {article.excerpt}
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    {article.publishedDate}
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
