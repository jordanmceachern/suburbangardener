import { NextResponse } from "next/server";
import { uploadImageToCloudinary, validateImageUpload } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const isFileLike =
      typeof Blob !== "undefined" && file instanceof Blob
        ? true
        : !!file &&
          typeof file === "object" &&
          "name" in file &&
          "type" in file &&
          typeof (file as { arrayBuffer?: unknown }).arrayBuffer === "function";

    if (!isFileLike) {
      return NextResponse.json(
        { error: "A valid image file is required." },
        { status: 400 }
      );
    }

    const imageFile = file as File | Blob;

    const validationError = validateImageUpload(imageFile);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const url = await uploadImageToCloudinary(
      imageFile,
      "SuburbanGardener/Posts"
    );

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    const cloudinaryError = error as {
      http_code?: number;
      message?: string;
      error?: { message?: string };
    };

    const status =
      cloudinaryError.http_code && cloudinaryError.http_code >= 400 ? 503 : 500;

    const message =
      cloudinaryError?.error?.message ||
      cloudinaryError?.message ||
      "Unable to upload image to Cloudinary.";

    let normalizedMessage = message;

    if (status === 503) {
      normalizedMessage =
        "Cloudinary rejected the image upload. Please check the Cloudinary credentials and try again. Details: " +
        message;
    }

    return NextResponse.json({ error: normalizedMessage }, { status });
  }
}
