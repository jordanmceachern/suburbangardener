import React from "react";

interface FontStyleTestProps {
  className?: string;
}

export default function FontStyleTest({ className = "" }: FontStyleTestProps) {
  return (
    <section
      className={`p-6 rounded-lg bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 ${className}`}
    >
      <h2 className="text-2xl font-bold mb-4 text-secondary-700 dark:text-secondary-300">
        Font and Style Test
      </h2>
      <div className="space-y-4">
        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          Extra small text for captions and fine print. (11px - Extra Small)
        </p>
        <p className="text-sm italic text-neutral-600 dark:text-neutral-400">
          Small text for secondary information. (12px - Small)
        </p>
        <p className="text-base text-foreground-light dark:text-foreground-dark">
          This is the default text size that should be used for most body
          content. The spacing and typography should be clean and readable.
          (14px - Default)
        </p>
        <p className="text-lg text-primary-700 dark:text-primary-300">
          This is large text for emphasis or headings. (16px - Large)
        </p>
        <p className="text-xl font-bold text-primary-700 dark:text-primary-300">
          This is extra large bold text for major headings. (18px - Extra Large)
        </p>
        <p className="text-lg font-semibold text-tertiary-600 dark:text-tertiary-400">
          This is tertiary color text for warm accents and highlights. (Golden
          Yellow)
        </p>
        <div className="flex gap-4 flex-wrap">
          <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors">
            Primary Button
          </button>
          <button className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-md transition-colors">
            Secondary Button
          </button>
          <button className="px-4 py-2 bg-tertiary-500 hover:bg-tertiary-600 text-white rounded-md transition-colors">
            Tertiary Button
          </button>
          <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors">
            Outline Button
          </button>
        </div>
      </div>
    </section>
  );
}
