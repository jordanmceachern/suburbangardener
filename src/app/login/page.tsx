"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "signUp") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to create account.");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        throw new Error("Invalid email or password.");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">
              {mode === "signIn" ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className="auth-subtitle">
              {mode === "signIn"
                ? "Sign in with your email and password"
                : "Create a secure account for your garden profile"}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Your password"
                minLength={8}
                required
              />
            </label>

            <button type="submit" disabled={isLoading} className="auth-button">
              {isLoading ? (
                <LoadingSpinner
                  size="sm"
                  className="mb-0"
                  text={
                    mode === "signIn" ? "Signing in..." : "Creating account..."
                  }
                />
              ) : mode === "signIn" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-toggle" style={{ marginTop: "1rem" }}>
            <button
              type="button"
              className="auth-link-button"
              onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
            >
              {mode === "signIn"
                ? "Need an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="auth-legal">
            By continuing, you agree to our terms of service and privacy policy.
          </div>

          <div className="auth-link">
            <Link href="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
