import { render } from "@testing-library/react";

// Simple test component for testing the setup
function TestComponent() {
  return (
    <div className="flex items-center justify-center p-4 bg-green-100">
      <h1 className="text-xl font-bold text-green-800">Test Component</h1>
    </div>
  );
}

describe("Test Setup", () => {
  it("renders test component with correct structure and classes", () => {
    const { container } = render(<TestComponent />);

    // Take a snapshot of the DOM structure including classes
    expect(container.firstChild).toMatchSnapshot();
  });

  it("contains expected Tailwind classes", () => {
    const { container } = render(<TestComponent />);

    // Check for Tailwind classes
    const hasFlexClasses = container.innerHTML.includes("flex");
    const hasColorClasses = container.innerHTML.includes("green-");
    const hasSpacingClasses = container.innerHTML.includes("p-");

    expect(hasFlexClasses).toBe(true);
    expect(hasColorClasses).toBe(true);
    expect(hasSpacingClasses).toBe(true);
  });
});
