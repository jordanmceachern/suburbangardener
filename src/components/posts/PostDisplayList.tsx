"use client";

import React from "react";
import Image from "next/image";
import PostDisplayCard, { type PostDisplayData } from "./PostDisplayCard";
import LoadingSpinner from "../LoadingSpinner";
import { PostListStyles, cn } from "../../lib/tailwind";
import { usePosts } from "../../contexts/PostContext";

interface PostDisplayListProps {
  className?: string;
}

// Renders the PostDisplayList UI.
export default function PostDisplayList({
  className = "",
}: PostDisplayListProps) {
  const { state, loadMorePosts, getFilteredPosts } = usePosts();

  // Get Posts filtered by category (client-side filtering)
  const displayedPosts = getFilteredPosts();

  if (state.loading && state.posts.length === 0) {
    return (
      <div className={className}>
        <div className={PostListStyles.section}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={PostListStyles.skeletonCard}>
              <div className={PostListStyles.skeletonBlock} />
              <div className={PostListStyles.skeletonLine} />
              <div className={PostListStyles.skeletonMeta} />
              <div className={PostListStyles.skeletonMetaShort} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {!state.loading && displayedPosts.length === 0 && (
        <div className={PostListStyles.emptyWrapper}>
          <Image
            alt="a ruined squished tomato on the ground"
            className={PostListStyles.emptyImage}
            height={400}
            width={400}
            src="https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1755004794/SuburbanGardener/toflato_l0dkqy.jpg"
          />
          <p className={PostListStyles.emptyText}>
            Sorry! An error occurred while trying to fetch the community posts,
            please come back to check again later.
          </p>
        </div>
      )}

      {displayedPosts.length > 0 && (
        <div className={PostListStyles.section}>
          {displayedPosts.map((post: PostDisplayData) => (
            <PostDisplayCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {state.hasMore && (
        <div className={PostListStyles.loadMoreWrap}>
          <button
            onClick={loadMorePosts}
            disabled={state.loading}
            className={PostListStyles.loadMoreButton}
          >
            {state.loading ? (
              <LoadingSpinner size="sm" text="Loading..." />
            ) : (
              `Load More Posts`
            )}
          </button>
        </div>
      )}

      {state.loading && state.posts.length > 0 && (
        <div
          className={cn(
            PostListStyles.section,
            PostListStyles.sectionLoadingMore
          )}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`loading-${index}`}
              className={PostListStyles.skeletonCard}
            >
              <div className={PostListStyles.skeletonBlock} />
              <div className={PostListStyles.skeletonLine} />
              <div className={PostListStyles.skeletonMeta} />
              <div className={PostListStyles.skeletonMetaShort} />
            </div>
          ))}
        </div>
      )}

      {state.error && (
        <div className={PostListStyles.errorWrap}>
          <p className={PostListStyles.errorText}>{state.error}</p>
        </div>
      )}
    </div>
  );
}
