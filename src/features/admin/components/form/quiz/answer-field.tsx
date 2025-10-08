"use client";

import { UseFormReturn } from "react-hook-form";
import { Check, Trash2, TriangleAlert, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { QuizSchema } from "@/features/admin/schemas/quiz-schema";
import {
  FileUpload,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { ButtonGroup } from "@/components/ui/button-group";
import { useEffect, useState } from "react";
import Image from "next/image";

interface AnswerFieldProps {
  questionIndex: number;
  answerIndex: number;
  form: UseFormReturn<QuizSchema>;
  removeAnswer: (index: number) => void;
  totalAnswers: number;
}

export function AnswerField({
  questionIndex,
  answerIndex,
  form,
  removeAnswer,
  totalAnswers,
}: AnswerFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageValue = form.watch(
    `questions.${questionIndex}.answers.${answerIndex}.imageAnswer`
  );

  useEffect(() => {
    if (imageValue && imageValue[0]) {
      const val = imageValue[0];

      if (val instanceof File) {
        const url = URL.createObjectURL(val);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }

      if (typeof val === "string") {
        setPreviewUrl(val);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [imageValue]);

  const removeImage = () => {
    form.setValue(
      `questions.${questionIndex}.answers.${answerIndex}.imageAnswer`,
      []
    );
    form.clearErrors(
      `questions.${questionIndex}.answers.${answerIndex}.imageAnswer`
    );
    setPreviewUrl(null);
  };
  const isCorrect = form.watch(
    `questions.${questionIndex}.answers.${answerIndex}.isCorrect`
  );

  const toggleCorrect = () => {
    const answers = form.getValues(`questions.${questionIndex}.answers`);
    const updatedAnswers = answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === answerIndex,
    }));
    form.setValue(`questions.${questionIndex}.answers`, updatedAnswers);
  };
  const imageError =
    form.formState.errors.questions?.[questionIndex]?.answers?.[answerIndex]
      ?.imageAnswer;

  return (
    <div
      className={cn("border-2 rounded-xl p-4 space-y-1 transition-all bg-card")}
    >
      <div className="flex items-start ">
        <ButtonGroup className="w-full  ">
          <ButtonGroup>
            <Button
              type="button"
              variant={isCorrect ? "default" : "outline"}
              size="icon"
              className={cn(
                isCorrect
                  ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                  : "border-gray-300 hover:border-green-500"
              )}
              onClick={toggleCorrect}
            >
              {isCorrect && <Check size={16} />}
            </Button>
          </ButtonGroup>

          <ButtonGroup className="w-full  ">
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.answers.${answerIndex}.text`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      className="rounded-br-none rounded-tr-none w-full "
                      placeholder={`Jawaban ${answerIndex + 1}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.answers.${answerIndex}.imageAnswer`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      value={
                        Array.isArray(field.value)
                          ? field.value.filter((v) => v instanceof File)
                          : []
                      }
                      onValueChange={(files) => {
                        field.onChange(files);
                        if (files && files.length > 0) {
                          form.clearErrors(
                            `questions.${questionIndex}.answers.${answerIndex}.imageAnswer`
                          );
                        }
                      }}
                      accept="image/*"
                      maxFiles={1}
                      maxSize={1 * 1024 * 1024}
                      onFileReject={(_, message) => {
                        form.setError(
                          `questions.${questionIndex}.answers.${answerIndex}.imageAnswer`,
                          { type: "custom", message: message }
                        );
                      }}
                    >
                      <FileUploadTrigger
                        className="rounded-tl-none rounded-bl-none"
                        asChild
                      >
                        <Button type="button" variant="outline" size="icon">
                          <Upload size={18} className="text-muted-foreground" />
                        </Button>
                      </FileUploadTrigger>
                      <FileUploadList orientation="horizontal"></FileUploadList>
                    </FileUpload>
                  </FormControl>
                </FormItem>
              )}
            />
          </ButtonGroup>
          {totalAnswers > 2 && (
            <ButtonGroup>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeAnswer(answerIndex)}
              >
                <Trash2 size={18} />
              </Button>
            </ButtonGroup>
          )}
        </ButtonGroup>
      </div>
      {previewUrl && (
        <div className="relative inline-block">
          <Image
            width={32}
            height={32}
            src={previewUrl}
            alt="Answer preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          <Button
            type="button"
            variant={"secondary"}
            size="icon-sm"
            onClick={removeImage}
            className="absolute -top-2 -right-2   rounded-full "
          >
            <X size={16} />
          </Button>
        </div>
      )}
      {imageError && (
        <div className="bg-destructive/10 border mt-4 border-destructive rounded-md p-3">
          <p className="text-sm text-destructive font-medium flex items-center gap-2">
            <TriangleAlert size={16} />
            <span>
              {typeof imageError === "object" && "message" in imageError
                ? imageError.message
                : Array.isArray(imageError) && imageError[0]?.message
                ? imageError[0].message
                : "Invalid image"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
