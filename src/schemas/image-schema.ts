import { z } from "zod";
type ImageSchemaOptions = {
  ACCEPTED_IMAGE_TYPES?: string[];
  MAX_FILE_SIZE?: number;
  MAX_DIMENSIONS?: {
    width: number;
    height: number;
  };
  MIN_DIMENSIONS?: {
    width: number;
    height: number;
  };
};
export const schemaOptions = {
  ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png"],
  MAX_FILE_SIZE: 1024 * 1024 * 1,
  MAX_DIMENSIONS: { width: 1600, height: 900 },
  MIN_DIMENSIONS: { width: 400, height: 250 },
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const imageSchema = ({
  ACCEPTED_IMAGE_TYPES = schemaOptions.ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE = schemaOptions.MAX_FILE_SIZE,
  MIN_DIMENSIONS = schemaOptions.MIN_DIMENSIONS,
  MAX_DIMENSIONS = schemaOptions.MAX_DIMENSIONS,
}: ImageSchemaOptions = {}) =>
  z
    .instanceof(File, {
      message: "Please select an image file.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `The image is too large. Please choose an image smaller than ${formatBytes(
        MAX_FILE_SIZE
      )}.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid image file (JPEG, PNG, or WebP).",
    })
    .refine(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const meetsDimensions =
                img.width >= MIN_DIMENSIONS.width &&
                img.height >= MIN_DIMENSIONS.height &&
                img.width <= MAX_DIMENSIONS.width &&
                img.height <= MAX_DIMENSIONS.height;
              resolve(meetsDimensions);
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }),
      {
        message: `The image dimensions are invalid. Please upload an image between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels.`,
      }
    );
