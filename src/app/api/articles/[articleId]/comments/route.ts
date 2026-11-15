import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { sanitizeHtml } from "@/lib/articleSecurity";
import { prisma } from "@/lib/prisma";

function mapComment(comment: any) {
  return {
    id: comment.id,
    articleId: comment.articleId,
    author: comment.author?.email
      ? comment.author.email.split("@")[0]
      : comment.author?.name || "Anonymous",
    bodyHtml: comment.bodyHtml,
    createdAt: comment.createdAt.toISOString(),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: { articleId: string } }
) {
  const article = await prisma.article.findUnique({
    where: { id: params.articleId },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const comments = await prisma.comment.findMany({
    where: { articleId: params.articleId },
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
  { params }: { params: { articleId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const article = await prisma.article.findUnique({
    where: { id: params.articleId },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  let payload: any;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const bodyHtml = sanitizeHtml(String(payload?.bodyHtml || "")).trim();

  if (!bodyHtml) {
    return NextResponse.json(
      { error: "Comment body is required." },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      articleId: params.articleId,
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
