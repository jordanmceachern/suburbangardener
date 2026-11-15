import React from "react";
import Link from "next/link";
import { PostPageHeaderStyles, buttonStyles, cn } from "../../lib/tailwind";

interface PostsPageHeaderProps {
  className?: string;
}

// Renders the PostsPageHeader page and its page-specific behavior.
export default function PostsPageHeader({
  className = "",
}: PostsPageHeaderProps) {
  return (
    <div className={cn(PostPageHeaderStyles.wrapper, className)}>
      <h1 className={PostPageHeaderStyles.title}>Gardening Posts</h1>
      <p className={PostPageHeaderStyles.copy}>
        Discover expert insights, seasonal tips, and in-depth guides for
        successful suburban gardening.
      </p>
      <div className={PostPageHeaderStyles.actions}>
        <Link href="/posts/new" className={buttonStyles.primary}>
          Write a Post
        </Link>
      </div>
    </div>
  );
}
