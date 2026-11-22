"use client";

import Link from "next/link";
import { useAuth } from "../lib/auth-nextauth";
import { customBuildStyles } from "../lib/tailwind";

// Renders the CustomBuildSection UI block.
export default function CustomBuildSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className={customBuildStyles.section}>
      <div className={customBuildStyles.inner}>
        <h2 className={customBuildStyles.title}>Custom Build Your Own</h2>
        <ul className={customBuildStyles.list}>
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
          {!isAuthenticated && (
            <>
              <Link
                href="/login?mode=signUp"
                className={customBuildStyles.primaryButton}
              >
                Create Account
              </Link>
              <Link href="/login" className={customBuildStyles.secondaryButton}>
                Sign In
              </Link>
            </>
          )}
          <Link href="/tools" className={customBuildStyles.tertiaryButton}>
            Explore Tools
          </Link>
        </div>
      </div>
    </section>
  );
}
