import React from "react";

export default function StorePage() {
  return (
    <main className="store-page">
      <div className="store-shell">
        <div className="store-header">
          <h1 className="store-title">Garden Store</h1>
          <p className="store-subtitle">
            Everything you need for your suburban garden - from tools and
            supplies to plants and accessories.
          </p>
        </div>

        <div className="store-filter-list">
          <button className="store-filter-button store-filter-button--active">
            All Products
          </button>
          <button className="store-filter-button">Tools</button>
          <button className="store-filter-button">Seeds & Plants</button>
          <button className="store-filter-button">Soil & Fertilizer</button>
          <button className="store-filter-button">Accessories</button>
        </div>

        <div className="store-grid">
          <div className="store-product-card">
            <div className="store-product-visual bg-gradient-to-r from-green-400 to-green-500">
              <div className="store-product-badge">Sale</div>
            </div>
            <div className="store-product-body">
              <h3 className="store-product-title">Premium Garden Spade</h3>
              <p className="store-product-description">
                Durable steel spade perfect for digging and soil preparation.
              </p>
              <div className="store-product-row">
                <div>
                  <span className="store-price">$29.99</span>
                  <span className="store-original-price">$39.99</span>
                </div>
                <button className="store-product-button">Add to Cart</button>
              </div>
            </div>
          </div>

          <div className="store-product-card group">
            <div className="store-product-visual bg-gradient-to-r from-blue-400 to-blue-500"></div>
            <div className="store-product-body">
              <h3 className="store-product-title">Organic Tomato Seeds</h3>
              <p className="store-product-description">
                Heritage variety tomato seeds for maximum flavor and yield.
              </p>
              <div className="store-product-row">
                <div>
                  <span className="store-price">$12.99</span>
                </div>
                <button className="store-product-button">Add to Cart</button>
              </div>
            </div>
          </div>

          <div className="store-product-card group">
            <div className="store-product-visual bg-gradient-to-r from-purple-400 to-purple-500"></div>
            <div className="store-product-body">
              <h3 className="store-product-title">All-Purpose Plant Food</h3>
              <p className="store-product-description">
                Slow-release fertilizer for healthy plant growth all season.
              </p>
              <div className="store-product-row">
                <div>
                  <span className="store-price">$24.99</span>
                </div>
                <button className="store-product-button">Add to Cart</button>
              </div>
            </div>
          </div>

          <div className="store-product-card group">
            <div className="store-product-visual bg-gradient-to-r from-orange-400 to-orange-500"></div>
            <div className="store-product-body">
              <h3 className="store-product-title">Watering Can Set</h3>
              <p className="store-product-description">
                Ergonomic watering cans in multiple sizes for all your needs.
              </p>
              <div className="store-product-row">
                <div>
                  <span className="store-price">$34.99</span>
                </div>
                <button className="store-product-button">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>

        <div className="store-newsletter">
          <h2 className="store-newsletter-title">Get Garden Updates</h2>
          <p className="store-newsletter-text">
            Subscribe to receive the latest product updates, seasonal tips, and
            exclusive offers.
          </p>
          <div className="store-newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="store-newsletter-input"
            />
            <button className="store-newsletter-submit">Subscribe</button>
          </div>
        </div>
      </div>
    </main>
  );
}
