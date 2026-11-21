export const DEFAULT_POST_CATEGORY = "General";
export const ALL_POST_CATEGORIES = "All Categories";
export const POST_CATEGORY_OPTIONS = [
  DEFAULT_POST_CATEGORY,
  "Fruit & Veg",
  "Flowers",
  "Soil",
  "Pest Control",
] as const;

export function normalizeEmail(value?: string | null): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function isAdminEmail(value?: string | null): boolean {
  return normalizeEmail(value) === "jormceachern@proton.me";
}

export function normalizeCategoryValue(value?: string | null): string {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return DEFAULT_POST_CATEGORY;
  }

  const normalized = trimmed.toLowerCase();

  if (
    [
      "fruit",
      "vegetables",
      "fruit & veg",
      "fruit and veg",
      "vegetables & fruit",
      "vegetables and fruit",
    ].includes(normalized)
  ) {
    return "Fruit & Veg";
  }

  return trimmed;
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

export function canEditPost({
  actorEmail,
  actorUserId,
  postAuthorEmail,
  postAuthorUserId,
}: {
  actorEmail?: string | null;
  actorUserId?: string | null;
  postAuthorEmail?: string | null;
  postAuthorUserId?: string | null;
}): boolean {
  return canDeletePost({
    actorEmail,
    actorUserId,
    postAuthorEmail,
    postAuthorUserId,
  });
}

export function canDeletePost({
  actorEmail,
  actorUserId,
  postAuthorEmail,
  postAuthorUserId,
}: {
  actorEmail?: string | null;
  actorUserId?: string | null;
  postAuthorEmail?: string | null;
  postAuthorUserId?: string | null;
}): boolean {
  const normalizedActorEmail = normalizeEmail(actorEmail);
  const normalizedAuthorEmail = normalizeEmail(postAuthorEmail);

  if (actorUserId && postAuthorUserId) {
    if (actorUserId === postAuthorUserId) {
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
    /<(?!\/?(?:p|br|strong|b|em|i|u|ul|ol|li|blockquote|a|h1|h2|h3|h4|h5|h6|span|div|code|pre|hr|sub|sup|mark)\b)[^>]+>/gi,
    ""
  );

  sanitized = sanitized.replace(
    /<(strong|b|em|i|u|p|br|ul|ol|li|blockquote|h1|h2|h3|h4|h5|h6|span|div|code|pre|sub|sup|mark)(?:\s[^>]*)?>/gi,
    (match, tag: string) => {
      const normalizedTag = String(tag).toLowerCase();
      return `<${normalizedTag}>`;
    }
  );

  return sanitized.trim();
}

// Older posts stored Markdown-style **bold** and *italic*; only text outside HTML tags is converted.
export function convertLegacyEmphasis(html: string): string {
  const converted = html
    .split(/(<[^>]*>)/)
    .map((part, index) => {
      if (index % 2 === 1) return part;

      return part
        .replace(/\*\*(\S(?:[^*]*\S)?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(\S(?:[^*]*\S)?)\*/g, "<em>$1</em>");
    })
    .join("");

  return converted
    .split(/\n+/)
    .map(line => {
      const trimmed = line.trim();
      if (/^[-*]\s+/.test(trimmed)) {
        return `<li>${trimmed.replace(/^[-*]\s+/, "")}</li>`;
      }
      return trimmed;
    })
    .join("");
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
