import { useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from './ui/button';

interface DeleteButtonProps {
  noteId: number;
}

const DeleteButton = ({ noteId }: DeleteButtonProps) => {
  const navigate = useNavigate();
  
  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/deleteNote', {
        noteId,
      });
      return response.data;
    },
  });

  return (
    <Button
      variant={'destructive'}
      size="sm"
      disabled={deleteNote.isLoading}
      onClick={() => {
        const confirm = window.confirm(
          'Are you sure you want to delete this note?'
        );
        if (!confirm) return;
        deleteNote.mutate(undefined, {
          onSuccess: () => {
            navigate('/dashboard');
          },
          onError: (err) => {
            console.error(err);
          },
        });
      }}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
