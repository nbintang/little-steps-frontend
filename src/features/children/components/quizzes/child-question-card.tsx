import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ContentRenderer } from "@/features/parent/components/content-renderer";
import { Content } from "@tiptap/react";
import { Answer } from "@/types/quiz-play";

export default function QuestionCard({
  index,
  total,
  questionJson,
  answers,
  selectedAnswerId,
  onSelect,
}: {
  index: number;
  total: number;
  questionJson: Content | null;
  answers: Answer[];
  selectedAnswerId?: string;
  onSelect: (answerId: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl text-balance">
          Question {index + 1} of {total}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ContentRenderer content={questionJson} />

        <RadioGroup
          className="mt-4 grid gap-3"
          value={selectedAnswerId}
          onValueChange={(val) => onSelect(val)}
        >
          {answers.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent"
            >
              <RadioGroupItem id={a.id} value={a.id} />
              {a.imageAnswer ? (
                <Image
                  src={
                    a.imageAnswer ||
                    "/placeholder.svg?height=64&width=64&query=answer option"
                  }
                  alt="Answer option image"
                  width={64}
                  height={64}
                  className="rounded-md border"
                />
              ) : null}
              <Label htmlFor={a.id} className="cursor-pointer">
                {a.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
