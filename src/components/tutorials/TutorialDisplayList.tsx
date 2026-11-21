"use client";

import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import TutorialDisplayCard from "./TutorialDisplayCard";
import { useTutorials } from "@/contexts/TutorialContext";
import { PostListStyles } from "@/lib/tailwind";
import Image from "next/image";

export default function TutorialDisplayList() {
  const { state, loadMoreTutorials } = useTutorials();
  const visible = state.featuredTutorial
    ? state.tutorials.filter(
        tutorial => tutorial.id !== state.featuredTutorial?.id
      )
    : state.tutorials;

  if (state.loading && state.tutorials.length === 0) {
    return (
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
    );
  }

  return (
    <div>
      {visible.length > 0 ? (
        <div className={PostListStyles.section}>
          {visible.map(tutorial => (
            <TutorialDisplayCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>
      ) : null}
      {state.hasMore ? (
        <div className={PostListStyles.loadMoreWrap}>
          <button
            onClick={loadMoreTutorials}
            disabled={state.loading}
            className={PostListStyles.loadMoreButton}
          >
            {state.loading ? (
              <LoadingSpinner size="sm" text="Loading..." />
            ) : (
              "Load More Tutorials"
            )}
          </button>
        </div>
      ) : null}
      {state.fetchCompleted &&
      !state.loading &&
      visible.length === 0 &&
      state.error ? (
        <div className={PostListStyles.emptyWrapper}>
          <Image
            alt="a ruined squished tomato on the ground"
            className={PostListStyles.emptyImage}
            height={400}
            width={400}
            src="https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1755004794/SuburbanGardener/toflato_l0dkqy.jpg"
          />
          <p className={PostListStyles.emptyText}>{state.error}</p>
        </div>
      ) : null}
      {state.loading && state.tutorials.length > 0 ? (
        <div
          className={`${PostListStyles.section} ${PostListStyles.sectionLoadingMore}`}
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
      ) : null}
    </div>
  );
}
