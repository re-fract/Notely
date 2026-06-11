import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface DeleteButtonProps {
  noteId: number;
}

const DeleteButton = ({ noteId }: DeleteButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
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
        setShowConfirm(false);
        navigate('/dashboard');
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  return (
    <>
      <button
        className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-600 border border-transparent transition-colors group relative"
        onClick={() => setShowConfirm(true)}
      >
        <span className="material-symbols-outlined text-sm group-hover:text-red-600 transition-colors">
          delete
        </span>
        <span className="font-label-sm text-xs hidden md:inline group-hover:text-red-600 transition-colors">
          Delete
        </span>
      </button>

      {/* Custom Wireframe Confirmation Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(false)}
          />
          {/* Dialog */}
          <div className="relative bg-white border-2 border-black wireframe-card-shadow w-full max-w-md z-10">
            {/* Header */}
            <div className="p-6 border-b-2 border-black">
              <h2 className="font-headline-md text-xl text-black">Confirm Deletion</h2>
              <p className="font-body-md text-base text-gray-600 mt-2">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
            </div>
            {/* Actions */}
            <div className="p-4 flex justify-end items-center gap-3 border-t-2 border-black">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="font-label-md text-sm px-4 py-2 text-gray-700 hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteNote.isLoading}
                className="bg-red-600 text-white font-label-md text-sm px-6 py-2 border-2 border-red-600 hover:bg-white hover:text-red-600 transition-colors"
              >
                {deleteNote.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;
