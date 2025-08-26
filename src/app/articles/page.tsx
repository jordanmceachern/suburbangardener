"use client";

import React, { useEffect } from "react";
import { ArticleProvider, useArticles } from "../../contexts/ArticleContext";
import ArticlesSidebar from "../../components/articles/ArticlesSidebar";
import ArticlesPageHeader from "../../components/articles/ArticlesPageHeader";
import FeaturedArticle from "../../components/articles/FeaturedArticle";
import ArticleDisplayList from "../../components/articles/ArticleDisplayList";

function ArticlesPageContent() {
  const { loadArticles } = useArticles();

  useEffect(() => {
    // Load initial articles on mount
    loadArticles();
  }, [loadArticles]);

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark relative">
      {/* Main Content Area */}
      <div className="lg:pr-80">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ArticlesPageHeader />

          <FeaturedArticle className="mb-12" />

          {/* Articles Feed */}
          <div className="mt-12">
            <ArticleDisplayList />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed top-0 right-0 w-80 z-40">
        <ArticlesSidebar maxArticles={6} />
      </div>
    </main>
  );
}

export default function ArticlesPage() {
  return (
    <ArticleProvider>
      <ArticlesPageContent />
    </ArticleProvider>
  );
}
