import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] dark:bg-[#141313] transition-colors duration-300">
        <div className="animate-spin h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] dark:bg-[#141313] transition-colors duration-300">
        <p className="font-body-md text-base text-gray-600 dark:text-gray-400">Note not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#141313] flex flex-col transition-colors duration-300">
      {/* Top Navigation - Minimalist */}
      <header className="w-full h-14 border-b-2 border-black dark:border-white bg-[#f9f9f9] dark:bg-[#141313] flex justify-between items-center px-4 lg:px-8 sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </Link>
          <span className="font-headline-md text-lg font-black text-black dark:text-white transition-colors">Notely</span>
          <span className="text-gray-400 dark:text-gray-600 mx-1 transition-colors">/</span>
          <span className="font-label-sm text-xs text-gray-500 dark:text-gray-400 transition-colors">#{note.name.replace(/\s+/g, '_')}</span>
        </div>
        <div className="flex items-center gap-3">
          <DeleteButton noteId={note.id!} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-[1000px] mx-auto w-full p-6 lg:p-12">
        <div className="border-2 border-black dark:border-white bg-white dark:bg-[#1c1b1b] p-6 lg:p-12 wireframe-card-shadow dark:shadow-white/20 transition-colors duration-300">
          <TipTapEditor note={note} />
        </div>
      </div>
    </div>
  );
};

export default Notebook;
