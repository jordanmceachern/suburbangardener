import React from "react";
import { cn } from "../lib/tailwind";
import { fontStyleTestStyles } from "../lib/tailwind";

interface FontStyleTestProps {
  className?: string;
}

// Runs the Font Style Test logic for this component.
export default function FontStyleTest({ className = "" }: FontStyleTestProps) {
  return (
    <section className={cn(fontStyleTestStyles.section, className)}>
      <h2 className={fontStyleTestStyles.title}>Font and Style Test</h2>
      <div className={fontStyleTestStyles.stack}>
        <p className={fontStyleTestStyles.caption}>
          Extra small text for captions and fine print. (11px - Extra Small)
        </p>
        <p className={fontStyleTestStyles.secondary}>
          Small text for secondary information. (12px - Small)
        </p>
        <p className={fontStyleTestStyles.defaultText}>
          This is the default text size that should be used for most body
          content. The spacing and typography should be clean and readable.
          (14px - Default)
        </p>
        <p className={fontStyleTestStyles.largeText}>
          This is large text for emphasis or headings. (16px - Large)
        </p>
        <p className={fontStyleTestStyles.extraLargeText}>
          This is extra large bold text for major headings. (18px - Extra Large)
        </p>
        <p className={fontStyleTestStyles.accentText}>
          This is tertiary color text for warm accents and highlights. (Golden
          Yellow)
        </p>
        <div className={fontStyleTestStyles.actions}>
          <button className={fontStyleTestStyles.primaryButton}>
            Primary Button
          </button>
          <button className={fontStyleTestStyles.secondaryButton}>
            Secondary Button
          </button>
          <button className={fontStyleTestStyles.tertiaryButton}>
            Tertiary Button
          </button>
          <button className={fontStyleTestStyles.dangerButton}>
            Danger Button
          </button>
        </div>
      </div>
    </section>
  );
}
