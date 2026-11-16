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
