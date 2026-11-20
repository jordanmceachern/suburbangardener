"use client";

import React from "react";
import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";
import BackgroundImage from "@/components/BackgroundImage";
import { maskDisplayName } from "@/lib/postSecurity";
import { PostCardStyles } from "@/lib/tailwind";

export interface TutorialDisplayData {
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

export default function TutorialDisplayCard({
  tutorial,
}: {
  tutorial: TutorialDisplayData;
}) {
  return (
    <div className={PostCardStyles.card}>
      <div className={PostCardStyles.imageWrap}>
        <BackgroundImage
          src={tutorial.imageUrl}
          label={tutorial.title}
          className={PostCardStyles.image}
        />
      </div>
      <div className={PostCardStyles.content}>
        <div className={PostCardStyles.meta}>
          <span className={PostCardStyles.metaText}>
            {tutorial.publishedDate} · {maskDisplayName(tutorial.author)}
          </span>
        </div>
        <h2 className={PostCardStyles.title}>{tutorial.title}</h2>
        <p className={PostCardStyles.excerpt}>{tutorial.excerpt}</p>
        <Link
          href={`/tutorials/${tutorial.slug}`}
          className={PostCardStyles.button}
        >
          Read Tutorial
          <ArrowIcon className={PostCardStyles.buttonIcon} />
        </Link>
      </div>
    </div>
  );
}
