"use client";

import React from "react";
import Link from "next/link";
import BackgroundImage from "../BackgroundImage";
import { maskDisplayName } from "../../lib/PostSecurity";
import { PostCardStyles, cn } from "../../lib/tailwind";

export interface PostDisplayData {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  author: string;
  slug: string;
  imageUrl: string;
  category: string;
  content?: string;
  voteScore?: number;
  voteCount?: number;
}

export type ArticleDisplayData = PostDisplayData;

interface PostDisplayCardProps {
  article?: PostDisplayData;
  Post?: PostDisplayData;
  className?: string;
  buttonVariant?: "default" | "narrow";
  showArrow?: boolean;
  titleClassName?: string;
  imageClassName?: string;
}

// Renders the PostDisplayCard UI block.
export default function PostDisplayCard({
  article,
  Post,
  className = "",
  buttonVariant = "default",
  showArrow = false,
  titleClassName = "",
  imageClassName = "",
}: PostDisplayCardProps) {
  const post = Post ?? article;

  if (!post) {
    return null;
  }

  const voteScore = typeof post.voteScore === "number" ? post.voteScore : 0;
  const voteCount = typeof post.voteCount === "number" ? post.voteCount : 0;

  return (
    <div className={cn(PostCardStyles.card, className)}>
      <div className={cn(PostCardStyles.imageWrap, imageClassName)}>
        <BackgroundImage
          src={post.imageUrl}
          label={post.title}
          className={PostCardStyles.image}
        />
      </div>
      <div className={PostCardStyles.content}>
        <div className={PostCardStyles.meta}>
          <span className={PostCardStyles.metaText}>
            {maskDisplayName(post.author)} · {post.publishedDate}
          </span>
          <span className={PostCardStyles.voteBadge}>
            ▲ {voteScore}
            {voteCount > 0 ? ` · ${voteCount}` : ""}
          </span>
        </div>
        <h2 className={cn(PostCardStyles.title, titleClassName)}>
          {post.title}
        </h2>
        <p className={PostCardStyles.excerpt}>{post.excerpt}</p>
        <Link
          href={`/posts/${post.slug}`}
          className={cn(
            PostCardStyles.button,
            buttonVariant === "narrow" ? PostCardStyles.buttonNarrow : ""
          )}
        >
          Read More{showArrow ? " →" : ""}
        </Link>
      </div>
    </div>
  );
}
