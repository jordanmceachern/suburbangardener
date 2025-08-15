"use client";

import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleOAuthSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("github", {
        callbackUrl: "/dashboard",
        redirect: true,
      });

      if (result?.error) {
        setError("Authentication failed. Please try again.");
      } else if (result?.ok) {
        // Wait for session to be established
        await getSession();
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-2">
              Welcome Back
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Sign in to your Suburban Gardener account
            </p>
          </div>

          {error && (
            <div className="mb-6 text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleOAuthSignIn}
              disabled={isLoading}
              className="w-full bg-neutral-900 dark:bg-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-600 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <LoadingSpinner
                  size="sm"
                  className="mb-0"
                  text="Signing in with GitHub..."
                />
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              By signing in, you agree to our terms of service and privacy
              policy.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
