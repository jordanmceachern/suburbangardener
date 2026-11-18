import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getVoteSummary(postId: string, userId?: string) {
  const [upvotes, downvotes, userVote] = await Promise.all([
    prisma.vote.count({ where: { PostId: postId, type: "UP" } }),
    prisma.vote.count({ where: { PostId: postId, type: "DOWN" } }),
    userId
      ? prisma.vote.findUnique({
          where: { userId_PostId: { userId, PostId: postId } },
          select: { type: true },
        })
      : null,
  ]);

  return { upvotes, downvotes, userVote: userVote?.type ?? null };
}

export async function GET(
  _request: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);

  return NextResponse.json(
    await getVoteSummary(params.postId, session?.user?.id)
  );
}

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

  // One vote per user and post: voting the other way replaces the previous vote.
  await prisma.vote.upsert({
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

  return NextResponse.json(
    await getVoteSummary(params.postId, session.user.id)
  );
}
