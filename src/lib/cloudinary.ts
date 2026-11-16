import { v2 as cloudinary } from "cloudinary";

export { MAX_IMAGE_UPLOAD_BYTES, validateImageUpload } from "./imageUpload";

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
  folder = "SuburbanGardener/Posts"
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
