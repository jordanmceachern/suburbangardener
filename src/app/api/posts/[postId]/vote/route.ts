import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const voteType = (
    typeof payload === "object" && payload && "type" in payload
      ? String((payload as { type?: unknown }).type || "")
      : ""
  ).toUpperCase();

  if (voteType !== "UP" && voteType !== "DOWN") {
    return NextResponse.json(
      { error: "Vote type must be UP or DOWN." },
      { status: 400 }
    );
  }

  const vote = await prisma.vote.upsert({
    where: {
      userId_PostId: {
        userId: session.user.id,
        PostId: params.postId,
      },
    },
    update: { type: voteType },
    create: {
      userId: session.user.id,
      PostId: params.postId,
      type: voteType,
    },
  });

  return NextResponse.json({ vote: { id: vote.id, type: vote.type } });
}
