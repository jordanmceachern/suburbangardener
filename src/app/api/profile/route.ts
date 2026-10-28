import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getUserProfile, upsertUserProfile } from "@/lib/profile";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getUserProfile(session.user.id);

  return NextResponse.json(
    profile ?? {
      userId: session.user.id,
      preferences: {},
      progress: {},
      cart: {},
    },
  );
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Profile payload must be an object" }, { status: 400 });
  }

  const profile = await upsertUserProfile(session.user.id, payload);

  return NextResponse.json(profile);
}
