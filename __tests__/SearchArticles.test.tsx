import { render } from "@testing-library/react";
import SearchArticles from "@/components/articles/SearchArticles";
import { ArticleProvider } from "@/contexts/ArticleContext";

describe("SearchArticles Component", () => {
  const mockProps = {
    className: "test-search-class",
  };

  it("should match DOM snapshot", () => {
    const { container } = render(
      <ArticleProvider>
        <SearchArticles {...mockProps} />
      </ArticleProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for search input", () => {
    const { container } = render(
      <ArticleProvider>
        <SearchArticles {...mockProps} />
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
