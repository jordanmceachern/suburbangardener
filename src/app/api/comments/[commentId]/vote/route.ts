import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: params.commentId },
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
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
      userId_commentId: {
        userId: session.user.id,
        commentId: params.commentId,
      },
    },
    update: { type: voteType },
    create: {
      userId: session.user.id,
      commentId: params.commentId,
      type: voteType,
    },
  });

  return NextResponse.json({ vote: { id: vote.id, type: vote.type } });
}
