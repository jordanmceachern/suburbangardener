import React from "react";
import type { ArticleDisplayData } from "./ArticleDisplayCard";

interface RecentArticlesProps {
  articles: ArticleDisplayData[];
  className?: string;
}

export default function RecentArticles({
  articles,
  className = "",
}: RecentArticlesProps) {
  return (
    <div className={`recent-articles ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Recent Articles</h2>
      <div className="space-y-3">
        {articles.slice(0, 5).map(article => (
          <div key={article.id} className="border-b border-gray-200 pb-2">
            <h3 className="font-medium text-sm">{article.title}</h3>
            <p className="text-xs text-gray-600">{article.publishedDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
