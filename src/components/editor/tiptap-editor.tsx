import React, { useState, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Strikethrough,
  Image as ImageIcon,
  Code,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { handlePresignedUrl } from "@/app/actions/misc";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  existingFiles?: string[];
  name?: string;
  setValue?: (name: string, v: string[]) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  className,
  existingFiles = [],
  name,
  setValue,
}) => {
  // Extract image URLs from the initial value
  const extractImageUrls = (html: string): string[] => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const urls: string[] = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  };

  // Initialize state for gallery & loading
  const [files, setFiles] = useState<string[]>([
    ...existingFiles,
    ...extractImageUrls(value),
  ]);
  const [loading, setLoading] = useState(false);

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize TipTap editor
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] w-full rounded-br-none rounded-bl-none bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
          HTMLAttributes: { class: "font-bold text-lg" },
        },
        bulletList: { HTMLAttributes: { class: "list-disc pl-4" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-4" } },
      }),
      TextStyle,
      Color,
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: { class: "editor-image" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Upload handler (your existing onDrop logic)
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setLoading(true);
      try {
        for (const file of acceptedFiles) {
          const filename = file.name.replace(/\s+/g, "-");
          const body = {
            filename,
            contentType: file.type || "multipart/form-data",
            size: file.size,
          };
          const result = await handlePresignedUrl(body);
          if (result?.success) {
            await fetch(result.data.presignedUrl, {
              method: "PUT",
              headers: { "Content-Type": file.type },
              body: file,
            });
            const accessUrl = result.data.imageUrl;
            setFiles((prev) => {
              const next = [...prev, accessUrl];
              if (name && setValue) {
                setValue(name, next);
              }
              return next;
            });
          }
        }
      } catch (err) {
        console.error("File upload failed:", err);
      } finally {
        setLoading(false);
      }
    },
    [name, setValue]
  );

  // Trigger file picker
  const addImage = () => {
    fileInputRef.current?.click();
  };

  // Handle native file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onDrop(Array.from(e.target.files));
      e.target.value = ""; // reset to allow re-uploading same file
    }
  };

  if (!editor) return null;

  // Insert a clicked gallery image into the editor
  const insertFromGallery = (url: string) => {
    editor.chain().focus().setImage({ src: url, alt: "Gallery image" }).run();
  };

  return (
    <div
      className={cn("editor-container relative border rounded-lg", className)}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-muted/50 border-b rounded-t-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted text-primary" : ""}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted text-primary" : ""}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-muted text-primary" : ""}
          type="button"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-muted text-primary"
              : ""
          }
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-muted text-primary"
              : ""
          }
          type="button"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList") ? "bg-muted text-primary" : ""
          }
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList") ? "bg-muted text-primary" : ""
          }
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock") ? "bg-muted text-primary" : ""
          }
          type="button"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={addImage} type="button">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.commands.undo()}
          disabled={!editor.can().chain().focus().undo().run()}
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.commands.redo()}
          disabled={!editor.can().chain().focus().redo().run()}
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden multiple-file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Editor content */}
      <EditorContent editor={editor} className="tiptap" />

      {/* Gallery below editor */}
      <div className="mt-2 flex gap-2 overflow-x-auto p-2 bg-muted/10 rounded-b-lg">
        {loading && <span className="italic">Uploading…</span>}
        {files.map((url) => (
          <picture key={url}>
            <img
              src={url}
              alt="uploaded thumbnail"
              className="h-16 w-16 object-cover rounded cursor-pointer border hover:border-primary"
              onClick={() => insertFromGallery(url)}
            />
          </picture>
        ))}
      </div>
    </div>
  );
};

export default TipTapEditor;
