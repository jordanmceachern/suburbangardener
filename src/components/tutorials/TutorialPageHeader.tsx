import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-nextauth";
import { isAdminEmail } from "@/lib/postSecurity";
import { PostPageHeaderStyles, buttonStyles, cn } from "@/lib/tailwind";

export default function TutorialPageHeader({
  className = "",
}: {
  className?: string;
}) {
  const { user } = useAuth();
  return (
    <div className={cn(PostPageHeaderStyles.wrapper, className)}>
      <h1 className={PostPageHeaderStyles.title}>Tutorials</h1>
      <p className={PostPageHeaderStyles.copy}>
        A collection of guides detailing setup and installation instructions for
        Suburban Gardener products.
      </p>
      {isAdminEmail(user?.email) ? (
        <div className={PostPageHeaderStyles.actions}>
          <Link href="/tutorials/new" className={buttonStyles.primary}>
            Write a Tutorial
          </Link>
        </div>
      ) : null}
    </div>
  );
}
