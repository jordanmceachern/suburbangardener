// Email service configuration for error reporting and verification emails using Resend
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendVerificationEmail({
  email,
  name,
  verificationUrl,
}: {
  email: string;
  name?: string | null;
  verificationUrl: string;
}): Promise<{ success: boolean; skipped?: boolean; error?: unknown }> {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured. Verification email was not sent."
    );
    return { success: false, skipped: true };
  }

  try {
    const displayName = name || "Gardener";
    const emailText = `Hello ${displayName},\n\nThanks for creating an account with Suburban Gardener. Please verify your email by visiting:\n\n${verificationUrl}\n\nIf you did not create this account, you can ignore this message.`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="margin: 0 0 16px; color: #111827;">Verify your Suburban Gardener account</h2>
        <p style="margin: 0 0 16px;">Hello ${displayName},</p>
        <p style="margin: 0 0 20px;">Thanks for creating an account with Suburban Gardener. Please confirm your email address to secure your account.</p>
        <p style="margin: 0 0 24px; text-align: center;">
          <a href="${verificationUrl}" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 700;">Confirm my account</a>
        </p>
        <p style="margin: 0 0 12px;">If the button does not work, visit this link:</p>
        <p style="margin: 0 0 16px; word-break: break-all;"><a href="${verificationUrl}" style="color: #f97316;">${verificationUrl}</a></p>
        <p style="margin: 0; color: #4b5563;">If you did not create this account, you can ignore this message.</p>
      </div>
    `.trim();

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Verify your Suburban Gardener account",
      text: emailText,
      html: emailHtml,
    });

    console.log("Verification email sent successfully via Resend:", result);
    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
}

export async function sendErrorEmail(errorData: any) {
  try {
    const emailBody = `
Error Report for Suburban Gardener

Timestamp: ${errorData.timestamp}
URL: ${errorData.url}
User Agent: ${errorData.userAgent}

Error Details:
- Name: ${errorData.error.name}
- Message: ${errorData.error.message}

Stack Trace:
${errorData.error.stack}

Component Stack:
${errorData.errorInfo.componentStack}
    `.trim();

    // Send email using Resend
    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Resend's verified testing domain
      to: "jormceachern@gmail.com",
      subject: `[Suburban Gardener] Error Report: ${errorData.error.name}`,
      text: emailBody,
    });

    console.log("Error report sent successfully via Resend:", result);

    return { success: true };
  } catch (error) {
    console.error("Failed to send error email:", error);
    return { success: false, error };
  }
}

// Environment variable you need to set in .env.local:
// RESEND_API_KEY=your_resend_api_key
//
// Note: You'll also need to verify your domain (suburbanGardener.com) with Resend
// or use a verified Resend domain like "onboarding@resend.dev" for testing.
