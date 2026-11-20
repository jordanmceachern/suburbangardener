import { render } from "@testing-library/react";
import SearchPosts from "@/components/posts/SearchPosts";
import { PostProvider } from "@/contexts/PostContext";

describe("SearchPosts Component", () => {
  it("should match DOM snapshot", () => {
    const { container } = render(
      <PostProvider>
        <SearchPosts />
      </PostProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for search input", () => {
    const { container } = render(
      <PostProvider>
        <SearchPosts />
      </PostProvider>
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
