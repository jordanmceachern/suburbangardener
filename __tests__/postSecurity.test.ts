import {
  isAdminEmail,
  maskDisplayName,
  sanitizeHtml,
} from "../src/lib/articleSecurity";

describe("post security helpers", () => {
  it("masks emails before the @ symbol for display", () => {
    expect(maskDisplayName("jormceachern@proton.me")).toBe("jormceachern");
    expect(maskDisplayName("someone@example.com")).toBe("someone");
  });

  it("detects the configured admin email", () => {
    expect(isAdminEmail("JORMCEACHERN@PROTON.ME")).toBe(true);
    expect(isAdminEmail("other@example.com")).toBe(false);
  });

  it("removes unsafe HTML before storage", () => {
    const dirty = `
      <p>Good</p>
      <script>alert("x")</script>
      <a href="javascript:alert(1)" onclick="evil()">link</a>
    `;

    const clean = sanitizeHtml(dirty);

    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("onclick");
    expect(clean).toContain("Good");
    expect(clean).toContain("href=");
  });
});
