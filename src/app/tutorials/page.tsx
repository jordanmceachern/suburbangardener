import React from "react";

export default function TutorialsPage() {
  return (
    <main className="tutorials-page">
      <div className="tutorials-shell">
        <div className="tutorials-header">
          <h1 className="tutorials-title">Gardening Tutorials</h1>
          <p className="tutorials-subtitle">
            Learn the art of suburban gardening with our comprehensive video
            tutorials and step-by-step guides.
          </p>
        </div>

        <div className="tutorials-grid">
          <div className="tutorial-card">
            <div className="tutorial-image bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="tutorial-body">
              <h3 className="tutorial-card-title">
                Starting Your First Garden
              </h3>
              <p className="tutorial-card-copy">
                Complete beginner&apos;s guide to planning and starting your
                suburban garden.
              </p>
              <div className="tutorial-card-footer">
                <span className="tutorial-meta">15 min video</span>
                <button className="tutorial-button">Watch Now</button>
              </div>
            </div>
          </div>

          <div className="tutorial-card">
            <div className="tutorial-image bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="tutorial-body">
              <h3 className="tutorial-card-title">Soil Preparation Basics</h3>
              <p className="tutorial-card-copy">
                Learn how to test, amend, and prepare your soil for optimal
                plant growth.
              </p>
              <div className="tutorial-card-footer">
                <span className="tutorial-meta">12 min video</span>
                <button className="tutorial-button">Watch Now</button>
              </div>
            </div>
          </div>

          <div className="tutorial-card">
            <div className="tutorial-image bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <div className="tutorial-body">
              <h3 className="tutorial-card-title">Watering Systems Setup</h3>
              <p className="tutorial-card-copy">
                Install efficient irrigation systems for your suburban garden.
              </p>
              <div className="tutorial-card-footer">
                <span className="tutorial-meta">20 min video</span>
                <button className="tutorial-button">Watch Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
