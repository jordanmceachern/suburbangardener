interface ArrowIconProps {
  direction?: "left" | "right";
  className?: string;
}

// Chevron used by the "View All Posts" button; "left" is its mirror image.
export default function ArrowIcon({
  direction = "right",
  className = "w-5 h-5",
}: ArrowIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}
