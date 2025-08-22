"use client";

import React, { useState, useEffect } from "react";
import ArticleDisplayCard from "./ArticleDisplayCard";
import { mockArticles } from "../../mock_data/articles";
import type { ArticleDisplayData } from "./ArticleDisplayCard";

interface ArticleDisplayListProps {
  className?: string;
  initialArticles?: number;
  articlesPerLoad?: number;
  onClick?: (clickedArticle: ArticleDisplayData) => void;
}

export default function ArticleDisplayList({
  className = "",
  initialArticles = 6,
  articlesPerLoad = 6,
  onClick,
}: ArticleDisplayListProps) {
  const [articles, setArticles] = useState<ArticleDisplayData[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<
    ArticleDisplayData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentCount, setCurrentCount] = useState(initialArticles);

  useEffect(() => {
    // Simulate loading articles (excluding the featured article)
    const loadArticles = () => {
      // Filter out the most recent article since it's used as featured
      const mostRecentDate = mockArticles.reduce((latest, current) => {
        const latestDate = new Date(latest.publishedDate);
        const currentDate = new Date(current.publishedDate);
        return currentDate > latestDate ? current : latest;
      }, mockArticles[0]);

      const allArticles = mockArticles.filter(
        article => article.id !== mostRecentDate.id
      );
      setArticles(allArticles);
      setDisplayedArticles(allArticles.slice(0, initialArticles));
      setLoading(false);
    };

    // Simulate a small delay for realistic loading
    setTimeout(loadArticles, 100);
  }, [initialArticles]);

  const handleLoadMore = () => {
    setLoadingMore(true);

    // Simulate loading delay
    setTimeout(() => {
      const newCount = currentCount + articlesPerLoad;
      setDisplayedArticles(articles.slice(0, newCount));
      setCurrentCount(newCount);
      setLoadingMore(false);
    }, 500);
  };

  const handleArticleClick = (article: ArticleDisplayData) => {
    if (onClick) {
      onClick(article);
    } else {
      // Default behavior - could navigate to article page
      console.log(`Navigate to article: ${article.slug}`);
    }
  };

  const hasMoreArticles = currentCount < articles.length;

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: initialArticles }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg h-48 sm:h-64 mb-4" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-6 mb-2" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-4 mb-2" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedArticles.map(article => (
          <ArticleDisplayCard
            key={article.id}
            article={article}
            onReadMore={() => handleArticleClick(article)}
          />
        ))}
      </div>

      {/* Load More Articles */}
      {hasMoreArticles && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </>
            ) : (
              `Load More Articles (${articles.length - currentCount} remaining)`
            )}
          </button>
        </div>
      )}

      {/* Loading More Skeleton */}
      {loadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {Array.from({
            length: Math.min(articlesPerLoad, articles.length - currentCount),
          }).map((_, index) => (
            <div key={`loading-${index}`} className="animate-pulse">
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg h-48 sm:h-64 mb-4" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-6 mb-2" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-4 mb-2" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
