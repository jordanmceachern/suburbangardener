import React from "react";
import Link from "next/link";
import { cn, communityStyles } from "../lib/tailwind";

interface CommunitySectionProps {
  className?: string;
}

export default function CommunitySection({
  className = "",
}: CommunitySectionProps) {
  return (
    <section className={cn(communityStyles.section, className)}>
      <div className={communityStyles.inner}>
        <h2 className={communityStyles.title}>Custom Build Your Own</h2>
        <ul className="list-disc space-y-3 pl-6 text-left text-primary-700 dark:text-neutral-300 mb-6">
          <li>
            Use our free, easy-to-use tools to build out your own custom
            irrigation system.
          </li>
          <li>
            Select the piping and accessories that fit your needs and meet your
            budget.
          </li>
          <li>
            Provide dimensions, upload an overhead image, or provide gps coords
            to start sending water where it&apos;s needed!
          </li>
        </ul>
        <div className={communityStyles.actions}>
          <Link
            href="/login?mode=signUp"
            className={communityStyles.primaryButton}
          >
            Create Account
          </Link>
          <Link href="/login" className={communityStyles.secondaryButton}>
            Log In
          </Link>
        </div>
      </div>
    </section>
  );
}
