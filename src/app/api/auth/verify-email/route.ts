import { NextResponse } from "next/server";
import { verifyUserEmail } from "@/lib/auth-user";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(
      new URL("/login?mode=signIn&error=invalid-verification-link", request.url)
    );
  }

  const isVerified = await verifyUserEmail({ email, token });

  if (!isVerified) {
    return NextResponse.redirect(
      new URL("/login?mode=signIn&error=verification-link-expired", request.url)
    );
  }

  return NextResponse.redirect(
    new URL("/login?mode=signIn&verified=1", request.url)
  );
}
