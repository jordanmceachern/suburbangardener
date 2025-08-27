import { test, expect } from "@playwright/test";

test.describe("Sidebar Components Visual Tests", () => {
  test.describe("Articles Sidebar", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/articles");
      await page.waitForLoadState("networkidle");
      // Ensure desktop viewport to see sidebar
      await page.setViewportSize({ width: 1200, height: 800 });
    });

    test("should match articles sidebar in light mode", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.waitForTimeout(500);

      const sidebar = page.locator("[class*='fixed'][class*='right-0']");
      if (await sidebar.isVisible()) {
        await expect(sidebar).toHaveScreenshot("articles-sidebar-light.png", {
          threshold: 0.2,
        });
      }
    });

    test("should match articles sidebar in dark mode", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.waitForTimeout(500);

      const sidebar = page.locator("[class*='fixed'][class*='right-0']");
      if (await sidebar.isVisible()) {
        await expect(sidebar).toHaveScreenshot("articles-sidebar-dark.png", {
          threshold: 0.2,
        });
      }
    });

    test("should match sidebar search component", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });

      const searchComponent = page.locator("text=Search Articles >> ..");
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
      const collapseButton = page.locator("button[aria-label*='articles']");
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

  test.describe("Article Detail Sidebar", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/articles/growing-organic-tomatoes");
      await page.waitForLoadState("networkidle");
      await page.setViewportSize({ width: 1200, height: 800 });
    });

    test("should match article detail sidebar in light mode", async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: "light" });
      await page.waitForTimeout(500);

      const sidebar = page.locator("[class*='fixed'][class*='right-0']");
      if (await sidebar.isVisible()) {
        await expect(sidebar).toHaveScreenshot(
          "article-detail-sidebar-light.png",
          {
            threshold: 0.2,
          }
        );
      }
    });

    test("should match recent articles in sidebar", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "light" });

      const recentArticles = page.locator("text=Recent Articles >> ..");
      if ((await recentArticles.count()) > 0) {
        await expect(recentArticles).toHaveScreenshot(
          "sidebar-recent-articles-light.png",
          {
            threshold: 0.2,
          }
        );
      }
    });
  });
});
