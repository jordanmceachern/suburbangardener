import { prisma } from "@/lib/prisma";

export type UserProfileRecord = {
  id: string;
  userId: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  preferences?: Record<string, unknown> | null;
  progress?: Record<string, unknown> | unknown[] | null;
  cart?: Record<string, unknown> | unknown[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileInput = {
  displayName?: string;
  avatarUrl?: string;
  preferences?: Record<string, unknown>;
  progress?: Record<string, unknown> | unknown[];
  cart?: Record<string, unknown> | unknown[];
};

const MAX_DISPLAY_NAME_LENGTH = 80;
const MAX_PROFILE_JSON_BYTES = 25000;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isJsonPayload(
  value: unknown
): value is Record<string, unknown> | unknown[] {
  return typeof value === "object" && value !== null;
}

function sanitizeJsonField(value: unknown) {
  if (!isJsonPayload(value)) {
    return undefined;
  }

  try {
    const serialized = JSON.stringify(value);
    if (serialized.length > MAX_PROFILE_JSON_BYTES) {
      return undefined;
    }

    return JSON.parse(serialized) as Record<string, unknown> | unknown[];
  } catch {
    return undefined;
  }
}

export function sanitizeProfileInput(input: unknown): Partial<ProfileInput> {
  if (!isPlainObject(input)) {
    return {};
  }

  const sanitized: Partial<ProfileInput> = {};

  const displayName =
    typeof input.displayName === "string"
      ? input.displayName.trim()
      : undefined;
  if (
    displayName &&
    displayName.length > 0 &&
    displayName.length <= MAX_DISPLAY_NAME_LENGTH
  ) {
    sanitized.displayName = displayName;
  }

  const avatarUrl =
    typeof input.avatarUrl === "string" ? input.avatarUrl.trim() : undefined;
  if (avatarUrl) {
    try {
      const parsed = new URL(avatarUrl);
      if (["http:", "https:"].includes(parsed.protocol)) {
        sanitized.avatarUrl = parsed.toString();
      }
    } catch {
      // Ignore malformed URLs
    }
  }

  const preferences = sanitizeJsonField(input.preferences);
  if (preferences && isPlainObject(preferences)) {
    sanitized.preferences = preferences;
  }

  const progress = sanitizeJsonField(input.progress);
  if (progress) {
    sanitized.progress = progress;
  }

  const cart = sanitizeJsonField(input.cart);
  if (cart) {
    sanitized.cart = cart;
  }

  return sanitized;
}

export async function getUserProfile(userId: string) {
  if (!userId) {
    return null;
  }

  return prisma.userProfile.findUnique({
    where: { userId },
  });
}

export async function upsertUserProfile(userId: string, input: unknown) {
  if (!userId) {
    throw new Error("User ID is required to store a profile.");
  }

  const payload = sanitizeProfileInput(input);

  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    return prisma.userProfile.create({
      data: {
        userId,
        ...(payload as any),
      },
    });
  }

  return prisma.userProfile.update({
    where: { userId },
    data: payload as any,
  });
}
