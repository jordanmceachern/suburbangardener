import React from "react";
import { render } from "@testing-library/react";
import ErrorBoundary from "../src/components/ErrorBoundary";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }

  return React.createElement("div", null, "Normal content");
};

describe("ErrorBoundary error reporting", () => {
  const originalConsoleError = console.error;
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockResolvedValue({ ok: true });
    global.fetch = fetchMock as typeof fetch;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it("catches render errors and posts the actual crash payload to the error-report endpoint", async () => {
    render(
      React.createElement(
        ErrorBoundary,
        null,
        React.createElement(ThrowError, { shouldThrow: true })
      )
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/error-report",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );

    const [, requestInit] = fetchMock.mock.calls[0];
    const requestConfig = requestInit as { body?: string };
    const body = JSON.parse(requestConfig.body ?? "{}");

    expect(body).toMatchObject({
      error: expect.objectContaining({
        name: "Error",
        message: "Test error",
      }),
      userId: "anonymous",
      url: expect.any(String),
      userAgent: expect.any(String),
      errorInfo: expect.objectContaining({
        componentStack: expect.any(String),
      }),
    });
  });
});
