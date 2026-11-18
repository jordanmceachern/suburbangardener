import React from "react";
import { cn, loadingSpinnerStyles } from "@/lib/tailwind";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

// Loads ingSpinner and keeps the component data up to date.
export default function LoadingSpinner({
  size = "md",
  className = "",
  text = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className={cn(loadingSpinnerStyles.shell, className)}>
      <svg
        className={cn(
          loadingSpinnerStyles.icon,
          loadingSpinnerStyles.sizes[size]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <span className={loadingSpinnerStyles.text}>{text}</span>}
    </div>
  );
}
