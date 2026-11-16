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
    const message =
      error instanceof Error
        ? error.message
        : "Unable to upload image to Cloudinary.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
