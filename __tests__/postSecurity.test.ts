import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import PostCreateForm from "../src/components/posts/PostCreateForm";
import {
  ALL_POST_CATEGORIES,
  DEFAULT_POST_CATEGORY,
  POST_CATEGORY_OPTIONS,
  canEditPost,
  convertLegacyEmphasis,
  isAdminEmail,
  maskDisplayName,
  sanitizeHtml,
} from "../src/lib/postSecurity";
import { PostFormStyles } from "../src/lib/tailwind";

jest.mock("../src/lib/auth-nextauth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next-cloudinary", () => ({
  CldUploadButton: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => React.createElement("button", { type: "button", className }, children),
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
        postAuthorUserId: "user-123",
      })
    ).toBe(true);

    expect(
      canEditPost({
        actorEmail: "gardener@example.com",
        postAuthorEmail: "gardener@example.com",
      })
    ).toBe(true);

    expect(
      canEditPost({
        actorEmail: "jormceachern@proton.me",
        postAuthorEmail: "other@example.com",
      })
    ).toBe(true);

    expect(
      canEditPost({
        actorUserId: "user-999",
        postAuthorUserId: "user-123",
      })
    ).toBe(false);
  });

  it("exposes shared category constants instead of duplicating category strings in components", () => {
    expect(DEFAULT_POST_CATEGORY).toBe("General");
    expect(ALL_POST_CATEGORIES).toBe("All Categories");
    expect(POST_CATEGORY_OPTIONS).toEqual([
      "General",
      "Fruit & Veg",
      "Flowers",
      "Soil",
      "Pest Control",
    ]);
  });

  it("converts legacy Markdown emphasis to HTML without touching tags", () => {
    expect(
      convertLegacyEmphasis(
        'I found **Jerusalem artichokes** (*AKA sunchokes*) <a href="https://x.com/*a*">link</a>'
      )
    ).toBe(
      'I found <strong>Jerusalem artichokes</strong> (<em>AKA sunchokes</em>) <a href="https://x.com/*a*">link</a>'
    );
    expect(convertLegacyEmphasis("2 * 3 * 4")).toBe("2 * 3 * 4");
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

  it("renders a Cloudinary upload button for the cover image field", () => {
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

    const uploadButton = screen.getByRole("button", { name: /choose file/i });
    expect(uploadButton).toHaveClass("bg-tertiary-400");
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
    expect(PostFormStyles.label).toContain("text-xl");
    expect(PostFormStyles.shell).toContain("bg-primary-100");
  });

  it("uses the site-wide primary focus ring for keyboard accessibility in form fields", () => {
    expect(PostFormStyles.input).toContain("focus:ring-2");
    expect(PostFormStyles.input).toContain("focus:ring-primary-500");
    expect(PostFormStyles.input).not.toContain("focus:ring-primary-500/20");
    expect(PostFormStyles.editor).toContain("focus:ring-primary-500");
  });

  it("tracks the summary and post body character counters with the correct limits", () => {
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

    expect(screen.getByText("0 / 200")).toBeInTheDocument();
    expect(screen.getByText("0 / 5000")).toBeInTheDocument();

    const summaryInput = screen.getByLabelText(/summary/i);
    const postBodyInput = screen.getByRole("textbox", { name: /post body/i });

    fireEvent.change(summaryInput, {
      target: { value: "a".repeat(250) },
    });

    expect(summaryInput).toHaveValue("a".repeat(200));
    expect(screen.getByText("200 / 200")).toBeInTheDocument();

    fireEvent.input(postBodyInput, {
      target: { textContent: "b".repeat(6000) },
    });

    expect(postBodyInput).toHaveTextContent("b".repeat(5000));
    expect(screen.getByText("5000 / 5000")).toBeInTheDocument();
  });

  it("formats the selected post body text without inserting visible markup", () => {
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

    const postBodyInput = screen.getByLabelText(/post body/i);

    fireEvent.change(postBodyInput, { target: { value: "garden" } });
    Object.defineProperty(postBodyInput, "selectionStart", {
      value: 0,
      configurable: true,
    });
    Object.defineProperty(postBodyInput, "selectionEnd", {
      value: 6,
      configurable: true,
    });

    fireEvent.click(screen.getByRole("button", { name: /bold/i }));
    expect(postBodyInput).toHaveValue("**garden**");

    fireEvent.change(postBodyInput, { target: { value: "leaf\nroot" } });
    Object.defineProperty(postBodyInput, "selectionStart", {
      value: 0,
      configurable: true,
    });
    Object.defineProperty(postBodyInput, "selectionEnd", {
      value: 9,
      configurable: true,
    });

    fireEvent.click(screen.getByRole("button", { name: /bullet/i }));
    expect(postBodyInput).toHaveValue("- leaf\n- root");
  });
});
