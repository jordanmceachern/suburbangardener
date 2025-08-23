import React from "react";
import RecentArticles from "../../components/articles/RecentArticles";
import ArticlesPageHeader from "../../components/articles/ArticlesPageHeader";
import FeaturedArticle from "../../components/articles/FeaturedArticle";
import ArticleDisplayList from "../../components/articles/ArticleDisplayList";

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark relative">
      {/* Main Content Area */}
      <div className="lg:pr-80">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ArticlesPageHeader />

          {/* Featured Article */}
          <FeaturedArticle className="mb-12" />

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
