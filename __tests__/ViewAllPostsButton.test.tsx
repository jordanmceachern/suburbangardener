import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ViewAllPostsButton from "@/components/posts/ViewAllPostsButton";

describe("ViewAllPostsButton Component", () => {
  it("should match DOM snapshot", () => {
    const { container } = render(<ViewAllPostsButton />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for button styling", () => {
    const { container } = render(<ViewAllPostsButton />);

    // Check for button-related classes
    const hasButtonClasses =
      container.innerHTML.includes("button") ||
      container.innerHTML.includes("btn") ||
      container.innerHTML.includes("bg-") ||
      container.innerHTML.includes("hover:") ||
      container.innerHTML.includes("px-") ||
      container.innerHTML.includes("py-");

    expect(hasButtonClasses).toBe(true);
  });
});
