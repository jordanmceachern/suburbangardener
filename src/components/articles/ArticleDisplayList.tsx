"use client";

import React from "react";
import Image from "next/image";
import ArticleDisplayCard from "./ArticleDisplayCard";
import LoadingSpinner from "../LoadingSpinner";
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
    <div className={className}>
      {/* No Articles Message */}
      {!state.loading && displayedArticles.length === 0 && (
        <div className="text-center py-12">
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
              <LoadingSpinner size="sm" text="Loading..." />
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
