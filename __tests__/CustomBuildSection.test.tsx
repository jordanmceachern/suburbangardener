import { render, screen } from "@testing-library/react";
import CustomBuildSection from "@/components/CustomBuildSection";
import { useAuth } from "@/lib/auth-nextauth";
import { customBuildStyles, homeArticleStyles } from "@/lib/tailwind";

jest.mock("@/lib/auth-nextauth", () => ({
  useAuth: jest.fn(),
}));

describe("CustomBuildSection Component", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  });

  it("routes the primary CTA to the sign-up flow and uses the correct label", () => {
    render(<CustomBuildSection />);
    const primaryAction = screen.getByRole("link", { name: /create account/i });

    expect(primaryAction).toHaveAttribute("href", "/login?mode=signUp");
  });

  it("shows explore tools instead of account prompts when a user is logged in", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "1", name: "Test User", email: "test@example.com" },
    });

    render(<CustomBuildSection />);

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
    const { container } = render(<CustomBuildSection />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for the custom build section layout", () => {
    const { container } = render(<CustomBuildSection />);

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
    expect(customBuildStyles.title.startsWith("text-2xl")).toBe(true);
    expect(homeArticleStyles.title.startsWith("text-2xl")).toBe(true);
    expect(customBuildStyles.title).toContain("sm:text-3xl");
    expect(homeArticleStyles.title).toContain("sm:text-3xl");
  });
});
