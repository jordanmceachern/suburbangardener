import { test, expect } from "@playwright/test";

test.describe("Articles Page Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Wait for the page to load completely
    await page.goto("/articles");
    await page.waitForLoadState("networkidle");
  });

  test("should match articles page layout in light mode", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForTimeout(500);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("articles-page-light.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("should match articles page layout in dark mode", async ({ page }) => {
    // Switch to dark mode
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(500);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("articles-page-dark.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("should match featured article component", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Wait for featured article to load
    const featuredArticle = page
      .locator("[data-testid='featured-article']")
      .first();
    if ((await featuredArticle.count()) === 0) {
      // If no test id, use a more general selector
      const featuredArticle = page.locator("article").first();
      await expect(featuredArticle).toHaveScreenshot(
        "featured-article-light.png",
        {
          threshold: 0.2,
        }
      );
    } else {
      await expect(featuredArticle).toHaveScreenshot(
        "featured-article-light.png",
        {
          threshold: 0.2,
        }
      );
    }
  });

  test("should match articles grid layout", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the articles grid specifically
    const articlesGrid = page.locator("[class*='grid']").last();
    await expect(articlesGrid).toHaveScreenshot("articles-grid-light.png", {
      threshold: 0.2,
    });
  });

  test("should match articles sidebar", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the sidebar (only visible on larger screens)
    const sidebar = page.locator("[class*='fixed'][class*='right-0']");
    if (await sidebar.isVisible()) {
      await expect(sidebar).toHaveScreenshot("articles-sidebar-light.png", {
        threshold: 0.2,
      });
    }
  });

  test("should match search functionality", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Find search input
    const searchInput = page.locator("input[placeholder*='Search']");
    if ((await searchInput.count()) > 0) {
      // Take screenshot of search area
      const searchContainer = searchInput.locator("..").locator("..");
      await expect(searchContainer).toHaveScreenshot(
        "search-component-light.png",
        {
          threshold: 0.2,
        }
      );

      // Test search interaction
      await searchInput.fill("tomato");
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot("search-results-light.png", {
        fullPage: true,
        threshold: 0.2,
      });
    }
  });

  test("should handle empty state", async ({ page }) => {
    // Try to trigger empty state by searching for something that won't exist
    const searchInput = page.locator("input[placeholder*='Search']");
    if ((await searchInput.count()) > 0) {
      await searchInput.fill("nonexistentsearchterm123");
      await page.waitForTimeout(1000);

      // Take screenshot of empty state
      await expect(page).toHaveScreenshot("articles-empty-state-light.png", {
        fullPage: true,
        threshold: 0.2,
      });
    }
  });
});
