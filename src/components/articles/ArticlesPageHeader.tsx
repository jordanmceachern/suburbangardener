import React from "react";
import { articlePageHeaderStyles, cn } from "../../lib/tailwind";

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
    </div>
  );
}
