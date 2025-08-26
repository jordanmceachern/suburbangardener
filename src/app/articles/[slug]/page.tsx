"use client";

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import BackgroundImage from "../../../components/BackgroundImage";
import ArticleSidebar from "../../../components/articles/ArticleSidebar";
import ViewAllArticlesButton from "../../../components/articles/ViewAllArticlesButton";
import { mockArticles } from "../../../mock_data/articles";

interface ArticlePageProps {
  params: { slug: string };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  // Find the article by slug
  const article = mockArticles.find(a => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  // Convert content to HTML (basic markdown-like conversion)
  const formatContent = (content: string) => {
    if (!content) return "";

    return content
      .split("\n")
      .map((line, index) => {
        // Handle headers
        if (line.startsWith("### ")) {
          return `<h3 key="${index}" class="text-xl font-semibold text-primary-900 dark:text-primary-100 mt-8 mb-4">${line.replace("### ", "")}</h3>`;
        }
        if (line.startsWith("## ")) {
          return `<h2 key="${index}" class="text-2xl font-bold text-primary-900 dark:text-primary-100 mt-10 mb-6">${line.replace("## ", "")}</h2>`;
        }
        if (line.startsWith("# ")) {
          return `<h1 key="${index}" class="text-3xl font-bold text-primary-900 dark:text-primary-100 mt-12 mb-8">${line.replace("# ", "")}</h1>`;
        }

        // Handle lists
        if (line.startsWith("- **") && line.includes("**:")) {
          const parts = line.split("**:");
          const term = parts[0].replace("- **", "");
          const definition = parts[1];
          return `<li key="${index}" class="mb-2"><strong class="text-primary-900 dark:text-primary-100">${term}:</strong><span class="text-neutral-700 dark:text-neutral-200">${definition}</span></li>`;
        }
        if (line.startsWith("- ")) {
          return `<li key="${index}" class="mb-1 text-neutral-700 dark:text-neutral-200">${line.replace("- ", "")}</li>`;
        }

        // Handle numbered lists
        if (/^\d+\./.test(line)) {
          return `<li key="${index}" class="mb-2 text-neutral-700 dark:text-neutral-200">${line.replace(/^\d+\.\s*/, "")}</li>`;
        }

        // Handle paragraphs
        if (
          line.trim() &&
          !line.startsWith("#") &&
          !line.startsWith("-") &&
          !/^\d+\./.test(line)
        ) {
          return `<p key="${index}" class="mb-4 text-neutral-700 dark:text-neutral-200 leading-relaxed">${line}</p>`;
        }

        // Empty lines
        if (!line.trim()) {
          return `<div key="${index}" class="mb-2"></div>`;
        }

        return line;
      })
      .join("");
  };

  return (
    <div className="min-h-screen  bg-background-light dark:bg-background-dark">
      {/* Main Content Area with Sidebar */}
      <div className="lg:pr-80 relative">
        <div className="mx-auto px-6 py-12 max-w-screen-2xl">
          <div>
            {/* Banner Image */}
            <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg mb-8 bg-slate-800">
              <BackgroundImage
                src={article.imageUrl}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Header */}
            <div className="mb-12">
              <div className="mb-4">
                <Link
                  href="/articles"
                  className="inline-flex items-center text-neutral-700 dark:text-neutral-200 hover:text-primary-900 dark:hover:text-primary-100 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Articles
                </Link>
              </div>
              <span className="inline-block px-3 py-1 bg-tertiary-500 text-white dark:text-neutral-950 text-sm font-medium rounded-full mb-4">
                {article.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-900 dark:text-primary-100 mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center text-neutral-700 dark:text-neutral-200 text-lg">
                <span>By {article.author}</span>
                <span className="mx-3">•</span>
                <span>{article.publishedDate}</span>
              </div>
            </div>

            {/* Article Excerpt */}
            <div className="mb-12">
              <p className="text-xl text-neutral-700 dark:text-gray-300 leading-relaxed italic font-medium">
                {article.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="article-content"
                dangerouslySetInnerHTML={{
                  __html: formatContent(article.content || ""),
                }}
              />
            </div>

            {/* Author Bio */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
                About {article.author}
              </h3>
              <p className="text-neutral-700 dark:text-neutral-200 mb-6">
                {article.author === "Jordan McEachern"
                  ? "Passionate suburban gardener and founder of SuburbanGardener, sharing practical tips for growing food and beauty in small spaces."
                  : "Experienced organic gardener and writer, specializing in sustainable growing practices and soil health."}
              </p>

              {/* Back to Articles Button */}
              <div className="flex justify-center">
                <ViewAllArticlesButton
                  text="Back to Articles"
                  arrowDirection="left"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Sidebar - Matches articles page layout */}
      <div className="fixed top-0 right-0 w-80 z-40">
        <ArticleSidebar currentArticle={article} />
      </div>
    </div>
  );
}
