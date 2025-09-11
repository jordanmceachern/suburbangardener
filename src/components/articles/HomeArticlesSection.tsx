"use client";

import React, { useState, useEffect } from "react";
import ArticleDisplayCard from "./ArticleDisplayCard";
import ViewAllArticlesButton from "./ViewAllArticlesButton";
import type { ArticleDisplayData } from "./ArticleDisplayCard";

interface HomeArticlesSectionProps {
  className?: string;
}

// Placeholder API URL for production
const PRODUCTION_API_URL = "https://api.suburbangardener.com/articles/featured";

async function fetchFeaturedArticles(): Promise<ArticleDisplayData[]> {
  // In production, make an API call
  if (process.env.NODE_ENV === "production") {
    try {
      const response = await fetch(`${PRODUCTION_API_URL}?limit=2`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const allArticles = await response.json();
      return allArticles.slice(0, 2); // Take first 2 articles
    } catch (error) {
      console.error("Error fetching articles:", error);
      // In production, return empty array instead of mock data
      // Never show fake information to users
      return [];
    }
  }

  // In development, use mock data - only import when not in production
  const { mockArticles } = await import("../../mock_data/articles");

  // Get first 2 articles (same as original logic)
  // Exclude the most recent one since it would be featured elsewhere
  const mostRecentArticle = mockArticles.reduce(
    (latest: ArticleDisplayData, current: ArticleDisplayData) => {
      const latestDate = new Date(latest.publishedDate);
      const currentDate = new Date(current.publishedDate);
      return currentDate > latestDate ? current : latest;
    },
    mockArticles[0]
  );

  const filteredArticles = mockArticles.filter(
    (article: ArticleDisplayData) => article.id !== mostRecentArticle.id
  );

  // Sort remaining articles by date in descending order (most recent first)
  const sortedArticles = filteredArticles.sort(
    (a: ArticleDisplayData, b: ArticleDisplayData) => {
      const dateA = new Date(a.publishedDate);
      const dateB = new Date(b.publishedDate);
      return dateB.getTime() - dateA.getTime();
    }
  );

  // Take the first 2 articles after sorting
  return sortedArticles.slice(0, 2);
}

export default function HomeArticlesSection({
  className = "",
}: HomeArticlesSectionProps) {
  const [articles, setArticles] = useState<ArticleDisplayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const fetchedArticles = await fetchFeaturedArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error loading articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    // Simulate a small delay for realistic loading in development
    setTimeout(loadArticles, 100);
  }, []);

  if (loading) {
    return (
      <section
        className={`p-6 rounded-lg bg-tertiary-100 dark:bg-tertiary-800 border border-tertiary-200 dark:border-tertiary-700 ${className}`}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Latest Gardening Articles
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-200 max-w-2xl mx-auto">
            Discover expert insights and seasonal tips for your garden
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg h-48 sm:h-64 mb-4" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-6 mb-2" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-4 mb-2" />
              <div className="bg-neutral-200 dark:bg-neutral-700 rounded h-4 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`p-6 rounded-lg bg-secondary-100 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 ${className}`}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Latest Gardening Articles
        </h2>
        <p className="sm:mx-auto text-lg text-start sm:text-center text-neutral-600 dark:text-neutral-200 max-w-2xl">
          Discover expert insights and seasonal tips for your garden.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map(article => (
          <ArticleDisplayCard key={article.id} article={article} />
        ))}
      </div>

      <div className="text-center mt-8">
        <ViewAllArticlesButton className="block w-full" />
      </div>
    </section>
  );
}
