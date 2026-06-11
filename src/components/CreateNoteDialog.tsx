import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useAuth } from '../contexts/AuthContext';

const CreateNoteDialog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const uploadToStorage = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axios.post('/api/uploadToStorage', {
        noteId,
      });
      return response.data;
    },
  });

  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        '/api/createNoteBook',
        {
          name: input,
          userId: user?.id,
        },
        {
          headers: {
            'x-user-id': user?.id,
          },
        }
      );
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === '') {
      window.alert('Please enter a name for your notebook');
      return;
    }
    createNotebook.mutate(undefined, {
      onSuccess: ({ note_id }) => {
        console.log('created new note:', { note_id });
        uploadToStorage.mutate(note_id);
        navigate(`/notebook/${note_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert('Failed to create new notebook');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="border-2 border-dashed border-black dark:border-white h-64 bg-white dark:bg-[#1c1b1b] flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-[#201f1f] transition-colors cursor-pointer group">
          <span className="material-symbols-outlined text-3xl text-gray-400 dark:text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors mb-2">
            add
          </span>
          <h2 className="font-label-md text-sm text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
            New Note
          </h2>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#1c1b1b] border-2 border-black dark:border-white p-0 max-w-md w-full rounded-none transition-colors">
        <DialogHeader className="p-6 border-b border-black dark:border-white transition-colors">
          <DialogTitle className="font-headline-md text-xl text-black dark:text-white m-0 transition-colors">
            Create Note
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col p-6 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-xs text-black dark:text-white uppercase tracking-widest transition-colors">
              Note Title
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Project Architecture"
              autoFocus
              className="wireframe-input w-full p-3 border border-black dark:border-white bg-white dark:bg-[#201f1f] font-body-md text-base text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-2 focus:border-black dark:focus:border-white transition-all"
            />
          </div>
          <div className="border-t border-black dark:border-white pt-4 flex justify-end items-center gap-4 transition-colors">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-transparent text-black dark:text-white font-label-md text-sm py-2 px-4 hover:underline transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createNotebook.isLoading}
              className="bg-black dark:bg-white text-white dark:text-black font-label-md text-sm py-2 px-6 border-2 border-black dark:border-white hover:bg-white dark:hover:bg-[#201f1f] hover:text-black dark:hover:text-white transition-colors disabled:opacity-50"
            >
              {createNotebook.isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
