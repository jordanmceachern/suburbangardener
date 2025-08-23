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
  buttonVariant?: "default" | "narrow";
}

export default function ArticleDisplayCard({
  article,
  className = "",
  onReadMore,
  buttonVariant = "default",
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
      className={`bg-primary-50 dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden min-w-0 flex flex-col ${className}`}
    >
      <div className="h-48 sm:h-64 bg-slate-800">
        <BackgroundImage
          src={article.imageUrl}
          label={article.title}
          className="w-full h-full rounded-b-none"
        />
      </div>
      <div className="p-4 sm:p-8 flex flex-col flex-grow">
        <div className="flex items-center mb-3 sm:mb-4">
          <span className="text-neutral-700 dark:text-neutral-200 text-sm">
            {article.publishedDate}
          </span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4">
          {article.title}
        </h2>
        <p className="text-neutral-700 dark:text-neutral-200 text-base sm:text-lg mb-4 sm:mb-6 line-clamp-3">
          {article.excerpt}
        </p>
        <button
          onClick={handleReadMore}
          className={`bg-tertiary-500 hover:bg-tertiary-600 dark:bg-tertiary-600 dark:hover:bg-tertiary-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors mt-auto ${
            buttonVariant === "narrow" ? "self-center" : ""
          }`}
        >
          Read More
        </button>
      </div>
    </article>
  );
}
