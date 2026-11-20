"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BackgroundImage from "@/components/BackgroundImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import TutorialComments from "../../../components/tutorials/TutorialComments";
import TutorialDetailSidebar from "../../../components/tutorials/TutorialDetailSidebar";
import { useAuth } from "@/lib/auth-nextauth";
import { isAdminEmail, convertLegacyEmphasis } from "@/lib/postSecurity";
import { PostDetailStyles, cn } from "@/lib/tailwind";

interface TutorialRecord {
  id: string;
  title: string;
  publishedDate: string;
  author: string;
  slug: string;
  imageUrl: string;
  youtubeUrl?: string;
  category: string;
  contentHtml?: string;
}

export default function TutorialPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : (params?.slug ?? "");
  const [tutorial, setTutorial] = useState<TutorialRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/tutorials?limit=100&offset=0");
        if (!response.ok) throw new Error("Unable to load tutorial.");
        const data = await response.json();
        const found = Array.isArray(data.tutorials)
          ? data.tutorials.find(
              (item: TutorialRecord & { kind?: never }) => item.slug === slug
            )
          : null;
        if (active) {
          setTutorial(found ?? null);
          setError(found ? null : "Tutorial not found.");
        }
      } catch (loadError) {
        if (active)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load tutorial."
          );
      } finally {
        if (active) setLoading(false);
      }
    }
    if (slug) load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className={PostDetailStyles.shell}>
        <div className={PostDetailStyles.content}>
          <div className={PostDetailStyles.inner}>
            <div className="flex min-h-[220px] items-center justify-center">
              <LoadingSpinner size="md" text="Loading Tutorial..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className={PostDetailStyles.shell}>
        <p className={PostDetailStyles.mutedText}>
          {error || "Tutorial not found."}
        </p>
      </div>
    );
  }

  const canManage = isAdminEmail(user?.email);

  const handleDelete = async () => {
    if (!canManage) return;
    const response = await fetch(`/api/tutorials/${tutorial.id}`, {
      method: "DELETE",
    });
    if (response.ok) router.push("/tutorials");
  };

  const body = convertLegacyEmphasis(tutorial.contentHtml || "");

  return (
    <div className={PostDetailStyles.shell}>
      <div className={PostDetailStyles.content}>
        <div className={PostDetailStyles.inner}>
          <div>
            <div className={PostDetailStyles.banner}>
              <BackgroundImage
                src={tutorial.imageUrl}
                className={PostDetailStyles.bannerImage}
              />
            </div>
            <div className="mb-12">
              <span className={PostDetailStyles.badge}>
                {tutorial.category}
              </span>
              <h1 className={PostDetailStyles.title}>{tutorial.title}</h1>
              <div className={PostDetailStyles.meta}>
                <span>{tutorial.publishedDate}</span>
                <span className="mx-3">•</span>
                <span>By {tutorial.author}</span>
              </div>
            </div>
            <div className={PostDetailStyles.body}>
              <div
                className={PostDetailStyles.PostBody}
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
            {tutorial.youtubeUrl ? (
              <div className="mt-10 mb-10 overflow-hidden rounded-lg border">
                <iframe
                  src={tutorial.youtubeUrl}
                  title={`${tutorial.title} video`}
                  className="h-[320px] w-full md:h-[420px]"
                  allowFullScreen
                />
              </div>
            ) : null}
            <div className={PostDetailStyles.footer}>
              <div className={PostDetailStyles.buttonRow}>
                {canManage ? (
                  <Link
                    href={`/tutorials/new?edit=${tutorial.id}`}
                    className={PostDetailStyles.editButton}
                  >
                    Edit Tutorial
                  </Link>
                ) : null}
                {canManage ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className={cn(PostDetailStyles.deleteButton)}
                  >
                    Delete Tutorial
                  </button>
                ) : null}
                <Link href="/tutorials" className={PostDetailStyles.editButton}>
                  Back to Tutorials
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
              <div>
                <TutorialComments tutorialId={tutorial.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <TutorialDetailSidebar currentTutorial={tutorial} maxTutorials={3} />
    </div>
  );
}
