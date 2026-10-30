import { NextResponse } from "next/server";
import {
  createUserWithPassword,
  generateVerificationToken,
  hashVerificationToken,
} from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/emailService";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "http://localhost:4000";

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: "An account with that email already exists." },
          { status: 400 }
        );
      }

      const verificationToken = generateVerificationToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          emailVerificationToken: hashVerificationToken(verificationToken),
          emailVerificationExpires: expiresAt,
        },
      });

      const emailResult = await sendVerificationEmail({
        email: existingUser.email,
        name: existingUser.name || existingUser.email,
        verificationUrl: `${appBaseUrl}/api/auth/verify-email?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(existingUser.email)}`,
      });

      if (!emailResult.success) {
        return NextResponse.json(
          {
            error:
              "We could not send the verification email. Please check your email address or try again in a moment.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        resent: true,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    }

    const user = await createUserWithPassword({
      email: normalizedEmail,
      password,
      name,
    });

    const emailResult = await sendVerificationEmail({
      email: user.email,
      name: user.name || user.email,
      verificationUrl: `${appBaseUrl}/api/auth/verify-email?token=${encodeURIComponent(user.verificationToken || "")}&email=${encodeURIComponent(user.email)}`,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          error:
            "We could not send the verification email. Please check your email address or try again in a moment.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create account right now.",
      },
      { status: 400 }
    );
  }
}
