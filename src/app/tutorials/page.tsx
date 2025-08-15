import React from "react";

export default function TutorialsPage() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Gardening Tutorials
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Learn the art of suburban gardening with our comprehensive video
            tutorials and step-by-step guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Tutorial Cards */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Starting Your First Garden
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Complete beginner&apos;s guide to planning and starting your
                suburban garden.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  15 min video
                </span>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Watch Now
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Soil Preparation Basics
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Learn how to test, amend, and prepare your soil for optimal
                plant growth.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  12 min video
                </span>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Watch Now
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Watering Systems Setup
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Install efficient irrigation systems for your suburban garden.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  20 min video
                </span>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
