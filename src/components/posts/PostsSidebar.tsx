"use client";

import React, { useEffect, useMemo, useState } from "react";
import SearchPosts from "./SearchPosts";
import type { PostDisplayData } from "./PostDisplayCard";
import PostListItem from "./PostListItem";
import { PostSidebarStyles, cn } from "../../lib/tailwind";

// Use PostDisplayData since it has all the fields we need
type PostMetadata = PostDisplayData;

// Placeholder API URL for production
const PRODUCTION_API_URL = "https://api.suburbangardener.com/Posts/recent";

async function fetchPosts(maxPosts: number = 3): Promise<PostMetadata[]> {
  // In production, this would make an API call
  if (process.env.NODE_ENV === "production") {
    try {
      const response = await fetch(`${PRODUCTION_API_URL}?limit=${maxPosts}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Posts");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching Posts:", error);
      // In production, return empty array instead of mock data
      // Never show fake information to users
      return [];
    }
  }

  // Development fallback: keep the sidebar empty rather than returning stale mock content.
  return [];
}

// Renders the PostsSidebar UI block.
export default function PostsSidebar(props: any) {
  const { className = "", maxPosts = 3 } = props as {
    className?: string;
    maxPosts?: number;
  };
  const [posts, setPosts] = React.useState<PostMetadata[]>([]);
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
        const fetchedPosts = await fetchPosts(maxPosts);
        setPosts(fetchedPosts);
        setError(null);
      } catch (err) {
        setError("Failed to load Posts");
        console.error("Error loading Posts:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [maxPosts]);

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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <div className={PostSidebarStyles.content}>
          <div className={PostSidebarStyles.searchWrap}>
            <SearchPosts />
          </div>

          <hr className={PostSidebarStyles.divider} />

          <h3 className={PostSidebarStyles.sectionTitle}>Recent Posts</h3>

          {loading && (
            <div className={PostSidebarStyles.skeletonWrap}>
              {Array.from({ length: maxPosts }).map((_, index) => (
                <div
                  key={index}
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

          {error && <p className={PostSidebarStyles.errorText}>{error}</p>}

          {!loading && !error && (
            <div className={PostSidebarStyles.listWrap}>
              {posts.map((post, index) => (
                <PostListItem
                  key={post.id}
                  post={post}
                  showBorder={index < posts.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
