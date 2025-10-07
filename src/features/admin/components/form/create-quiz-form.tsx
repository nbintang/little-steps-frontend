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
import { useCallback, useRef } from "react";
import { CreateQuizSchema, createQuizSchema } from "../../schemas/quiz-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Content, Editor } from "@tiptap/react";
import { Textarea } from "@/components/ui/textarea";
import { Clock8Icon } from "lucide-react";
import { AsyncSelect } from "@/components/ui/async-select";
import { CategoryAPI } from "@/types/category";
import { categoryService } from "@/services/category-service";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import MinimalTiptapArticleEditor from "../content-editor/minimal-tiptap-article";
export const CreateQuizForm = () => {
  const editorRef = useRef<Editor | null>(null);
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
              imageAnswer: "",
              isCorrect: false,
            },
          ],
        },
      ],
    },
  });
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
  const onSubmit = async (data: CreateQuizSchema) => {
    console.log(data);
  };
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
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem className="w-full max-w-xs space-y-2">
              <FormLabel htmlFor="duration">
                Time input with start icon
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                    <Clock8Icon className="size-4" />
                    <span className="sr-only">User</span>
                  </div>
                  <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    defaultValue="08:30:00"
                    className="peer bg-background appearance-none pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    {...field}
                  />
                </div>{" "}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
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
              <FormDescription>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque
                eius quisquam quidem!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
    <FormField
            control={form.control}
            name="contentJson"
            render={({ field }) => (
              <FormItem className="lg:col-span-2">
                <FormLabel>Konten</FormLabel>{" "}
                <FormDescription>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Itaque eius quisquam quidem!
                </FormDescription>
                <FormControl>
                  <MinimalTiptapArticleEditor
                    {...field}
                    throttleDelay={0}
                    className={cn("w-full min-h-[200px]", {
                      "border-destructive focus-within:border-destructive":
                        form.formState.errors.contentJson?.message,
                    })}
                    editorContentClassName="some-class"
                    editorClassName="focus:outline-hidden p-5"
                    output="json"
                    placeholder="Write something..."
                    onCreate={handleCreate}
                    autofocus
                    immediatelyRender
                    editable
                    injectCSS
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

      </form>
    </Form>
  );
};
