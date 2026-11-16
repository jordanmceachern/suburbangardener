import React from "react";
import { render, screen } from "@testing-library/react";
import PostCreateForm from "../src/components/posts/PostCreateForm";
import {
  canEditPost,
  isAdminEmail,
  maskDisplayName,
  sanitizeHtml,
} from "../src/lib/articleSecurity";
import { PostFormStyles } from "../src/lib/tailwind";

jest.mock("../src/lib/auth-nextauth", () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = jest.requireMock("../src/lib/auth-nextauth");

describe("post security helpers", () => {
  it("masks emails before the @ symbol for display", () => {
    expect(maskDisplayName("jormceachern@proton.me")).toBe("jormceachern");
    expect(maskDisplayName("someone@example.com")).toBe("someone");
  });

  it("detects the configured admin email", () => {
    expect(isAdminEmail("JORMCEACHERN@PROTON.ME")).toBe(true);
    expect(isAdminEmail("other@example.com")).toBe(false);
  });

  it("allows authors and admin users to edit posts", () => {
    expect(
      canEditPost({
        actorUserId: "user-123",
        PostAuthorUserId: "user-123",
      })
    ).toBe(true);

    expect(
      canEditPost({
        actorEmail: "gardener@example.com",
        PostAuthorEmail: "gardener@example.com",
      })
    ).toBe(true);

    expect(
      canEditPost({
        actorEmail: "jormceachern@proton.me",
        PostAuthorEmail: "other@example.com",
      })
    ).toBe(true);

    expect(
      canEditPost({
        actorUserId: "user-999",
        PostAuthorUserId: "user-123",
      })
    ).toBe(false);
  });

  it("removes unsafe HTML before storage", () => {
    const dirty = `
      <p>Good</p>
      <script>alert("x")</script>
      <a href="javascript:alert(1)" onclick="evil()">link</a>
    `;

    const clean = sanitizeHtml(dirty);

    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("onclick");
    expect(clean).toContain("Good");
    expect(clean).toContain("href=");
  });

  it("renders the rich-text toolbar controls for the post body editor", () => {
    useAuth.mockReturnValue({
      user: {
        id: "user-123",
        email: "gardener@example.com",
        name: "Gardener",
      },
      isAuthenticated: true,
      isLoading: false,
    });

    render(React.createElement(PostCreateForm));

    expect(screen.getByRole("button", { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /italic/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /underline/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bullet/i })).toBeInTheDocument();
  });

  it("keeps the create post form aligned with the auth modal styling contract", () => {
    useAuth.mockReturnValue({
      user: {
        id: "user-123",
        email: "gardener@example.com",
        name: "Gardener",
      },
      isAuthenticated: true,
      isLoading: false,
    });

    render(React.createElement(PostCreateForm));

    expect(
      screen.getByRole("heading", { name: /write a gardening post/i })
    ).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(
      "Give your post a searchable name"
    );
    expect(titleInput).toHaveClass("auth-input");
    expect(PostFormStyles.input).toContain("auth-input");
    expect(PostFormStyles.label).toContain("text-lg");
    expect(PostFormStyles.shell).toContain("bg-primary-100");
  });
});
