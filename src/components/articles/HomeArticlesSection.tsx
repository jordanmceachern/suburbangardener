"use client";

import React, { useState, useEffect } from "react";
import ArticleDisplayCard from "./ArticleDisplayCard";
import ViewAllArticlesButton from "./ViewAllArticlesButton";
import { cn, homeArticleStyles } from "../../lib/tailwind";
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
      <section className={cn(homeArticleStyles.sectionLoading, className)}>
        <div className={homeArticleStyles.titleWrap}>
          <h2 className={homeArticleStyles.title}>Latest Gardening Articles</h2>
          <p className={homeArticleStyles.description}>
            Discover expert insights and seasonal tips for your garden
          </p>
        </div>
        <div className={homeArticleStyles.grid}>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className={homeArticleStyles.skeletonCard}>
              <div className={homeArticleStyles.skeletonBlock} />
              <div className={homeArticleStyles.skeletonLine} />
              <div className={homeArticleStyles.skeletonMeta} />
              <div className={homeArticleStyles.skeletonMetaShort} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn(homeArticleStyles.sectionLoaded, className)}>
      <div className={homeArticleStyles.titleWrap}>
        <h2 className={homeArticleStyles.title}>Latest Gardening Articles</h2>
        <p className={homeArticleStyles.descriptionMobile}>
          Discover expert insights and seasonal tips for your garden.
        </p>
      </div>

      <div className={homeArticleStyles.grid}>
        {articles.map(article => (
          <ArticleDisplayCard key={article.id} article={article} />
        ))}
      </div>

      <div className={homeArticleStyles.ctaWrap}>
        <ViewAllArticlesButton className={homeArticleStyles.ctaButton} />
      </div>
    </section>
  );
}
