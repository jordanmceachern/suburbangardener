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
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">
              Suburban Gardener Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Welcome back, {user.name}!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-4">
              🌱 Welcome to Your Garden
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              This is your personal gardening dashboard. Here you can track your
              plants, plan your garden, and access exclusive content.
            </p>
            <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
              <p className="text-primary-700 dark:text-primary-300 text-sm">
                🎉 You&apos;re now logged in and have access to premium
                features!
              </p>
            </div>
          </div>

          {/* My Plants Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              🌿 My Plants
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <span className="text-neutral-700 dark:text-neutral-300">
                  Tomatoes
                </span>
                <span className="text-green-600 dark:text-green-400 text-sm">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <span className="text-neutral-700 dark:text-neutral-300">
                  Basil
                </span>
                <span className="text-green-600 dark:text-green-400 text-sm">
                  Growing
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <span className="text-neutral-700 dark:text-neutral-300">
                  Lettuce
                </span>
                <span className="text-yellow-600 dark:text-yellow-400 text-sm">
                  Needs Water
                </span>
              </div>
            </div>
          </div>

          {/* Garden Tools Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              🛠️ Garden Tools
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-primary-50 dark:bg-primary-900 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
                <span className="text-primary-700 dark:text-primary-300">
                  Plant Planner
                </span>
              </button>
              <button className="w-full text-left p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                <span className="text-secondary-700 dark:text-secondary-300">
                  Watering Schedule
                </span>
              </button>
              <button className="w-full text-left p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors">
                <span className="text-neutral-700 dark:text-neutral-300">
                  Garden Journal
                </span>
              </button>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              📊 Quick Stats
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Plants Growing
                  </span>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    12
                  </span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Garden Health
                  </span>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    85%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full w-5/6"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              🌤️ Weather
            </h3>
            <div className="text-center">
              <div className="text-3xl mb-2">☀️</div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                72°F
              </div>
              <div className="text-neutral-600 dark:text-neutral-400 text-sm">
                Perfect gardening weather!
              </div>
            </div>
          </div>

          {/* Navigation Card */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              🔗 Quick Links
            </h3>
            <div className="space-y-3">
              <Link
                href="/"
                className="block p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
              >
                <span className="text-neutral-700 dark:text-neutral-300">
                  ← Back to Home
                </span>
              </Link>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <span className="text-neutral-500 dark:text-neutral-400 text-sm">
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
