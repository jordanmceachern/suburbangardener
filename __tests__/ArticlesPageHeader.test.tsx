import { render } from "@testing-library/react";
import ArticlesPageHeader from "@/components/articles/ArticlesPageHeader";

describe("ArticlesPageHeader Component", () => {
  it("should match DOM snapshot", () => {
    const { container } = render(<ArticlesPageHeader />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for header layout", () => {
    const { container } = render(<ArticlesPageHeader />);

    // Check for header-related classes
    const hasHeaderClasses =
      container.innerHTML.includes("text-") ||
      container.innerHTML.includes("font-") ||
      container.innerHTML.includes("mb-") ||
      container.innerHTML.includes("text-center");

    expect(hasHeaderClasses).toBe(true);
  });
});
