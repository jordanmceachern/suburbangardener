"use client";

import React, { Component, ReactNode } from "react";
import Image from "next/image";
import { errorStyles } from "../lib/tailwind";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// Simple in-memory cache to prevent spam (resets on page reload)
const errorCache = new Set<string>();

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Send error report with spam protection
    this.sendErrorReport(error, errorInfo);
  }

  private async sendErrorReport(error: Error, errorInfo: React.ErrorInfo) {
    try {
      // Create a unique error signature to prevent spam
      const errorSignature = `${error.name}:${error.message}:${errorInfo.componentStack?.split("\n")[1]?.trim()}`;

      // Check if we've already sent this error recently
      if (errorCache.has(errorSignature)) {
        console.log("Error already reported, skipping duplicate email");
        return;
      }

      // Add to cache to prevent duplicates
      errorCache.add(errorSignature);

      // Clear cache after 5 minutes to allow for legitimate repeat errors
      setTimeout(
        () => {
          errorCache.delete(errorSignature);
        },
        60 * 60 * 1000
      );

      const errorData = {
        timestamp: new Date().toISOString(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: "anonymous", // You can enhance this with actual user identification
      };

      // Send to your API endpoint
      await fetch("/api/error-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorData),
      });

      console.log("Error report sent successfully");
    } catch (emailError) {
      console.error("Failed to send error report:", emailError);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={errorStyles.shell}>
          <div className={errorStyles.card}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt text is provided via label prop */}
            <Image
              alt="a ruined squished tomato on the ground"
              className={errorStyles.image}
              height={400}
              width={400}
              src="https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1755004794/SuburbanGardener/toflato_l0dkqy.jpg"
            />

            <div className={errorStyles.section}>
              <h1 className={errorStyles.title}>Sorry, something went wrong!</h1>
              <p className={errorStyles.text}>
                The website has sent me a notification to let me know. If the
                issue is coming from our end, I&apos;ll be working on resolving
                it ASAP - please come back soon!
              </p>
            </div>

            <div className={errorStyles.actions}>
              <button
                onClick={() => window.location.reload()}
                className={errorStyles.primaryButton}
              >
                Refresh this Page
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className={errorStyles.secondaryButton}
              >
                Go to Home Page
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className={errorStyles.details}>
                <summary className={errorStyles.summary}>
                  Developer Details (Development Only)
                </summary>
                <div className={errorStyles.detailBlock}>
                  <div>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className={errorStyles.codeBlock}>
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className={errorStyles.codeBlock}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
