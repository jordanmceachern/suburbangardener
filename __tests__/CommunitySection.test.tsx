import { render } from "@testing-library/react";
import CommunitySection from "@/components/CommunitySection";

describe("CommunitySection Component", () => {
  it("should match DOM snapshot", () => {
    const { container } = render(<CommunitySection />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for community section layout", () => {
    const { container } = render(<CommunitySection />);

    // Check for section-related classes
    const hasSectionClasses =
      container.innerHTML.includes("section") ||
      container.innerHTML.includes("community") ||
      container.innerHTML.includes("text-center") ||
      container.innerHTML.includes("flex") ||
      container.innerHTML.includes("grid");

    expect(hasSectionClasses).toBe(true);
  });
});
