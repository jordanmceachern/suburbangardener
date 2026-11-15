import React from "react";
import Link from "next/link";
import type { PostDisplayData } from "./PostDisplayCard";

interface PostListItemProps {
  Post?: PostDisplayData;
  article?: PostDisplayData;
  showBorder?: boolean;
  className?: string;
}

// Renders the PostListItem UI.
export default function PostListItem({
  Post,
  article,
  showBorder = true,
  className = "",
}: PostListItemProps) {
  const item = Post ?? article;

  if (!item) {
    return null;
  }

  return (
    <div
      className={`${
        showBorder ? "border-b border-slate-300 dark:border-slate-500 pb-4" : ""
      } ${className}`}
    >
      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
        <Link
          href={`/posts/${item.slug}`}
          className="hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
        >
          {item.title}
        </Link>
      </h4>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
        {item.excerpt}
      </p>
      <span className="text-xs text-slate-500 dark:text-slate-300">
        {item.publishedDate}
      </span>
    </div>
  );
}
