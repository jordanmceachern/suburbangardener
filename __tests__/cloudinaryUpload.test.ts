import { validateImageUpload } from "@/lib/cloudinary";

describe("validateImageUpload", () => {
  it("accepts images up to 10 MB", () => {
    const file = new File([new Uint8Array(10 * 1024 * 1024)], "garden.jpg", {
      type: "image/jpeg",
    });

    expect(validateImageUpload(file)).toBeNull();
  });

  it("rejects images larger than 10 MB", () => {
    const file = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.jpg", {
      type: "image/jpeg",
    });

    expect(validateImageUpload(file)).toContain("10 MB");
  });

  it("rejects non-image files", () => {
    const file = new File(["not an image"], "document.pdf", {
      type: "application/pdf",
    });

    expect(validateImageUpload(file)).toContain("image");
  });
});
