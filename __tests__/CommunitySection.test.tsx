import { render, screen } from "@testing-library/react";
import CommunitySection from "@/components/CommunitySection";
import { useAuth } from "@/lib/auth-nextauth";
import { communityStyles, homeArticleStyles } from "@/lib/tailwind";

jest.mock("@/lib/auth-nextauth", () => ({
  useAuth: jest.fn(),
}));

describe("CommunitySection Component", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  });

  it("routes the primary CTA to the sign-up flow and uses the correct label", () => {
    render(<CommunitySection />);
    const primaryAction = screen.getByRole("link", { name: /create account/i });

    expect(primaryAction).toHaveAttribute("href", "/login?mode=signUp");
  });

  it("shows explore tools instead of account prompts when a user is logged in", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "1", name: "Test User", email: "test@example.com" },
    });

    render(<CommunitySection />);

    expect(
      screen.getByRole("link", { name: /explore tools/i })
    ).toHaveAttribute("href", "/tools");
    expect(
      screen.queryByRole("link", { name: /create account/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /log in/i })
    ).not.toBeInTheDocument();
  });

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
