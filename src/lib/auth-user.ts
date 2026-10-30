import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

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

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      name: name?.trim() || null,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
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
