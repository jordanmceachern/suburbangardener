"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PostCreateForm from "@/components/posts/PostCreateForm";

export default function NewPostPage() {
  return (
    <ProtectedRoute redirectTo="/login?callbackUrl=/posts/new">
      <main className="min-h-screen bg-background-light px-4 py-10 dark:bg-background-dark">
        <div className="mx-auto max-w-5xl">
          <PostCreateForm />
        </div>
      </main>
    </ProtectedRoute>
  );
}
