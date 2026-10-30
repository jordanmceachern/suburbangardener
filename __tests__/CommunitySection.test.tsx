import { render } from "@testing-library/react";
import CommunitySection from "@/components/CommunitySection";
import { communityStyles, homeArticleStyles } from "@/lib/tailwind";

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

  it("keeps home section headings no larger than the hero text on mobile", () => {
    expect(communityStyles.title.startsWith("text-2xl")).toBe(true);
    expect(homeArticleStyles.title.startsWith("text-2xl")).toBe(true);
    expect(communityStyles.title).toContain("sm:text-3xl");
    expect(homeArticleStyles.title).toContain("sm:text-3xl");
  });
});
