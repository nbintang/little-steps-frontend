"use client";

import { useCallback, useState } from "react";
import { useFormContext, Controller, FieldValues, Path } from "react-hook-form";
import { useDropzone, FileWithPath } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { CameraIcon } from "lucide-react";
import { ImageCropper } from "../ui/image-cropper";

type FileWithPreview = File & { preview: string };

interface AvatarUploaderProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>; // <-- gunakan Path<TFieldValues>
  label?: string;
  size?: string;
  placeholderSrc?: string;
}

const accept: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg"],
};

export function AvatarUploader<TFieldValues extends FieldValues>({
  name,
  label,
  size = "32",
  placeholderSrc = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
}: AvatarUploaderProps<TFieldValues>) {
  const { control, setValue } = useFormContext<TFieldValues>();
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    setSelectedFile(fileWithPreview);
    setDialogOpen(true);
  }, []);

  const handleImageUpdate = useCallback(
    (base64: string | null) => {
      setCroppedImage(base64);
      setValue(name, base64 ? base64 : ("" as FieldValues[Path<TFieldValues>]));
    },
    [setValue, name]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <Controller<TFieldValues>
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col items-center gap-2">
          {label && <p className="text-sm font-medium">{label}</p>}

          <div className="grid place-items-center">
            {selectedFile ? (
              <ImageCropper
                size={size}
                croppedImage={croppedImage}
                setCroppedImage={handleImageUpdate}
                dialogOpen={isDialogOpen}
                setOpenDialog={setDialogOpen}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            ) : (
              <Avatar
                {...getRootProps()}
                className={cn(
                  `size-${size}`,
                  "cursor-pointer relative border border-muted"
                )}
              >
                <Input {...getInputProps()} />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-50 transition-opacity flex items-center justify-center text-white z-10">
                  <CameraIcon className="w-6 h-6" />
                </div>
                <AvatarImage src={field.value || placeholderSrc} alt="Avatar" />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      )}
    />
  );
}
