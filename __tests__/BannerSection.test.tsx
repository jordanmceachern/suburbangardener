import { render } from "@testing-library/react";
import BannerSection from "@/components/BannerSection";

describe("BannerSection Component", () => {
  it("should match DOM snapshot", () => {
    const { container } = render(<BannerSection />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for banner layout", () => {
    const { container } = render(<BannerSection className="custom-banner" />);

    // Check for banner-related classes
    const hasBannerClasses =
      container.innerHTML.includes("flex") &&
      container.innerHTML.includes("items-center") &&
      container.innerHTML.includes("text-center");

    expect(hasBannerClasses).toBe(true);
    expect(container.innerHTML).toContain("custom-banner");
  });
});
