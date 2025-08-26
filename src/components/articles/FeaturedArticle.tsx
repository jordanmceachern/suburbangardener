"use client";

import React from "react";
import ArticleDisplayCard from "./ArticleDisplayCard";
import { useArticles } from "../../contexts/ArticleContext";

interface FeaturedArticleProps {
  className?: string;
}

export default function FeaturedArticle({
  className = "",
}: FeaturedArticleProps) {
  const { state } = useArticles();

  if (state.loading && !state.featuredArticle) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg h-48 sm:h-64 mb-4" />
          <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-8 mb-3" />
          <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-4 mb-2" />
          <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-4 w-2/3 mb-4" />
          <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-10 w-32" />
        </div>
      </div>
    );
  }

  if (!state.featuredArticle) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <ArticleDisplayCard
        article={state.featuredArticle}
        buttonVariant="narrow"
        showArrow={true}
      />
    </div>
  );
}
