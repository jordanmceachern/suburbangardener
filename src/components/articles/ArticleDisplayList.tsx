"use client";

import React from "react";
import Image from "next/image";
import ArticleDisplayCard from "./ArticleDisplayCard";
import LoadingSpinner from "../LoadingSpinner";
import { articleListStyles } from "../../lib/tailwind";
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
      <div className={className}>
        <div className={articleListStyles.section}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={articleListStyles.skeletonCard}>
              <div className={articleListStyles.skeletonBlock} />
              <div className={articleListStyles.skeletonLine} />
              <div className={articleListStyles.skeletonMeta} />
              <div className={articleListStyles.skeletonMetaShort} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {!state.loading && displayedArticles.length === 0 && (
        <div className={articleListStyles.emptyWrapper}>
          <Image
            alt="a ruined squished tomato on the ground"
            className={articleListStyles.emptyImage}
            height={400}
            width={400}
            src="https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1755004794/SuburbanGardener/toflato_l0dkqy.jpg"
          />
          <p className={articleListStyles.emptyText}>
            Sorry! We encountered an issue while trying to fetch our articles
            for you, please come back to check again later.
          </p>
        </div>
      )}

      {displayedArticles.length > 0 && (
        <div className={articleListStyles.section}>
          {displayedArticles.map(article => (
            <ArticleDisplayCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {state.hasMore && (
        <div className={articleListStyles.loadMoreWrap}>
          <button
            onClick={loadMoreArticles}
            disabled={state.loading}
            className={articleListStyles.loadMoreButton}
          >
            {state.loading ? (
              <LoadingSpinner size="sm" text="Loading..." />
            ) : (
              `Load More Articles`
            )}
          </button>
        </div>
      )}

      {state.loading && state.articles.length > 0 && (
        <div className={`${articleListStyles.section} mt-6`}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`loading-${index}`}
              className={articleListStyles.skeletonCard}
            >
              <div className={articleListStyles.skeletonBlock} />
              <div className={articleListStyles.skeletonLine} />
              <div className={articleListStyles.skeletonMeta} />
              <div className={articleListStyles.skeletonMetaShort} />
            </div>
          ))}
        </div>
      )}

      {state.error && (
        <div className="mt-8 text-center">
          <p className={articleListStyles.errorText}>{state.error}</p>
        </div>
      )}
    </div>
  );
}
