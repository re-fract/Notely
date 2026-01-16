import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import TipTapEditor from '../components/TipTapEditor';
import DeleteButton from '../components/DeleteButton';
import { useAuth } from '../contexts/AuthContext';
import type { NoteType } from '../lib/types';

const Notebook = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [note, setNote] = useState<NoteType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      if (!user || !noteId) return;

      try {
        const response = await axios.get(`/api/notes/${noteId}`, {
          headers: {
            'x-user-id': user.id,
          },
        });
        setNote(response.data.note);
      } catch (error) {
        console.error('Failed to fetch note:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grainy flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen grainy flex items-center justify-center">
        <p>Note not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen grainy p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
          <Link to="/dashboard">
            <Button className="bg-green-600" size="sm">
              Back
            </Button>
          </Link>
          <div className="w-3"></div>
          <span className="font-semibold">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="inline-block mx-1">/</span>
          <span className="text-stone-500 font-semibold">{note.name}</span>
          <div className="ml-auto">
            <DeleteButton noteId={note.id!} />
          </div>
        </div>

        <div className="h-4"></div>
        <div className="border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full">
          <TipTapEditor note={note} />
        </div>
      </div>
    </div>
  );
};

export default Notebook;
