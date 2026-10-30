"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-nextauth";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!deleteConfirmOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDeleteConfirmOpen(false);
    }, 15000);

    return () => window.clearTimeout(timeoutId);
  }, [deleteConfirmOpen]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleDeleteProfile = async () => {
    if (!deleteConfirmOpen) {
      setDeleteConfirmOpen(true);
      setDeleteError("");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "Unable to delete profile." }));
        throw new Error(data.error || "Unable to delete profile.");
      }

      await signOut({ redirect: false });
      router.push("/login?mode=signUp");
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Unable to delete profile."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <LoadingSpinner />
      </main>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-header-copy">
            <h1 className="dashboard-title">Suburban Gardener Dashboard</h1>
          </div>

          <div className="dashboard-user-meta">
            <span className="dashboard-email">{user.email}</span>
            <button onClick={handleLogout} className="dashboard-logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-layout">
          <aside className="dashboard-settings-card">
            <div className="dashboard-settings-heading">
              <span className="dashboard-settings-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" />
                  <path d="m18 15 4-4" />
                  <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
                </svg>
              </span>
              <div>
                <h2 className="dashboard-settings-title">Settings</h2>
                <p className="dashboard-settings-subtitle">Account controls</p>
              </div>
            </div>

            <div className="dashboard-settings-body">
              <div className="dashboard-settings-column dashboard-settings-column--danger">
                <button
                  type="button"
                  className="dashboard-delete-button"
                  onClick={handleDeleteProfile}
                  disabled={isDeleting}
                >
                  {isDeleting
                    ? "Deleting profile..."
                    : deleteConfirmOpen
                      ? "Are you sure? Delete profile"
                      : "Delete profile"}
                </button>

                {deleteConfirmOpen && (
                  <p className="dashboard-delete-warning">
                    This will delete any saved progress with tools and reading &amp; shopping history, etc.
                  </p>
                )}

                {deleteError && (
                  <p className="dashboard-delete-error">{deleteError}</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
