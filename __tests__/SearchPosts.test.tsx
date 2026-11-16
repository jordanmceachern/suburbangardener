import { render } from "@testing-library/react";
import SearchPosts from "@/components/posts/SearchPosts";
import { ArticleProvider } from "@/contexts/PostContext";

describe("SearchPosts Component", () => {
  const mockProps = {
    className: "test-search-class",
  };

  it("should match DOM snapshot", () => {
    const { container } = render(
      <ArticleProvider>
        <SearchPosts {...mockProps} />
      </ArticleProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for search input", () => {
    const { container } = render(
      <ArticleProvider>
        <SearchPosts {...mockProps} />
      </ArticleProvider>
    );

    // Check for search-related classes
    const hasSearchClasses =
      container.innerHTML.includes("input") ||
      container.innerHTML.includes("border") ||
      container.innerHTML.includes("rounded") ||
      container.innerHTML.includes("px-") ||
      container.innerHTML.includes("py-");

    expect(hasSearchClasses).toBe(true);
  });
});
