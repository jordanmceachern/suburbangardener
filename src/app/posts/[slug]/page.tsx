"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ArrowIcon from "@/components/ArrowIcon";
import BackgroundImage from "@/components/BackgroundImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostSidebar from "@/components/posts/PostSidebar";
import PostComments from "@/components/posts/PostComments";
import ViewAllPostsButton from "@/components/posts/ViewAllPostsButton";
import { useAuth } from "@/lib/auth-nextauth";
import { canDeletePost, convertLegacyEmphasis } from "@/lib/postSecurity";
import { PostDetailStyles, cn, viewAllPostsStyles } from "@/lib/tailwind";

type PostRecord = {
  id: string;
  title: string;
  excerpt: string;
  summary?: string;
  publishedDate: string;
  author: string;
  authorEmail?: string;
  authorId?: string;
  slug: string;
  imageUrl: string;
  youtubeUrl?: string;
  category: string;
  content?: string;
  contentHtml?: string;
  upvotes?: number;
  downvotes?: number;
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
  const router = useRouter();
  const { user } = useAuth();
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : (params?.slug ?? "");
  const [post, setPost] = useState<PostRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [databaseNotice, setDatabaseNotice] = useState<string | null>(null);
  const [vote, setVote] = useState<"UP" | "DOWN" | null>(null);
  const [voteCounts, setVoteCounts] = useState({ upvotes: 0, downvotes: 0 });
  const [votePending, setVotePending] = useState(false);
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!isDeleteConfirmed) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsDeleteConfirmed(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [isDeleteConfirmed]);

  const postId = post?.id;
  const userId = user?.id;

  useEffect(() => {
    if (!postId) {
      return;
    }

    let isActive = true;

    fetch(`/api/posts/${postId}/vote`)
      .then(response => (response.ok ? response.json() : null))
      .then(summary => {
        if (isActive && summary) {
          setVoteCounts({
            upvotes: summary.upvotes,
            downvotes: summary.downvotes,
          });
          setVote(summary.userVote);
        }
      })
      .catch(() => {});

    return () => {
      isActive = false;
    };
  }, [postId, userId]);

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
        const foundPost = Array.isArray(data.posts)
          ? data.posts.find((item: PostRecord) => item.slug === slug)
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

  if (!post) {
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

  const PostBody = convertLegacyEmphasis(
    post.contentHtml || post.content || ""
  );
  const summaryText = post.summary || post.excerpt || "";
  const canManagePost =
    !!user &&
    canDeletePost({
      actorEmail: user.email,
      actorUserId: user.id,
      postAuthorEmail: post.authorEmail,
      postAuthorUserId: post.authorId,
    });

  const handleDeleteClick = async () => {
    if (isDeleting) {
      return;
    }

    if (!isDeleteConfirmed) {
      setDeleteError(null);
      setIsDeleteConfirmed(true);
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || "Unable to delete Post.");
      }

      router.push("/posts");
    } catch (error) {
      setIsDeleteConfirmed(false);
      setIsDeleting(false);
      setDeleteError(
        error instanceof Error ? error.message : "Unable to delete Post."
      );
    }
  };

  const handleVote = async (nextVote: "UP" | "DOWN") => {
    if (!post || vote === nextVote) return;

    setVotePending(true);

    try {
      const response = await fetch(`/api/posts/${post.id}/vote`, {
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

      const summary = await response.json();
      setVoteCounts({
        upvotes: summary.upvotes,
        downvotes: summary.downvotes,
      });
      setVote(summary.userVote);
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
                src={post.imageUrl}
                className={PostDetailStyles.bannerImage}
              />
            </div>

            <div className="mb-12">
              <div className="mb-4">
                <Link href="/posts" className={PostDetailStyles.backLink}>
                  <ArrowIcon
                    direction="left"
                    className={viewAllPostsStyles.iconLeft}
                  />
                  Back to Posts
                </Link>
              </div>

              <span className={PostDetailStyles.badge}>{post.category}</span>
              <h1 className={PostDetailStyles.title}>{post.title}</h1>
              <div className={PostDetailStyles.meta}>
                <span>{post.publishedDate}</span>
                <span className="mx-3">•</span>
                <span>By {post.author}</span>
              </div>
            </div>

            <div className={PostDetailStyles.summary}>
              <p>{summaryText}</p>
            </div>

            <div className={PostDetailStyles.voteRow}>
              <button
                type="button"
                disabled={votePending}
                onClick={() => handleVote("UP")}
                className={cn(
                  PostDetailStyles.upvoteButton,
                  vote === "UP" && PostDetailStyles.voteButtonActive
                )}
              >
                {voteCounts.upvotes} ▲ Upvote
              </button>
              <button
                type="button"
                disabled={votePending}
                onClick={() => handleVote("DOWN")}
                className={cn(
                  PostDetailStyles.downvoteButton,
                  vote === "DOWN" && PostDetailStyles.voteButtonActive
                )}
              >
                {voteCounts.downvotes} ▼ Downvote
              </button>
            </div>

            {post.youtubeUrl ? (
              <div className="mb-10 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <iframe
                  src={getEmbedUrl(post.youtubeUrl)}
                  title={`${post.title} video`}
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

            <div className={PostDetailStyles.footer}>
              <div className={PostDetailStyles.buttonRow}>
                {canManagePost ? (
                  <Link
                    href={`/posts/new?edit=${encodeURIComponent(post.id)}`}
                    className={PostDetailStyles.editButton}
                  >
                    Edit Post
                  </Link>
                ) : null}
                {canManagePost ? (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className={cn(
                      PostDetailStyles.deleteButton,
                      isDeleteConfirmed && PostDetailStyles.deleteButtonConfirm
                    )}
                    aria-live="polite"
                  >
                    {isDeleting
                      ? "Deleting..."
                      : isDeleteConfirmed
                        ? "Are you sure?"
                        : "Delete Post"}
                  </button>
                ) : null}
                <ViewAllPostsButton
                  text="Back to Posts"
                  arrowDirection="left"
                />
              </div>
              {deleteError ? (
                <p role="alert" className={PostDetailStyles.deleteError}>
                  {deleteError}
                </p>
              ) : null}
            </div>

            <PostComments postId={post.id} />
          </div>
        </div>
      </div>

      <div className={PostDetailStyles.sidebarWrap}>
        <PostSidebar currentPost={post} />
      </div>
    </div>
  );
}
