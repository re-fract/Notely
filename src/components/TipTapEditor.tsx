import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, Extension } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import TipTapMenuBar from './TipTapMenuBar';
import { Button } from './ui/button';
import { useDebounce } from '../lib/useDebounce';
import type { NoteType } from '../lib/types';

interface TipTapEditorProps {
  note: NoteType;
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
          if (completingRef.current) return true;
          
          completingRef.current = true;
          const prompt = this.editor.getText().split(' ').slice(-30).join(' ');
          
          console.log('AI Autocomplete triggered with prompt:', prompt);
          
          axios.post('/api/completion', { prompt })
            .then((response) => {
              const completion = response.data;
              console.log('Got completion:', completion);
              if (completion) {
                this.editor.commands.insertContent(completion);
              }
            })
            .catch((error) => {
              console.error('Completion error:', error);
            })
            .finally(() => {
              completingRef.current = false;
            });
          
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit,
      AIAutocomplete,
    ],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  // Store editor ref
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const debouncedEditorState = useDebounce(editorState, 500);
  
  useEffect(() => {
    // save to db
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

  return (
    <>
      <div className="flex">
        {editor && <TipTapMenuBar editor={editor} />}
        <Button disabled variant={'outline'}>
          {saveNote.isLoading ? 'Saving...' : 'Saved'}
        </Button>
      </div>

      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>
      <div className="h-4"></div>
      <span className="text-sm">
        Tip: Press{' '}
        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
          Alt + Shift + A
        </kbd>{' '}
        for AI autocomplete
      </span>
    </>
  );
};

export default TipTapEditor;
