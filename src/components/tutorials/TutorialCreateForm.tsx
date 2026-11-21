"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CldUploadButton,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useAuth } from "@/lib/auth-nextauth";
import { isAdminEmail } from "@/lib/postSecurity";
import { POST_FORM_COPY, PostFormStyles, cn } from "@/lib/tailwind";

const initialForm = {
  title: "",
  summary: "",
  coverImageUrl: "",
  youtubeUrl: "",
  contentHtml: "",
};

const MAX_TUTORIAL_BODY_CHARACTERS = 5000;

export default function TutorialCreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") || "";
  const { user, isAuthenticated, isLoading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLoadingEditContent, setIsLoadingEditContent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!editId) return;
    setIsLoadingEditContent(true);
    fetch(`/api/tutorials/${editId}`)
      .then(response => response.json())
      .then(data => {
        if (data.tutorial) {
          setForm({
            title: data.tutorial.title || "",
            summary: data.tutorial.summary || data.tutorial.excerpt || "",
            coverImageUrl:
              data.tutorial.coverImageUrl || data.tutorial.coverUrl || "",
            youtubeUrl: data.tutorial.youtubeUrl || "",
            contentHtml: (data.tutorial.contentHtml || "")
              .replace(/<strong>/gi, "**")
              .replace(/<\/strong>/gi, "**")
              .replace(/<b>/gi, "**")
              .replace(/<\/b>/gi, "**")
              .replace(/<em>/gi, "*")
              .replace(/<\/em>/gi, "*")
              .replace(/<i>/gi, "*")
              .replace(/<\/i>/gi, "*")
              .replace(/<u>/gi, "<u>")
              .replace(/<\/u>/gi, "</u>")
              .replace(/<ul>|<\/ul>/gi, "")
              .replace(/<li>/gi, "- ")
              .replace(/<\/li>/gi, "\n"),
          });
        }
      })
      .catch(() => setError("Unable to load tutorial for editing."))
      .finally(() => setIsLoadingEditContent(false));
  }, [editId]);

  const editorButtons = [
    { label: "Bold", command: "bold" as const },
    { label: "Italic", command: "italic" as const },
    { label: "Underline", command: "underline" as const },
  ];

  const getPlainTextContent = (value: string) =>
    value.replace(/\s+/g, " ").trim();

  const tutorialBodyCharacterCount = getPlainTextContent(
    form.contentHtml || ""
  ).length;

  const applyTextFormat = (command: "bold" | "italic" | "underline") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const prefix = command === "bold" ? "**" : command === "italic" ? "*" : "";
    if (!prefix) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    const suffix = prefix;
    const nextValue = `${textarea.value.slice(0, start)}${prefix}${selected}${suffix}${textarea.value.slice(end)}`;

    updateField("contentHtml", nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    });
  };

  const applyBulletFormat = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    const before = textarea.value.slice(0, start);
    const after = textarea.value.slice(end);
    const lines = (selected || "").split("\n").map(line => `- ${line}`);

    updateField("contentHtml", `${before}${lines.join("\n")}${after}`);
  };

  if (isLoading)
    return <div className={PostFormStyles.loading}>Loading...</div>;
  if (!isAuthenticated)
    return (
      <div className={PostFormStyles.emptyState}>
        {POST_FORM_COPY.emptyState}
      </div>
    );
  if (!isAdminEmail(user?.email)) {
    return (
      <div className={PostFormStyles.emptyState}>
        Only the administrator can create tutorials.
      </div>
    );
  }

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (
      !form.title.trim() ||
      !form.summary.trim() ||
      !form.contentHtml.trim() ||
      !form.coverImageUrl.trim()
    ) {
      setError("Title, summary, content, and cover image are required.");
      return;
    }
    if (form.contentHtml.length > MAX_TUTORIAL_BODY_CHARACTERS) {
      setError(
        `Content exceeds the maximum length of ${MAX_TUTORIAL_BODY_CHARACTERS} characters.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        editId ? `/api/tutorials/${editId}` : "/api/tutorials",
        {
          method: editId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            title: form.title.trim(),
            summary: form.summary.trim(),
            contentHtml: form.contentHtml.trim(),
            coverImageUrl: form.coverImageUrl.trim(),
            youtubeUrl: form.youtubeUrl.trim(),
          }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to save tutorial.");
      router.push("/tutorials");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save tutorial."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingEditContent) {
    return (
      <div className={PostFormStyles.editSkeleton}>
        <div className={PostFormStyles.editSkeletonTitle} />
        <div className={PostFormStyles.editSkeletonField} />
        <div className={PostFormStyles.editSkeletonField} />
        <div className={PostFormStyles.editSkeletonBody} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={PostFormStyles.shell}>
      <div className={PostFormStyles.header}>
        <h1 className={PostFormStyles.title}>
          {editId ? "Edit your Tutorial" : "Write a Gardening Tutorial"}
        </h1>
      </div>
      {error ? (
        <div role="alert" className={PostFormStyles.error}>
          {error}
        </div>
      ) : null}
      <div className={PostFormStyles.grid}>
        <label className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>Title</span>
          <input
            value={form.title}
            onChange={event => updateField("title", event.target.value)}
            className={PostFormStyles.input}
            required
          />
        </label>
        <div className={PostFormStyles.field}>
          <span id="cover-image-label" className={PostFormStyles.label}>
            {POST_FORM_COPY.labels.coverImage}
          </span>
          <div>
            <CldUploadButton
              uploadPreset="suburbangardener"
              config={{ cloud: { cloudName: "dtweazqf2" } }}
              options={{
                sources: ["local"],
                multiple: false,
                maxFiles: 1,
                clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                maxFileSize: 10 * 1024 * 1024,
              }}
              onSuccess={(results: CloudinaryUploadWidgetResults) => {
                if (results.info && typeof results.info !== "string") {
                  updateField(
                    "coverImageUrl",
                    results.info.secure_url || results.info.url
                  );
                }
              }}
              className={PostFormStyles.uploadButton}
              aria-labelledby="cover-image-label"
              aria-describedby="cover-image-help"
            >
              {form.coverImageUrl
                ? POST_FORM_COPY.labels.fileSelected
                : POST_FORM_COPY.labels.chooseFile}
            </CldUploadButton>
          </div>
          <p id="cover-image-help" className={PostFormStyles.previewHint}>
            {POST_FORM_COPY.uploadHelp}
          </p>
        </div>
        <label className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>YouTube</span>
          <input
            value={form.youtubeUrl}
            onChange={event => updateField("youtubeUrl", event.target.value)}
            className={PostFormStyles.input}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </label>
        <label className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>Summary</span>
          <textarea
            value={form.summary}
            onChange={event => updateField("summary", event.target.value)}
            className={PostFormStyles.textarea}
            rows={3}
            required
          />
        </label>
        <div className={PostFormStyles.postBodyField}>
          <div className={PostFormStyles.toolbarRow}>
            <label htmlFor="tutorial-body" className={PostFormStyles.label}>
              Tutorial Body
            </label>
            <div className={PostFormStyles.editorToolbar}>
              {editorButtons.map(button => (
                <button
                  key={button.label}
                  type="button"
                  onClick={() => applyTextFormat(button.command)}
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

          <textarea
            id="tutorial-body"
            name="contentHtml"
            ref={textareaRef}
            value={form.contentHtml}
            onChange={event => {
              const nextValue = event.target.value.slice(
                0,
                MAX_TUTORIAL_BODY_CHARACTERS
              );
              updateField("contentHtml", nextValue);
            }}
            rows={8}
            required
            aria-required="true"
            aria-describedby="tutorial-body-character-counter"
            className={cn(PostFormStyles.editor, "block resize-none")}
            placeholder="Share your tutorial step-by-step..."
          />
          <div
            id="tutorial-body-character-counter"
            className={PostFormStyles.previewHint}
            aria-live="polite"
          >
            {tutorialBodyCharacterCount} / {MAX_TUTORIAL_BODY_CHARACTERS}
          </div>
        </div>
      </div>
      <div className={PostFormStyles.actions}>
        <button
          type="button"
          onClick={() => router.push("/tutorials")}
          className={PostFormStyles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={PostFormStyles.submitButton}
        >
          {submitting
            ? "Saving..."
            : editId
              ? "Save Changes"
              : "Publish Tutorial"}
        </button>
      </div>
    </form>
  );
}
