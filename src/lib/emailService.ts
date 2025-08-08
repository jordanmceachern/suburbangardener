// Email service configuration for error reporting using Resend
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
