import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";
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
        <ArrowIcon direction="left" className={viewAllPostsStyles.iconLeft} />
      )}
      {text}
      {arrowDirection === "right" && (
        <ArrowIcon className={viewAllPostsStyles.iconRight} />
      )}
    </Link>
  );
}
