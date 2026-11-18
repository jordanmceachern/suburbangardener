import { test, expect } from "@playwright/test";

test.describe("Sidebar Components Visual Tests", () => {
  test.describe("Posts Sidebar", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/posts");
      await page.waitForLoadState("networkidle");
      // Ensure desktop viewport to see sidebar
      await page.setViewportSize({ width: 1200, height: 800 });
    });

    test("should match posts sidebar in light mode", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.waitForTimeout(500);

      const sidebar = page.locator("[class*='fixed'][class*='right-0']");
      if (await sidebar.isVisible()) {
        await expect(sidebar).toHaveScreenshot("posts-sidebar-light.png", {
          threshold: 0.2,
        });
      }
    });

    test("should match posts sidebar in dark mode", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.waitForTimeout(500);

      const sidebar = page.locator("[class*='fixed'][class*='right-0']");
      if (await sidebar.isVisible()) {
        await expect(sidebar).toHaveScreenshot("posts-sidebar-dark.png", {
          threshold: 0.2,
        });
      }
    });

    test("should match sidebar search component", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });

      const searchComponent = page.locator("text=Search Posts >> ..");
      if ((await searchComponent.count()) > 0) {
        await expect(searchComponent).toHaveScreenshot(
          "sidebar-search-light.png",
          {
            threshold: 0.2,
          }
        );
      }
    });

    test("should match sidebar collapse functionality", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.setViewportSize({ width: 800, height: 600 }); // Medium viewport

      // Look for collapse button
      const collapseButton = page.locator("button[aria-label*='posts']");
      if ((await collapseButton.count()) > 0) {
        await expect(collapseButton).toHaveScreenshot(
          "sidebar-collapse-button-light.png",
          {
            threshold: 0.2,
          }
        );
      }
    });
  });

  test.describe("Post Detail Sidebar", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/posts/growing-organic-tomatoes");
      await page.waitForLoadState("networkidle");
      await page.setViewportSize({ width: 1200, height: 800 });
    });

    test("should match post detail sidebar in light mode", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.waitForTimeout(500);

      const sidebar = page.locator("[class*='fixed'][class*='right-0']");
      if (await sidebar.isVisible()) {
        await expect(sidebar).toHaveScreenshot(
          "post-detail-sidebar-light.png",
          {
            threshold: 0.2,
          }
        );
      }
    });

    test("should match recent posts in sidebar", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });

      const recentPosts = page.locator("text=Recent Posts >> ..");
      if ((await recentPosts.count()) > 0) {
        await expect(recentPosts).toHaveScreenshot(
          "sidebar-recent-posts-light.png",
          {
            threshold: 0.2,
          }
        );
      }
    });
  });
});
