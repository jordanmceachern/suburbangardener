"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ArticleCreateForm from "@/components/articles/ArticleCreateForm";

export default function NewArticlePage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background-light px-4 py-10 dark:bg-background-dark">
        <div className="mx-auto max-w-5xl">
          <ArticleCreateForm />
        </div>
      </main>
    </ProtectedRoute>
  );
}
