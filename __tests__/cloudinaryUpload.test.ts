jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

const { POST } = require("@/app/api/upload/route");
const {
  uploadImageToCloudinary,
  validateImageUpload,
} = require("@/lib/cloudinary");

jest.mock("@/lib/cloudinary", () => ({
  ...jest.requireActual("@/lib/cloudinary"),
  uploadImageToCloudinary: jest.fn(),
}));

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

  it("returns a clear upload service error when Cloudinary rejects the upload", async () => {
    const mockedUpload = uploadImageToCloudinary as jest.MockedFunction<
      typeof uploadImageToCloudinary
    >;

    mockedUpload.mockRejectedValue({
      http_code: 403,
      message: "Invalid API key",
    });

    const formData = new FormData();
    formData.append(
      "file",
      new File(["image bytes"], "garden.png", { type: "image/png" })
    );

    const response = await POST({
      formData: async () => formData,
    } as Request);

    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain("Cloudinary");
  });
});
