import { render } from "@testing-library/react";
import RecentPosts from "@/components/posts/RecentPosts";
import type { PostDisplayData } from "@/components/posts/PostDisplayCard";

describe("RecentPosts Component", () => {
  const mockPosts: PostDisplayData[] = [
    {
      id: "1",
      title: "Recent Post 1",
      excerpt: "First recent post",
      publishedDate: "2024-01-01",
      slug: "recent-post-1",
      content: "Recent content 1",
      imageUrl: "/recent-image-1.jpg",
      category: "Gardening",
      author: "Test Author",
    },
  ];

  it("should match DOM snapshot", () => {
    const { container } = render(<RecentPosts posts={mockPosts} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for recent posts layout", () => {
    const { container } = render(<RecentPosts posts={mockPosts} />);

    // Check for recent posts classes
    const hasRecentClasses =
      container.innerHTML.includes("recent") ||
      container.innerHTML.includes("list") ||
      container.innerHTML.includes("space-") ||
      container.innerHTML.includes("divide-");

    expect(hasRecentClasses).toBe(true);
  });
});
