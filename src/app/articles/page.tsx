import React from "react";
import RecentArticles from "../../components/articles/RecentArticles";
import ArticleDisplayCard from "../../components/articles/ArticleDisplayCard";
import ArticleDisplayList from "../../components/articles/ArticleDisplayList";
import { mockFeaturedArticle } from "../../mock_data/articles";

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark relative">
      {/* Main Content Area */}
      <div className="lg:pr-80">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
              Gardening Articles
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Discover expert insights, seasonal tips, and in-depth guides for
              successful suburban gardening.
            </p>
          </div>

          {/* Featured Article */}
          <div className="mb-12">
            <ArticleDisplayCard article={mockFeaturedArticle} />
          </div>

          {/* Related Articles Grid */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              More Articles
            </h2>
            <ArticleDisplayList />
          </div>
        </div>
      </div>

      {/* Collapsible Sidebar - All screens */}
      <div className="fixed top-0 right-0 w-80 z-40">
        <RecentArticles maxArticles={6} />
      </div>
    </main>
  );
}
