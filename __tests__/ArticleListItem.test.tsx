import { render } from "@testing-library/react";
import ArticleListItem from "@/components/articles/ArticleListItem";

describe("ArticleListItem Component", () => {
  const mockArticle = {
    id: "1",
    title: "Test Article",
    excerpt: "This is a test article excerpt",
    slug: "test-article",
    content: "Test content",
    imageUrl: "/test-image.jpg",
    author: "Test Author",
    publishedDate: "2024-01-01",
    category: "gardening",
  };

  it("should match DOM snapshot", () => {
    const { container } = render(<ArticleListItem article={mockArticle} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for list item layout", () => {
    const { container } = render(<ArticleListItem article={mockArticle} />);

    // Check for list item classes
    const hasListClasses =
      container.innerHTML.includes("flex") ||
      container.innerHTML.includes("grid") ||
      container.innerHTML.includes("border") ||
      container.innerHTML.includes("hover:") ||
      container.innerHTML.includes("p-") ||
      container.innerHTML.includes("m-");

    expect(hasListClasses).toBe(true);
  });
});
