"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth-nextauth";
import { cn, customBuildStyles } from "../lib/tailwind";

interface CustomBuildSectionProps {
  className?: string;
}

// Renders the CustomBuildSection UI block.
export default function CustomBuildSection({
  className = "",
}: CustomBuildSectionProps) {
  const { isAuthenticated } = useAuth();

  return (
    <section className={cn(customBuildStyles.section, className)}>
      <div className={customBuildStyles.inner}>
        <h2 className={customBuildStyles.title}>Custom Build Your Own</h2>
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
            Provide dimensions, GPS coordinates, or upload an overhead image to
            start sending water where it&apos;s needed!
          </li>
        </ul>
        <div className={customBuildStyles.actions}>
          {isAuthenticated ? (
            <Link href="/tools" className={customBuildStyles.primaryButton}>
              Explore Tools
            </Link>
          ) : (
            <>
              <Link
                href="/login?mode=signUp"
                className={customBuildStyles.primaryButton}
              >
                Create Account
              </Link>
              <Link href="/login" className={customBuildStyles.secondaryButton}>
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
