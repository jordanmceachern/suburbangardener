"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BackgroundImage from "@/components/BackgroundImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostSidebar from "@/components/posts/PostSidebar";
import PostComments from "@/components/posts/PostComments";
import ViewAllPostsButton from "@/components/posts/ViewAllPostsButton";
import { PostDetailStyles, cn } from "@/lib/tailwind";

type PostRecord = {
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

export default function PostPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : (params?.slug ?? "");
  const [Post, setPost] = useState<PostRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [databaseNotice, setDatabaseNotice] = useState<string | null>(null);
  const [vote, setVote] = useState<"UP" | "DOWN" | null>(null);
  const [votePending, setVotePending] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadPost() {
      try {
        setLoading(true);
        const response = await fetch("/api/posts?limit=100&offset=0");

        if (!response.ok) {
          const errorJson = await response.json().catch(() => ({}));
          throw new Error(
            errorJson.error ||
              "The Post database is currently unavailable. Please try again later."
          );
        }

        const data = await response.json();
        const foundPost = Array.isArray(data.Posts)
          ? data.Posts.find((item: PostRecord) => item.slug === slug)
          : null;

        if (isActive) {
          setPost(foundPost ?? null);
          setDatabaseNotice(foundPost ? null : "Post not found.");
        }
      } catch (error) {
        if (isActive) {
          setPost(null);
          setDatabaseNotice(
            error instanceof Error
              ? error.message
              : "The Post database is currently unavailable. Please try again later."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadPost();
    }

    return () => {
      isActive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className={PostDetailStyles.shell}>
        <div className={PostDetailStyles.content}>
          <div className={PostDetailStyles.inner}>
            <div className="flex min-h-[220px] items-center justify-center">
              <LoadingSpinner
                size="md"
                text="Loading Post..."
                className={PostDetailStyles.mutedText}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!Post) {
    return (
      <div className={PostDetailStyles.shell}>
        <div className={PostDetailStyles.content}>
          <div className={PostDetailStyles.inner}>
            <p className={PostDetailStyles.mutedText}>
              {databaseNotice ||
                "The Post database is currently unavailable. Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const PostBody = Post.contentHtml || Post.content || "";
  const summaryText = Post.summary || Post.excerpt || "";
  const voteScore = typeof Post.voteScore === "number" ? Post.voteScore : 0;
  const voteCount = typeof Post.voteCount === "number" ? Post.voteCount : 0;

  const handleVote = async (nextVote: "UP" | "DOWN") => {
    if (!Post) return;

    setVotePending(true);

    try {
      const response = await fetch(`/api/posts/${Post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: nextVote }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(
          errorJson.error || "You must be logged in to vote on Posts."
        );
      }

      setVote(nextVote);
      setPost(current =>
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
    <div className={PostDetailStyles.shell}>
      <div className={PostDetailStyles.content}>
        <div className={PostDetailStyles.inner}>
          <div>
            <div className={PostDetailStyles.banner}>
              <BackgroundImage
                src={Post.imageUrl}
                className={PostDetailStyles.bannerImage}
              />
            </div>

            <div className="mb-12">
              <div className="mb-4">
                <Link href="/posts" className={PostDetailStyles.backLink}>
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
                  Back to Posts
                </Link>
              </div>

              <span className={PostDetailStyles.badge}>{Post.category}</span>
              <h1 className={PostDetailStyles.title}>{Post.title}</h1>
              <div className={PostDetailStyles.meta}>
                <span>By {Post.author}</span>
                <span className="mx-3">•</span>
                <span>{Post.publishedDate}</span>
              </div>
            </div>

            <div className={PostDetailStyles.summary}>
              <p>{summaryText}</p>
            </div>

            <div className={PostDetailStyles.voteRow}>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                Score: {voteScore} · {voteCount} votes
              </span>
              <button
                type="button"
                disabled={votePending}
                onClick={() => handleVote("UP")}
                className={cn(
                  PostDetailStyles.voteButton,
                  vote === "UP" && PostDetailStyles.voteButtonActive
                )}
              >
                ▲ Upvote
              </button>
              <button
                type="button"
                disabled={votePending}
                onClick={() => handleVote("DOWN")}
                className={cn(
                  PostDetailStyles.voteButton,
                  vote === "DOWN" && PostDetailStyles.voteButtonActive
                )}
              >
                ▼ Downvote
              </button>
            </div>

            {Post.youtubeUrl ? (
              <div className="mb-10 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <iframe
                  src={getEmbedUrl(Post.youtubeUrl)}
                  title={`${Post.title} video`}
                  className="h-[320px] w-full md:h-[420px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}

            <div className={PostDetailStyles.body}>
              <div
                className={PostDetailStyles.PostBody}
                dangerouslySetInnerHTML={{ __html: PostBody }}
              />
            </div>

            <div className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h3 className={PostDetailStyles.sectionTitle}>
                About {Post.author}
              </h3>
              <p className={PostDetailStyles.bio}>
                {Post.author === "Jordan McEachern"
                  ? "Passionate suburban gardener and founder of SuburbanGardener, sharing practical tips for growing food and beauty in small spaces."
                  : "Experienced organic gardener and writer, specializing in sustainable growing practices and soil health."}
              </p>

              <div className={PostDetailStyles.buttonRow}>
                <ViewAllPostsButton
                  text="Back to Posts"
                  arrowDirection="left"
                />
              </div>
            </div>

            <PostComments PostId={Post.id} />
          </div>
        </div>
      </div>

      <div className={PostDetailStyles.sidebarWrap}>
        <PostSidebar currentPost={Post} />
      </div>
    </div>
  );
}
