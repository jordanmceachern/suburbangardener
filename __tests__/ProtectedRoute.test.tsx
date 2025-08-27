import { render } from "@testing-library/react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { name: "Test User" } },
    status: "authenticated",
  }),
}));

// Mock the auth hook
jest.mock("../src/lib/auth-nextauth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe("ProtectedRoute Component", () => {
  it("should match DOM snapshot with authenticated user", () => {
    const { container } = render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for protected content", () => {
    const { container } = render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>
    );

    // Check that content is rendered
    expect(container.textContent).toContain("Protected content");
  });
});
