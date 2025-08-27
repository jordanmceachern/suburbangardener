import { render } from "@testing-library/react";
import BackgroundImage from "@/components/BackgroundImage";

describe("BackgroundImage Component", () => {
  const defaultProps = {
    src: "/test-image.jpg",
    label: "Test Background",
  };

  it("should match DOM snapshot", () => {
    const { container } = render(<BackgroundImage {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for background styling", () => {
    const { container } = render(
      <BackgroundImage {...defaultProps} className="custom-bg-class" />
    );

    // Check for background-related classes
    const hasBackgroundClasses =
      container.innerHTML.includes("bg-") ||
      container.innerHTML.includes("background") ||
      container.innerHTML.includes("backdrop") ||
      container.innerHTML.includes("custom-bg-class");

    expect(hasBackgroundClasses).toBe(true);
  });
});
