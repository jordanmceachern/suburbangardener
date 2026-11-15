import { render, screen } from "@testing-library/react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/auth-nextauth";
import {
  applyThemeMode,
  resolveInitialTheme,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

jest.mock("@/lib/auth-nextauth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Navigation Component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  });

  it("renders with correct structure and classes", () => {
    const { container } = render(<Navigation />);

    // Take a snapshot of the DOM structure including classes
    expect(container.firstChild).toMatchSnapshot();
  });

  it("contains expected navigation structure", () => {
    const { container, getAllByRole } = render(<Navigation />);

    // Check for nav elements (there might be multiple for responsive design)
    const navs = getAllByRole("navigation");
    expect(navs.length).toBeGreaterThan(0);

    // Verify the responsive navigation shell and shared CSS hook classes.
    const hasFlexClasses = container.innerHTML.includes("flex");
    const hasNavigationHooks =
      container.innerHTML.includes("nav-shell-desktop") ||
      container.innerHTML.includes("nav-mobile-bar") ||
      container.innerHTML.includes("nav-link--desktop") ||
      container.innerHTML.includes("nav-link--active");

    expect(hasFlexClasses).toBe(true);
    expect(hasNavigationHooks).toBe(true);
  });

  it("renders a theme toggle item with the opposite mode label", () => {
    render(<Navigation />);

    expect(
      screen.getAllByRole("button", { name: /dark/i }).length
    ).toBeGreaterThan(0);
  });

  it("hides Dashboard for logged out users", () => {
    render(<Navigation />);

    expect(
      screen.queryByRole("link", { name: /dashboard/i })
    ).not.toBeInTheDocument();
  });

  it("places Dashboard last when a user is authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "u1", name: "Tester", email: "tester@example.com" },
    });

    render(<Navigation />);

    const navNames = screen
      .getAllByRole("link")
      .map(
        link =>
          (link as HTMLAnchorElement).textContent?.trim() ||
          (link as HTMLAnchorElement).getAttribute("title") ||
          ""
      )
      .filter(Boolean);

    const dashboardIndex = navNames.findIndex(name => /dashboard/i.test(name));
    const storeIndex = navNames.findIndex(name => /store/i.test(name));

    expect(dashboardIndex).toBeGreaterThan(storeIndex);
  });

  it("prefers the system dark theme when there is no saved override", () => {
    window.localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    expect(resolveInitialTheme()).toBe("dark");

    applyThemeMode("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("keeps a saved light preference ahead of the system dark preference", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    expect(resolveInitialTheme()).toBe("light");
  });

  it("does not write a temporary light theme on initial mount when the system is dark", () => {
    window.localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    render(<Navigation />);

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });
});
