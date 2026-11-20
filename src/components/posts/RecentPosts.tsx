import React from "react";
import { cn, recentPostsStyles } from "../../lib/tailwind";
import type { PostDisplayData } from "./PostDisplayCard";

interface RecentPostsProps {
  posts?: PostDisplayData[];
  className?: string;
}

// Renders the RecentPosts UI.
export default function RecentPosts({
  posts,
  className = "",
}: RecentPostsProps) {
  const recentPosts = posts ?? [];

  return (
    <div className={cn(recentPostsStyles.shell, className)}>
      <h2 className={recentPostsStyles.title}>Recent Posts</h2>
      <div className={recentPostsStyles.list}>
        {recentPosts.slice(0, 5).map(post => (
          <div key={post.id} className={recentPostsStyles.item}>
            <h3 className={recentPostsStyles.itemTitle}>{post.title}</h3>
            <p className={recentPostsStyles.itemMeta}>{post.publishedDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
