import { NextResponse } from "next/server";
import { uploadImageToCloudinary, validateImageUpload } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A valid image file is required." },
        { status: 400 }
      );
    }

    const validationError = validateImageUpload(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const url = await uploadImageToCloudinary(file, "SuburbanGardener/Posts");

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
