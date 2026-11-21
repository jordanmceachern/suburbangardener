import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PostCreateForm from "../src/components/posts/PostCreateForm";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/posts/new",
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

jest.mock("../src/lib/auth-nextauth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next-cloudinary", () => ({
  CldUploadButton: ({
    children,
    className,
    onSuccess,
  }: {
    children: React.ReactNode;
    className?: string;
    onSuccess?: (result: { info: { secure_url: string } }) => void;
  }) => (
    <button
      type="button"
      className={className}
      onClick={() =>
        onSuccess?.({
          info: { secure_url: "https://example.com/garden.jpg" },
        })
      }
    >
      {children}
    </button>
  ),
}));

const { useAuth } = jest.requireMock("../src/lib/auth-nextauth");

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: "Jerusalem Artichoke Guide" },
  });
  fireEvent.change(screen.getByLabelText(/summary/i), {
    target: { value: "How to grow, harvest, and cook Jerusalem artichokes." },
  });
  fireEvent.input(screen.getByRole("textbox", { name: /post body/i }), {
    target: {
      textContent: "Plant artichokes in loose soil and harvest after frost.",
    },
  });
  fireEvent.click(screen.getByRole("button", { name: /choose file/i }));
}

describe("PostCreateForm create and edit submissions", () => {
  beforeEach(() => {
    mockPush.mockReset();
    window.history.replaceState({}, "", "/posts/new");
    useAuth.mockReturnValue({
      user: {
        id: "user-123",
        email: "gardener@example.com",
        name: "Gardener",
      },
      isAuthenticated: true,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("creates a post with POST and redirects after success", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ post: { id: "post-123" } }),
    });
    global.fetch = fetchMock as typeof fetch;

    render(<PostCreateForm />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole("button", { name: /publish post/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/posts",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    const [, request] = fetchMock.mock.calls[0];
    const payload = JSON.parse(request.body);

    expect(payload).toEqual(
      expect.objectContaining({
        title: "Jerusalem Artichoke Guide",
        summary: "How to grow, harvest, and cook Jerusalem artichokes.",
        contentHtml: "Plant artichokes in loose soil and harvest after frost.",
        coverImageUrl: "https://example.com/garden.jpg",
        category: "General",
      })
    );

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/posts"));
  });

  it("loads an existing post and submits changes with PATCH", async () => {
    window.history.replaceState({}, "", "/posts/new?edit=post-123");

    const fetchMock = jest
      .fn()
      .mockImplementation(async (url: string, options?: RequestInit) => {
        if (url === "/api/posts/post-123" && options?.method === "PATCH") {
          return {
            ok: true,
            json: async () => ({ post: { id: "post-123" } }),
          };
        }

        return {
          ok: true,
          json: async () => ({
            post: {
              id: "post-123",
              title: "Old Artichoke Title",
              summary: "Old summary",
              category: "Fruit & Veg",
              coverImageUrl: "https://example.com/old.jpg",
              youtubeUrl: "",
              contentHtml: "Old post body",
            },
          }),
        };
      });
    global.fetch = fetchMock as typeof fetch;

    render(<PostCreateForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue(
        "Old Artichoke Title"
      );
    });

    expect(
      screen.getByRole("heading", { name: /edit your garden post/i })
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Updated Artichoke Title" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/posts/post-123",
        expect.objectContaining({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    const patchCall = fetchMock.mock.calls.find(
      ([, options]) => (options as RequestInit | undefined)?.method === "PATCH"
    );
    const payload = JSON.parse((patchCall?.[1] as RequestInit).body as string);

    expect(payload).toEqual(
      expect.objectContaining({
        title: "Updated Artichoke Title",
        summary: "Old summary",
        contentHtml: "Old post body",
        coverImageUrl: "https://example.com/old.jpg",
        category: "Fruit & Veg",
      })
    );

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/posts"));
  });
});
