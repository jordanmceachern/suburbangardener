"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { TutorialDisplayData } from "./TutorialDisplayCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchTutorials from "./SearchTutorials";
import { PostSidebarStyles, cn } from "@/lib/tailwind";

async function fetchTutorials(
  maxTutorials: number
): Promise<TutorialDisplayData[]> {
  const response = await fetch(`/api/tutorials?limit=${maxTutorials}&offset=0`);
  if (!response.ok) throw new Error("Failed to fetch tutorials");
  const data = await response.json();
  return Array.isArray(data.tutorials) ? data.tutorials : [];
}

export default function TutorialSidebar({
  className = "",
  maxTutorials = 6,
}: {
  className?: string;
  maxTutorials?: number;
}) {
  const [tutorials, setTutorials] = useState<TutorialDisplayData[]>([]);
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
        const fetched = await fetchTutorials(maxTutorials);
        if (active) setTutorials(fetched);
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
  }, [maxTutorials]);

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
    <div className={className}>
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <div className={PostSidebarStyles.content}>
          <div className={PostSidebarStyles.searchWrap}>
            <SearchTutorials />
          </div>
          <hr className={PostSidebarStyles.divider} />

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
            <div className={PostSidebarStyles.listWrap}>
              {tutorials.map((tutorial, index) => (
                <div
                  key={tutorial.id}
                  className={
                    index < tutorials.length - 1
                      ? "border-b border-primary-200 pb-4 mb-4 dark:border-slate-500"
                      : ""
                  }
                >
                  <h4 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">
                    <Link
                      href={`/tutorials/${tutorial.slug}`}
                      className="hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      {tutorial.title}
                    </Link>
                  </h4>
                  <p className="mt-1 line-clamp-2 text-base text-foreground-light dark:text-foreground-dark">
                    {tutorial.excerpt}
                  </p>
                  <span className="mt-1 block text-base text-foreground-light dark:text-foreground-dark">
                    {tutorial.publishedDate}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
