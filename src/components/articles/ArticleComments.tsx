"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/lib/auth-nextauth";
import { articleDetailStyles, buttonStyles, cn } from "@/lib/tailwind";

interface CommentRecord {
  id: string;
  author: string;
  bodyHtml: string;
  createdAt: string;
}

export default function ArticleComments({ articleId }: { articleId: string }) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles/${articleId}/comments`);

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
  }, [articleId]);

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId, fetchComments]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!commentBody.trim()) {
      setError("Comment text is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/articles/${articleId}/comments`, {
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
    <section className={articleDetailStyles.commentsSection}>
      <h3 className={articleDetailStyles.commentsHeader}>Comments</h3>

      {isAuthenticated ? (
        <form
          onSubmit={handleSubmit}
          className={articleDetailStyles.commentComposer}
        >
          <textarea
            value={commentBody}
            onChange={event => setCommentBody(event.target.value)}
            rows={4}
            className={articleDetailStyles.textarea}
            placeholder="Share your thoughts on this article..."
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !commentBody.trim()}
              className={cn(
                buttonStyles.primary,
                "inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {submitting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className={articleDetailStyles.mutedText}>
          Log in to join the conversation.
        </p>
      )}

      {error ? (
        <div className={articleDetailStyles.mutedText}>{error}</div>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner
            size="sm"
            text="Loading comments..."
            className={articleDetailStyles.mutedText}
          />
        </div>
      ) : comments.length === 0 ? (
        <p className={articleDetailStyles.mutedText}>
          No comments yet. Be the first to respond.
        </p>
      ) : (
        <div className={articleDetailStyles.commentList}>
          {comments.map(comment => (
            <article
              key={comment.id}
              className={articleDetailStyles.commentItem}
            >
              <div className={articleDetailStyles.commentMeta}>
                <strong>{comment.author}</strong>
                <span className="mx-2">•</span>
                <span>
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div
                className={articleDetailStyles.commentBody}
                dangerouslySetInnerHTML={{ __html: comment.bodyHtml }}
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
