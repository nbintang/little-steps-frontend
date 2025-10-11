"use client";
import { useEditor, EditorContent, Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const ContentRenderer = ({ content }: { content: Content }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,
    immediatelyRender: false,
  });
  if (!editor) return null;
  return <EditorContent editor={editor} />;
};
