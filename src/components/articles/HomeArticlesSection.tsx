"use client";

import React, { useState, useEffect } from "react";
import ArticleDisplayCard from "./ArticleDisplayCard";
import ViewAllArticlesButton from "./ViewAllArticlesButton";
import { cn, homeArticleStyles } from "../../lib/tailwind";
import type { ArticleDisplayData } from "./ArticleDisplayCard";

interface HomeArticlesSectionProps {
  className?: string;
}

async function fetchFeaturedArticles(): Promise<ArticleDisplayData[]> {
  try {
    const response = await fetch("/api/articles?limit=2&offset=0", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }

    const data = await response.json();
    if (!Array.isArray(data.articles)) {
      return [];
    }

    return data.articles.slice(0, 2);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

// Renders the HomeArticlesSection UI block.
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

    loadArticles();
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
