"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BackgroundImage from "@/components/BackgroundImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import ArticleSidebar from "@/components/articles/ArticleSidebar";
import ArticleComments from "@/components/articles/ArticleComments";
import ViewAllArticlesButton from "@/components/articles/ViewAllArticlesButton";
import { articleDetailStyles, cn } from "@/lib/tailwind";

type ArticleRecord = {
  id: string;
  title: string;
  excerpt: string;
  summary?: string;
  publishedDate: string;
  author: string;
  slug: string;
  imageUrl: string;
  youtubeUrl?: string;
  category: string;
  content?: string;
  contentHtml?: string;
  voteScore?: number;
  voteCount?: number;
};

function getEmbedUrl(youtubeUrl: string) {
  try {
    const url = new URL(youtubeUrl);

    if (url.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${url.pathname.replace("/", "")}`;
    }

    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return youtubeUrl;
  } catch {
    return youtubeUrl;
  }
}

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : (params?.slug ?? "");
  const [article, setArticle] = useState<ArticleRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [databaseNotice, setDatabaseNotice] = useState<string | null>(null);
  const [vote, setVote] = useState<"UP" | "DOWN" | null>(null);
  const [votePending, setVotePending] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadArticle() {
      try {
        setLoading(true);
        const response = await fetch("/api/articles?limit=100&offset=0");

        if (!response.ok) {
          const errorJson = await response.json().catch(() => ({}));
          throw new Error(
            errorJson.error ||
              "The article database is currently unavailable. Please try again later."
          );
        }

        const data = await response.json();
        const foundArticle = Array.isArray(data.articles)
          ? data.articles.find((item: ArticleRecord) => item.slug === slug)
          : null;

        if (isActive) {
          setArticle(foundArticle ?? null);
          setDatabaseNotice(foundArticle ? null : "Article not found.");
        }
      } catch (error) {
        if (isActive) {
          setArticle(null);
          setDatabaseNotice(
            error instanceof Error
              ? error.message
              : "The article database is currently unavailable. Please try again later."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadArticle();
    }

    return () => {
      isActive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className={articleDetailStyles.shell}>
        <div className={articleDetailStyles.content}>
          <div className={articleDetailStyles.inner}>
            <div className="flex min-h-[220px] items-center justify-center">
              <LoadingSpinner
                size="md"
                text="Loading article..."
                className={articleDetailStyles.mutedText}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={articleDetailStyles.shell}>
        <div className={articleDetailStyles.content}>
          <div className={articleDetailStyles.inner}>
            <p className={articleDetailStyles.mutedText}>
              {databaseNotice ||
                "The article database is currently unavailable. Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const articleBody = article.contentHtml || article.content || "";
  const summaryText = article.summary || article.excerpt || "";
  const voteScore =
    typeof article.voteScore === "number" ? article.voteScore : 0;
  const voteCount =
    typeof article.voteCount === "number" ? article.voteCount : 0;

  const handleVote = async (nextVote: "UP" | "DOWN") => {
    if (!article) return;

    setVotePending(true);

    try {
      const response = await fetch(`/api/articles/${article.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: nextVote }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(
          errorJson.error || "You must be logged in to vote on articles."
        );
      }

      setVote(nextVote);
      setArticle(current =>
        current
          ? {
              ...current,
              voteScore:
                (current.voteScore ?? 0) + (nextVote === "UP" ? 1 : -1),
              voteCount: (current.voteCount ?? 0) + 1,
            }
          : current
      );
    } catch (error) {
      setDatabaseNotice(
        error instanceof Error ? error.message : "Unable to register your vote."
      );
    } finally {
      setVotePending(false);
    }
  };

  return (
    <div className={articleDetailStyles.shell}>
      <div className={articleDetailStyles.content}>
        <div className={articleDetailStyles.inner}>
          <div>
            <div className={articleDetailStyles.banner}>
              <BackgroundImage
                src={article.imageUrl}
                className={articleDetailStyles.bannerImage}
              />
            </div>

            <div className="mb-12">
              <div className="mb-4">
                <Link href="/articles" className={articleDetailStyles.backLink}>
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Articles
                </Link>
              </div>

              <span className={articleDetailStyles.badge}>
                {article.category}
              </span>
              <h1 className={articleDetailStyles.title}>{article.title}</h1>
              <div className={articleDetailStyles.meta}>
                <span>By {article.author}</span>
                <span className="mx-3">•</span>
                <span>{article.publishedDate}</span>
              </div>
            </div>

            <div className={articleDetailStyles.summary}>
              <p>{summaryText}</p>
            </div>

            <div className={articleDetailStyles.voteRow}>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                Score: {voteScore} · {voteCount} votes
              </span>
              <button
                type="button"
                disabled={votePending}
                onClick={() => handleVote("UP")}
                className={cn(
                  articleDetailStyles.voteButton,
                  vote === "UP" && articleDetailStyles.voteButtonActive
                )}
              >
                ▲ Upvote
              </button>
              <button
                type="button"
                disabled={votePending}
                onClick={() => handleVote("DOWN")}
                className={cn(
                  articleDetailStyles.voteButton,
                  vote === "DOWN" && articleDetailStyles.voteButtonActive
                )}
              >
                ▼ Downvote
              </button>
            </div>

            {article.youtubeUrl ? (
              <div className="mb-10 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <iframe
                  src={getEmbedUrl(article.youtubeUrl)}
                  title={`${article.title} video`}
                  className="h-[320px] w-full md:h-[420px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}

            <div className={articleDetailStyles.body}>
              <div
                className={articleDetailStyles.articleBody}
                dangerouslySetInnerHTML={{ __html: articleBody }}
              />
            </div>

            <div className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h3 className={articleDetailStyles.sectionTitle}>
                About {article.author}
              </h3>
              <p className={articleDetailStyles.bio}>
                {article.author === "Jordan McEachern"
                  ? "Passionate suburban gardener and founder of SuburbanGardener, sharing practical tips for growing food and beauty in small spaces."
                  : "Experienced organic gardener and writer, specializing in sustainable growing practices and soil health."}
              </p>

              <div className={articleDetailStyles.buttonRow}>
                <ViewAllArticlesButton
                  text="Back to Articles"
                  arrowDirection="left"
                />
              </div>
            </div>

            <ArticleComments articleId={article.id} />
          </div>
        </div>
      </div>

      <div className={articleDetailStyles.sidebarWrap}>
        <ArticleSidebar currentArticle={article} />
      </div>
    </div>
  );
}
