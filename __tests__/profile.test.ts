import { sanitizeProfileInput } from "../src/lib/profile";

describe("profile sanitization", () => {
  it("normalizes and strips unsafe profile fields", () => {
    const result = sanitizeProfileInput({
      displayName: "   Alice Garden   ",
      avatarUrl: "https://example.com/avatar.png",
      preferences: { theme: "dark", notifications: true },
      progress: { tools: ["composting-101"] },
      cart: { items: [{ id: "seed-kit", qty: 2 }] },
      userId: "attacker-user-id",
      admin: true,
    });

    expect(result).toEqual({
      displayName: "Alice Garden",
      avatarUrl: "https://example.com/avatar.png",
      preferences: { theme: "dark", notifications: true },
      progress: { tools: ["composting-101"] },
      cart: { items: [{ id: "seed-kit", qty: 2 }] },
    });
  });

  it("rejects invalid display names and oversized payloads", () => {
    const invalid = sanitizeProfileInput({
      displayName: "",
      progress: { huge: "x".repeat(200000) },
    });

    expect(invalid.displayName).toBeUndefined();
    expect(invalid.progress).toBeUndefined();
  });
});
