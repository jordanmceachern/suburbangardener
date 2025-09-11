"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { ArticleDisplayData } from "./ArticleDisplayCard";
import ArticleListItem from "./ArticleListItem";

// Use ArticleDisplayData since it has all the fields we need
type ArticleMetadata = ArticleDisplayData;

interface ArticleSidebarProps {
  className?: string;
  maxArticles?: number;
  currentArticle?: ArticleDisplayData;
}

// Placeholder API URL for production
const PRODUCTION_API_URL = "https://api.suburbangardener.com/articles/recent";

async function fetchArticles(
  maxArticles: number = 3,
  currentArticle?: ArticleDisplayData
): Promise<{
  recentArticles: ArticleMetadata[];
  relatedArticles: ArticleMetadata[];
}> {
  // In production, this would make an API call
  if (process.env.NODE_ENV === "production") {
    try {
      const response = await fetch(
        `${PRODUCTION_API_URL}?limit=${maxArticles}&current=${currentArticle?.id || ""}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const allArticles = await response.json();

      // Filter out current article and categorize
      const filteredArticles = allArticles.filter(
        (article: ArticleMetadata) => article.id !== currentArticle?.id
      );

      const relatedArticles = currentArticle
        ? filteredArticles
            .filter(
              (article: ArticleMetadata) =>
                article.category === currentArticle.category
            )
            .slice(0, maxArticles)
        : [];

      const recentArticles = filteredArticles.slice(0, maxArticles);

      return { recentArticles, relatedArticles };
    } catch (error) {
      console.error("Error fetching articles:", error);
      // In production, return empty arrays instead of mock data, never show fake information to users
      return { recentArticles: [], relatedArticles: [] };
    }
  }

  // In development, use mock data
  const { mockSidebarArticles } = await import("../../mock_data/articles");
  const filteredMockArticles = mockSidebarArticles.filter(
    (article: ArticleMetadata) => article.id !== currentArticle?.id
  );

  const relatedArticles = currentArticle
    ? filteredMockArticles
        .filter(
          (article: ArticleMetadata) =>
            article.category === currentArticle.category
        )
        .slice(0, maxArticles)
    : [];

  const recentArticles = filteredMockArticles.slice(0, maxArticles);

  return { recentArticles, relatedArticles };
}

export default function ArticleSidebar({
  className = "",
  maxArticles = 3,
  currentArticle,
}: ArticleSidebarProps) {
  const [recentArticles, setRecentArticles] = React.useState<ArticleMetadata[]>(
    []
  );
  const [relatedArticles, setRelatedArticles] = React.useState<
    ArticleMetadata[]
  >([]);
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
      `absolute top-4 -left-10 bg-slate-200 dark:bg-slate-600 shadow-xl cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors z-30 focus:outline-none focus:ring-2 focus:ring-primary-500 w-10 h-16 flex items-center justify-center rounded-l-md lg:hidden ${
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
        const {
          recentArticles: fetchedRecent,
          relatedArticles: fetchedRelated,
        } = await fetchArticles(maxArticles, currentArticle);
        setRecentArticles(fetchedRecent);
        setRelatedArticles(fetchedRelated);
        setError(null);
      } catch (err) {
        setError("Failed to load articles");
        console.error("Error loading articles:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, [maxArticles, currentArticle]);

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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </button>

        {/* Panel Content */}
        <div className="p-6 pt-6 h-full overflow-y-auto">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Recent Articles
          </h3>

          {loading && (
            <div className="space-y-4 mb-8">
              {Array.from({ length: maxArticles }).map((_, index) => (
                <div
                  key={`recent-skeleton-${index}`}
                  className={
                    index < maxArticles - 1
                      ? "border-b border-slate-300 dark:border-slate-500 pb-4 animate-pulse"
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
            <p className="text-sm text-red-600 dark:text-red-400 mb-8">
              {error}
            </p>
          )}

          {!loading && !error && (
            <div className="space-y-4 mb-8">
              {recentArticles.map((article, index) => (
                <ArticleListItem
                  key={article.id}
                  article={article}
                  showBorder={index < recentArticles.length - 1}
                />
              ))}
            </div>
          )}

          {/* Related Articles Section */}
          <>
            <div className="border-t border-slate-300 dark:border-slate-500 mb-6"></div>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Related Articles
            </h3>

            {loading && (
              <div className="space-y-4">
                {Array.from({ length: maxArticles }).map((_, index) => (
                  <div
                    key={`related-skeleton-${index}`}
                    className={
                      index < maxArticles - 1
                        ? "border-b border-slate-300 dark:border-slate-500 pb-4 animate-pulse"
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

            {!loading && relatedArticles.length === 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                No related articles found in this category.
              </p>
            )}

            {!loading && relatedArticles.length > 0 && (
              <div className="space-y-4">
                {relatedArticles.map((article, index) => (
                  <ArticleListItem
                    key={article.id}
                    article={article}
                    showBorder={index < relatedArticles.length - 1}
                  />
                ))}
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
