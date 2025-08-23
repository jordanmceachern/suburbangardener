"use client";

import React, { useState, useEffect } from "react";
import ArticleDisplayCard from "./ArticleDisplayCard";
import { mockArticles } from "../../mock_data/articles";
import type { ArticleDisplayData } from "./ArticleDisplayCard";

interface FeaturedArticleProps {
  className?: string;
}

export default function FeaturedArticle({
  className = "",
}: FeaturedArticleProps) {
  const [featuredArticle, setFeaturedArticle] =
    useState<ArticleDisplayData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the most recent article from the mock data
    const loadFeaturedArticle = () => {
      const mostRecentArticle = mockArticles.reduce((latest, current) => {
        const latestDate = new Date(latest.publishedDate);
        const currentDate = new Date(current.publishedDate);
        return currentDate > latestDate ? current : latest;
      }, mockArticles[0]);

      setFeaturedArticle(mostRecentArticle);
      setLoading(false);
    };

    // Simulate a small delay for realistic loading
    setTimeout(loadFeaturedArticle, 100);
  }, []);

  if (loading) {
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

  if (!featuredArticle) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <ArticleDisplayCard
        article={featuredArticle}
        buttonVariant="narrow"
        showArrow={true}
      />
    </div>
  );
}
