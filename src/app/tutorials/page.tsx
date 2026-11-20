"use client";

import React, { useEffect, useRef } from "react";
import { TutorialProvider, useTutorials } from "@/contexts/TutorialContext";
import TutorialPageHeader from "@/components/tutorials/TutorialPageHeader";
import TutorialFeatured from "@/components/tutorials/TutorialFeatured";
import TutorialDisplayList from "@/components/tutorials/TutorialDisplayList";
import TutorialSidebar from "@/components/tutorials/TutorialSidebar";

function TutorialsPageContent() {
  const { loadTutorials } = useTutorials();
  const initialLoadStarted = useRef(false);

  useEffect(() => {
    if (initialLoadStarted.current) return;
    initialLoadStarted.current = true;
    loadTutorials(true);
  }, [loadTutorials]);

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark relative">
      <div className="lg:pr-80">
        <div className="mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <TutorialPageHeader />
            <TutorialFeatured />
          </div>
          <div className="mt-6 max-w-4xl mx-auto">
            <TutorialDisplayList />
          </div>
        </div>
      </div>
      <div className="fixed top-0 right-0 w-80 z-40">
        <TutorialSidebar maxTutorials={6} />
      </div>
    </main>
  );
}

export default function TutorialsPage() {
  return (
    <TutorialProvider>
      <TutorialsPageContent />
    </TutorialProvider>
  );
}
