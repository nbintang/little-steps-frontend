import * as React from "react";
import "@/components/ui/minimal-tiptap/styles/index.css";

import type { Content, Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import SectionOne from "@/components/ui/minimal-tiptap/components/section/one";
import SectionTwo from "@/components/ui/minimal-tiptap/components/section/two";
import SectionThree from "@/components/ui/minimal-tiptap/components/section/three";
import SectionFour from "@/components/ui/minimal-tiptap/components/section/four";
import SectionFive from "@/components/ui/minimal-tiptap/components/section/five";
import useMinimalTiptapEditor, {
  type UseMinimalTiptapEditorProps,
} from "@/components/ui/minimal-tiptap/hooks/use-minimal-tiptap";
import { MeasuredContainer } from "@/components/ui/minimal-tiptap/components/measured-container";
import { LinkBubbleMenu } from "@/components/ui/minimal-tiptap/components/bubble-menu/link-bubble-menu";

export interface MinimalTiptapProps
  extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <ScrollArea className=" border-b border-border p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionTwo
        editor={editor}
        activeActions={["bold", "italic", "underline"]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        allowImagesUpload={false}
        allowLinkUpload={false}
        activeActions={["blockquote"]}
        mainActionCount={0}
      />
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
);

export const MinimalTiptapQuestionEditor = ({
  value,
  onChange,
  className,
  editorContentClassName,
  ...props
}: MinimalTiptapProps) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    ...props,
  });

  if (!editor) {
    return null;
  }

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      className={cn(
        "border-input min-data-[orientation=vertical]:h-72 flex h-auto w-full flex-col rounded-md border shadow-xs",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        className
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cn("minimal-tiptap-editor", editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  );
};

MinimalTiptapQuestionEditor.displayName = "MinimalTiptapQuestionEditor";

export default MinimalTiptapQuestionEditor;
