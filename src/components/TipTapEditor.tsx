import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, Extension } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useDebounce } from '../lib/useDebounce';
import type { NoteType } from '../lib/types';

interface TipTapEditorProps {
  note: NoteType;
}

// Shared AI completion logic - works with any ProseMirror editor instance
function triggerAICompletion(editor: any, completingRef: React.MutableRefObject<boolean>) {
  if (completingRef.current) return;

  completingRef.current = true;
  const prompt = editor.getText().split(' ').slice(-30).join(' ');

  console.log('AI Autocomplete triggered with prompt:', prompt);

  axios
    .post('/api/completion', { prompt })
    .then((response) => {
      const completion = response.data;
      console.log('Got completion:', completion);
      if (completion) {
        editor.commands.insertContent(completion);
      }
    })
    .catch((error) => {
      console.error('Completion error:', error);
    })
    .finally(() => {
      completingRef.current = false;
    });
}

const TipTapEditor = ({ note }: TipTapEditorProps) => {
  const [editorState, setEditorState] = useState(
    note.editorState || `<h1>${note.name}</h1>`
  );
  const completingRef = useRef(false);
  const editorRef = useRef<any>(null);

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.put('/api/saveNote', {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });

  // Create AI Autocomplete extension
  const AIAutocomplete = Extension.create({
    name: 'aiAutocomplete',
    addKeyboardShortcuts() {
      return {
        'Alt-Shift-a': () => {
          triggerAICompletion(this.editor, completingRef);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, AIAutocomplete],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const debouncedEditorState = useDebounce(editorState, 500);

  useEffect(() => {
    if (debouncedEditorState === '') return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log('success update!', data);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  }, [debouncedEditorState]);

  // Word count
  const wordCount = editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0;

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Formatting Toolbar */}
      <div className="sticky top-0 z-20 w-full mb-6 bg-[#f9f9f9] dark:bg-[#141313] border-2 border-black dark:border-white p-2 flex items-center justify-between wireframe-button-shadow dark:shadow-white/20 transition-colors">
        <div className="flex items-center gap-2">
          {/* Text Styles */}
          <div className="flex items-center border border-black dark:border-white bg-white dark:bg-[#201f1f] transition-colors">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2a2a2a] border-r border-gray-300 dark:border-gray-700 transition-colors ${
                editor.isActive('bold') ? 'bg-black text-white' : ''
              }`}
              title="Bold"
            >
              <span className="material-symbols-outlined text-sm font-bold">format_bold</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2a2a2a] border-r border-gray-300 dark:border-gray-700 transition-colors ${
                editor.isActive('italic') ? 'bg-black text-white' : ''
              }`}
              title="Italic"
            >
              <span className="material-symbols-outlined text-sm italic">format_italic</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors ${
                editor.isActive('strike') ? 'bg-black text-white' : ''
              }`}
              title="Underline"
            >
              <span className="material-symbols-outlined text-sm underline">format_underlined</span>
            </button>
          </div>

          {/* Headers */}
          <div className="flex items-center border border-black dark:border-white bg-white dark:bg-[#201f1f] ml-2 hidden sm:flex transition-colors">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2a2a2a] border-r border-gray-300 dark:border-gray-700 font-label-sm font-bold text-black dark:text-white transition-colors ${
                editor.isActive('heading', { level: 1 }) ? 'bg-black text-white' : ''
              }`}
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2a2a2a] border-r border-gray-300 dark:border-gray-700 font-label-sm font-bold text-black dark:text-white transition-colors ${
                editor.isActive('heading', { level: 2 }) ? 'bg-black text-white' : ''
              }`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2a2a2a] font-label-sm text-black dark:text-white transition-colors ${
                editor.isActive('paragraph') && !editor.isActive('heading') ? 'bg-black text-white' : ''
              }`}
              title="Paragraph"
            >
              P
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center border border-black dark:border-white bg-white dark:bg-[#201f1f] ml-2 hidden md:flex transition-colors">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2a2a2a] border-r border-gray-300 dark:border-gray-700 transition-colors ${
                editor.isActive('bulletList') ? 'bg-black text-white' : ''
              }`}
              title="Bullet List"
            >
              <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors ${
                editor.isActive('orderedList') ? 'bg-black text-white' : ''
              }`}
              title="Numbered List"
            >
              <span className="material-symbols-outlined text-sm">format_list_numbered</span>
            </button>
          </div>
        </div>

        {/* Right side - Word count + AI + Save status */}
        <div className="flex items-center gap-4">
          <span className="font-label-sm text-xs text-gray-400 hidden sm:block">
            Words: {wordCount}
          </span>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block transition-colors"></div>

          {/* AI Assist Button */}
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 transition-colors"
            title="AI Assist (Alt+Shift+A)"
            onClick={() => {
              if (editor) {
                triggerAICompletion(editor, completingRef);
              }
            }}
          >
            <span className="material-symbols-outlined text-sm text-black dark:text-white transition-colors">auto_awesome</span>
            <span className="font-label-sm text-xs hidden md:inline text-black dark:text-white transition-colors">Assist</span>
          </button>

          {/* Save Status */}
          <span
            className={`font-label-sm text-xs px-2 py-1 border transition-colors ${
              saveNote.isLoading
                ? 'border-black dark:border-white bg-gray-100 dark:bg-[#2a2a2a]'
                : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {saveNote.isLoading ? 'Saving...' : 'Saved'}
          </span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <EditorContent
          editor={editor}
          className="prose prose-sm w-full min-h-[400px] focus:outline-none"
        />
      </div>
      {/* AI Shortcut hint */}
      <div className="mt-4 flex justify-end">
        <span className="font-label-sm text-xs text-gray-400 dark:text-gray-500">
          Tip: Press{' '}
          <kbd className="px-1.5 py-0.5 font-mono text-xs border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#201f1f]">
            Alt + Shift + A
          </kbd>{' '}
          for AI autocomplete
        </span>
      </div>
    </div>
  );
};

export default TipTapEditor;
