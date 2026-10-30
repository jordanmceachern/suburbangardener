jest.mock("resend", () => {
  const send = jest.fn();

  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: { send },
    })),
  };
});

describe("Verification emails", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env.RESEND_API_KEY = "test-api-key";
    process.env.RESEND_FROM_EMAIL = "hello@suburbangardener.com";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  it("includes a clickable confirmation button in the email HTML payload", async () => {
    const { Resend } = require("resend");
    const { sendVerificationEmail } = await import("../src/lib/emailService");

    await sendVerificationEmail({
      email: "plant-lover@example.com",
      name: "Plant Lover",
      verificationUrl:
        "https://app.example.com/api/auth/verify-email?token=test-token",
    });

    expect(Resend).toHaveBeenCalledWith("test-api-key");

    const resendInstance = Resend.mock.results[0].value;
    expect(resendInstance.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "plant-lover@example.com",
        subject: "Verify your Suburban Gardener account",
        text: expect.stringContaining("Please verify your email"),
        html: expect.stringContaining("Confirm my account"),
      })
    );

    const payload = resendInstance.emails.send.mock.calls[0][0];
    expect(payload.html).toContain(
      "https://app.example.com/api/auth/verify-email?token=test-token"
    );
  });
});
