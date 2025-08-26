"use client";

import React from "react";
import Link from "next/link";
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
  content?: string; // Full article content for individual pages
}

interface ArticleDisplayCardProps {
  article: ArticleDisplayData;
  className?: string;
  onReadMore?: () => void;
  buttonVariant?: "default" | "narrow";
  showArrow?: boolean;
  titleClassName?: string;
  imageClassName?: string;
}

export default function ArticleDisplayCard({
  article,
  className = "",
  onReadMore,
  buttonVariant = "default",
  showArrow = false,
  titleClassName = "",
  imageClassName = "",
}: ArticleDisplayCardProps) {
  const handleReadMore = () => {
    console.log("Read More clicked for article:", article.slug);
    if (onReadMore) {
      onReadMore();
    }
  };

  return (
    <article
      className={`bg-primary-50 dark:bg-slate-500 rounded-lg shadow-lg overflow-hidden min-w-0 flex flex-col ${className}`}
    >
      <div className={`h-48 sm:h-64 bg-slate-800 ${imageClassName}`}>
        <BackgroundImage
          src={article.imageUrl}
          label={article.title}
          className="w-full h-full rounded-b-none"
        />
      </div>
      <div className="px-6 pb-6 py-4 flex flex-col flex-grow">
        <div className="flex items-center mb-2">
          <span className="text-neutral-700 dark:text-neutral-200 text-sm">
            {article.publishedDate}
          </span>
        </div>
        <h2
          className={`text-xl lg:text-2xl xl:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 ${titleClassName}`}
        >
          {article.title}
        </h2>
        <p className="text-neutral-700 dark:text-neutral-200 text-base sm:text-lg mb-4 sm:mb-6 line-clamp-3">
          {article.excerpt}
        </p>

        {onReadMore ? (
          <button
            onClick={handleReadMore}
            className={`bg-tertiary-500 hover:bg-tertiary-600 dark:bg-tertiary-600 dark:hover:bg-tertiary-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors mt-auto ${
              buttonVariant === "narrow" ? "self-center" : ""
            }`}
          >
            Read More{showArrow ? " →" : ""}
          </button>
        ) : (
          <Link
            href={`/articles/${article.slug}`}
            className={`bg-tertiary-500 hover:bg-tertiary-600 dark:bg-tertiary-600 dark:hover:bg-tertiary-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors mt-auto inline-block text-center ${
              buttonVariant === "narrow" ? "self-center" : ""
            }`}
          >
            Read More{showArrow ? " →" : ""}
          </Link>
        )}
      </div>
    </article>
  );
}
