import Link from "next/link";
import { buttonStyles, cn, viewAllPostsStyles } from "@/lib/tailwind";

interface ViewAllPostsButtonProps {
  className?: string;
  variant?: "primary" | "secondary";
  text?: string;
  arrowDirection?: "left" | "right";
}

// Renders the ViewAllPostsButton UI block.
export default function ViewAllPostsButton({
  className = "",
  variant = "primary",
  text = "View All Posts",
  arrowDirection = "right",
}: ViewAllPostsButtonProps) {
  const variantClasses =
    buttonStyles[variant === "primary" ? "primary" : "secondary"];

  const combinedClasses = cn(
    variantClasses,
    viewAllPostsStyles.button,
    className
  );

  return (
    <Link href="/posts" className={combinedClasses}>
      {arrowDirection === "left" && (
        <svg
          className={viewAllPostsStyles.iconLeft}
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
      )}
      {text}
      {arrowDirection === "right" && (
        <svg
          className={viewAllPostsStyles.iconRight}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </Link>
  );
}
