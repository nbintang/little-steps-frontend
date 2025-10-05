import { base64ToFile } from "@/helpers/base64-to-file";
import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export type UploadImageApiResponse = {
  secureUrl?: string | null;
  publicId?: string;
  createdAt: Date | string | null;
};

export enum MediaFolder {
  LITTLE_STEPS_IMAGES = "little_steps_images",
}

type UploadImageOptions = Omit<
  UseMutationOptions<
    SuccessResponse<UploadImageApiResponse>,
    unknown,
    File | string | null,
    unknown
  >,
  "mutationFn" | "mutationKey" | "onError"
>;

interface UseUploadImageProps extends UploadImageOptions {
  existedUrl?: string | null;
}

const useUploadImage = ({ existedUrl, ...options }: UseUploadImageProps = {}) =>
  useMutation({
    mutationKey: ["upload-image"],
    mutationFn: async (
      file: File | string | null
    ): Promise<SuccessResponse<UploadImageApiResponse>> => {
      if (!file) {
        return {
          message: "No file provided",
          data: {
            secureUrl: (existedUrl as string) ?? "",
            publicId: "",
            createdAt: null,
          },
        };
      }

      // siapkan formData
      const formData = new FormData();

      // handle base64 string
      let convertedFile: File;
      if (typeof file === "string" && file.startsWith("data:image/")) {
        convertedFile = base64ToFile(file, "image.png");
      } else if (file instanceof File) {
        convertedFile = file;
      } else {
        throw new Error("Invalid image format");
      }

      formData.append("image", convertedFile);

      // upload ke backend
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
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message ?? "Failed to upload image");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
    ...options,
  });

export default useUploadImage;
