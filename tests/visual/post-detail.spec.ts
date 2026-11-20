import { test, expect } from "@playwright/test";

test.describe("Post Detail Page Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a specific post
    await page.goto("/posts/growing-organic-tomatoes");
    await page.waitForLoadState("networkidle");
  });

  test("should match post detail page in light mode", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForTimeout(500);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("post-detail-light.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("should match post detail page in dark mode", async ({ page }) => {
    // Switch to dark mode
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(500);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("post-detail-dark.png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("should match post header section", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the post header (image + title + meta)
    const headerSection = page.locator("main > div > div > div").first();
    await expect(headerSection).toHaveScreenshot("post-header-light.png", {
      threshold: 0.2,
    });
  });

  test("should match post content formatting", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the post content area
    const contentArea = page.locator(".post-content");
    if ((await contentArea.count()) > 0) {
      await expect(contentArea).toHaveScreenshot("post-content-light.png", {
        threshold: 0.2,
      });
    }
  });

  test("should match post footer/bio section", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the author bio section
    const bioSection = page.locator(":text('About') >> ..").last();
    await expect(bioSection).toHaveScreenshot("post-bio-light.png", {
      threshold: 0.2,
    });
  });

  test("should match post sidebar layout", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the sidebar (only visible on larger screens)
    const sidebar = page.locator("[class*='fixed'][class*='right-0']");
    if (await sidebar.isVisible()) {
      await expect(sidebar).toHaveScreenshot("post-sidebar-light.png", {
        threshold: 0.2,
      });
    }
  });

  test("should match back to posts navigation", async ({ page }) => {
    // Ensure light mode
    await page.emulateMedia({ colorScheme: "light" });

    // Target the back navigation link
    const backLink = page.locator("text=Back to Posts").first();
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
