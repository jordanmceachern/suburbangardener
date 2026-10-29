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
        <h2 className={communityStyles.title}>Join Our Gardening Community</h2>
        <p className={communityStyles.text}>
          Sign up for exclusive access to premium gardening tools, personalized
          plant care guides, and more!
        </p>
        <div className={communityStyles.actions}>
          <Link href="/register" className={communityStyles.primaryButton}>
            Get Started - Sign Up
          </Link>
          <Link href="/login" className={communityStyles.secondaryButton}>
            Log In
          </Link>
        </div>
      </div>
    </section>
  );
}
