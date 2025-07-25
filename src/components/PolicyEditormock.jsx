import React, { useEffect, useState, useCallback, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link2,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Dropdown from "./Dropdown";

// --- MOCK API (Simulates network requests) ---
// In a real app, this would be in its own file, e.g., 'src/api/policyApi.js'
const mockApi = {
  fetchVersions: async (policyTitle) => {
    console.log(`Fetching versions for: ${policyTitle}`);
    await new Promise((res) => setTimeout(res, 500));
    // Simulate finding existing versions
    return [
      {
        id: "v2",
        status: "published",
        content: `<h1>Published Policy</h1><p>This is the currently active version.</p>`,
        updatedAt: "2024-12-01T12:00:00Z",
      },
      {
        id: "v1",
        status: "draft",
        content: `<h2>Sample Policy</h2><p>This is a <strong>rich</strong> text <u>editor</u> with some initial content.</p>`,
        updatedAt: "2025-01-15T09:30:00Z",
      },
    ];
  },
  saveVersion: async (policyTitle, content, status) => {
    console.log(`Saving version for: ${policyTitle}`, { status, content });
    await new Promise((res) => setTimeout(res, 800));
    if (Math.random() > 0.9) {
      // Simulate a random network failure
      throw new Error("Failed to save. Please try again.");
    }
    return {
      id: `v${Date.now()}`,
      status,
      content,
      updatedAt: new Date().toISOString(),
    };
  },
};

// --- HELPER & CHILD COMPONENTS ---

const ToolbarButton = ({ onClick, isActive, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`}
    title={title}
  >
    {children}
  </button>
);

const LinkModal = ({ isOpen, onClose, onSave, initialUrl = "" }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
    }
  }, [isOpen, initialUrl]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0000001] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-medium mb-3">Set Link URL</h3>
        <input
          type="url"
          className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const EditorToolbar = ({ editor }) => {
  const [isLinkModalOpen, setLinkModalOpen] = useState(false);

  const openLinkModal = useCallback(() => {
    setLinkModalOpen(true);
  }, []);

  const closeLinkModal = useCallback(() => {
    setLinkModalOpen(false);
  }, []);

  const handleSetLink = useCallback(
    (url) => {
      if (url) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      } else {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      }
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border border-gray-300 rounded px-2 py-1 bg-white mb-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={openLinkModal}
          isActive={editor.isActive("link")}
          title="Set Link"
        >
          <Link2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Code"
        >
          <Code size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight size={18} />
        </ToolbarButton>
      </div>
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={closeLinkModal}
        onSave={handleSetLink}
        initialUrl={editor.getAttributes("link").href}
      />
    </>
  );
};

const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="h-40 bg-gray-200 rounded"></div>
    <div className="flex justify-end gap-4">
      <div className="h-10 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const PolicyEditor = ({ title }) => {
  const [status, setStatus] = useState("draft");
  const [showHtml, setShowHtml] = useState(false);
  const [versions, setVersions] = useState([]);
  const [currentVersionId, setCurrentVersionId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: true,
        orderedList: true,
        listItem: true,
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate: () => {
      setIsDirty(true);
    },
  });

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedVersions = await mockApi.fetchVersions(title);
        setVersions(fetchedVersions);

        const latestVersion = fetchedVersions[0];
        if (latestVersion && editor) {
          editor.commands.setContent(latestVersion.content, false);
          setStatus(latestVersion.status);
          setCurrentVersionId(latestVersion.id);
        }
        setIsDirty(false);
      } catch (err) {
        setError("Could not load policy data.", err);
        toast.error("Could not load policy data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [title, editor]);

  const handleSave = useCallback(async () => {
    if (!editor || isSaving) return;

    setIsSaving(true);
    setError(null);
    const htmlContent = editor.getHTML();

    try {
      const savedVersion = await mockApi.saveVersion(
        title,
        htmlContent,
        status
      );
      setVersions((prev) => [
        savedVersion,
        ...prev.filter((v) => v.id !== currentVersionId),
      ]);
      setCurrentVersionId(savedVersion.id);
      setIsDirty(false);
      toast.success(
        `${title.charAt(0).toUpperCase() + title.slice(1)} saved successfully!`
      );
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [editor, isSaving, title, status, currentVersionId]);

  const handleVersionSelect = useCallback(
    (version) => {
      if (isDirty) {
        if (
          !window.confirm(
            "You have unsaved changes. Are you sure you want to discard them and load a different version?"
          )
        ) {
          return;
        }
      }
      editor?.commands.setContent(version.content, false);
      setStatus(version.status);
      setCurrentVersionId(version.id);
      setIsDirty(false);
      toast.info(
        `Loaded version from ${new Date(
          version.updatedAt
        ).toLocaleDateString()}`
      );
    },
    [editor, isDirty]
  );

  const formattedTitle = useMemo(() => title.replace(/-/g, " "), [title]);

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded shadow-sm border border-gray-200">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold capitalize text-gray-800">
          {formattedTitle}
        </h2>
        <div className="flex items-center justify-end">
          <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer user-select-none">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={showHtml}
              onChange={(e) => setShowHtml(e.target.checked)}
            />
            <span>Show in HTML Format</span>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}
        {showHtml && (
          <pre className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded text-sm overflow-auto whitespace-pre-wrap text-gray-800">
            {editor?.getHTML()}
          </pre>
        )}
        {!showHtml && (
          <>
            <EditorToolbar editor={editor} />

            <EditorContent
              editor={editor}
              className="border text-sm border-gray-300 p-3 rounded-md min-h-[250px] focus-within:ring-3 focus-within:ring-gray-200 transition-shadow 
      [&_.ProseMirror]:min-h-[250px] 
      [&_.ProseMirror]:outline-none 
      [&_.ProseMirror]:break-words 
      [&_.ProseMirror]:whitespace-pre-wrap 
      [&_.ProseMirror]:overflow-x-auto"
            />
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-end items-center mt-2">
          <div className="w-1/4">
            <Dropdown
              label="Status"
              value={status}
              options={["draft", "published"]}
              islable={false}
              onChange={(e) => {
                setStatus(e.target.value);
                setIsDirty(true); // Mark as dirty so Save is enabled
              }}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="w-full sm:w-auto bg-[#783904] text-white px-6 py-2 rounded-md hover:bg-[#ad4f04] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 font-semibold"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        <div>
          <h3 className="font-medium text-sm text-gray-700 mt-4 mb-2">
            Version History
          </h3>
          <ul className="space-y-1 text-sm text-gray-600">
            {versions.map((v) => (
              <li key={v.id}>
                <button
                  onClick={() => handleVersionSelect(v)}
                  className={`w-full text-left p-2 rounded-md transition-colors ${
                    v.id === currentVersionId
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span
                    className={`capitalize px-2 py-0.5 rounded-full text-xs ${
                      v.status === "published"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {v.status}
                  </span>
                  <span className="ml-3">
                    {new Date(v.updatedAt).toLocaleString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PolicyEditor;
