"use client";

import React from "react";
import Link from "next/link";
import BackgroundImage from "../BackgroundImage";
import { maskDisplayName } from "../../lib/articleSecurity";
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
  voteScore?: number;
  voteCount?: number;
}

interface ArticleDisplayCardProps {
  article: ArticleDisplayData;
  className?: string;
  buttonVariant?: "default" | "narrow";
  showArrow?: boolean;
  titleClassName?: string;
  imageClassName?: string;
}

// Renders the ArticleDisplayCard UI block.
export default function ArticleDisplayCard({
  article,
  className = "",
  buttonVariant = "default",
  showArrow = false,
  titleClassName = "",
  imageClassName = "",
}: ArticleDisplayCardProps) {
  const voteScore =
    typeof article.voteScore === "number" ? article.voteScore : 0;
  const voteCount =
    typeof article.voteCount === "number" ? article.voteCount : 0;

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
        <div className={cn(articleCardStyles.meta, "justify-between gap-3")}>
          <span className={articleCardStyles.metaText}>
            {maskDisplayName(article.author)} · {article.publishedDate}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
            ▲ {voteScore}
            {voteCount > 0 ? ` · ${voteCount}` : ""}
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
