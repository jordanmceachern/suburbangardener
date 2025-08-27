import { render } from "@testing-library/react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Test component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>Normal content</div>;
};

describe("ErrorBoundary Component", () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it("should match DOM snapshot with normal children", () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match DOM snapshot when error occurs", () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should maintain CSS classes for error display", () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check for error-related classes and content
    const hasErrorClasses =
      container.innerHTML.includes("Sorry, something went wrong") ||
      container.innerHTML.includes("text-foreground") ||
      container.innerHTML.includes("text-neutral");

    expect(hasErrorClasses).toBe(true);
  });
});
