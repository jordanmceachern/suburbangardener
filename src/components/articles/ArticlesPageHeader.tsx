import React from "react";

interface ArticlesPageHeaderProps {
  className?: string;
}

export default function ArticlesPageHeader({
  className = "",
}: ArticlesPageHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
        Gardening Articles
      </h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-200 max-w-2xl mx-auto">
        Discover expert insights, seasonal tips, and in-depth guides for
        successful suburban gardening.
      </p>
    </div>
  );
}
