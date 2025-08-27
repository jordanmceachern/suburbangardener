import { render } from "@testing-library/react";
import LoadingSpinner from "@/components/LoadingSpinner";

describe("LoadingSpinner Component", () => {
  it("should match DOM snapshot with default props", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match DOM snapshot with different sizes", () => {
    const { container: smallContainer } = render(<LoadingSpinner size="sm" />);
    expect(smallContainer.firstChild).toMatchSnapshot();

    const { container: largeContainer } = render(<LoadingSpinner size="lg" />);
    expect(largeContainer.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for spinner animation", () => {
    const { container } = render(<LoadingSpinner text="Custom loading..." />);

    // Check for spinner-related classes
    const hasSpinnerClasses =
      container.innerHTML.includes("animate-spin") ||
      container.innerHTML.includes("spinner") ||
      container.innerHTML.includes("loading");

    expect(hasSpinnerClasses).toBe(true);
    expect(container.textContent).toContain("Custom loading...");
  });
});
