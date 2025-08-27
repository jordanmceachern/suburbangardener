import { render } from "@testing-library/react";
import ArticleDisplayList from "@/components/articles/ArticleDisplayList";
import { ArticleProvider } from "@/contexts/ArticleContext";

describe("ArticleDisplayList Component", () => {
  const mockProps = {
    className: "test-list-class",
  };

  it("should match DOM snapshot", () => {
    const { container } = render(
      <ArticleProvider>
        <ArticleDisplayList {...mockProps} />
      </ArticleProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for list layout", () => {
    const { container } = render(
      <ArticleProvider>
        <ArticleDisplayList {...mockProps} />
      </ArticleProvider>
    );

    // Check for list-related classes
    const hasListClasses =
      container.innerHTML.includes("grid") ||
      container.innerHTML.includes("flex") ||
      container.innerHTML.includes("space-") ||
      container.innerHTML.includes("gap-");

    expect(hasListClasses).toBe(true);
  });
});
