import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  verificationToken?: string;
};

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashVerificationToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createUserWithPassword({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthUser> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error("An account with that email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verificationToken = generateVerificationToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      name: name?.trim() || null,
      emailVerificationToken: hashVerificationToken(verificationToken),
      emailVerificationExpires: expiresAt,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    verificationToken,
  };
}

export async function verifyUserEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !user.emailVerificationToken || !user.emailVerificationExpires) {
    return false;
  }

  if (new Date() > new Date(user.emailVerificationExpires)) {
    return false;
  }

  const hashedToken = hashVerificationToken(token);

  if (user.emailVerificationToken !== hashedToken) {
    return false;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  return true;
}

export async function getCredentialFailureReason({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string | null> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return "Email is required.";
  }

  if (!password) {
    return "Password is required.";
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return "No account was found for that email.";
  }

  if (!user.passwordHash) {
    return "This account does not have a password set.";
  }

  if (!user.emailVerified) {
    return "Please verify your email before signing in. Check your inbox for the confirmation link.";
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return "The password is incorrect.";
  }

  return null;
}

export async function verifyUserCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthUser | null> {
  const failureReason = await getCredentialFailureReason({ email, password });

  if (failureReason) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
