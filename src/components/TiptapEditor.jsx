import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  UploadCloud,
  Bold,
  Italic,
  List,
  Undo2,
  Redo2,
  Link as LinkIcon,
} from "lucide-react";

const TiptapEditor = ({
  label,
  option,
  value,
  set,
  placeholder,
  isLabel = true,
  extra,
}) => {
  const fileInputRef = React.useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start typing...",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${extra || ""}`,
      },
    },
    onUpdate: ({ editor }) => {
      set?.(editor.getHTML());
    },
  });

  // ✅ Sync external value changes safely
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        editor?.commands.setContent(text);
        set?.(text);
      };
      reader.readAsText(file);
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  if (!editor) return null;

  return (
    <div>
      {/* Label + Upload Option */}
      <div className="flex justify-between mb-1">
        {isLabel && <label className="block font-medium">{label}</label>}
        {option && (
          <div
            className="text-blue-600 text-xs inline-flex gap-1 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={16} /> Upload .txt File
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2 border border-gray-200 rounded-md p-2 bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded ${editor.isActive("bulletList") ? "bg-gray-300" : ""}`}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`p-1 rounded ${editor.isActive("link") ? "bg-gray-300" : ""}`}
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1 rounded"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1 rounded"
        >
          <Redo2 size={16} />
        </button>
      </div>

      {/* ✅ Editor container — clickable anywhere including top-left */}
      <div
        className="w-full border border-gray-300 rounded-md bg-white min-h-[200px] px-3 py-2 cursor-text"
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent
          editor={editor}
          className="min-h-[200px] leading-relaxed text-gray-800"
        />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".txt"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default TiptapEditor;
