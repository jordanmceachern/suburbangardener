"use client";

import React from "react";
import Link from "next/link";
import BackgroundImage from "../BackgroundImage";
import { articleCardStyles, cn } from "../../lib/tailwind";

export interface ArticleDisplayData {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  author: string;
  slug: string;
  imageUrl: string;
  category: string;
  content?: string;
}

interface ArticleDisplayCardProps {
  article: ArticleDisplayData;
  className?: string;
  buttonVariant?: "default" | "narrow";
  showArrow?: boolean;
  titleClassName?: string;
  imageClassName?: string;
}

export default function ArticleDisplayCard({
  article,
  className = "",
  buttonVariant = "default",
  showArrow = false,
  titleClassName = "",
  imageClassName = "",
}: ArticleDisplayCardProps) {
  return (
    <article className={cn(articleCardStyles.card, className)}>
      <div className={cn(articleCardStyles.imageWrap, imageClassName)}>
        <BackgroundImage
          src={article.imageUrl}
          label={article.title}
          className={articleCardStyles.image}
        />
      </div>
      <div className={articleCardStyles.content}>
        <div className={articleCardStyles.meta}>
          <span className={articleCardStyles.metaText}>
            {article.publishedDate}
          </span>
        </div>
        <h2 className={cn(articleCardStyles.title, titleClassName)}>
          {article.title}
        </h2>
        <p className={articleCardStyles.excerpt}>{article.excerpt}</p>
        <Link
          href={`/articles/${article.slug}`}
          className={cn(
            articleCardStyles.button,
            buttonVariant === "narrow" ? articleCardStyles.buttonNarrow : ""
          )}
        >
          Read More{showArrow ? " →" : ""}
        </Link>
      </div>
    </article>
  );
}
