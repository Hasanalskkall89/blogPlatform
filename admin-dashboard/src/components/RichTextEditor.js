'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useCallback, useEffect } from 'react';
import {
  FiBold, FiCode, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight,
  FiLink, FiImage, FiList, FiMinus, FiRotateCcw, FiRotateCw,
  FiType, FiGrid, FiTrash2,
} from 'react-icons/fi';
import {
  RiStrikethrough, RiDoubleQuotesL, RiListOrdered, RiH1, RiH2, RiH3,
  RiMarkPenLine, RiPaintFill,
} from 'react-icons/ri';
import { API_URL } from '@/config';

function ToolbarButton({ onClick, isActive, children, title, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-0.5 sm:mx-1" />;
}

export default function RichTextEditor({ content, onChange, onImageInsert }) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-indigo-600 underline hover:text-indigo-800' },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder: 'Start writing article content here...',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none rtl dark:prose-invert focus:outline-none min-h-[300px] sm:min-h-[400px] px-3 sm:px-5 py-3 sm:py-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const addLink = useCallback(() => {
    if (!linkUrl) return;
    editor.chain().focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl })
      .run();
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
  }, [editor]);

  const addImage = useCallback((url) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const colors = [
    '#000000', '#434343', '#666666', '#999999',
    '#DC2626', '#EA580C', '#D97706', '#65A30D',
    '#059669', '#0891B2', '#2563EB', '#7C3AED',
    '#C026D3', '#E11D48',
  ];

  const highlightColors = [
    '#FEF08A', '#FDE68A', '#BBF7D0', '#BAE6FD',
    '#DDD6FE', '#FBCFE8', '#FED7AA', '#E5E7EB',
  ];

  if (!editor) return null;

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-750 p-1.5 sm:p-2 flex flex-wrap gap-0.5 sm:gap-1 items-center">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!editor.can().undo()}>
          <FiRotateCcw className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!editor.can().redo()}>
          <FiRotateCw className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <RiH1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <RiH2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <RiH3 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
          <FiBold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
          <FiItalic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
          <FiUnderline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
          <RiStrikethrough className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Color */}
        <div className="relative">
          <ToolbarButton onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }} title="Text Color">
            <RiPaintFill className="w-4 h-4" />
          </ToolbarButton>
          {showColorPicker && (
            <div className="absolute top-full right-0 mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 grid grid-cols-7 gap-1 w-max">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => { editor.chain().focus().setColor(color).run(); setShowColorPicker(false); }}
                  className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                type="button"
                onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }}
                className="col-span-7 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-1"
              >
                Remove Color
              </button>
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="relative">
          <ToolbarButton onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }} isActive={editor.isActive('highlight')} title="Highlight">
            <RiMarkPenLine className="w-4 h-4" />
          </ToolbarButton>
          {showHighlightPicker && (
            <div className="absolute top-full right-0 mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 grid grid-cols-4 gap-1 w-max">
              {highlightColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => { editor.chain().focus().toggleHighlight({ color }).run(); setShowHighlightPicker(false); }}
                  className="w-6 h-6 rounded border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                type="button"
                onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightPicker(false); }}
                className="col-span-4 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-1"
              >
                Remove Highlight
              </button>
            </div>
          )}
        </div>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <FiAlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <FiAlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <FiAlignLeft className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
          <FiList className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
          <RiListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Blockquote & Code */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
          <RiDoubleQuotesL className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code">
          <FiCode className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton onClick={() => setShowLinkInput(!showLinkInput)} isActive={editor.isActive('link')} title="Link">
            <FiLink className="w-4 h-4" />
          </ToolbarButton>
          {showLinkInput && (
            <div className="absolute top-full right-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 flex gap-2 w-72">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
                dir="ltr"
              />
              <button type="button" onClick={addLink} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Add
              </button>
              {editor.isActive('link') && (
                <button type="button" onClick={removeLink} className="px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Image */}
        <ToolbarButton onClick={() => onImageInsert && onImageInsert(addImage)} title="Image">
          <FiImage className="w-4 h-4" />
        </ToolbarButton>

        {/* Table */}
        <ToolbarButton onClick={insertTable} title="Table">
          <FiGrid className="w-4 h-4" />
        </ToolbarButton>

        {/* Horizontal Rule */}
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <FiMinus className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <div onClick={() => editor.chain().focus().run()} className="cursor-text">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
