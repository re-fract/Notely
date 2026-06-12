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

interface DeleteButtonProps {
  noteId: number;
}

const DeleteButton = ({ noteId }: DeleteButtonProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/deleteNote', {
        noteId,
      });
      return response.data;
    },
  });

  const handleDelete = () => {
    deleteNote.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        navigate('/dashboard');
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-600 border border-transparent transition-colors group relative"
        >
          <span className="material-symbols-outlined text-sm group-hover:text-red-600 transition-colors">
            delete
          </span>
          <span className="font-label-sm text-xs hidden md:inline group-hover:text-red-600 transition-colors">
            Delete
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#1c1b1b] border-2 border-black dark:border-white p-0 max-w-md w-full rounded-none transition-colors">
        <DialogHeader className="p-6 border-b-2 border-black dark:border-white transition-colors">
          <DialogTitle className="font-headline-md text-xl text-black dark:text-white m-0 transition-colors">
            Confirm Deletion
          </DialogTitle>
          <p className="font-body-md text-base text-gray-600 dark:text-gray-400 mt-2 transition-colors">
            Are you sure you want to delete this note? This action cannot be undone.
          </p>
        </DialogHeader>
        <div className="p-4 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="font-label-md text-sm px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteNote.isLoading}
            className="bg-red-600 text-white font-label-md text-sm px-6 py-2 border-2 border-red-600 hover:bg-white hover:text-red-600 transition-colors disabled:opacity-50"
          >
            {deleteNote.isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
