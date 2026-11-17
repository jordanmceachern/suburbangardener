import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sanitizeHtml } from "@/lib/postSecurity";
import { prisma } from "@/lib/prisma";

type CommentMapEntry = {
  id: string;
  PostId: string;
  bodyHtml: string;
  createdAt: Date | string;
  author?: { email?: string | null; name?: string | null } | null;
};

function mapComment(comment: CommentMapEntry) {
  return {
    id: comment.id,
    PostId: comment.PostId,
    author: comment.author?.email
      ? comment.author.email.split("@")[0]
      : comment.author?.name || "Anonymous",
    bodyHtml: comment.bodyHtml,
    createdAt:
      comment.createdAt instanceof Date
        ? comment.createdAt.toISOString()
        : new Date(comment.createdAt).toISOString(),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: { postId: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comments = await prisma.comment.findMany({
    where: { PostId: params.postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: { email: true, name: true },
      },
    },
  });

  return NextResponse.json({ comments: comments.map(mapComment) });
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

  const bodyHtml = sanitizeHtml(
    typeof payload === "object" && payload && "bodyHtml" in payload
      ? String((payload as { bodyHtml?: unknown }).bodyHtml || "")
      : ""
  ).trim();

  if (!bodyHtml) {
    return NextResponse.json(
      { error: "Comment body is required." },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      PostId: params.postId,
      authorId: session.user.id,
      bodyHtml,
    },
    include: {
      author: {
        select: { email: true, name: true },
      },
    },
  });

  return NextResponse.json({ comment: mapComment(comment) }, { status: 201 });
}
