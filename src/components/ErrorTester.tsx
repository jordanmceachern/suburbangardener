"use client";

import { useState } from "react";

export default function ErrorTester() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  // This will trigger the error boundary
  if (shouldThrowError) {
    throw new Error("Test error for ErrorBoundary component");
  }

  const triggerError = () => {
    setShouldThrowError(true);
  };

  return (
    <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            🧪 Error Boundary Tester
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Click the button below to trigger an error and test the error
            boundary system. This will display the branded error page and send
            an email notification.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={triggerError}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            🚨 Trigger Error
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors font-medium"
          >
            🔄 Reset Page
          </button>
        </div>

        <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
          <p>• The error will be caught by the ErrorBoundary component</p>
          <p>• An email will be sent to jormceachern@gmail.com</p>
          <p>• Anti-spam protection prevents duplicate emails</p>
          <p>• Only visible in development mode</p>
        </div>
      </div>
    </div>
  );
}
