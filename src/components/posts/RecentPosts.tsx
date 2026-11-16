import React from "react";
import { cn, recentPostsStyles } from "../../lib/tailwind";
import type { PostDisplayData } from "./PostDisplayCard";

interface RecentPostsProps {
  Posts?: PostDisplayData[];
  articles?: PostDisplayData[];
  className?: string;
}

// Renders the RecentPosts UI.
export default function RecentPosts({
  Posts,
  articles,
  className = "",
}: RecentPostsProps) {
  const recentPosts = Posts ?? articles ?? [];

  return (
    <div className={cn(recentPostsStyles.shell, className)}>
      <h2 className={recentPostsStyles.title}>Recent Posts</h2>
      <div className={recentPostsStyles.list}>
        {recentPosts.slice(0, 5).map(Post => (
          <div key={Post.id} className={recentPostsStyles.item}>
            <h3 className={recentPostsStyles.itemTitle}>{Post.title}</h3>
            <p className={recentPostsStyles.itemMeta}>{Post.publishedDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
