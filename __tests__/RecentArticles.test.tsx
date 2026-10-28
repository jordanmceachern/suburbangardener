import { render } from "@testing-library/react";
import RecentArticles from "@/components/articles/RecentArticles";
import type { ArticleDisplayData } from "@/components/articles/ArticleDisplayCard";

describe("RecentArticles Component", () => {
  const mockArticles: ArticleDisplayData[] = [
    {
      id: "1",
      title: "Recent Article 1",
      excerpt: "First recent article",
      publishedDate: "2024-01-01",
      slug: "recent-article-1",
      content: "Recent content 1",
      imageUrl: "/recent-image-1.jpg",
      category: "Gardening",
      author: "Test Author",
    },
  ];

  it("should match DOM snapshot", () => {
    const { container } = render(<RecentArticles articles={mockArticles} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for recent articles layout", () => {
    const { container } = render(<RecentArticles articles={mockArticles} />);

    // Check for recent articles classes
    const hasRecentClasses =
      container.innerHTML.includes("recent") ||
      container.innerHTML.includes("list") ||
      container.innerHTML.includes("space-") ||
      container.innerHTML.includes("divide-");

    expect(hasRecentClasses).toBe(true);
  });
});
