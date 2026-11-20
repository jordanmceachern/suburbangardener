import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sanitizeHtml } from "@/lib/postSecurity";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  const tutorial = await prisma.tutorial.findUnique({
    where: { id: params.tutorialId },
  });
  if (!tutorial)
    return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });

  const comments = await prisma.tutorialComment.findMany({
    where: { tutorialId: params.tutorialId, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { email: true, name: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { email: true, name: true } } },
      },
    },
  });

  return NextResponse.json({
    comments: comments.map(comment => ({
      id: comment.id,
      author: comment.author.email
        ? comment.author.email.split("@")[0]
        : comment.author.name || "Anonymous",
      bodyHtml: comment.bodyHtml,
      createdAt: comment.createdAt.toISOString(),
      parentId: null,
      replies: comment.replies.map(reply => ({
        id: reply.id,
        author: reply.author.email
          ? reply.author.email.split("@")[0]
          : reply.author.name || "Anonymous",
        bodyHtml: reply.bodyHtml,
        createdAt: reply.createdAt.toISOString(),
        parentId: reply.parentId,
      })),
    })),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tutorial = await prisma.tutorial.findUnique({
    where: { id: params.tutorialId },
  });
  if (!tutorial)
    return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });

  const payload = await request.json().catch(() => null);
  const bodyHtml = sanitizeHtml(
    typeof payload === "object" && payload && "bodyHtml" in payload
      ? String((payload as { bodyHtml?: unknown }).bodyHtml || "")
      : ""
  ).trim();
  if (!bodyHtml)
    return NextResponse.json(
      { error: "Comment body is required." },
      { status: 400 }
    );

  const parentId =
    typeof payload === "object" && payload && "parentId" in payload
      ? String((payload as { parentId?: unknown }).parentId || "").trim()
      : "";

  if (parentId) {
    const parent = await prisma.tutorialComment.findUnique({
      where: { id: parentId },
      select: { tutorialId: true, parentId: true },
    });

    if (!parent || parent.tutorialId !== params.tutorialId) {
      return NextResponse.json(
        { error: "Reply target not found on this tutorial." },
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

  const comment = await prisma.tutorialComment.create({
    data: {
      tutorialId: params.tutorialId,
      authorId: session.user.id,
      parentId: parentId || null,
      bodyHtml,
    },
  });

  return NextResponse.json({ comment: { id: comment.id } }, { status: 201 });
}
