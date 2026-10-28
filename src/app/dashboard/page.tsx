"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth-nextauth";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
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
          <div>
            <h1 className="dashboard-title">Suburban Gardener Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user.name}!</p>
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
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2 className="dashboard-card-title">🌱 Welcome to Your Garden</h2>
            <p className="dashboard-copy">
              This is your personal gardening dashboard. Here you can track your
              plants, plan your garden, and access exclusive content.
            </p>
            <div className="dashboard-highlight">
              <p className="dashboard-highlight-text">
                🎉 You&apos;re now logged in and have access to premium
                features!
              </p>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title-small">🌿 My Plants</h3>
            <div className="dashboard-list">
              <div className="dashboard-list-item">
                <span className="dashboard-list-label">Tomatoes</span>
                <span className="dashboard-status dashboard-status--healthy">
                  Healthy
                </span>
              </div>
              <div className="dashboard-list-item">
                <span className="dashboard-list-label">Basil</span>
                <span className="dashboard-status dashboard-status--growing">
                  Growing
                </span>
              </div>
              <div className="dashboard-list-item">
                <span className="dashboard-list-label">Lettuce</span>
                <span className="dashboard-status dashboard-status--warning">
                  Needs Water
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title-small">🛠️ Garden Tools</h3>
            <div className="dashboard-list">
              <button className="dashboard-tool-button dashboard-tool-button--primary">
                <span className="dashboard-tool-label">Plant Planner</span>
              </button>
              <button className="dashboard-tool-button dashboard-tool-button--secondary">
                <span className="dashboard-tool-label--secondary">
                  Watering Schedule
                </span>
              </button>
              <button className="dashboard-tool-button dashboard-tool-button--neutral">
                <span className="dashboard-tool-label--neutral">
                  Garden Journal
                </span>
              </button>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title-small">📊 Quick Stats</h3>
            <div className="dashboard-stat-group">
              <div>
                <div className="dashboard-stat-row">
                  <span className="dashboard-stat-label">Plants Growing</span>
                  <span className="dashboard-stat-value">12</span>
                </div>
                <div className="dashboard-progress">
                  <div className="dashboard-progress-bar dashboard-progress-bar--green w-3/4"></div>
                </div>
              </div>
              <div>
                <div className="dashboard-stat-row">
                  <span className="dashboard-stat-label">Garden Health</span>
                  <span className="dashboard-stat-value">85%</span>
                </div>
                <div className="dashboard-progress">
                  <div className="dashboard-progress-bar dashboard-progress-bar--primary w-5/6"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title-small">🌤️ Weather</h3>
            <div className="dashboard-weather">
              <div className="dashboard-weather-icon">☀️</div>
              <div className="dashboard-weather-temp">72°F</div>
              <div className="dashboard-weather-copy">
                Perfect gardening weather!
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="dashboard-card-title-small">🔗 Quick Links</h3>
            <div className="dashboard-list">
              <Link href="/" className="dashboard-link-card">
                <span className="dashboard-link-label">← Back to Home</span>
              </Link>
              <div className="dashboard-mini-card">
                <span className="dashboard-mini-copy">
                  More features coming soon...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
