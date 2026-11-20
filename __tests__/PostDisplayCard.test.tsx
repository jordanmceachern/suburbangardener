import { render } from "@testing-library/react";
import PostDisplayCard from "@/components/posts/PostDisplayCard";

describe("PostDisplayCard Component", () => {
  const mockPost = {
    id: "1",
    title: "Test Post",
    excerpt: "This is a test post excerpt",
    slug: "test-post",
    content: "Test content",
    imageUrl: "/test-image.jpg",
    author: "Test Author",
    publishedDate: "2024-01-01",
    category: "gardening",
  };

  it("should match DOM snapshot", () => {
    const { container } = render(<PostDisplayCard post={mockPost} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for card layout", () => {
    const { container } = render(<PostDisplayCard post={mockPost} />);

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
