"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import BackgroundImage from "../../components/BackgroundImage";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [accountExists, setAccountExists] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const requestedMode = searchParams.get("mode");
    if (requestedMode === "signUp") {
      setMode("signUp");
    }
  }, [searchParams]);

  const resetAccountForm = () => {
    setError("");
    setAccountExists(false);
    setVerificationSent(false);
    setVerificationEmail("");
  };

  const handleResendVerification = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to resend verification email.");
      }

      setVerificationEmail(email);
      setVerificationSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend verification email."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          if (data.error?.toLowerCase().includes("already exists")) {
            setAccountExists(true);
            return;
          }

          throw new Error(data.error || "Unable to create account.");
        }

        setVerificationEmail(email);
        setVerificationSent(true);
        setAccountExists(false);
        return;
      }

      const validationResponse = await fetch("/api/auth/check-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const validationData = await validationResponse.json();

      if (!validationResponse.ok) {
        throw new Error(
          validationData.error ||
            "The email or password is invalid. Please check both and try again."
        );
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        throw new Error(
          result.error === "CredentialsSignin"
            ? "The email or password is invalid. Please check both and try again."
            : result.error
        );
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

  if (verificationSent) {
    return (
      <main className="auth-page">
        <div className="auth-shell">
          <div className="auth-card">
            <div className="auth-logo">
              <BackgroundImage
                label="Suburban Gardener Logo"
                src="https://res.cloudinary.com/dtweazqf2/image/upload/c_fill,t_transparent-white-alpha-dim,q_auto,f_auto/v1755011510/SuburbanGardener/suburban_gardener_s4c8gy.png"
                width={180}
                maxWidth={180}
              />
            </div>

            <div className="auth-header">
              <h1 className="auth-title">Verify your email</h1>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <AlertTriangle
                  className="auth-helper-icon"
                  aria-hidden="true"
                />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-verification">
              A verification link has been sent to{" "}
              <strong>{verificationEmail}</strong>. Please click the link in
              your email to activate your account.
            </div>

            <div className="auth-actions">
              <button
                type="button"
                className="auth-button"
                onClick={handleResendVerification}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend verification email"}
              </button>
            </div>

            <div className="auth-toggle" style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className="auth-toggle-action"
                onClick={() => {
                  setMode("signIn");
                  resetAccountForm();
                  setEmail("");
                  setPassword("");
                }}
                aria-label="Sign in"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-logo">
            <BackgroundImage
              label="Suburban Gardener Logo"
              src="https://res.cloudinary.com/dtweazqf2/image/upload/c_fill,t_transparent-white-alpha-dim,q_auto,f_auto/v1755011510/SuburbanGardener/suburban_gardener_s4c8gy.png"
              width={180}
              maxWidth={180}
            />
          </div>

          <div className="auth-header">
            <h1 className="auth-title">
              {mode === "signIn" ? "Welcome Back" : "Create Your Account"}
            </h1>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={event => {
                  setEmail(event.target.value);
                  if (accountExists) {
                    setAccountExists(false);
                  }
                }}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={event => {
                  setPassword(event.target.value);
                  if (accountExists) {
                    setAccountExists(false);
                  }
                }}
                placeholder="Your password"
                minLength={8}
                required
              />
            </label>

            <button
              type="submit"
              disabled={isLoading || (mode === "signUp" && accountExists)}
              className="auth-button"
            >
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

            {error && (
              <div className="auth-error" role="alert">
                <AlertTriangle
                  className="auth-helper-icon"
                  aria-hidden="true"
                />
                <span>{error}</span>
              </div>
            )}

            {mode === "signUp" && accountExists && (
              <p className="auth-helper" role="status">
                <AlertTriangle
                  className="auth-helper-icon"
                  aria-hidden="true"
                />
                <span>
                  An account with this email already exists. Please use a
                  different email or click the sign-in link below.
                </span>
              </p>
            )}
          </form>

          <div className="auth-toggle" style={{ marginTop: "1rem" }}>
            {mode === "signIn" ? (
              <p className="auth-toggle-text">
                Need an account?{" "}
                <button
                  type="button"
                  className="auth-toggle-action"
                  onClick={() => {
                    setMode("signUp");
                    setError("");
                    setAccountExists(false);
                  }}
                  aria-label="Create one"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p className="auth-toggle-text">
                Already have an account?{" "}
                <button
                  type="button"
                  className="auth-toggle-action"
                  onClick={() => {
                    setMode("signIn");
                    setError("");
                    setAccountExists(false);
                  }}
                  aria-label="Sign in"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {mode === "signUp" && (
            <div className="auth-legal">
              Your information will not be collected for tracking or data
              trafficking purposes, only for saving your progress and history
              for personal convenience.
            </div>
          )}

          <div className="auth-link">
            <Link href="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
