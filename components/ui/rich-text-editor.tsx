"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import mammoth from "mammoth";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
  Minus,
  Palette,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Type,
  Trash2,
  Plus,
  FileUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ENDPOINTS, API_BASE_URL } from "@/lib/api/config";
import { getAuthToken } from "@/lib/auth/cookies";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Gray", value: "#6b7280" },
];

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Pink", value: "#fce7f3" },
  { name: "Orange", value: "#fed7aa" },
  { name: "Purple", value: "#e9d5ff" },
];

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
  disabled = false,
  className,
}: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [isConvertingDocx, setIsConvertingDocx] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // We'll add it separately
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800 cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlock,
      HorizontalRule,
      Subscript,
      Superscript,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="border-2 border-slate-300 rounded-lg overflow-hidden bg-white">
        <div className="p-4 min-h-[300px] flex items-center justify-center text-slate-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mx-auto mb-2"></div>
            <p className="text-sm">Loading editor...</p>
          </div>
        </div>
      </div>
    );
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      e.target.value = "";
      return;
    }

    setIsUploadingImage(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Get auth token
      const token = getAuthToken();
      const baseUrl = API_BASE_URL || 'https://api.lccigq.com';

      // Upload file to backend
      const response = await fetch(`${baseUrl}${ENDPOINTS.upload.file()}`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      // Handle API response structure: { success, message, data: { url, fileName } }
      const imageUrl = data.data?.url || data.url || (data.data && typeof data.data === 'string' ? data.data : null);

      if (!imageUrl) {
        throw new Error('No URL returned from upload');
      }

      // Insert image into editor using the returned URL
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  const handleDocxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a .docx file
    if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      alert('Please upload a .docx or .doc file');
      e.target.value = "";
      return;
    }

    setIsConvertingDocx(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      // Set the HTML content in the editor
      editor.commands.setContent(result.value);
      
      // Show warnings if any
      if (result.messages.length > 0) {
        console.warn('Docx conversion warnings:', result.messages);
      }
    } catch (error) {
      console.error('Error converting docx:', error);
      alert('Failed to convert document. Please make sure it\'s a valid .docx file.');
    } finally {
      setIsConvertingDocx(false);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const setHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
    setShowHighlightPicker(false);
  };

  return (
    <div className={cn("border-2 border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm", className)}>
      {/* Enhanced Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("bold") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("italic") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("underline") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("strike") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 ml-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={cn(
                "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
                editor.isActive("subscript") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
              )}
              title="Subscript"
            >
              <SubscriptIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={cn(
                "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
                editor.isActive("superscript") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
              )}
              title="Superscript"
            >
              <SuperscriptIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("heading", { level: 1 }) && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("heading", { level: 2 }) && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("heading", { level: 3 }) && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists & Quote */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("bulletList") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("orderedList") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("blockquote") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("codeBlock") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive({ textAlign: "left" }) && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive({ textAlign: "center" }) && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive({ textAlign: "right" }) && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive({ textAlign: "justify" }) && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        {/* Colors & Highlight */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 hover:bg-slate-200 transition-colors"
                title="Text Color"
              >
                <Type className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-2">
                <p className="text-sm font-semibold mb-2">Text Color</p>
                <div className="grid grid-cols-3 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setColor(color.value)}
                      className="h-8 w-full rounded border-2 border-slate-300 hover:border-slate-500 transition-colors"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover open={showHighlightPicker} onOpenChange={setShowHighlightPicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
                  editor.isActive("highlight") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
                )}
                title="Highlight"
              >
                <Highlighter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-2">
                <p className="text-sm font-semibold mb-2">Highlight Color</p>
                <div className="grid grid-cols-3 gap-2">
                  {HIGHLIGHT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setHighlight(color.value)}
                      className="h-8 w-full rounded border-2 border-slate-300 hover:border-slate-500 transition-colors"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run();
                    setShowHighlightPicker(false);
                  }}
                  className="w-full mt-2"
                >
                  Remove Highlight
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Media & Insert */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <input
            type="file"
            ref={docxInputRef}
            accept=".docx,.doc"
            onChange={handleDocxUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => docxInputRef.current?.click()}
            disabled={isConvertingDocx}
            className={cn(
              "h-9 px-2 text-xs hover:bg-slate-200 transition-colors",
              isConvertingDocx && "opacity-50 cursor-not-allowed"
            )}
            title="Upload Word Document (.docx)"
          >
            {isConvertingDocx ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-600 mr-1"></div>
                <span>Converting...</span>
              </>
            ) : (
              <>
                <FileUp className="h-3 w-3 mr-1" />
                <span>Upload DOCX</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 w-9 p-0 hover:bg-slate-200 transition-colors"
            title="Upload Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            className="h-9 w-9 p-0 hover:bg-slate-200 transition-colors"
            title="Insert Image URL"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={cn(
              "h-9 w-9 p-0 hover:bg-slate-200 transition-colors",
              editor.isActive("link") && "bg-[color:var(--brand-blue)] text-white hover:bg-[color:var(--brand-blue)]/90"
            )}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="h-9 w-9 p-0 hover:bg-slate-200 transition-colors"
            title="Horizontal Rule"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Table Controls */}
        {editor.isActive("table") && (
          <div className="flex items-center gap-2 border-r border-slate-300 pr-2 mr-2">
            {/* Row Controls */}
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-md">
              <span className="text-xs font-medium text-slate-600 mr-1">Row:</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addRowBefore}
                className="h-8 px-2 text-xs hover:bg-slate-200 transition-colors"
                title="Add Row Above"
              >
                <Plus className="h-3 w-3 mr-1" />
                <span>Above</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addRowAfter}
                className="h-8 px-2 text-xs hover:bg-slate-200 transition-colors"
                title="Add Row Below"
              >
                <Plus className="h-3 w-3 mr-1" />
                <span>Below</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={deleteRow}
                className="h-8 px-2 text-xs hover:bg-red-100 transition-colors text-red-600 hover:text-red-700"
                title="Delete Row"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                <span>Delete</span>
              </Button>
            </div>
            {/* Column Controls */}
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-md">
              <span className="text-xs font-medium text-slate-600 mr-1">Col:</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addColumnBefore}
                className="h-8 px-2 text-xs hover:bg-slate-200 transition-colors"
                title="Add Column Left"
              >
                <Plus className="h-3 w-3 mr-1" />
                <span>Left</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addColumnAfter}
                className="h-8 px-2 text-xs hover:bg-slate-200 transition-colors"
                title="Add Column Right"
              >
                <Plus className="h-3 w-3 mr-1" />
                <span>Right</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={deleteColumn}
                className="h-8 px-2 text-xs hover:bg-red-100 transition-colors text-red-600 hover:text-red-700"
                title="Delete Column"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                <span>Delete</span>
              </Button>
            </div>
            {/* Table Actions */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={deleteTable}
              className="h-8 px-2 text-xs hover:bg-red-100 transition-colors text-red-600 hover:text-red-700 border border-red-300"
              title="Delete Entire Table"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              <span>Delete Table</span>
            </Button>
          </div>
        )}

        {/* Table Insert */}
        {!editor.isActive("table") && (
          <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertTable}
              className="h-9 w-9 p-0 hover:bg-slate-200 transition-colors"
              title="Insert Table"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="h-9 w-9 p-0 hover:bg-slate-200 transition-colors disabled:opacity-50"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="h-9 w-9 p-0 hover:bg-slate-200 transition-colors disabled:opacity-50"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-6 min-h-[400px] focus-within:outline-none bg-white">
        <EditorContent 
          editor={editor}
          className="prose prose-slate max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[350px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:focus:outline-none [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child::before]:text-slate-400 [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:h-0 [&_table]:border-collapse [&_table]:w-full [&_table]:my-4 [&_table]:border [&_table]:border-slate-300 [&_table_td]:border [&_table_td]:border-slate-300 [&_table_td]:px-4 [&_table_td]:py-2 [&_table_td]:bg-white [&_table_th]:border [&_table_th]:border-slate-300 [&_table_th]:px-4 [&_table_th]:py-2 [&_table_th]:bg-slate-100 [&_table_th]:font-semibold [&_table_th]:text-left [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-md [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800 [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_hr]:my-8 [&_hr]:border-t [&_hr]:border-slate-300"
        />
      </div>
    </div>
  );
}
