import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sanitizeHtml } from "@/lib/postSecurity";
import { prisma } from "@/lib/prisma";

type CommentMapEntry = {
  id: string;
  postId: string;
  bodyHtml: string;
  createdAt: Date | string;
  author?: { email?: string | null; name?: string | null } | null;
  parentId?: string | null;
  replies?: CommentMapEntry[];
  authorId?: string;
};

type MappedComment = {
  id: string;
  postId: string;
  authorId: string | null;
  author: string;
  bodyHtml: string;
  parentId: string | null;
  createdAt: string;
  replies: MappedComment[];
};

function mapComment(comment: CommentMapEntry): MappedComment {
  return {
    id: comment.id,
    postId: comment.postId,
    authorId: comment.authorId || null,
    author: comment.author?.email
      ? comment.author.email.split("@")[0]
      : comment.author?.name || "Anonymous",
    bodyHtml: comment.bodyHtml,
    parentId: comment.parentId ?? null,
    createdAt:
      comment.createdAt instanceof Date
        ? comment.createdAt.toISOString()
        : new Date(comment.createdAt).toISOString(),
    replies: Array.isArray(comment.replies)
      ? comment.replies.map(mapComment)
      : [],
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
    where: { postId: params.postId, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, email: true, name: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, email: true, name: true } } },
      },
    },
  });

  const mappedComments = comments.map(comment => ({
    id: comment.id,
    postId: comment.postId,
    authorId: comment.authorId || null,
    author: comment.author?.email
      ? comment.author.email.split("@")[0]
      : comment.author?.name || "Anonymous",
    bodyHtml: comment.bodyHtml,
    parentId: null,
    createdAt:
      comment.createdAt instanceof Date
        ? comment.createdAt.toISOString()
        : new Date(comment.createdAt).toISOString(),
    replies: comment.replies.map(reply => ({
      id: reply.id,
      postId: reply.postId,
      author: reply.author?.email
        ? reply.author.email.split("@")[0]
        : reply.author?.name || "Anonymous",
      bodyHtml: reply.bodyHtml,
      parentId: reply.parentId,
      authorId: reply.authorId,
      createdAt:
        reply.createdAt instanceof Date
          ? reply.createdAt.toISOString()
          : new Date(reply.createdAt).toISOString(),
    })),
  }));

  return NextResponse.json({ comments: mappedComments });
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

  const parentId =
    typeof payload === "object" && payload && "parentId" in payload
      ? String((payload as { parentId?: unknown }).parentId || "").trim()
      : "";

  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
      select: { postId: true, parentId: true },
    });

    if (!parent || parent.postId !== params.postId) {
      return NextResponse.json(
        { error: "Reply target not found on this post." },
        { status: 400 }
      );
    }

    if (parent.parentId) {
      return NextResponse.json(
        { error: "Replies can only be added to top-level comments." },
        { status: 400 }
      );
    }
  }

  const comment = await prisma.comment.create({
    data: {
      postId: params.postId,
      authorId: session.user.id,
      parentId: parentId || null,
      bodyHtml,
    },
    include: {
      author: {
        select: { id: true, email: true, name: true },
      },
    },
  });

  return NextResponse.json({ comment: mapComment(comment) }, { status: 201 });
}
