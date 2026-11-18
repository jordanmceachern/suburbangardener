import { test, expect } from "@playwright/test";

test.describe("Posts Page Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Wait for the page to load completely
    await page.goto("/posts");
    await page.waitForLoadState("networkidle");
  });

  test("should match posts page layout in light mode", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForTimeout(500);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("posts-page-light.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("should match posts page layout in dark mode", async ({ page }) => {
    // Switch to dark mode
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(500);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("posts-page-dark.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("should match featured post component", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Wait for featured post to load
    const featuredPost = page.locator("[data-testid='featured-post']").first();
    if ((await featuredPost.count()) === 0) {
      // If no test id, use a more general selector
      const featuredPost = page.locator("article").first();
      await expect(featuredPost).toHaveScreenshot("featured-post-light.png", {
        threshold: 0.2,
      });
    } else {
      await expect(featuredPost).toHaveScreenshot("featured-post-light.png", {
        threshold: 0.2,
      });
    }
  });

  test("should match posts grid layout", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the posts grid specifically
    const postsGrid = page.locator("[class*='grid']").last();
    await expect(postsGrid).toHaveScreenshot("posts-grid-light.png", {
      threshold: 0.2,
    });
  });

  test("should match posts sidebar", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the sidebar (only visible on larger screens)
    const sidebar = page.locator("[class*='fixed'][class*='right-0']");
    if (await sidebar.isVisible()) {
      await expect(sidebar).toHaveScreenshot("posts-sidebar-light.png", {
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
      await expect(page).toHaveScreenshot("posts-empty-state-light.png", {
        fullPage: true,
        threshold: 0.2,
      });
    }
  });
});
