import { render } from "@testing-library/react";
import PostListItem from "@/components/posts/PostListItem";

describe("PostListItem Component", () => {
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
    const { container } = render(<PostListItem post={mockPost} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for list item layout", () => {
    const { container } = render(<PostListItem post={mockPost} />);

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
