"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-nextauth";
import { normalizeCategoryValue } from "@/lib/articleSecurity";
import { validateImageUpload } from "@/lib/imageUpload";
import { PostFormStyles, buttonStyles, cn, searchStyles } from "@/lib/tailwind";

const MAX_POST_BODY_CHARACTERS = 5000;
const MAX_SUMMARY_CHARACTERS = 100;

const initialForm = {
  title: "",
  summary: "",
  category: "General",
  coverImageUrl: "",
  youtubeUrl: "",
  contentHtml: "",
};

export default function PostCreateForm() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const nextEditPostId = params.get("edit");
    setEditPostId(nextEditPostId);
    setIsEditing(Boolean(nextEditPostId));

    if (!nextEditPostId) {
      return;
    }

    let isMounted = true;

    async function loadPost() {
      try {
        const response = await fetch(`/api/posts/${nextEditPostId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load Post for editing.");
        }

        if (!isMounted || !data.post) {
          return;
        }

        setForm({
          title: data.post.title || "",
          summary: data.post.summary || data.post.excerpt || "",
          category: normalizeCategoryValue(data.post.category || "General"),
          coverImageUrl: data.post.coverImageUrl || "",
          youtubeUrl: data.post.youtubeUrl || "",
          contentHtml: data.post.contentHtml || initialForm.contentHtml,
        });
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load Post for editing."
          );
        }
      }
    }

    loadPost();

    return () => {
      isMounted = false;
    };
  }, []);

  const editorButtons = [
    { label: "Bold", prefix: "**", suffix: "**" },
    { label: "Italic", prefix: "*", suffix: "*" },
    { label: "Underline", prefix: "<u>", suffix: "</u>" },
  ];

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const getPlainTextContent = (value: string) =>
    value.replace(/\s+/g, " ").trim();

  const postBodyCharacterCount = getPlainTextContent(
    form.contentHtml || ""
  ).length;
  const summaryCharacterCount = getPlainTextContent(form.summary || "").length;

  const applyTextFormat = (prefix: string, suffix = prefix) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    const before = textarea.value.slice(0, start);
    const after = textarea.value.slice(end);
    const nextValue = `${before}${prefix}${selected}${suffix}${after}`;

    updateField("contentHtml", nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const caretStart = start + prefix.length;
      const caretEnd = caretStart + selected.length;
      textarea.setSelectionRange(caretStart, caretEnd);
    });
  };

  const applyBulletFormat = () => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    const before = textarea.value.slice(0, start);
    const after = textarea.value.slice(end);
    const selectedLines = selected ? selected.split("\n") : [""];
    const formattedLines = selectedLines.map(line =>
      line.trim() ? `- ${line.trim()}` : "- "
    );
    const nextValue = `${before}${formattedLines.join("\n")}${after}`;

    updateField("contentHtml", nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorStart = start + 2;
      const cursorEnd = cursorStart + formattedLines.join("\n").length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validationError = validateImageUpload(file);
    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }

    setIsUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to upload cover image.");
      }

      updateField("coverImageUrl", data.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload cover image."
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!isAuthenticated || !user) {
      setError("You must be logged in to publish an Post.");
      return;
    }

    const trimmedContent = (form.contentHtml || "").trim();

    if (!trimmedContent || trimmedContent === "<br>") {
      setError("Post content is required.");
      return;
    }

    if (trimmedContent.length > MAX_POST_BODY_CHARACTERS) {
      setError("Post body must be 5000 characters or fewer.");
      return;
    }

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.summary.trim()) {
      setError("Summary is required.");
      return;
    }

    if (form.summary.trim().length > MAX_SUMMARY_CHARACTERS) {
      setError("Summary must be 100 characters or fewer.");
      return;
    }

    if (!form.coverImageUrl.trim()) {
      setError("A cover image URL is required.");
      return;
    }

    if (
      form.youtubeUrl.trim() &&
      !/^https?:\/\//i.test(form.youtubeUrl.trim())
    ) {
      setError("The YouTube URL must be a valid web address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        summary: form.summary.trim(),
        category: normalizeCategoryValue(form.category),
        contentHtml: trimmedContent,
        coverImageUrl: form.coverImageUrl.trim(),
        youtubeUrl: form.youtubeUrl.trim(),
      };

      const response = await fetch(
        isEditing && editPostId ? `/api/posts/${editPostId}` : "/api/posts",
        {
          method: isEditing && editPostId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            (isEditing ? "Unable to update Post." : "Unable to publish Post.")
        );
      }

      router.push("/posts");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : isEditing
            ? "Unable to update Post."
            : "Unable to publish Post."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-foreground-light dark:text-foreground-dark">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={PostFormStyles.emptyState}>
        Sign in to create a gardening Post.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={PostFormStyles.shell}
      aria-labelledby="post-form-title"
      aria-describedby={error ? "post-form-error" : undefined}
    >
      <div className={PostFormStyles.header}>
        <h1 id="post-form-title" className={PostFormStyles.title}>
          {isEditing ? "Edit your Garden Post" : "Write a Gardening Post"}
        </h1>
      </div>

      {error ? (
        <div
          id="post-form-error"
          role="alert"
          aria-live="assertive"
          className={PostFormStyles.error}
        >
          {error}
        </div>
      ) : null}

      <div className={PostFormStyles.grid}>
        <label htmlFor="post-title" className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>Title</span>
          <input
            id="post-title"
            name="title"
            value={form.title}
            onChange={event => updateField("title", event.target.value)}
            className={PostFormStyles.input}
            placeholder="Give your post a searchable name"
            required
            aria-required="true"
          />
        </label>

        <label htmlFor="post-category" className={PostFormStyles.field}>
          <span className={PostFormStyles.label}>Category</span>
          <div className="relative">
            <select
              id="post-category"
              name="category"
              value={normalizeCategoryValue(form.category)}
              onChange={event => updateField("category", event.target.value)}
              required
              aria-required="true"
              className={cn(
                "auth-input w-full appearance-none pr-10 cursor-pointer",
                "focus:border-primary-500"
              )}
            >
              <option>General</option>
              <option>Fruit & Veg</option>
              <option>Flowers</option>
              <option>Soil</option>
              <option>Pest Control</option>
            </select>
            <svg
              className={cn(
                searchStyles.dropdownIcon,
                "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 8l4 4 4-4"
              />
            </svg>
          </div>
        </label>

        <div className={PostFormStyles.field}>
          <label htmlFor="cover-image" className={PostFormStyles.label}>
            Cover Image
          </label>
          <input
            id="cover-image"
            name="coverImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={PostFormStyles.input}
            disabled={isUploadingImage}
            required
            aria-required="true"
            aria-describedby="cover-image-help"
          />
          <p id="cover-image-help" className={PostFormStyles.previewHint}>
            Upload a JPG, PNG, GIF, or WebP image up to 10 MB.
          </p>

          {form.coverImageUrl ? (
            <div className={PostFormStyles.previewWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.coverImageUrl}
                alt="Cover preview"
                className={PostFormStyles.previewImage}
              />
            </div>
          ) : null}
        </div>

        <label htmlFor="post-youtube" className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>YouTube</span>
          <input
            id="post-youtube"
            name="youtubeUrl"
            value={form.youtubeUrl}
            onChange={event => updateField("youtubeUrl", event.target.value)}
            className={PostFormStyles.input}
            placeholder="https://www.youtube.com/watch?v=..."
            aria-describedby="youtube-help"
          />
        </label>
      </div>

      <div className={PostFormStyles.editorWrap}>
        <label htmlFor="post-summary" className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>Summary</span>
          <textarea
            id="post-summary"
            name="summary"
            value={form.summary}
            onChange={event => {
              const nextValue = event.target.value.slice(
                0,
                MAX_SUMMARY_CHARACTERS
              );
              updateField("summary", nextValue);
            }}
            rows={3}
            className={PostFormStyles.textarea}
            placeholder="How would you describe your post?"
            required
            aria-required="true"
            aria-describedby="summary-character-counter"
          />
          <div
            id="summary-character-counter"
            className={PostFormStyles.previewHint}
            aria-live="polite"
          >
            {summaryCharacterCount} / {MAX_SUMMARY_CHARACTERS}
          </div>
        </label>

        <div className={PostFormStyles.postBodyField}>
          <div className="flex items-center gap-2">
            <label htmlFor="post-body" className={PostFormStyles.label}>
              Post Body
            </label>
            <div className={`${PostFormStyles.editorToolbar} ms-4`}>
              {editorButtons.map(button => (
                <button
                  key={button.label}
                  type="button"
                  onClick={() =>
                    button.label === "Bold"
                      ? applyTextFormat(button.prefix, button.suffix)
                      : button.label === "Italic"
                        ? applyTextFormat(button.prefix, button.suffix)
                        : applyTextFormat(button.prefix, button.suffix)
                  }
                  className={PostFormStyles.editorButton}
                  aria-label={`Apply ${button.label.toLowerCase()} formatting`}
                >
                  {button.label}
                </button>
              ))}
              <button
                type="button"
                onClick={applyBulletFormat}
                className={PostFormStyles.editorButton}
                aria-label="Apply bullet list formatting"
              >
                Bullet
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="post-body"
              name="contentHtml"
              ref={textareaRef}
              value={form.contentHtml}
              onChange={event => {
                const nextValue = event.target.value.slice(
                  0,
                  MAX_POST_BODY_CHARACTERS
                );
                updateField("contentHtml", nextValue);
              }}
              rows={8}
              required
              aria-required="true"
              aria-describedby="post-body-character-counter"
              className={cn(PostFormStyles.editor, "block resize-none")}
              placeholder="Share what you've learned in detail..."
            />
          </div>
          <div
            id="post-body-character-counter"
            className={PostFormStyles.previewHint}
            aria-live="polite"
          >
            {postBodyCharacterCount} / {MAX_POST_BODY_CHARACTERS}
          </div>
        </div>
      </div>

      <div className={PostFormStyles.actions}>
        <button
          type="button"
          onClick={() => router.push("/posts")}
          className={cn(
            buttonStyles.secondary,
            "inline-flex items-center justify-center"
          )}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            buttonStyles.primary,
            "inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {isSubmitting
            ? isEditing
              ? "Saving..."
              : "Publishing..."
            : isEditing
              ? "Save Changes"
              : "Publish Post"}
        </button>
      </div>
    </form>
  );
}
