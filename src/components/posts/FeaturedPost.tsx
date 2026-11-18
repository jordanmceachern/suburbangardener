"use client";

import React from "react";
import PostDisplayCard from "./PostDisplayCard";
import { usePosts } from "../../contexts/PostContext";
import { featuredPostStyles } from "../../lib/tailwind";

interface FeaturedPostProps {
  className?: string;
}

// Renders the FeaturedPost UI.
export default function FeaturedPost({ className = "" }: FeaturedPostProps) {
  const { state } = usePosts();

  if (state.loading && !state.featuredPost) {
    return (
      <div className={className}>
        <div className={featuredPostStyles.skeletonCard}>
          <div className={featuredPostStyles.skeletonBlock} />
          <div className={featuredPostStyles.skeletonLine} />
          <div className={featuredPostStyles.skeletonMeta} />
          <div className={featuredPostStyles.skeletonMetaShort} />
          <div className={featuredPostStyles.skeletonAction} />
        </div>
      </div>
    );
  }

  if (!state.featuredPost) {
    return null;
  }

  return (
    <div className={className}>
      <PostDisplayCard
        Post={state.featuredPost}
        buttonVariant="narrow"
        titleClassName={featuredPostStyles.featuredTitleClassName}
        imageClassName={featuredPostStyles.imageClassName}
      />
    </div>
  );
}
