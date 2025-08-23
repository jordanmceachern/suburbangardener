import React from "react";
import Link from "next/link";
import type { ArticleDisplayData } from "./ArticleDisplayCard";

interface ArticleListItemProps {
  article: ArticleDisplayData;
  showBorder?: boolean;
  className?: string;
}

export default function ArticleListItem({
  article,
  showBorder = true,
  className = "",
}: ArticleListItemProps) {
  return (
    <article
      className={`${
        showBorder ? "border-b border-slate-300 dark:border-slate-500 pb-4" : ""
      } ${className}`}
    >
      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
        <Link
          href={`/articles/${article.slug}`}
          className="hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
        >
          {article.title}
        </Link>
      </h4>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
        {article.excerpt}
      </p>
      <span className="text-xs text-slate-500 dark:text-slate-300">
        {article.publishedDate}
      </span>
    </article>
  );
}
