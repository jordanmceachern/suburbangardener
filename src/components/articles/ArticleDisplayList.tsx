"use client";

import React from "react";
import Image from "next/image";
import ArticleDisplayCard, {
  type ArticleDisplayData,
} from "./ArticleDisplayCard";
import { useArticles } from "../../contexts/ArticleContext";

interface ArticleDisplayListProps {
  className?: string;
}

export default function ArticleDisplayList({
  className = "",
}: ArticleDisplayListProps) {
  const { state, loadMoreArticles, getFilteredArticles } = useArticles();

  // Get articles filtered by category (client-side filtering)
  const displayedArticles = getFilteredArticles();

  if (state.loading && state.articles.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
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
      {/* No Articles Message */}
      {!state.loading && displayedArticles.length === 0 && (
        <div className="text-center py-12">
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt text is provided via label prop */}
          <Image
            alt="a ruined squished tomato on the ground"
            className="flex justify-center mb-8 rounded-lg mx-auto"
            height={400}
            width={400}
            src="https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1755004794/SuburbanGardener/toflato_l0dkqy.jpg"
          />
          <p className="text-xl text-neutral-900 dark:text-neutral-100">
            Sorry! We encountered an issue while trying to fetch our articles
            for you, please come back to check again later.
          </p>
        </div>
      )}

      {/* Articles Grid */}
      {displayedArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedArticles.map(article => (
            <ArticleDisplayCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Load More Articles */}
      {state.hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMoreArticles}
            disabled={state.loading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            {state.loading ? (
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
              `Load More Articles`
            )}
          </button>
        </div>
      )}

      {/* Loading More Skeleton */}
      {state.loading && state.articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`loading-${index}`} className="animate-pulse">
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg h-48 sm:h-64 mb-4" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-6 mb-2" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-4 mb-2" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {state.error && (
        <div className="mt-8 text-center">
          <p className="text-red-600 dark:text-red-400">{state.error}</p>
        </div>
      )}
    </div>
  );
}
