import React from "react";
import Link from "next/link";

interface CommunitySectionProps {
  className?: string;
}

export default function CommunitySection({
  className = "",
}: CommunitySectionProps) {
  return (
    <section
      className={`p-6 rounded-lg bg-primary-100 dark:bg-secondary-900 border border-primary-200 dark:border-secondary-800 ${className}`}
    >
      <div className="text-center">
        <h2 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
          Join Our Gardening Community
        </h2>
        <p className="text-primary-700 dark:text-neutral-300 mb-6">
          Sign up for exclusive access to premium gardening tools, personalized
          plant care guides, and more!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Get Started - Sign Up
          </Link>
          <Link
            href="/login"
            className="bg-white dark:bg-tertiary-800 hover:bg-neutral-50 dark:hover:bg-tertiary-900 text-neutral-600 dark:text-neutral-100 font-medium py-3 px-6 rounded-lg border border-primary-300 dark:border-none transition-colors"
          >
            Already a Member? Log In
          </Link>
        </div>
      </div>
    </section>
  );
}
