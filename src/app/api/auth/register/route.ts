import { NextResponse } from "next/server";
import { createUserWithPassword } from "@/lib/auth-user";
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

    const user = await createUserWithPassword({
      email,
      password,
      name,
    });

    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "http://localhost:4000";

    const emailResult = await sendVerificationEmail({
      email: user.email,
      name: user.name || user.email,
      verificationUrl: `${appBaseUrl}/login?mode=signUp&email=${encodeURIComponent(user.email)}`,
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
