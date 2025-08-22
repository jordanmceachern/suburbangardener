"use client";

import React from "react";
import BackgroundImage from "../BackgroundImage";

export interface ArticleDisplayData {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  author: string;
  slug: string;
  imageUrl: string;
  category: string;
}

interface ArticleDisplayCardProps {
  article: ArticleDisplayData;
  className?: string;
  onReadMore?: () => void;
}

export default function ArticleDisplayCard({
  article,
  className = "",
  onReadMore,
}: ArticleDisplayCardProps) {
  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore();
    } else {
      // Default behavior - could navigate to article page
      console.log(`Navigate to article: ${article.slug}`);
    }
  };

  return (
    <article
      className={`bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden min-w-0 ${className}`}
    >
      <div className="h-48 sm:h-64">
        <BackgroundImage
          src={article.imageUrl}
          label={article.title}
          className="w-full h-full"
        />
      </div>
      <div className="p-4 sm:p-8">
        <div className="flex items-center mb-3 sm:mb-4">
          <span className="text-neutral-500 dark:text-neutral-400 text-sm">
            {article.publishedDate}
          </span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4">
          {article.title}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg mb-4 sm:mb-6">
          {article.excerpt}
        </p>
        <button
          onClick={handleReadMore}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors"
        >
          Read Full Article
        </button>
      </div>
    </article>
  );
}
