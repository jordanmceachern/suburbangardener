import { render } from "@testing-library/react";
import Navigation from "@/components/Navigation";

describe("Navigation Component", () => {
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
});
