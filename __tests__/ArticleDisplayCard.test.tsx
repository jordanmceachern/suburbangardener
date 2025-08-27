import { render } from "@testing-library/react";
import ArticleDisplayCard from "@/components/articles/ArticleDisplayCard";

describe("ArticleDisplayCard Component", () => {
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
    const { container } = render(<ArticleDisplayCard article={mockArticle} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for card layout", () => {
    const { container } = render(<ArticleDisplayCard article={mockArticle} />);

    // Check for card-related classes
    const hasCardClasses =
      container.innerHTML.includes("card") ||
      container.innerHTML.includes("border") ||
      container.innerHTML.includes("rounded") ||
      container.innerHTML.includes("shadow") ||
      container.innerHTML.includes("bg-");

    expect(hasCardClasses).toBe(true);
  });
});
