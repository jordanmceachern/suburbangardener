import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isValidYouTubeUrl,
  maskDisplayName,
  normalizeCategoryValue,
  sanitizeHtml,
} from "@/lib/postSecurity";

type PostMapEntry = {
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
  votes?: Array<{ type: "UP" | "DOWN" }>;
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

function mapPost(Post: PostMapEntry) {
  const publishedDate = Post.publishedAt ?? Post.createdAt ?? new Date();
  const votes = Array.isArray(Post.votes) ? Post.votes : [];
  const voteScore = votes.reduce((total: number, vote) => {
    if (vote.type === "UP") return total + 1;
    if (vote.type === "DOWN") return total - 1;
    return total;
  }, 0);

  return {
    id: Post.id,
    title: Post.title,
    excerpt: Post.excerpt || "",
    summary: Post.excerpt || "",
    publishedDate: formatDate(publishedDate),
    author: maskDisplayName(
      Post.author?.email || Post.author?.name || "Anonymous"
    ),
    authorEmail: Post.author?.email || "",
    authorId: Post.authorId || Post.author?.id || "",
    slug: Post.slug,
    imageUrl: Post.coverUrl || "",
    youtubeUrl: Post.youtubeUrl || "",
    videoUrl: Post.youtubeUrl || "",
    category: Post.category || "General",
    content: Post.contentHtml || "",
    contentHtml: Post.contentHtml || "",
    voteScore,
    voteCount: votes.length,
  };
}

async function fetchPostListFromDb(
  search: string,
  category: string,
  limit: number,
  offset: number
) {
  const where: Prisma.PostWhereInput = {};

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

  const [Posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, email: true, name: true },
        },
        votes: {
          select: { type: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    Posts: Posts.map(mapPost),
    total,
    hasMore: offset + Posts.length < total,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "20"));
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0"));
  const search = sanitizeHtml(searchParams.get("search") || "");
  const category = sanitizeHtml(searchParams.get("category") || "");

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error:
            "The Post database is currently unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    const dbPosts = await fetchPostListFromDb(search, category, limit, offset);

    return NextResponse.json(dbPosts);
  } catch (error) {
    console.error("Could not load Posts from the database:", error);
    return NextResponse.json(
      {
        error:
          "The Post database is currently unavailable. Please try again later.",
      },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      String(payload?.category || "General")
    );
    const category =
      normalizeCategoryValue(sanitizedCategory.trim() || "General") ||
      "General";

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

    const PostBaseSlug = slugify(title) || "Post";
    const existingSlugs = await prisma.post.findMany({
      where: {
        slug: {
          startsWith: PostBaseSlug,
        },
      },
      select: {
        slug: true,
      },
    });

    const usedSlugs = new Set(
      existingSlugs.map((item: { slug: string }) => item.slug)
    );
    let slug = PostBaseSlug;

    for (let suffix = 2; usedSlugs.has(slug); suffix += 1) {
      slug = `${PostBaseSlug}-${suffix}`;
    }

    const Post = await prisma.post.create({
      data: {
        title,
        excerpt: summary,
        contentHtml,
        coverUrl: coverImageUrl,
        youtubeUrl: youtubeUrl || null,
        category,
        slug,
        authorId: session.user.id,
        publishedAt: new Date(),
      },
      include: {
        author: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        Post: mapPost(Post),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create Post:", error);
    return NextResponse.json(
      { error: "Failed to create Post." },
      { status: 500 }
    );
  }
}
