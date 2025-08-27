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

    // Verify Tailwind classes for responsive navigation
    const hasFlexClasses = container.innerHTML.includes("flex");
    const hasResponsiveClasses =
      container.innerHTML.includes("sm:") ||
      container.innerHTML.includes("md:") ||
      container.innerHTML.includes("lg:");

    expect(hasFlexClasses).toBe(true);
    expect(hasResponsiveClasses).toBe(true);
  });
});
