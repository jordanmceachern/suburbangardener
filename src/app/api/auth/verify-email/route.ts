import { NextResponse } from "next/server";
import { verifyUserEmail } from "@/lib/auth-user";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(
      new URL("/login?mode=signIn&error=invalid-verification-link", request.url)
    );
  }

  const isVerified = await verifyUserEmail({ email, token });

  if (!isVerified) {
    return NextResponse.redirect(
      new URL("/login?mode=signIn&error=verification-link-expired", request.url)
    );
  }

  const redirectUrl = new URL("/login?mode=signIn&verified=1", request.url);

  return new NextResponse(
    `<!doctype html><html><body><script>
      const dashboardUrl = ${JSON.stringify("/dashboard")};
      const loginUrl = ${JSON.stringify(redirectUrl.toString())};

      try {
        if (window.opener && window.opener !== window) {
          try {
            window.opener.postMessage({ type: "email-verified" }, window.location.origin);
          } catch (postMessageError) {}
          try {
            window.opener.location.href = dashboardUrl;
          } catch (openerError) {}
        }

        try {
          window.localStorage.setItem("suburban-gardener-email-verified", String(Date.now()));
        } catch (storageError) {}

        try {
          window.close();
        } catch (closeError) {}
      } catch (error) {}

      try {
        window.location.href = loginUrl;
      } catch (redirectError) {
        try {
          window.location.assign(loginUrl);
        } catch (assignError) {}
      }
    </script></body></html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}
