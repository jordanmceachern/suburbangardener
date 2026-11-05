import { NextResponse } from "next/server";
import { getCredentialFailureReason } from "@/lib/auth-user";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required.", valid: false },
        { status: 400 }
      );
    }

    const failureReason = await getCredentialFailureReason({ email, password });

    if (failureReason) {
      return NextResponse.json(
        { error: failureReason, valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to validate credentials right now.",
        valid: false,
      },
      { status: 400 }
    );
  }
}
