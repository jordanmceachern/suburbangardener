"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/lib/auth-nextauth";
import { PostDetailStyles, buttonStyles, cn } from "@/lib/tailwind";

interface CommentRecord {
  id: string;
  author: string;
  bodyHtml: string;
  createdAt: string;
}

export default function PostComments({
  PostId,
  articleId,
}: {
  PostId?: string;
  articleId?: string;
}) {
  const postId = PostId ?? articleId ?? "";
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) {
      setComments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);

      if (!response.ok) {
        throw new Error("Unable to load comments.");
      }

      const data = await response.json();
      setComments(Array.isArray(data.comments) ? data.comments : []);
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load comments."
      );
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, fetchComments]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!commentBody.trim()) {
      setError("Comment text is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bodyHtml: commentBody.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to post comment.");
      }

      setCommentBody("");
      await fetchComments();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to post comment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={PostDetailStyles.commentsSection}>
      <h3 className={PostDetailStyles.commentsHeader}>Comments</h3>

      {isAuthenticated ? (
        <form
          onSubmit={handleSubmit}
          className={PostDetailStyles.commentComposer}
        >
          <textarea
            value={commentBody}
            onChange={event => setCommentBody(event.target.value)}
            rows={4}
            className={PostDetailStyles.textarea}
            placeholder="Share your thoughts on this Post..."
          />
          <div className={PostDetailStyles.actionRow}>
            <button
              type="submit"
              disabled={submitting || !commentBody.trim()}
              className={cn(
                buttonStyles.primary,
                PostDetailStyles.primaryAction
              )}
            >
              {submitting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className={PostDetailStyles.mutedText}>
          Log in to join the conversation.
        </p>
      )}

      {error ? <div className={PostDetailStyles.mutedText}>{error}</div> : null}

      {loading ? (
        <div className={PostDetailStyles.loadingWrap}>
          <LoadingSpinner
            size="sm"
            text="Loading comments..."
            className={PostDetailStyles.mutedText}
          />
        </div>
      ) : comments.length === 0 ? (
        <p className={PostDetailStyles.mutedText}>
          No comments yet. Be the first to respond.
        </p>
      ) : (
        <div className={PostDetailStyles.commentList}>
          {comments.map(comment => (
            <div key={comment.id} className={PostDetailStyles.commentItem}>
              <div className={PostDetailStyles.commentMeta}>
                <strong>{comment.author}</strong>
                <span className={PostDetailStyles.commentDot}>•</span>
                <span>
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div
                className={PostDetailStyles.commentBody}
                dangerouslySetInnerHTML={{ __html: comment.bodyHtml }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
