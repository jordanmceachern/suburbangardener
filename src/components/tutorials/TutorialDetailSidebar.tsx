"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PostSidebarStyles, cn } from "@/lib/tailwind";

interface TutorialMetadata {
  id: string;
  title: string;
  excerpt?: string;
  publishedDate: string;
  slug: string;
  category: string;
}

export default function TutorialDetailSidebar({
  currentTutorial,
  maxTutorials = 3,
}: {
  currentTutorial?: TutorialMetadata;
  maxTutorials?: number;
}) {
  const [recentTutorials, setRecentTutorials] = useState<TutorialMetadata[]>(
    []
  );
  const [relatedTutorials, setRelatedTutorials] = useState<TutorialMetadata[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadTutorials() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/tutorials?limit=20&offset=0`);
        if (!response.ok) throw new Error("Failed to fetch tutorials");
        const data = await response.json();
        const allTutorials: TutorialMetadata[] = Array.isArray(data.tutorials)
          ? data.tutorials
          : [];
        const filtered = allTutorials.filter(
          tutorial => tutorial.id !== currentTutorial?.id
        );

        if (active) {
          setRecentTutorials(filtered.slice(0, maxTutorials));
          setRelatedTutorials(
            currentTutorial
              ? filtered
                  .filter(
                    tutorial => tutorial.category === currentTutorial.category
                  )
                  .slice(0, maxTutorials)
              : []
          );
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load tutorials"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTutorials();
    return () => {
      active = false;
    };
  }, [currentTutorial, maxTutorials]);

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

  const toggleCollapse = () => {
    if (window.innerWidth < 1024) setIsOpen(current => !current);
  };

  return (
    <div className="fixed top-0 right-0 w-80 z-40">
      <div className={panelClasses}>
        <button
          type="button"
          className={collapseButtonClasses}
          onClick={toggleCollapse}
          aria-label={
            isOpen ? "Hide recent tutorials" : "Show recent tutorials"
          }
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 13.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </button>

        <div className={PostSidebarStyles.content}>
          <h3 className={PostSidebarStyles.sectionTitle}>Recent Tutorials</h3>

          {loading ? (
            <div className="mt-4 flex items-center justify-center py-8">
              <LoadingSpinner size="sm" text="Loading tutorials..." />
            </div>
          ) : null}

          {error ? (
            <p className={PostSidebarStyles.errorText}>{error}</p>
          ) : null}

          {!loading && !error ? (
            <div
              className={cn(
                PostSidebarStyles.listWrap,
                PostSidebarStyles.sectionSpacing
              )}
            >
              {recentTutorials.map((tutorial, index) => (
                <div
                  key={tutorial.id}
                  className={
                    index < recentTutorials.length - 1
                      ? "border-b border-primary-200 pb-4 mb-4 dark:border-slate-500"
                      : ""
                  }
                >
                  <h4 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">
                    <Link href={`/tutorials/${tutorial.slug}`}>
                      {tutorial.title}
                    </Link>
                  </h4>
                  <p className="mt-1 line-clamp-2 text-base">
                    {tutorial.excerpt}
                  </p>
                  <span className="mt-1 block text-base">
                    {tutorial.publishedDate}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <div className={PostSidebarStyles.divider} />
          <h3 className={PostSidebarStyles.sectionTitle}>Related Tutorials</h3>

          {loading ? (
            <div className="mt-4 flex items-center justify-center py-8">
              <LoadingSpinner size="sm" text="Loading tutorials..." />
            </div>
          ) : null}

          {!loading && !error && relatedTutorials.length === 0 ? (
            <p className={PostSidebarStyles.relatedEmpty}>
              No related Tutorials found in this category.
            </p>
          ) : null}

          {!loading && !error && relatedTutorials.length > 0 ? (
            <div className={PostSidebarStyles.listWrap}>
              {relatedTutorials.map((tutorial, index) => (
                <div
                  key={tutorial.id}
                  className={
                    index < relatedTutorials.length - 1
                      ? "border-b border-primary-200 pb-4 mb-4 dark:border-slate-500"
                      : ""
                  }
                >
                  <h4 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">
                    <Link href={`/tutorials/${tutorial.slug}`}>
                      {tutorial.title}
                    </Link>
                  </h4>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
