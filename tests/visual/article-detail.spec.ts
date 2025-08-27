import { test, expect } from "@playwright/test";

test.describe("Article Detail Page Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a specific article
    await page.goto("/articles/growing-organic-tomatoes");
    await page.waitForLoadState("networkidle");
  });

  test("should match article detail page in light mode", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForTimeout(500);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("article-detail-light.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("should match article detail page in dark mode", async ({ page }) => {
    // Switch to dark mode
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(500);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("article-detail-dark.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("should match article header section", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the article header (image + title + meta)
    const headerSection = page.locator("main > div > div > div").first();
    await expect(headerSection).toHaveScreenshot("article-header-light.png", {
      threshold: 0.2,
    });
  });

  test("should match article content formatting", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the article content area
    const contentArea = page.locator(".article-content");
    if ((await contentArea.count()) > 0) {
      await expect(contentArea).toHaveScreenshot("article-content-light.png", {
        threshold: 0.2,
      });
    }
  });

  test("should match article footer/bio section", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the author bio section
    const bioSection = page.locator(":text('About') >> ..").last();
    await expect(bioSection).toHaveScreenshot("article-bio-light.png", {
      threshold: 0.2,
    });
  });

  test("should match article sidebar layout", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the sidebar (only visible on larger screens)
    const sidebar = page.locator("[class*='fixed'][class*='right-0']");
    if (await sidebar.isVisible()) {
      await expect(sidebar).toHaveScreenshot("article-sidebar-light.png", {
        threshold: 0.2,
      });
    }
  });

  test("should match back to articles navigation", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the back navigation link
    const backLink = page.locator("text=Back to Articles").first();
    if ((await backLink.count()) > 0) {
      const backContainer = backLink.locator("..").locator("..");
      await expect(backContainer).toHaveScreenshot(
        "back-navigation-light.png",
        {
          threshold: 0.2,
        }
      );
    }
  });
});
