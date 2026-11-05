describe("Tailwind content scanning", () => {
  it("includes the full src tree so utility strings in shared helpers are generated", () => {
    const config = require("../tailwind.config.js");

    expect(config.content).toEqual(
      expect.arrayContaining([
        expect.stringContaining("./src/**/*.{js,ts,jsx,tsx,mdx}"),
      ])
    );
  });

  it("keeps responsive utility classes used by the home and articles layout in the scan set", () => {
    const config = require("../tailwind.config.js");

    expect(config.content.join("\n")).toContain(
      "./src/**/*.{js,ts,jsx,tsx,mdx}"
    );
    expect(config.content.join("\n")).toContain("src/");
  });
});
