"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/lib/auth-nextauth";
import { PostDetailStyles, buttonStyles, cn } from "@/lib/tailwind";
import { isAdminEmail } from "@/lib/postSecurity";

interface CommentRecord {
  id: string;
  author: string;
  authorId?: string | null;
  bodyHtml: string;
  createdAt: string;
  parentId?: string | null;
  replies?: CommentRecord[];
}

export default function TutorialComments({
  tutorialId,
}: {
  tutorialId: string;
}) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [body, setBody] = useState("");
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tutorials/${tutorialId}/comments`);
      if (!response.ok) throw new Error("Unable to load tutorial comments.");
      const data = await response.json();
      setComments(Array.isArray(data.comments) ? data.comments : []);
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load tutorial comments."
      );
    } finally {
      setLoading(false);
    }
  }, [tutorialId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/tutorials/${tutorialId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bodyHtml: body.trim() }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to post comment.");
      setBody("");
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

  const submitReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!replyTargetId || !replyBody.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/tutorials/${tutorialId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bodyHtml: replyBody.trim(),
          parentId: replyTargetId,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to post reply.");
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

  const handleDeleteComment = async (commentId: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(
        `/api/tutorials/${tutorialId}/comments/${commentId}`,
        { method: "DELETE" }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete comment.");
      }
      await fetchComments();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete comment."
      );
    }
  };

  const renderComment = (
    comment: CommentRecord,
    depth = 0
  ): React.ReactNode => (
    <div
      key={comment.id}
      className={cn(
        PostDetailStyles.commentItem,
        depth > 0 &&
          "ml-6 border-l border-neutral-300 pl-4 dark:border-neutral-700"
      )}
    >
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
      {depth === 0 && isAuthenticated ? (
        <button
          type="button"
          className={PostDetailStyles.replyActionLink}
          onClick={() => {
            setReplyTargetId(comment.id);
            setReplyBody("");
          }}
        >
          Reply
        </button>
      ) : null}
      {isAdminEmail(user?.email) || comment.authorId === user?.id ? (
        <button
          type="button"
          onClick={() => handleDeleteComment(comment.id)}
          className={PostDetailStyles.deleteActionLink}
        >
          Delete
        </button>
      ) : null}
      {replyTargetId === comment.id ? (
        <form
          onSubmit={submitReply}
          className={PostDetailStyles.commentComposer}
        >
          <textarea
            value={replyBody}
            onChange={event => setReplyBody(event.target.value)}
            rows={3}
            className={PostDetailStyles.textarea}
            placeholder={`Reply to ${comment.author}...`}
          />
          <div className={PostDetailStyles.replyActionRow}>
            <button
              type="button"
              onClick={() => setReplyTargetId(null)}
              className={cn(
                buttonStyles.danger,
                "focus:outline-none focus:ring-2 focus:ring-primary-500"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !replyBody.trim()}
              className={cn(
                buttonStyles.primary,
                PostDetailStyles.primaryAction,
                "focus:outline-none focus:ring-2 focus:ring-primary-500"
              )}
            >
              {submitting ? "Commenting..." : "Comment"}
            </button>
          </div>
        </form>
      ) : null}
      {(depth === 0 ? comment.replies || [] : []).map(reply => (
        <div
          key={reply.id}
          className={cn(
            "mt-4",
            PostDetailStyles.replyIndent,
            depth > 0 &&
              "ml-6 border-l border-neutral-300 pl-4 dark:border-neutral-700"
          )}
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
          {isAdminEmail(user?.email) || reply.authorId === user?.id ? (
            <button
              type="button"
              onClick={() => handleDeleteComment(reply.id)}
              className={PostDetailStyles.deleteActionLink}
            >
              Delete
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );

  return (
    <section className={PostDetailStyles.commentsSection}>
      <h3 className={PostDetailStyles.commentsHeader}>Comments</h3>
      {isAuthenticated ? (
        <form
          onSubmit={submitComment}
          className={PostDetailStyles.commentComposer}
        >
          <textarea
            value={body}
            onChange={event => setBody(event.target.value)}
            rows={4}
            className={PostDetailStyles.textarea}
            placeholder="Share your thoughts on this tutorial..."
          />
          <div className={PostDetailStyles.actionRow}>
            <button
              type="submit"
              disabled={submitting || !body.trim()}
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
          <LoadingSpinner size="sm" text="Loading comments..." />
        </div>
      ) : (
        <div className={PostDetailStyles.commentList}>
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </section>
  );
}
