import React from "react";
import Link from "next/link";
import { articlePageHeaderStyles, buttonStyles, cn } from "../../lib/tailwind";

interface ArticlesPageHeaderProps {
  className?: string;
}

// Renders the ArticlesPageHeader page and its page-specific behavior.
export default function ArticlesPageHeader({
  className = "",
}: ArticlesPageHeaderProps) {
  return (
    <div className={cn(articlePageHeaderStyles.wrapper, className)}>
      <h1 className={articlePageHeaderStyles.title}>Gardening Articles</h1>
      <p className={articlePageHeaderStyles.copy}>
        Discover expert insights, seasonal tips, and in-depth guides for
        successful suburban gardening.
      </p>
      <div className={articlePageHeaderStyles.actions}>
        <Link href="/articles/new" className={buttonStyles.primary}>
          Write an Article
        </Link>
      </div>
    </div>
  );
}
