import { test, expect } from "@playwright/test";

test.describe("Navigation Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should match desktop navigation in light mode", async ({ page }) => {
    // Ensure light mode and desktop viewport
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    // Target the desktop navigation
    const desktopNav = page.locator("nav").first();
    await expect(desktopNav).toHaveScreenshot("desktop-nav-light.png", {
      threshold: 0.2,
    });
  });

  test("should match desktop navigation in dark mode", async ({ page }) => {
    // Switch to dark mode
    await page.emulateMedia({ colorScheme: "dark" });
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    // Target the desktop navigation
    const desktopNav = page.locator("nav").first();
    await expect(desktopNav).toHaveScreenshot("desktop-nav-dark.png", {
      threshold: 0.2,
    });
  });

  test("should match mobile navigation in light mode", async ({ page }) => {
    // Ensure light mode and mobile viewport
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Target the mobile navigation (bottom bar)
    const mobileNav = page.locator("nav").last();
    await expect(mobileNav).toHaveScreenshot("mobile-nav-light.png", {
      threshold: 0.2,
    });
  });

  test("should match navigation focus states", async ({ page }) => {
    // Ensure light mode and desktop viewport
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize({ width: 1200, height: 800 });

    // Focus on a navigation link to test focus ring
    const navLink = page.locator("nav a").first();
    await navLink.focus();
    await page.waitForTimeout(200);

    await expect(navLink).toHaveScreenshot("nav-focus-state-light.png", {
      threshold: 0.2,
    });
  });
});
