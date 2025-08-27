import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ViewAllArticlesButton from "@/components/articles/ViewAllArticlesButton";

describe("ViewAllArticlesButton Component", () => {
  it("should match DOM snapshot", () => {
    const { container } = render(<ViewAllArticlesButton />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for button styling", () => {
    const { container } = render(<ViewAllArticlesButton />);

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
