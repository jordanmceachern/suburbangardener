import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { tutorialId: string; commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const comment = await prisma.tutorialComment.findUnique({
    where: { id: params.commentId },
    select: { tutorialId: true },
  });
  if (!comment || comment.tutorialId !== params.tutorialId) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const payload = await request.json().catch(() => null);
  const type =
    typeof payload === "object" && payload && "type" in payload
      ? String((payload as { type?: unknown }).type || "").toUpperCase()
      : "";
  if (type !== "UP" && type !== "DOWN") {
    return NextResponse.json(
      { error: "Vote type must be UP or DOWN." },
      { status: 400 }
    );
  }

  await prisma.tutorialCommentVote.upsert({
    where: {
      userId_commentId: {
        userId: session.user.id,
        commentId: params.commentId,
      },
    },
    update: { type: type as "UP" | "DOWN" },
    create: {
      userId: session.user.id,
      commentId: params.commentId,
      type: type as "UP" | "DOWN",
    },
  });

  return NextResponse.json({ success: true });
}
