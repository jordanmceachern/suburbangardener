"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-nextauth";
import { validateImageUpload } from "@/lib/cloudinary";
import { PostFormStyles, buttonStyles, cn } from "@/lib/tailwind";

const initialForm = {
  title: "",
  summary: "",
  category: "General",
  coverImageUrl: "",
  youtubeUrl: "",
  contentHtml: "<p>Share your guidance, growing tips, and seasonal advice.</p>",
};

export default function PostCreateForm() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML.trim() === "") {
      editorRef.current.innerHTML = form.contentHtml;
    }
  }, [form.contentHtml]);

  const editorButtons = useMemo(
    () => [
      { label: "Bold", command: "bold" },
      { label: "Italic", command: "italic" },
      { label: "H3", command: "formatBlock", value: "h3" },
      { label: "Bullet", command: "insertUnorderedList" },
    ],
    []
  );

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const applyEditorCommand = (
    command: string,
    value?: string,
    shouldFocus = true
  ) => {
    if (typeof document !== "undefined") {
      document.execCommand(command, false, value ?? undefined);
      if (shouldFocus) {
        editorRef.current?.focus();
      }
      setForm(current => ({
        ...current,
        contentHtml: editorRef.current?.innerHTML || current.contentHtml,
      }));
    }
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

    const trimmedContent = (
      editorRef.current?.innerHTML ||
      form.contentHtml ||
      ""
    ).trim();

    if (!trimmedContent || trimmedContent === "<br>") {
      setError("Post content is required.");
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
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          summary: form.summary.trim(),
          contentHtml: trimmedContent,
          coverImageUrl: form.coverImageUrl.trim(),
          youtubeUrl: form.youtubeUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to publish Post.");
      }

      router.push("/posts");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
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
    <form onSubmit={handleSubmit} className={PostFormStyles.shell}>
      <div className={PostFormStyles.header}>
        <h1 className={PostFormStyles.title}>Publish a gardening Post</h1>
        <p className={PostFormStyles.intro}>
          Share practical advice with the suburban gardening community.
        </p>
      </div>

      {error ? <div className={PostFormStyles.error}>{error}</div> : null}

      <div className={PostFormStyles.grid}>
        <label className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>Title</span>
          <input
            value={form.title}
            onChange={event => updateField("title", event.target.value)}
            className={PostFormStyles.input}
            placeholder="Growing tomatoes in a compact suburban plot"
            required
          />
        </label>

        <label className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>Summary</span>
          <textarea
            value={form.summary}
            onChange={event => updateField("summary", event.target.value)}
            rows={3}
            className={PostFormStyles.textarea}
            placeholder="A brief summary for readers on the Post feed."
            required
          />
        </label>

        <label className={PostFormStyles.field}>
          <span className={PostFormStyles.label}>Category</span>
          <select
            value={form.category}
            onChange={event => updateField("category", event.target.value)}
            className={PostFormStyles.input}
          >
            <option>General</option>
            <option>Vegetables</option>
            <option>Flowers</option>
            <option>Fruit</option>
            <option>Soil</option>
            <option>Pest Control</option>
          </select>
        </label>

        <div className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>Cover image upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={PostFormStyles.input}
            disabled={isUploadingImage}
          />
          <p className={PostFormStyles.previewHint}>
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

        <label className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>Cover image URL</span>
          <input
            value={form.coverImageUrl}
            onChange={event => updateField("coverImageUrl", event.target.value)}
            className={PostFormStyles.input}
            placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
            required
          />
        </label>

        <label className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>Optional YouTube URL</span>
          <input
            value={form.youtubeUrl}
            onChange={event => updateField("youtubeUrl", event.target.value)}
            className={PostFormStyles.input}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </label>
      </div>

      <div className={PostFormStyles.editorWrap}>
        <div className={PostFormStyles.editorToolbar}>
          {editorButtons.map(button => (
            <button
              key={button.label}
              type="button"
              onClick={() =>
                button.command === "formatBlock"
                  ? applyEditorCommand(button.command, button.value)
                  : applyEditorCommand(button.command)
              }
              className={PostFormStyles.editorButton}
            >
              {button.label}
            </button>
          ))}
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={event =>
            setForm(current => ({
              ...current,
              contentHtml: (event.target as HTMLDivElement).innerHTML,
            }))
          }
          className={PostFormStyles.editor}
          dangerouslySetInnerHTML={{ __html: form.contentHtml }}
        />
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
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </button>
      </div>
    </form>
  );
}
