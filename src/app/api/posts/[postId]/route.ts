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
  { params }: { params: { postId: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: {
      author: {
        select: { id: true, email: true, name: true },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json({
    post: {
      id: post.id,
      title: post.title,
      summary: post.excerpt,
      excerpt: post.excerpt,
      contentHtml: post.contentHtml,
      coverImageUrl: post.coverUrl,
      coverUrl: post.coverUrl,
      youtubeUrl: post.youtubeUrl,
      category: post.category,
      authorId: post.authorId,
      authorEmail: post.author.email,
      authorName: post.author.name,
      slug: post.slug,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingPost = await prisma.post.findUnique({
    where: { id: params.postId },
    include: {
      author: {
        select: { id: true, email: true },
      },
    },
  });

  if (!existingPost) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const isAuthor = session.user.id === existingPost.authorId;
  const isAdmin = isAdminEmail(session.user.email);

  if (!isAuthor && !isAdmin) {
    return NextResponse.json(
      { error: "You can only edit your own posts or admin posts." },
      { status: 403 }
    );
  }

  try {
    const payload = await request.json();
    const title = sanitizeHtml(String(payload?.title || "")).trim();
    const summary = sanitizeHtml(
      String(payload?.summary || payload?.excerpt || "")
    ).trim();
    const contentHtml = sanitizeHtml(String(payload?.contentHtml || "")).trim();
    const coverImageUrl = String(
      payload?.coverImageUrl || payload?.coverUrl || ""
    ).trim();
    const youtubeUrl = String(
      payload?.youtubeUrl || payload?.videoUrl || ""
    ).trim();
    const sanitizedCategory = sanitizeHtml(
      String(payload?.category || existingPost.category)
    );
    const category =
      normalizeCategoryValue(
        sanitizedCategory.trim() || existingPost.category
      ) || existingPost.category;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }

    if (!summary) {
      return NextResponse.json(
        { error: "Summary is required." },
        { status: 400 }
      );
    }

    if (!contentHtml) {
      return NextResponse.json(
        { error: "Post content is required." },
        { status: 400 }
      );
    }

    if (!coverImageUrl) {
      return NextResponse.json(
        { error: "A cover image URL is required." },
        { status: 400 }
      );
    }

    if (youtubeUrl && !isValidYouTubeUrl(youtubeUrl)) {
      return NextResponse.json(
        { error: "The YouTube URL is invalid." },
        { status: 400 }
      );
    }

    const nextSlugBase = slugify(title) || "post";
    const nextSlug =
      nextSlugBase === existingPost.slug ? existingPost.slug : nextSlugBase;

    const updatedPost = await prisma.post.update({
      where: { id: params.postId },
      data: {
        title,
        excerpt: summary,
        contentHtml,
        coverUrl: coverImageUrl,
        youtubeUrl: youtubeUrl || null,
        category,
        slug: nextSlug,
      },
      include: {
        author: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        summary: updatedPost.excerpt,
        excerpt: updatedPost.excerpt,
        contentHtml: updatedPost.contentHtml,
        coverImageUrl: updatedPost.coverUrl,
        coverUrl: updatedPost.coverUrl,
        youtubeUrl: updatedPost.youtubeUrl,
        category: updatedPost.category,
        authorId: updatedPost.authorId,
        authorEmail: updatedPost.author.email,
        authorName: updatedPost.author.name,
        slug: updatedPost.slug,
      },
    });
  } catch (error) {
    console.error("Failed to update Post:", error);
    return NextResponse.json(
      { error: "Failed to update Post." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { postId: string } }
) {
  return PATCH(request, context);
}
