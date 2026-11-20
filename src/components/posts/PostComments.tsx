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
  parentId?: string | null;
  replies?: CommentRecord[];
}

export default function PostComments({
  postId: postIdProp,
}: {
  postId?: string;
}) {
  const postId = postIdProp ?? "";
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
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

  const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!replyTargetId || !replyBody.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bodyHtml: replyBody.trim(),
          parentId: replyTargetId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to post reply.");
      }
      setReplyTargetId(null);
      setReplyBody("");
      await fetchComments();
    } catch (replyError) {
      setError(
        replyError instanceof Error
          ? replyError.message
          : "Unable to post reply."
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
        <p className={PostDetailStyles.commentLoginPrompt}>
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

              {isAuthenticated ? (
                <button
                  type="button"
                  className="mt-2 text-sm font-semibold text-primary-700 dark:text-primary-300"
                  onClick={() => {
                    setReplyTargetId(comment.id);
                    setReplyBody("");
                  }}
                >
                  Reply
                </button>
              ) : null}

              {replyTargetId === comment.id ? (
                <form
                  onSubmit={handleReplySubmit}
                  className={PostDetailStyles.commentComposer}
                >
                  <textarea
                    value={replyBody}
                    onChange={event => setReplyBody(event.target.value)}
                    rows={3}
                    className={PostDetailStyles.textarea}
                    placeholder={`Reply to ${comment.author}...`}
                  />
                  <div className={PostDetailStyles.actionRow}>
                    <button
                      type="submit"
                      disabled={submitting || !replyBody.trim()}
                      className={cn(
                        buttonStyles.primary,
                        PostDetailStyles.primaryAction
                      )}
                    >
                      {submitting ? "Posting..." : "Post reply"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTargetId(null);
                        setReplyBody("");
                      }}
                      className={buttonStyles.secondary}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}

              {(comment.replies || []).map(reply => (
                <div
                  key={reply.id}
                  className="ml-6 mt-4 border-l border-neutral-300 pl-4 dark:border-neutral-700"
                >
                  <div className={PostDetailStyles.commentMeta}>
                    <strong>{reply.author}</strong>
                    <span className={PostDetailStyles.commentDot}>•</span>
                    <span>
                      {new Date(reply.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div
                    className={PostDetailStyles.commentBody}
                    dangerouslySetInnerHTML={{ __html: reply.bodyHtml }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
