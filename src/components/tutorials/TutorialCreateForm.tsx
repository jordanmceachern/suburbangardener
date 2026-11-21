"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CldUploadButton,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { useAuth } from "@/lib/auth-nextauth";
import {
  DEFAULT_POST_CATEGORY,
  POST_CATEGORY_OPTIONS,
  isAdminEmail,
  normalizeCategoryValue,
} from "@/lib/postSecurity";
import { POST_FORM_COPY, PostFormStyles, cn } from "@/lib/tailwind";

const initialForm = {
  title: "",
  summary: "",
  category: DEFAULT_POST_CATEGORY,
  coverImageUrl: "",
  youtubeUrl: "",
  contentHtml: "",
};

export default function TutorialCreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") || "";
  const { user, isAuthenticated, isLoading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!editId) return;
    fetch(`/api/tutorials/${editId}`)
      .then(response => response.json())
      .then(data => {
        if (data.tutorial) {
          setForm({
            title: data.tutorial.title || "",
            summary: data.tutorial.summary || data.tutorial.excerpt || "",
            category: normalizeCategoryValue(
              data.tutorial.category || DEFAULT_POST_CATEGORY
            ),
            coverImageUrl:
              data.tutorial.coverImageUrl || data.tutorial.coverUrl || "",
            youtubeUrl: data.tutorial.youtubeUrl || "",
            contentHtml: data.tutorial.contentHtml || "",
          });
        }
      })
      .catch(() => setError("Unable to load tutorial for editing."));
  }, [editId]);

  if (isLoading) return <div className="p-8">Loading...</div>;
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
            category: normalizeCategoryValue(form.category),
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
        <label className={PostFormStyles.field}>
          <span className={PostFormStyles.label}>Category</span>
          <select
            value={form.category}
            onChange={event => updateField("category", event.target.value)}
            className={PostFormStyles.selectInput}
          >
            {POST_CATEGORY_OPTIONS.map(option => (
              <option key={option}>{option}</option>
            ))}
          </select>
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
        <label className={PostFormStyles.fieldFull}>
          <span className={PostFormStyles.label}>Tutorial Body</span>
          <textarea
            value={form.contentHtml}
            onChange={event => updateField("contentHtml", event.target.value)}
            className={PostFormStyles.textarea}
            rows={12}
            required
          />
        </label>
      </div>
      <div className={cn(PostFormStyles.actions, "justify-end")}>
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
