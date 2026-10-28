import React from "react";

export default function ToolsPage() {
  return (
    <main className="tools-page">
      <div className="tools-shell">
        <div className="tools-header">
          <h1 className="tools-title">Garden Tools & Calculators</h1>
          <p className="tools-subtitle">
            Plan your perfect garden with our interactive tools and calculators
            designed for suburban gardening success.
          </p>
        </div>

        <div className="tools-grid">
          <div className="tool-card">
            <div className="tool-icon-wrap tool-icon-wrap--green">
              <svg
                className="tool-icon tool-icon--green"
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
            <h3 className="tool-title">Garden Layout Planner</h3>
            <p className="tool-copy">
              Design your garden layout with our interactive drag-and-drop
              planner. Optimize space and plan companion planting.
            </p>
            <button className="tool-button">Launch Planner</button>
          </div>

          <div className="tool-card">
            <div className="tool-icon-wrap tool-icon-wrap--blue">
              <svg
                className="tool-icon tool-icon--blue"
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
            <h3 className="tool-title">Plant Spacing Calculator</h3>
            <p className="tool-copy">
              Calculate optimal spacing between plants based on variety, growth
              habits, and available space.
            </p>
            <button className="tool-button">Calculate Spacing</button>
          </div>

          <div className="tool-card">
            <div className="tool-icon-wrap tool-icon-wrap--cyan">
              <svg
                className="tool-icon tool-icon--cyan"
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
            <h3 className="tool-title">Watering Schedule Tool</h3>
            <p className="tool-copy">
              Create personalized watering schedules based on plant types,
              weather, and soil conditions.
            </p>
            <button className="tool-button">Create Schedule</button>
          </div>

          <div className="tool-card">
            <div className="tool-icon-wrap tool-icon-wrap--orange">
              <svg
                className="tool-icon tool-icon--orange"
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
            <h3 className="tool-title">Harvest Calendar</h3>
            <p className="tool-copy">
              Track planting dates and predict harvest times for all your
              vegetables and herbs.
            </p>
            <button className="tool-button">View Calendar</button>
          </div>

          <div className="tool-card">
            <div className="tool-icon-wrap tool-icon-wrap--purple">
              <svg
                className="tool-icon tool-icon--purple"
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
            <h3 className="tool-title">Soil Test Tracker</h3>
            <p className="tool-copy">
              Log and track soil pH, nutrients, and amendments over time to
              optimize soil health.
            </p>
            <button className="tool-button">Track Soil Data</button>
          </div>

          <div className="tool-card">
            <div className="tool-icon-wrap tool-icon-wrap--emerald">
              <svg
                className="tool-icon tool-icon--emerald"
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
            <h3 className="tool-title">Seed Starting Calculator</h3>
            <p className="tool-copy">
              Calculate when to start seeds indoors based on your last frost
              date and desired harvest time.
            </p>
            <button className="tool-button">Calculate Dates</button>
          </div>
        </div>

        <div className="tools-feature">
          <div className="tools-feature-inner">
            <h2 className="tools-feature-title">Garden Design Studio</h2>
            <p className="tools-feature-copy">
              Our most comprehensive tool for designing your complete suburban
              garden layout with 3D visualization, plant databases, and seasonal
              planning.
            </p>
            <div className="tools-feature-actions">
              <button className="tools-feature-button-primary">
                Launch Design Studio
              </button>
              <button className="tools-feature-button-secondary">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
