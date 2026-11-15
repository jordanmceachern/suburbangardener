import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isValidYouTubeUrl,
  maskDisplayName,
  sanitizeHtml,
} from "@/lib/articleSecurity";

type ArticleMapEntry = {
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
  author?: { email?: string | null; name?: string | null } | null;
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

function mapArticle(article: ArticleMapEntry) {
  const publishedDate = article.publishedAt ?? article.createdAt ?? new Date();
  const votes = Array.isArray(article.votes) ? article.votes : [];
  const voteScore = votes.reduce((total: number, vote) => {
    if (vote.type === "UP") return total + 1;
    if (vote.type === "DOWN") return total - 1;
    return total;
  }, 0);

  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt || "",
    summary: article.excerpt || "",
    publishedDate: formatDate(publishedDate),
    author: maskDisplayName(
      article.author?.email || article.author?.name || "Anonymous"
    ),
    slug: article.slug,
    imageUrl: article.coverUrl || "",
    youtubeUrl: article.youtubeUrl || "",
    videoUrl: article.youtubeUrl || "",
    category: article.category || "General",
    content: article.contentHtml || "",
    contentHtml: article.contentHtml || "",
    voteScore,
    voteCount: votes.length,
  };
}

async function fetchArticleListFromDb(
  search: string,
  category: string,
  limit: number,
  offset: number
) {
  const where: Prisma.ArticleWhereInput = {};

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

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: {
          select: { email: true, name: true },
        },
        votes: {
          select: { type: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles: articles.map(mapArticle),
    total,
    hasMore: offset + articles.length < total,
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
            "The article database is currently unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    const dbArticles = await fetchArticleListFromDb(
      search,
      category,
      limit,
      offset
    );

    return NextResponse.json(dbArticles);
  } catch (error) {
    console.error("Could not load articles from the database:", error);
    return NextResponse.json(
      {
        error:
          "The article database is currently unavailable. Please try again later.",
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
    const category =
      sanitizeHtml(String(payload?.category || "General")).trim() || "General";

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
        { error: "Article content is required." },
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

    const articleBaseSlug = slugify(title) || "article";
    const existingSlugs = await prisma.article.findMany({
      where: {
        slug: {
          startsWith: articleBaseSlug,
        },
      },
      select: {
        slug: true,
      },
    });

    const usedSlugs = new Set(existingSlugs.map(item => item.slug));
    let slug = articleBaseSlug;

    for (let suffix = 2; usedSlugs.has(slug); suffix += 1) {
      slug = `${articleBaseSlug}-${suffix}`;
    }

    const article = await prisma.article.create({
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
          select: { email: true, name: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        article: mapArticle(article),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create article:", error);
    return NextResponse.json(
      { error: "Failed to create article." },
      { status: 500 }
    );
  }
}
