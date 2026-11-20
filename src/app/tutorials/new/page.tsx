"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TutorialCreateForm from "@/components/tutorials/TutorialCreateForm";

export default function NewTutorialPage() {
  return (
    <ProtectedRoute redirectTo="/login?callbackUrl=/tutorials/new">
      <main className="min-h-screen bg-background-light px-4 py-10 dark:bg-background-dark">
        <div className="mx-auto max-w-5xl">
          <TutorialCreateForm />
        </div>
      </main>
    </ProtectedRoute>
  );
}
