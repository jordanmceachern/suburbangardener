import bcrypt from "bcryptjs";
import { render, screen } from "@testing-library/react";
import HomePage from "../src/app/page";
import {
  createUserWithPassword,
  verifyUserCredentials,
} from "../src/lib/auth-user";

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

  it("verifies valid credentials and rejects invalid ones", async () => {
    prismaUser.findUnique.mockResolvedValue({
      id: "user_456",
      email: "grower@example.com",
      name: "Grower",
      passwordHash: bcrypt.hashSync("gardenpass", 12),
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

    const invalidUser = await verifyUserCredentials({
      email: "grower@example.com",
      password: "wrongpass",
    });

    expect(invalidUser).toBeNull();
  });

  it("shows a single login CTA on the home page", () => {
    render(<HomePage />);

    const loginLinks = screen.getAllByRole("link", { name: /log in|login/i });

    expect(loginLinks).toHaveLength(1);
    expect(loginLinks[0]).toHaveAttribute("href", "/login");
  });
});
