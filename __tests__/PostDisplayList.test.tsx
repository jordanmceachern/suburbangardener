import { render } from "@testing-library/react";
import PostDisplayList from "@/components/posts/PostDisplayList";
import { PostProvider } from "@/contexts/PostContext";

describe("PostDisplayList Component", () => {
  const mockProps = {
    className: "test-list-class",
  };

  it("should match DOM snapshot", () => {
    const { container } = render(
      <PostProvider>
        <PostDisplayList {...mockProps} />
      </PostProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for list layout", () => {
    const { container } = render(
      <PostProvider>
        <PostDisplayList {...mockProps} />
      </PostProvider>
    );

    // Check for list-related classes
    const hasListClasses =
      container.innerHTML.includes("test-list-class") ||
      container.innerHTML.includes("grid") ||
      container.innerHTML.includes("flex") ||
      container.innerHTML.includes("space-") ||
      container.innerHTML.includes("gap-");

    expect(hasListClasses).toBe(true);
  });
});
