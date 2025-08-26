import { NextRequest, NextResponse } from "next/server";
import { mockArticles } from "../../../mock_data/articles";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  try {
    // In production, this would query your database
    if (process.env.NODE_ENV === "production") {
      // TODO: Replace with actual database query
      // const articles = await db.articles.findMany({
      //   where: {
      //     AND: [
      //       search ? {
      //         OR: [
      //           { title: { contains: search, mode: 'insensitive' } },
      //           { excerpt: { contains: search, mode: 'insensitive' } },
      //           { content: { contains: search, mode: 'insensitive' } },
      //         ]
      //       } : {},
      //       category && category !== 'All Categories' ? { category } : {},
      //     ]
      //   },
      //   skip: offset,
      //   take: limit,
      //   orderBy: { publishedDate: 'desc' }
      // });

      // Return empty data in production until database is properly configured
      // This ensures users don't see unreviewed mock content
      return NextResponse.json({
        articles: [],
        total: 0,
        hasMore: false,
      });
    }

    // Development: Use mock data
    let filteredArticles = [...mockArticles];

    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredArticles = filteredArticles.filter(
        article =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.excerpt.toLowerCase().includes(searchTerm) ||
          article.content?.toLowerCase().includes(searchTerm) ||
          article.author.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (category && category !== "All Categories") {
      filteredArticles = filteredArticles.filter(
        article => article.category === category
      );
    }

    // Sort by published date (most recent first)
    filteredArticles.sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );

    // Apply pagination
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);

    return NextResponse.json({
      articles: paginatedArticles,
      total: filteredArticles.length,
      hasMore: offset + limit < filteredArticles.length,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
