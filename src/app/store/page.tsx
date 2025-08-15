import React from "react";

export default function StorePage() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Garden Store
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Everything you need for your suburban garden - from tools and
            supplies to plants and accessories.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium">
            All Products
          </button>
          <button className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-6 py-2 rounded-full font-medium hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
            Tools
          </button>
          <button className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-6 py-2 rounded-full font-medium hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
            Seeds & Plants
          </button>
          <button className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-6 py-2 rounded-full font-medium hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
            Soil & Fertilizer
          </button>
          <button className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-6 py-2 rounded-full font-medium hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
            Accessories
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product Cards */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden group">
            <div className="h-48 bg-gradient-to-r from-green-400 to-green-500 relative">
              <div className="absolute top-3 right-3">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Sale
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Premium Garden Spade
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                Durable steel spade perfect for digging and soil preparation.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    $29.99
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 line-through ml-2">
                    $39.99
                  </span>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden group">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-500"></div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Organic Tomato Seeds
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                Heritage variety tomato seeds for maximum flavor and yield.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    $12.99
                  </span>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden group">
            <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-500"></div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                All-Purpose Plant Food
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                Slow-release fertilizer for healthy plant growth all season.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    $24.99
                  </span>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden group">
            <div className="h-48 bg-gradient-to-r from-orange-400 to-orange-500"></div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Watering Can Set
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                Ergonomic watering cans in multiple sizes for all your needs.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    $34.99
                  </span>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary-50 dark:bg-primary-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-4">
            Get Garden Updates
          </h2>
          <p className="text-primary-700 dark:text-primary-300 mb-6 max-w-md mx-auto">
            Subscribe to receive the latest product updates, seasonal tips, and
            exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
