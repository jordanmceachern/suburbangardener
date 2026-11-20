"use client";

import React from "react";
import TutorialDisplayCard from "./TutorialDisplayCard";
import { useTutorials } from "@/contexts/TutorialContext";
import { featuredPostStyles } from "@/lib/tailwind";

export default function TutorialFeatured() {
  const { state } = useTutorials();
  if (state.loading && !state.featuredTutorial) {
    return (
      <div className={featuredPostStyles.skeletonCard}>
        <div className={featuredPostStyles.skeletonBlock} />
        <div className={featuredPostStyles.skeletonLine} />
        <div className={featuredPostStyles.skeletonMeta} />
        <div className={featuredPostStyles.skeletonMetaShort} />
        <div className={featuredPostStyles.skeletonAction} />
      </div>
    );
  }
  if (!state.featuredTutorial) return null;
  return <TutorialDisplayCard tutorial={state.featuredTutorial} />;
}
