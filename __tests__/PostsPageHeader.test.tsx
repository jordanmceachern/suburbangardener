import { render } from "@testing-library/react";
import PostsPageHeader from "@/components/posts/PostsPageHeader";

describe("PostsPageHeader Component", () => {
  it("should match DOM snapshot", () => {
    const { container } = render(<PostsPageHeader />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for header layout", () => {
    const { container } = render(<PostsPageHeader />);

    // Check for header-related classes
    const hasHeaderClasses =
      container.innerHTML.includes("text-") ||
      container.innerHTML.includes("font-") ||
      container.innerHTML.includes("mb-") ||
      container.innerHTML.includes("text-center");

    expect(hasHeaderClasses).toBe(true);
  });
});
