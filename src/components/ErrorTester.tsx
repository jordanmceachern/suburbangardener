"use client";

import { useState } from "react";
import { errorTesterStyles } from "../lib/tailwind";

// Runs the Error Tester logic for this component.
export default function ErrorTester() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  // This will trigger the error boundary
  if (shouldThrowError) {
    throw new Error("Test error for ErrorBoundary component");
  }

  // Runs the trigger Error logic for this component.
  const triggerError = () => {
    setShouldThrowError(true);
  };

  return (
    <div className={errorTesterStyles.shell}>
      <div className={errorTesterStyles.content}>
        <div>
          <h3 className={errorTesterStyles.title}>🧪 Error Boundary Tester</h3>
          <p className={errorTesterStyles.text}>
            Click the button below to trigger an error and test the error
            boundary system. This will display the branded error page and send
            an email notification.
          </p>
        </div>

        <div className={errorTesterStyles.actions}>
          <button
            onClick={triggerError}
            className={errorTesterStyles.primaryButton}
          >
            🚨 Trigger Error
          </button>

          <button
            onClick={() => window.location.reload()}
            className={errorTesterStyles.secondaryButton}
          >
            🔄 Reset Page
          </button>
        </div>

        <div className={errorTesterStyles.meta}>
          <p>• The error will be caught by the ErrorBoundary component</p>
          <p>• An email will be sent to jormceachern@proton.me</p>
          <p>• Anti-spam protection prevents duplicate emails</p>
          <p>• Only visible in development mode</p>
        </div>
      </div>
    </div>
  );
}
