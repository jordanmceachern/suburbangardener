import { NextRequest, NextResponse } from "next/server";
import { sendErrorEmail } from "../../../lib/emailService";

// Simple in-memory cache for server-side spam protection
const serverErrorCache = new Map<string, number>();

// Clean up old entries every hour
setInterval(
  () => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    serverErrorCache.forEach((timestamp, key) => {
      if (now - timestamp > oneHour) {
        serverErrorCache.delete(key);
      }
    });
  },
  60 * 60 * 1000
);

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json();

    // Create error signature for spam protection
    const errorSignature = `${errorData.error.name}:${errorData.error.message}:${errorData.url}`;
    const now = Date.now();
    const lastReported = serverErrorCache.get(errorSignature);

    // Prevent spam: only send if not reported in the last hour
    if (lastReported && now - lastReported < 60 * 60 * 1000) {
      return NextResponse.json({
        success: true,
        message: "Error already reported recently",
      });
    }

    // Update cache
    serverErrorCache.set(errorSignature, now);

    // Send email notification
    await sendErrorEmail(errorData);

    return NextResponse.json({
      success: true,
      message: "Error report received",
    });
  } catch (error) {
    console.error("Failed to process error report:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process error report" },
      { status: 500 }
    );
  }
}
