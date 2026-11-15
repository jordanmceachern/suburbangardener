"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { PostDisplayData } from "./PostDisplayCard";
import PostListItem from "./PostListItem";
import { PostSidebarStyles, cn } from "../../lib/tailwind";

// Use PostDisplayData since it has all the fields we need
type PostMetadata = PostDisplayData;

async function fetchPosts(
  maxPosts: number = 3,
  currentPost?: PostDisplayData
): Promise<{
  recentPosts: PostMetadata[];
  relatedPosts: PostMetadata[];
}> {
  const response = await fetch(`/api/posts?limit=20&offset=0`);

  if (!response.ok) {
    throw new Error("Failed to fetch Posts");
  }

  const data = await response.json();
  const allPosts: PostMetadata[] = Array.isArray(data.Posts) ? data.Posts : [];

  const filteredPosts = allPosts.filter(
    (Post: PostMetadata) => Post.id !== currentPost?.id
  );

  const relatedPosts = currentPost
    ? filteredPosts
        .filter((Post: PostMetadata) => Post.category === currentPost.category)
        .slice(0, maxPosts)
    : [];

  const recentPosts = filteredPosts.slice(0, maxPosts);

  return { recentPosts, relatedPosts };
}

// Renders the PostSidebar UI block.
export default function PostSidebar(props: any) {
  const {
    className = "",
    maxPosts = 3,
    currentPost,
    currentArticle,
  } = props as {
    className?: string;
    maxPosts?: number;
    currentPost?: PostDisplayData;
    currentArticle?: PostDisplayData;
  };
  const resolvedCurrentPost = currentPost ?? currentArticle;
  const [recentPosts, setRecentPosts] = React.useState<PostMetadata[]>([]);
  const [relatedPosts, setRelatedPosts] = React.useState<PostMetadata[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Set initial state based on screen size on mount
  useEffect(() => {
    const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint
    setIsOpen(isLargeScreen);
  }, []);

  const panelClasses = useMemo(
    () =>
      cn(
        PostSidebarStyles.panelBase,
        isOpen ? PostSidebarStyles.panelOpen : PostSidebarStyles.panelClosed
      ),
    [isOpen]
  );

  const collapseButtonClasses = useMemo(
    () =>
      cn(
        PostSidebarStyles.collapseButtonBase,
        isOpen
          ? PostSidebarStyles.collapseButtonOpen
          : PostSidebarStyles.collapseButtonClosed
      ),
    [isOpen]
  );

  // Synchronizes local component state with browser events and external data changes.
  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const { recentPosts: fetchedRecent, relatedPosts: fetchedRelated } =
          await fetchPosts(maxPosts, resolvedCurrentPost);
        setRecentPosts(fetchedRecent);
        setRelatedPosts(fetchedRelated);
        setError(null);
      } catch (err) {
        setError("Failed to load Posts");
        console.error("Error loading Posts:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [maxPosts, resolvedCurrentPost]);

  // Toggles Collapse to keep the UI state in sync with the user action.
  const toggleCollapse = () => {
    // Only allow toggling on screens smaller than large breakpoint
    if (window.innerWidth < 1024) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={className}>
      <div className={panelClasses}>
        {/* Collapse Tab */}
        <button
          type="button"
          className={collapseButtonClasses}
          onClick={toggleCollapse}
          aria-label={isOpen ? "Hide recent posts" : "Show recent posts"}
        >
          <svg
            className={PostSidebarStyles.collapseIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </button>

        <div className={PostSidebarStyles.content}>
          <h3 className={PostSidebarStyles.sectionTitle}>Recent Posts</h3>

          {loading && (
            <div className={`${PostSidebarStyles.skeletonWrap} mb-8`}>
              {Array.from({ length: maxPosts }).map((_, index) => (
                <div
                  key={`recent-skeleton-${index}`}
                  className={
                    index < maxPosts - 1
                      ? PostSidebarStyles.skeletonDivider
                      : PostSidebarStyles.skeletonItem
                  }
                >
                  <div className={PostSidebarStyles.skeletonBlock} />
                  <div className={PostSidebarStyles.skeletonLine} />
                  <div className={PostSidebarStyles.skeletonShort} />
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className={`${PostSidebarStyles.errorText} mb-8`}>{error}</p>
          )}

          {!loading && !error && (
            <div className={`${PostSidebarStyles.listWrap} mb-8`}>
              {recentPosts.map((Post, index) => (
                <PostListItem
                  key={Post.id}
                  Post={Post}
                  showBorder={index < recentPosts.length - 1}
                />
              ))}
            </div>
          )}

          <>
            <div className={PostSidebarStyles.divider}></div>

            <h3 className={PostSidebarStyles.sectionTitle}>Related Posts</h3>

            {loading && (
              <div className={PostSidebarStyles.skeletonWrap}>
                {Array.from({ length: maxPosts }).map((_, index) => (
                  <div
                    key={`related-skeleton-${index}`}
                    className={
                      index < maxPosts - 1
                        ? PostSidebarStyles.skeletonDivider
                        : PostSidebarStyles.skeletonItem
                    }
                  >
                    <div className={PostSidebarStyles.skeletonBlock} />
                    <div className={PostSidebarStyles.skeletonLine} />
                    <div className={PostSidebarStyles.skeletonShort} />
                  </div>
                ))}
              </div>
            )}

            {!loading && relatedPosts.length === 0 && (
              <p className={PostSidebarStyles.relatedEmpty}>
                No related Posts found in this category.
              </p>
            )}

            {!loading && relatedPosts.length > 0 && (
              <div className={PostSidebarStyles.listWrap}>
                {relatedPosts.map((Post, index) => (
                  <PostListItem
                    key={Post.id}
                    Post={Post}
                    showBorder={index < relatedPosts.length - 1}
                  />
                ))}
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
