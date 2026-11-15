import { v2 as cloudinary } from "cloudinary";

export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;

export function validateImageUpload(
  file: File | Blob | null | undefined
): string | null {
  if (!file) {
    return "An image file is required.";
  }

  if (!file.type.startsWith("image/")) {
    return "Only image files are allowed.";
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return "Image must be 10 MB or smaller.";
  }

  return null;
}

export function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return {
    cloudName,
    apiKey,
    apiSecret,
    configured: Boolean(cloudName && apiKey && apiSecret),
  };
}

export async function uploadImageToCloudinary(
  file: File | Blob,
  folder = "SuburbanGardener/articles"
): Promise<string> {
  const { configured, cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  if (!configured || !cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const result = await cloudinary.uploader.upload(
    `data:${file.type};base64,${base64}`,
    {
      folder,
      resource_type: "image",
      type: "upload",
      access_mode: "public",
      use_filename: true,
      unique_filename: true,
      quality: "auto",
      fetch_format: "auto",
    }
  );

  return result.secure_url || result.url;
}
