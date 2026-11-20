"use client";

import React from "react";
import Link from "next/link";
import ArrowIcon from "../ArrowIcon";
import BackgroundImage from "../BackgroundImage";
import { maskDisplayName } from "../../lib/postSecurity";
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
  upvotes?: number;
  downvotes?: number;
}

interface PostDisplayCardProps {
  post?: PostDisplayData;
  className?: string;
  buttonVariant?: "default" | "narrow";
  titleClassName?: string;
  imageClassName?: string;
}

// Renders the PostDisplayCard UI block.
export default function PostDisplayCard({
  post,
  className = "",
  buttonVariant = "default",
  titleClassName = "",
  imageClassName = "",
}: PostDisplayCardProps) {
  if (!post) {
    return null;
  }

  const upvotes = post.upvotes ?? 0;
  const downvotes = post.downvotes ?? 0;

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
            {post.publishedDate} · {maskDisplayName(post.author)}
          </span>
          <span className={PostCardStyles.voteBadge}>
            <span>▲ {upvotes}</span>
            <span>▼ {downvotes}</span>
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
          Read More
          <ArrowIcon className={PostCardStyles.buttonIcon} />
        </Link>
      </div>
    </div>
  );
}
