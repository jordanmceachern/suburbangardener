import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  isAdminEmail,
  isValidYouTubeUrl,
  normalizeCategoryValue,
  sanitizeHtml,
} from "@/lib/postSecurity";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  const tutorial = await prisma.tutorial.findUnique({
    where: { id: params.tutorialId },
    include: { author: { select: { id: true, email: true, name: true } } },
  });

  if (!tutorial) {
    return NextResponse.json({ error: "Tutorial not found." }, { status: 404 });
  }

  return NextResponse.json({
    tutorial: {
      id: tutorial.id,
      title: tutorial.title,
      summary: tutorial.excerpt,
      excerpt: tutorial.excerpt,
      contentHtml: tutorial.contentHtml,
      coverImageUrl: tutorial.coverUrl,
      coverUrl: tutorial.coverUrl,
      youtubeUrl: tutorial.youtubeUrl,
      category: tutorial.category,
      authorId: tutorial.authorId,
      authorEmail: tutorial.author.email,
      authorName: tutorial.author.name,
      slug: tutorial.slug,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json(
      { error: "Only the administrator can edit tutorials." },
      { status: 403 }
    );
  }

  const existing = await prisma.tutorial.findUnique({
    where: { id: params.tutorialId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Tutorial not found." }, { status: 404 });
  }

  try {
    const payload = await request.json();
    const title = sanitizeHtml(String(payload?.title || "")).trim();
    const summary = sanitizeHtml(
      String(payload?.summary || payload?.excerpt || "")
    ).trim();
    const contentHtml = sanitizeHtml(String(payload?.contentHtml || "")).trim();
    const coverUrl = String(
      payload?.coverImageUrl || payload?.coverUrl || ""
    ).trim();
    const youtubeUrl = String(
      payload?.youtubeUrl || payload?.videoUrl || ""
    ).trim();
    const category =
      normalizeCategoryValue(
        sanitizeHtml(String(payload?.category || existing.category)).trim() ||
          existing.category
      ) || existing.category;

    if (!title)
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    if (!summary)
      return NextResponse.json(
        { error: "Summary is required." },
        { status: 400 }
      );
    if (!contentHtml)
      return NextResponse.json(
        { error: "Tutorial content is required." },
        { status: 400 }
      );
    if (!coverUrl)
      return NextResponse.json(
        { error: "A cover image URL is required." },
        { status: 400 }
      );
    if (youtubeUrl && !isValidYouTubeUrl(youtubeUrl))
      return NextResponse.json(
        { error: "The YouTube URL is invalid." },
        { status: 400 }
      );

    const nextSlugBase = slugify(title) || "tutorial";
    const nextSlug =
      nextSlugBase === existing.slug ? existing.slug : nextSlugBase;

    const updated = await prisma.tutorial.update({
      where: { id: params.tutorialId },
      data: {
        title,
        excerpt: summary,
        contentHtml,
        coverUrl,
        youtubeUrl: youtubeUrl || null,
        category,
        slug: nextSlug,
      },
      include: { author: { select: { id: true, email: true, name: true } } },
    });

    return NextResponse.json({ success: true, tutorial: updated });
  } catch (error) {
    console.error("Failed to update tutorial:", error);
    return NextResponse.json(
      { error: "Failed to update tutorial." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { tutorialId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json(
      { error: "Only the administrator can delete tutorials." },
      { status: 403 }
    );
  }

  try {
    await prisma.tutorial.delete({ where: { id: params.tutorialId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Tutorial not found or could not be deleted." },
      { status: 404 }
    );
  }
}
