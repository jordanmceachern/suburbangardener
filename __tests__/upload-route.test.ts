jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

jest.mock("../src/lib/cloudinary", () => ({
  uploadImageToCloudinary: jest
    .fn()
    .mockResolvedValue("https://example.com/uploaded.png"),
  validateImageUpload: jest.fn(() => null),
}));

const { POST } = require("../src/app/api/upload/route");
const {
  uploadImageToCloudinary,
  validateImageUpload,
} = require("../src/lib/cloudinary");
const { NextResponse } = require("next/server");

describe("upload route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("accepts blob-like uploads when the File global is unavailable", async () => {
    const image = new Blob(["image-bytes"], { type: "image/png" });
    Object.defineProperty(image, "name", {
      value: "cover.png",
      configurable: true,
    });

    const formData = new FormData();
    formData.append("file", image);

    const response = await POST({
      formData: async () => formData,
    } as any);

    const payload = await response.json();

    expect(validateImageUpload).toHaveBeenCalledTimes(1);
    expect(uploadImageToCloudinary).toHaveBeenCalledWith(
      expect.objectContaining({ type: "image/png" }),
      "SuburbanGardener/Posts"
    );
    expect(response.status).toBe(200);
    expect(payload).toEqual({ url: "https://example.com/uploaded.png" });
    expect(NextResponse.json).toHaveBeenCalledWith({
      url: "https://example.com/uploaded.png",
    });
  });
});
