"use client";

import React, { useEffect } from "react";
import { PostProvider, usePosts } from "../../contexts/PostContext";
import PostsSidebar from "../../components/posts/PostsSidebar";
import PostsPageHeader from "../../components/posts/PostsPageHeader";
import FeaturedPost from "../../components/posts/FeaturedPost";
import PostDisplayList from "../../components/posts/PostDisplayList";

// Renders the Posts Page Content page and its page-specific behavior.
function PostsPageContent() {
  const { loadPosts } = usePosts();

  // Synchronizes local component state with browser events and external data changes.
  useEffect(() => {
    // Load initial Posts on mount
    loadPosts();
  }, [loadPosts]);

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark relative">
      {/* Main Content Area */}
      <div className="lg:pr-80">
        <div className="mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <PostsPageHeader />
            <FeaturedPost />
          </div>

          {/* Posts Feed - Full Width */}
          <div className="mt-6 max-w-4xl mx-auto">
            <PostDisplayList />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed top-0 right-0 w-80 z-40">
        <PostsSidebar maxPosts={6} />
      </div>
    </main>
  );
}

// Renders the Posts Page page and its page-specific behavior.
export default function PostsPage() {
  return (
    <PostProvider>
      <PostsPageContent />
    </PostProvider>
  );
}
