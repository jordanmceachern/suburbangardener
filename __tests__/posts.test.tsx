import { render } from "@testing-library/react";
import PostsPage from "@/app/posts/page";

describe("PostsPage", () => {
  it("renders with correct structure and classes", () => {
    const { container } = render(<PostsPage />);

    // Take a snapshot of the DOM structure including classes
    expect(container.firstChild).toMatchSnapshot();
  });

  it("contains expected Tailwind classes for layout", () => {
    const { container } = render(<PostsPage />);

    // Check for key Tailwind classes that define the layout
    const mainContainer =
      container.querySelector('[class*="container"]') ||
      container.querySelector('[class*="max-w"]') ||
      container.querySelector('[class*="mx-auto"]');

    expect(mainContainer).toBeTruthy();

    // Verify responsive design classes are present
    const hasResponsiveClasses =
      container.innerHTML.includes("sm:") ||
      container.innerHTML.includes("md:") ||
      container.innerHTML.includes("lg:");

    expect(hasResponsiveClasses).toBe(true);
  });
});
