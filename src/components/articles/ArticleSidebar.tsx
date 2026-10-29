"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { ArticleDisplayData } from "./ArticleDisplayCard";
import ArticleListItem from "./ArticleListItem";
import { articleSidebarStyles, cn } from "../../lib/tailwind";

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
      cn(
        articleSidebarStyles.panelBase,
        isOpen
          ? articleSidebarStyles.panelOpen
          : articleSidebarStyles.panelClosed
      ),
    [isOpen]
  );

  const collapseButtonClasses = useMemo(
    () =>
      cn(
        articleSidebarStyles.collapseButtonBase,
        isOpen
          ? articleSidebarStyles.collapseButtonOpen
          : articleSidebarStyles.collapseButtonClosed
      ),
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
            className={articleSidebarStyles.collapseIcon}
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

        <div className={articleSidebarStyles.content}>
          <h3 className={articleSidebarStyles.sectionTitle}>Recent Articles</h3>

          {loading && (
            <div className={`${articleSidebarStyles.skeletonWrap} mb-8`}>
              {Array.from({ length: maxArticles }).map((_, index) => (
                <div
                  key={`recent-skeleton-${index}`}
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
            <p className={`${articleSidebarStyles.errorText} mb-8`}>{error}</p>
          )}

          {!loading && !error && (
            <div className={`${articleSidebarStyles.listWrap} mb-8`}>
              {recentArticles.map((article, index) => (
                <ArticleListItem
                  key={article.id}
                  article={article}
                  showBorder={index < recentArticles.length - 1}
                />
              ))}
            </div>
          )}

          <>
            <div className={articleSidebarStyles.divider}></div>

            <h3 className={articleSidebarStyles.sectionTitle}>
              Related Articles
            </h3>

            {loading && (
              <div className={articleSidebarStyles.skeletonWrap}>
                {Array.from({ length: maxArticles }).map((_, index) => (
                  <div
                    key={`related-skeleton-${index}`}
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

            {!loading && relatedArticles.length === 0 && (
              <p className={articleSidebarStyles.relatedEmpty}>
                No related articles found in this category.
              </p>
            )}

            {!loading && relatedArticles.length > 0 && (
              <div className={articleSidebarStyles.listWrap}>
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
