import { base64ToFile } from "@/helpers/base64-to-file";
import { UploadImageApiResponse } from "@/hooks/use-upload-image";
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
