"use client";

import React, { Component, ReactNode } from "react";
import Image from "next/image";

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
        <div className="min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark p-4">
          <div className="flex flex-col items-center text-center max-w-2xl w-full space-y-6">
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt text is provided via label prop */}
            <Image
              alt="a ruined squished tomato on the ground"
              className="flex justify-center mb-8 rounded-lg"
              height={400}
              width={400}
              src="https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1755004794/SuburbanGardener/toflato_l0dkqy.jpg"
            />

            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">
                Sorry, something went wrong!
              </h1>
              <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                The website has sent me a notification to let me know. If the
                issue is coming from our end, I&apos;ll be working on resolving
                it ASAP - please come back soon!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Refresh this Page
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors"
              >
                Go to Home Page
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="w-full mt-8 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-left">
                <summary className="cursor-pointer font-medium text-neutral-800 dark:text-neutral-200 mb-2">
                  Developer Details (Development Only)
                </summary>
                <div className="space-y-2 text-sm font-mono text-neutral-700 dark:text-neutral-300">
                  <div>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs mt-1 p-2 bg-neutral-200 dark:bg-neutral-700 rounded text-neutral-800 dark:text-neutral-200">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1 p-2 bg-neutral-200 dark:bg-neutral-700 rounded text-neutral-800 dark:text-neutral-200">
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
