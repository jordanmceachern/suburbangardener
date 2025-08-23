import Link from "next/link";

interface ViewAllArticlesButtonProps {
  className?: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  text?: string;
  arrowDirection?: "left" | "right";
}

export default function ViewAllArticlesButton({
  className = "",
  variant = "primary",
  size = "medium",
  text = "View All Articles",
  arrowDirection = "right",
}: ViewAllArticlesButtonProps) {
  const baseClasses =
    "font-medium rounded-lg transition-colors inline-flex items-center justify-center";

  const variantClasses = {
    primary:
      "bg-primary-500 hover:bg-primary-600 text-white hover:text-neutral-100",
    secondary:
      "bg-secondary-500 hover:bg-secondary-600 text-white hover:text-neutral-100",
  };

  const sizeClasses = {
    small: "py-2 px-4 text-sm",
    medium: "py-3 px-6 text-base",
    large: "py-4 px-8 text-lg",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <Link href="/articles" className={combinedClasses}>
      {arrowDirection === "left" && (
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
      )}
      {text}
      {arrowDirection === "right" && (
        <svg
          className="w-5 h-5 ml-2"
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
