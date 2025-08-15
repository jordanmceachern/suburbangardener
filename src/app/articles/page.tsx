import React from "react";

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Gardening Articles
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Discover expert insights, seasonal tips, and in-depth guides for
            successful suburban gardening.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Featured Article */}
          <div className="lg:col-span-2">
            <article className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-sm ml-4">
                    March 15, 2025
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Spring Garden Planning: Your Complete Guide
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-6">
                  As winter fades away, it&apos;s time to start planning your
                  spring garden. This comprehensive guide covers everything from
                  soil preparation to plant selection for a thriving suburban
                  garden.
                </p>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Read Full Article
                </button>
              </div>
            </article>
          </div>

          {/* Sidebar Articles */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Recent Articles
              </h3>
              <div className="space-y-4">
                <article className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Composting 101: Turn Waste into Garden Gold
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Learn the basics of creating nutrient-rich compost for your
                    garden.
                  </p>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    March 10, 2025
                  </span>
                </article>

                <article className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Pest Control: Natural Solutions
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Protect your plants without harmful chemicals using these
                    natural methods.
                  </p>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    March 8, 2025
                  </span>
                </article>

                <article>
                  <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    Small Space, Big Harvest
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Maximize your yield even in the smallest suburban garden
                    spaces.
                  </p>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    March 5, 2025
                  </span>
                </article>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Beginner Tips (12)
                </a>
                <a
                  href="#"
                  className="block text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Seasonal Guides (8)
                </a>
                <a
                  href="#"
                  className="block text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Plant Care (15)
                </a>
                <a
                  href="#"
                  className="block text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Tools & Equipment (6)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
