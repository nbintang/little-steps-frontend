"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { QuizSchema } from "../../../schemas/quiz-schema";
import MinimalTiptapQuestionEditor from "../../content-editor/minimal-tiptap-question";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { AnswerField } from "./answer-field";
import { Label } from "@/components/ui/label";
interface QuestionCardProps {
  questionIndex: number;
  form: UseFormReturn<QuizSchema>;
  removeQuestion: (index: number) => void;
  totalQuestions: number;
  handleCreate: ({ editor }: { editor: Editor }) => void;
}

export function QuestionCard({
  questionIndex,
  handleCreate,
  form,
  removeQuestion,
  totalQuestions,
}: QuestionCardProps) {
  const {
    fields: answerFields,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control: form.control,
    name: `questions.${questionIndex}.answers`,
  });

  const addAnswer = () => {
    appendAnswer({ text: "", imageAnswer: [], isCorrect: false });
  };

  return (
    <Card className="border-2 border-muted bg-card/50 shadow-sm">
      <CardHeader className="flex flex-row justify-between items-start space-y-0">
        <CardTitle className="text-lg font-semibold">
          Pertanyaan {questionIndex + 1}
        </CardTitle>

        {totalQuestions > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeQuestion(questionIndex)}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={18} />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6"> 
        <FormField
          control={form.control}
          name={`questions.${questionIndex}.questionJson` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Isi Pertanyaan</FormLabel>
              <FormControl>
                <MinimalTiptapQuestionEditor
                  {...field}
                  throttleDelay={0}
                  className={cn("w-full min-h-[200px]", {
                    "border-destructive focus-within:border-destructive":
                      form.formState.errors.questions?.[questionIndex]
                        ?.questionJson,
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

        <Separator />
 

        <div className="space-y-4">
          {answerFields.map((answer, answerIndex) => (
            <AnswerField
              key={answer.id}
              questionIndex={questionIndex}
              answerIndex={answerIndex}
              form={form}
              removeAnswer={removeAnswer} 
              totalAnswers={answerFields.length}
            />
          ))}
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Pilihan Jawaban</Label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addAnswer}
              className="  flex items-center gap-1"
            >
              <Plus size={16} />
              Tambah Jawaban
            </Button>
          </div> 
          {form.formState.errors.questions?.[questionIndex]?.answers && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.questions[questionIndex]?.answers?.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
