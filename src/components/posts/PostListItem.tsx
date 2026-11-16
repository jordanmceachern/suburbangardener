import React from "react";
import Link from "next/link";
import { PostListItemStyles, cn } from "../../lib/tailwind";
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
      className={cn(
        showBorder ? PostListItemStyles.item : PostListItemStyles.itemNoBorder,
        className
      )}
    >
      <h4 className={PostListItemStyles.title}>
        <Link
          href={`/posts/${item.slug}`}
          className={PostListItemStyles.titleLink}
        >
          {item.title}
        </Link>
      </h4>
      <p className={PostListItemStyles.excerpt}>{item.excerpt}</p>
      <span className={PostListItemStyles.date}>{item.publishedDate}</span>
    </div>
  );
}
