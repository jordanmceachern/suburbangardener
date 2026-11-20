import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isAdminEmail,
  isValidYouTubeUrl,
  maskDisplayName,
  normalizeCategoryValue,
  sanitizeHtml,
} from "@/lib/postSecurity";

type TutorialMapEntry = {
  id: string;
  title: string;
  excerpt?: string | null;
  createdAt: Date | string;
  publishedAt?: Date | string | null;
  coverUrl?: string | null;
  youtubeUrl?: string | null;
  category?: string | null;
  contentHtml?: string | null;
  slug: string;
  authorId?: string | null;
  author?: {
    id?: string | null;
    email?: string | null;
    name?: string | null;
  } | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function mapTutorial(tutorial: TutorialMapEntry) {
  return {
    id: tutorial.id,
    title: tutorial.title,
    excerpt: tutorial.excerpt || "",
    summary: tutorial.excerpt || "",
    publishedDate: formatDate(tutorial.publishedAt ?? tutorial.createdAt),
    author: maskDisplayName(
      tutorial.author?.email || tutorial.author?.name || "Anonymous"
    ),
    authorEmail: tutorial.author?.email || "",
    authorId: tutorial.authorId || tutorial.author?.id || "",
    slug: tutorial.slug,
    imageUrl: tutorial.coverUrl || "",
    youtubeUrl: tutorial.youtubeUrl || "",
    category: tutorial.category || "General",
    content: tutorial.contentHtml || "",
    contentHtml: tutorial.contentHtml || "",
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "20"));
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0"));
  const search = sanitizeHtml(searchParams.get("search") || "");
  const category = sanitizeHtml(searchParams.get("category") || "");

  const where: Prisma.TutorialWhereInput = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { contentHtml: { contains: search, mode: "insensitive" } },
      { author: { email: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (category && category !== "All Categories") {
    where.category = category;
  }

  try {
    const [tutorials, total] = await Promise.all([
      prisma.tutorial.findMany({
        where,
        include: { author: { select: { id: true, email: true, name: true } } },
        orderBy: { publishedAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.tutorial.count({ where }),
    ]);

    return NextResponse.json({
      tutorials: tutorials.map(mapTutorial),
      total,
      hasMore: offset + tutorials.length < total,
    });
  } catch (error) {
    console.error("Could not load tutorials:", error);
    return NextResponse.json(
      { error: "The tutorial database is unavailable." },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json(
      { error: "Only the administrator can create tutorials." },
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
    const coverUrl = String(
      payload?.coverImageUrl || payload?.coverUrl || ""
    ).trim();
    const youtubeUrl = String(
      payload?.youtubeUrl || payload?.videoUrl || ""
    ).trim();
    const category =
      normalizeCategoryValue(
        sanitizeHtml(String(payload?.category || "General")).trim() || "General"
      ) || "General";

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

    const baseSlug = slugify(title) || "tutorial";
    const existing = await prisma.tutorial.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    });
    const used = new Set(existing.map(item => item.slug));
    let slug = baseSlug;
    for (let suffix = 2; used.has(slug); suffix += 1)
      slug = `${baseSlug}-${suffix}`;

    const tutorial = await prisma.tutorial.create({
      data: {
        title,
        excerpt: summary,
        contentHtml,
        coverUrl,
        youtubeUrl: youtubeUrl || null,
        category,
        slug,
        authorId: session.user.id,
        publishedAt: new Date(),
      } as any,
      include: { author: { select: { id: true, email: true, name: true } } },
    });

    return NextResponse.json(
      { success: true, tutorial: mapTutorial(tutorial) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create tutorial:", error);
    return NextResponse.json(
      { error: "Failed to create tutorial." },
      { status: 500 }
    );
  }
}
