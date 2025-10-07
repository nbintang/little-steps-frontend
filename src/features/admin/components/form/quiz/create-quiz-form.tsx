"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCallback, useRef, useState } from "react";
import {
  CreateQuizSchema,
  createQuizSchema,
} from "../../../schemas/quiz-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Content, Editor } from "@tiptap/react";
import { Textarea } from "@/components/ui/textarea";
import { Clock8Icon, Plus } from "lucide-react";
import { AsyncSelect } from "@/components/ui/async-select";
import { CategoryAPI } from "@/types/category";
import { categoryService } from "@/services/category-service";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { QuestionCard } from "./question-field";
import { Button } from "@/components/ui/button";
import { TimePickerInput } from "@/components/ui/time-picker/time-picker-input";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";
import useUploadImage from "@/hooks/use-upload-image";
import { QuizMutateResponseAPI } from "@/types/quizzes";
import { usePost } from "@/hooks/use-post";
import { QuestionAPI } from "@/types/questions";
import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export const CreateQuizForm = () => {
  const editorRef = useRef<Editor | null>(null);
  const router = useRouter();
  const form = useForm<CreateQuizSchema>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 0,
      categoryId: "",
      questions: [
        {
          questionJson: {},
          answers: [
            {
              text: "",
              imageAnswer: [],
              isCorrect: false,
            },
            {
              text: "",
              imageAnswer: [],
              isCorrect: false,
            },
          ],
        },
      ],
    },
  });

  const { mutateAsync: uploadImageAnswer } = useUploadImage();
  const { mutateAsync: createQuiz, data } = usePost<QuizMutateResponseAPI>({
    keys: ["quizzes"],
    endpoint: "quizzes",
  });
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const addQuestion = () => {
    appendQuestion({
      questionJson: {},
      answers: [
        { text: "", imageAnswer: [], isCorrect: false },
        { text: "", imageAnswer: [], isCorrect: false },
      ],
    });
  };
  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      form.getValues("questions").map((q) => {
        if (editor.isEmpty) {
          editor.commands.setContent(q.questionJson as Content);
        }
      });
      editorRef.current = editor;
    },
    [form]
  );

  const duration = form.watch("duration");
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const updateDuration = (newMinutes: number, newSeconds: number) => {
    const totalSeconds = newMinutes * 60 + newSeconds;
    form.setValue("duration", totalSeconds);
  };

  const onSubmit = async (data: CreateQuizSchema) => {
    const TOAST_ID = "create-quiz";

    try {
      const questions = data.questions ?? [];
      type FileRef = { file: File; questionIndex: number; answerIndex: number };
      const fileRefs: FileRef[] = [];

      questions.forEach((q, qi) => {
        q.answers?.forEach((a, ai) => {
          const maybe = a.imageAnswer;
          if (Array.isArray(maybe) && maybe[0] instanceof File) {
            fileRefs.push({
              file: maybe[0] as File,
              questionIndex: qi,
              answerIndex: ai,
            });
          }
        });
      });

      const urlMap: Record<string, string> = {};
      if (fileRefs.length > 0) {

        const uploadTasks = fileRefs.map(async (ref) => {
          try {
            const res = await uploadImageAnswer(ref.file);
            const url = res?.data?.secureUrl ?? res;
            if (!url) throw new Error("Upload tidak mengembalikan URL");
            return { ...ref, url: String(url) };
          } catch (err) {
            const msg =
              err instanceof Error ? err.message : "Image upload failed";
            throw new Error(
              `Upload failed for question ${ref.questionIndex + 1} answer ${
                ref.answerIndex + 1
              }: ${msg}`
            );
          }
        });

        const uploadResults = await Promise.all(uploadTasks);
        uploadResults.forEach((u) => {
          urlMap[`${u.questionIndex}-${u.answerIndex}`] = u.url;
        });
      }

      const questionsPayload = questions.map((q, qi) => ({
        questionJson: q.questionJson,
        answers:
          q.answers?.map((a, ai) => {
            const answerPayload: any = {
              text: a.text ?? "",
              isCorrect: Boolean(a.isCorrect),
            };
            const key = `${qi}-${ai}`;
            if (urlMap[key]) {
              answerPayload.imageAnswer = urlMap[key];
            } else if (
              Array.isArray(a.imageAnswer) &&
              typeof a.imageAnswer[0] === "string"
            ) {
              answerPayload.imageAnswer = a.imageAnswer[0];
            }
            return answerPayload;
          }) ?? [],
      }));

      toast.loading("Saving quiz...", { id: TOAST_ID });
      const quizPayload = {
        title: data.title,
        description: data.description,
        duration: data.duration,
        categoryId: data.categoryId,
      };

      const createdQuizResp = await createQuiz(quizPayload);
      const quizId = createdQuizResp.data?.id;
      if (!quizId) {
        throw new Error("Gagal mendapatkan quizId dari response createQuiz");
      }

      const questionsEndpoint = `/protected/quizzes/${quizId}/questions/bulk`;
      const resQuestions = await api.post<SuccessResponse<QuestionAPI[]>>(
        questionsEndpoint,
        questionsPayload
      );

      if (resQuestions.status < 200 || resQuestions.status >= 300) {
        const text = resQuestions.data?.message ?? "Unknown error";
        throw new Error(
          `Gagal menyimpan questions: ${resQuestions.status} ${text}`
        );
      }

      // 7) success
      toast.success("Quiz berhasil dibuat", { id: TOAST_ID });
      form.reset();
      router.push("/admin/dashboard/quizzes");
    } catch (err) {
      console.error("Submit error:", err);
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      // ganti loading -> error
      toast.error(message, { id: "create-quiz" });
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Quiz </FormLabel>
              <FormControl>
                <Input placeholder="Buat Judul Quiz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Quiz</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Buat Deskripsi Quiz"
                  rows={4}
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durasi (Menit)</FormLabel>
                <FormDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse
                  inventore totam alias!
                </FormDescription>
                <div className="flex items-center gap-2">
                  {/* 🕒 Minutes Picker */}
                  <ButtonGroup>
                    <Button size={"icon"} variant={"outline"}>
                      <Clock8Icon className="size-4" />
                    </Button>
                    <FormControl>
                      <TimePickerInput
                        picker="minutes"
                        date={
                          new Date(new Date().setMinutes(minutes, seconds, 0))
                        }
                        setDate={(newDate) =>
                          updateDuration(newDate?.getMinutes() ?? 0, seconds)
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <TimePickerInput
                        picker="seconds"
                        date={
                          new Date(new Date().setMinutes(minutes, seconds, 0))
                        }
                        setDate={(newDate) =>
                          updateDuration(minutes, newDate?.getSeconds() ?? 0)
                        }
                      />
                    </FormControl>
                  </ButtonGroup>
                </div>
                {form.formState.errors.duration && (
                  <FormMessage>
                    {form.formState.errors.duration.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <FormDescription>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Itaque eius quisquam quidem!
                </FormDescription>
                <FormControl>
                  <AsyncSelect<CategoryAPI>
                    fetcher={categoryService}
                    getDisplayValue={(option) => (
                      <div className={"max-w-xs"}>
                        <p className="truncate">{option.name}</p>
                      </div>
                    )}
                    renderOption={(item) => <div>{item.name}</div>}
                    getOptionValue={(item) => item.id}
                    label="Categories"
                    placeholder="Select Categories"
                    width={"100%"}
                    loadingSkeleton={
                      <div className="grid place-items-center">
                        <div className="text-muted-foreground  flex items-center gap-2 py-5">
                          <Spinner />
                          <p className="text-sm"> Loading...</p>
                        </div>
                      </div>
                    }
                    triggerClassName={cn("text-muted-foreground ")}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {questionFields.map((question, questionIndex) => (
          <QuestionCard
            key={question.id}
            questionIndex={questionIndex}
            form={form}
            removeQuestion={removeQuestion}
            handleCreate={handleCreate}
            // handleImageUpload={handleImageUpload}
            // removeImage={removeImage}
            // selectedImages={selectedImages}
            totalQuestions={questionFields.length}
          />
        ))}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2"
          >
            <Plus size={20} />
            Tambah Pertanyaan
          </Button>
        </div>
        {form.formState.isDirty && (
          <Button
            type="submit"
            className="w-full max-w-[200px]"
            disabled={isLoading}
          >
            {!isLoading ? (
              <>
                <Plus />
                Buat Quiz
              </>
            ) : (
              <>
                <Spinner />
                Membuat..
              </>
            )}
          </Button>
        )}
      </form>
    </Form>
  );
};
