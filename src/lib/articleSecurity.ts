export function normalizeEmail(value?: string | null): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function isAdminEmail(value?: string | null): boolean {
  return normalizeEmail(value) === "jormceachern@proton.me";
}

export function maskDisplayName(value?: string | null): string {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return "Anonymous";
  }

  const atIndex = trimmed.indexOf("@");
  if (atIndex > 0) {
    return trimmed.slice(0, atIndex);
  }

  return trimmed;
}

export function canDeleteArticle({
  actorEmail,
  actorUserId,
  articleAuthorEmail,
  articleAuthorUserId,
}: {
  actorEmail?: string | null;
  actorUserId?: string | null;
  articleAuthorEmail?: string | null;
  articleAuthorUserId?: string | null;
}): boolean {
  const normalizedActorEmail = normalizeEmail(actorEmail);
  const normalizedAuthorEmail = normalizeEmail(articleAuthorEmail);

  if (actorUserId && articleAuthorUserId) {
    if (actorUserId === articleAuthorUserId) {
      return true;
    }
  }

  if (normalizedActorEmail && normalizedAuthorEmail) {
    if (normalizedActorEmail === normalizedAuthorEmail) {
      return true;
    }
  }

  return isAdminEmail(normalizedActorEmail);
}

export function sanitizeHtml(input: string): string {
  if (!input) {
    return "";
  }

  let sanitized = String(input)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(
      /href\s*=\s*(?:"|')\s*(javascript:|data:|vbscript:)/gi,
      'href="#"'
    );

  sanitized = sanitized.replace(
    /<(?!\/?(?:p|br|strong|b|em|i|u|ul|ol|li|blockquote|a|h1|h2|h3|h4|h5|h6|span|div|code|pre|hr|img|figure|figcaption|sub|sup|mark)\b)[^>]+>/gi,
    ""
  );

  return sanitized.trim();
}

export function isValidYouTubeUrl(value?: string | null): boolean {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();

    return (
      hostname === "youtu.be" ||
      hostname === "www.youtu.be" ||
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "m.youtube.com"
    );
  } catch {
    return false;
  }
}
