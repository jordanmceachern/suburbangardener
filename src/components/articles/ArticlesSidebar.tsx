"use client";

import React, { useEffect, useMemo, useState } from "react";
import SearchArticles from "./SearchArticles";
import type { ArticleDisplayData } from "./ArticleDisplayCard";
import ArticleListItem from "./ArticleListItem";
import { articleSidebarStyles, cn } from "../../lib/tailwind";

// Use ArticleDisplayData since it has all the fields we need
type ArticleMetadata = ArticleDisplayData;

interface ArticlesSidebarProps {
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
      // In production, return empty array instead of mock data
      // Never show fake information to users
      return [];
    }
  }

  // In development, use mock data - only import when not in production
  const { mockSidebarArticles } = await import("../../mock_data/articles");
  return mockSidebarArticles.slice(0, maxArticles);
}

export default function ArticlesSidebar({
  className = "",
  maxArticles = 3,
}: ArticlesSidebarProps) {
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
      cn(
        articleSidebarStyles.panelBase,
        isOpen ? articleSidebarStyles.panelOpen : articleSidebarStyles.panelClosed,
      ),
    [isOpen]
  );

  const collapseButtonClasses = useMemo(
    () =>
      cn(
        articleSidebarStyles.collapseButtonBase,
        isOpen
          ? articleSidebarStyles.collapseButtonOpen
          : articleSidebarStyles.collapseButtonClosed,
      ),
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
            className={articleSidebarStyles.collapseIcon}
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

        <div className={articleSidebarStyles.content}>
          <div className="mb-8">
            <SearchArticles />
          </div>

          <div className={articleSidebarStyles.divider}></div>

          <h3 className={articleSidebarStyles.sectionTitle}>Recent Articles</h3>

          {loading && (
            <div className={articleSidebarStyles.skeletonWrap}>
              {Array.from({ length: maxArticles }).map((_, index) => (
                <div
                  key={index}
                  className={
                    index < maxArticles - 1
                      ? articleSidebarStyles.skeletonDivider
                      : articleSidebarStyles.skeletonItem
                  }
                >
                  <div className={articleSidebarStyles.skeletonBlock} />
                  <div className={articleSidebarStyles.skeletonLine} />
                  <div className={articleSidebarStyles.skeletonShort} />
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className={articleSidebarStyles.errorText}>{error}</p>
          )}

          {!loading && !error && (
            <div className={articleSidebarStyles.listWrap}>
              {articles.map((article, index) => (
                <ArticleListItem
                  key={article.id}
                  article={article}
                  showBorder={index < articles.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
