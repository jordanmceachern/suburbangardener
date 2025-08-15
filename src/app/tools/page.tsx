import React from "react";

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Garden Tools & Calculators
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Plan your perfect garden with our interactive tools and calculators
            designed for suburban gardening success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Garden Planner Tool */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Garden Layout Planner
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Design your garden layout with our interactive drag-and-drop
              planner. Optimize space and plan companion planting.
            </p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Launch Planner
            </button>
          </div>

          {/* Spacing Calculator */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Plant Spacing Calculator
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Calculate optimal spacing between plants based on variety, growth
              habits, and available space.
            </p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Calculate Spacing
            </button>
          </div>

          {/* Watering Schedule */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900 rounded-lg mb-4">
              <svg
                className="w-8 h-8 text-cyan-600 dark:text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Watering Schedule Tool
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Create personalized watering schedules based on plant types,
              weather, and soil conditions.
            </p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Create Schedule
            </button>
          </div>

          {/* Harvest Calendar */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg mb-4">
              <svg
                className="w-8 h-8 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Harvest Calendar
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Track planting dates and predict harvest times for all your
              vegetables and herbs.
            </p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              View Calendar
            </button>
          </div>

          {/* Soil Test Tracker */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4">
              <svg
                className="w-8 h-8 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Soil Test Tracker
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Log and track soil pH, nutrients, and amendments over time to
              optimize soil health.
            </p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Track Soil Data
            </button>
          </div>

          {/* Seed Starting Calculator */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-lg mb-4">
              <svg
                className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Seed Starting Calculator
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Calculate when to start seeds indoors based on your last frost
              date and desired harvest time.
            </p>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Calculate Dates
            </button>
          </div>
        </div>

        {/* Featured Tool Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900 rounded-lg p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-4">
              Garden Design Studio
            </h2>
            <p className="text-lg text-primary-700 dark:text-primary-300 mb-8">
              Our most comprehensive tool for designing your complete suburban
              garden layout with 3D visualization, plant databases, and seasonal
              planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors">
                Launch Design Studio
              </button>
              <button className="bg-white dark:bg-neutral-800 border border-primary-600 text-primary-600 dark:text-primary-400 px-8 py-3 rounded-lg font-medium text-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
