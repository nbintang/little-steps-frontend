import { base64ToFile } from "@/helpers/base64-to-file";
import { UploadImageApiResponse } from "@/hooks/use-image-uploader";
import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";
export enum MediaFolder {
  LITTLE_STEPS_IMAGES = "little_steps_images",
}
export const imageUploadService = async (
  file: File | string | null,
  existedUrl?: string | null
) => {
  try {
    // kalau bukan file/base64, anggap user pakai URL lama → langsung return existedUrl
    if (!file || (typeof file === "string" && !file.startsWith("data:image/"))) {
      return {
        message: "No new file uploaded",
        data: {
          secureUrl: existedUrl ?? (typeof file === "string" ? file : ""),
          publicId: "",
          createdAt: null,
        },
      };
    }

    const formData = new FormData();
    let convertedFile: File;

    if (typeof file === "string" && file.startsWith("data:image/")) {
      convertedFile = base64ToFile(file, "image.png");
    } else if (file instanceof File) {
      convertedFile = file;
    } else {
      throw new Error("Invalid image format");
    }

    formData.append("image", convertedFile);

    const res = await api.post<SuccessResponse<UploadImageApiResponse>>(
      "/media/image/upload",
      formData,
      {
        params: {
          folder: MediaFolder.LITTLE_STEPS_IMAGES,
          existedUrl: existedUrl ?? null,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
