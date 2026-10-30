import bcrypt from "bcryptjs";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HomePage from "../src/app/page";
import LoginPage from "../src/app/login/page";
import {
  createUserWithPassword,
  getCredentialFailureReason,
  verifyUserCredentials,
} from "../src/lib/auth-user";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

const { signIn } = jest.requireMock("next-auth/react");

jest.mock("../src/lib/prisma", () => {
  const mockPrismaUser = {
    findUnique: jest.fn(),
    create: jest.fn(),
  };

  return {
    prisma: {
      user: mockPrismaUser,
    },
    __mockPrismaUser: mockPrismaUser,
  };
});

const { __mockPrismaUser: prismaUser } = jest.requireMock("../src/lib/prisma");

describe("credentials auth flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user with a hashed password and rejects duplicate emails", async () => {
    prismaUser.findUnique.mockResolvedValue(null);
    prismaUser.create.mockResolvedValue({
      id: "user_123",
      email: "gardener@example.com",
      name: null,
      passwordHash: "hashed-value",
    });

    const user = await createUserWithPassword({
      email: "gardener@example.com",
      password: "gardenpass",
    });

    expect(user).toMatchObject({
      id: "user_123",
      email: "gardener@example.com",
      name: null,
    });
    expect(prismaUser.create).toHaveBeenCalledTimes(1);

    const args = prismaUser.create.mock.calls[0][0];
    expect(args.data.email).toBe("gardener@example.com");
    expect(args.data.passwordHash).not.toBe("gardenpass");

    prismaUser.findUnique.mockResolvedValue({ id: "existing-user" });

    await expect(
      createUserWithPassword({
        email: "gardener@example.com",
        password: "gardenpass",
      })
    ).rejects.toThrow("already exists");
  });

  it("verifies valid credentials and rejects invalid or unverified ones", async () => {
    prismaUser.findUnique.mockResolvedValue({
      id: "user_456",
      email: "grower@example.com",
      name: "Grower",
      passwordHash: bcrypt.hashSync("gardenpass", 12),
      emailVerified: new Date("2024-01-01T00:00:00.000Z"),
    });

    const validUser = await verifyUserCredentials({
      email: "grower@example.com",
      password: "gardenpass",
    });

    expect(validUser).toMatchObject({
      id: "user_456",
      email: "grower@example.com",
      name: "Grower",
    });

    prismaUser.findUnique.mockResolvedValue({
      id: "user_789",
      email: "pending@example.com",
      name: "Pending",
      passwordHash: bcrypt.hashSync("gardenpass", 12),
      emailVerified: null,
    });

    const unverifiedUser = await verifyUserCredentials({
      email: "pending@example.com",
      password: "gardenpass",
    });

    expect(unverifiedUser).toBeNull();

    const invalidUser = await verifyUserCredentials({
      email: "grower@example.com",
      password: "wrongpass",
    });

    expect(invalidUser).toBeNull();
  });

  it("explains why an email or password is invalid", async () => {
    prismaUser.findUnique.mockResolvedValue(null);

    await expect(
      getCredentialFailureReason({
        email: "missing@example.com",
        password: "gardenpass",
      })
    ).resolves.toBe("No account was found for that email.");

    prismaUser.findUnique.mockResolvedValue({
      id: "user_999",
      email: "grower@example.com",
      name: "Grower",
      passwordHash: bcrypt.hashSync("gardenpass", 12),
      emailVerified: new Date("2024-01-01T00:00:00.000Z"),
    });

    await expect(
      getCredentialFailureReason({
        email: "grower@example.com",
        password: "wrongpass",
      })
    ).resolves.toBe("The password is incorrect.");
  });

  it("validates credentials via the server before signing in", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ valid: true }),
    }) as jest.Mock;
    signIn.mockResolvedValue({ ok: true, url: "/dashboard" });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "grower@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "gardenpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/check-credentials",
        expect.objectContaining({
          method: "POST",
        })
      );
    });

    expect(signIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({
        email: "grower@example.com",
        password: "gardenpass",
        redirect: false,
      })
    );
  });

  it("shows a single login CTA on the home page", () => {
    render(<HomePage />);

    const loginLinks = screen.getAllByRole("link", { name: /log in|login/i });

    expect(loginLinks).toHaveLength(1);
    expect(loginLinks[0]).toHaveAttribute("href", "/login");
  });

  it("renders the branded logo and auth heading on the login page", () => {
    render(<LoginPage />);

    expect(
      screen.getByLabelText(/suburban gardener logo/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();
  });

  it("makes only the action phrase clickable in the auth toggle", () => {
    render(<LoginPage />);

    const toggleText = screen.getByText(/need an account\?/i);
    expect(toggleText).toBeInTheDocument();
    expect(toggleText).toHaveTextContent("Need an account?");

    const actionButton = screen.getByRole("button", { name: /create one/i });
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveTextContent("Create one");

    expect(
      screen.queryByRole("button", { name: /need an account\? create one/i })
    ).not.toBeInTheDocument();
  });

  it("disables create account when the email already exists and shows a helper message", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "An account with that email already exists.",
      }),
    }) as jest.Mock;

    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: /create one/i }));
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "gardenpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /create account/i })
      ).toBeDisabled();
    });

    expect(
      screen.getByText(/an account with this email already exists/i)
    ).toBeInTheDocument();
  });

  it("shows a verification step after a successful sign-up and allows resending", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    }) as jest.Mock;

    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: /create one/i }));
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "gardenpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/verification link/i)).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /resend verification email/i })
    ).toBeInTheDocument();
  });
});
