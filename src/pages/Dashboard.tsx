import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CreateNoteDialog from '../components/CreateNoteDialog';
import UserButton from '../components/UserButton';
import { useAuth } from '../contexts/AuthContext';
import type { NoteType } from '../lib/types';

const Dashboard = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;

      try {
        const response = await axios.get('/api/notes', {
          headers: {
            'x-user-id': user.id,
          },
        });
        setNotes(response.data.notes);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="animate-spin h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#141313] flex flex-col transition-colors duration-300">
      {/* TopNavBar */}
      <header className="flex justify-between items-center px-6 lg:px-12 w-full h-16 sticky top-0 z-50 bg-[#f9f9f9] dark:bg-[#141313] border-b-2 border-black dark:border-white transition-colors duration-300">
        <div className="flex items-center gap-2">
          <span className="font-headline-md text-xl font-black text-black dark:text-white transition-colors">Notely</span>
        </div>
        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 p-6 lg:p-12 max-w-[1200px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-black dark:text-white mb-2 transition-colors">My Notes</h1>
          <p className="font-body-lg text-lg text-gray-500 dark:text-gray-400 transition-colors">Your active notes and knowledge.</p>
        </div>

        {/* Note Grid (Bento style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Note Card */}
          <CreateNoteDialog />

          {/* Note Cards */}
          {notes.map((note) => (
            <Link to={`/notebook/${note.id}`} key={note.id}>
              <article className="border border-black dark:border-white bg-white dark:bg-[#1c1b1b] p-4 flex flex-col h-64 card-hover cursor-pointer group transition-all wireframe-card-shadow dark:shadow-white/20">
                <div className="flex justify-between items-start mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 dark:text-white transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-black dark:text-white">description</span>
                    <h3 className="font-headline-md text-lg text-black dark:text-white font-semibold transition-colors">
                      {note.name}
                    </h3>
                  </div>
                </div>
                {note.imageUrl ? (
                  <div className="mb-4 h-32 overflow-hidden border border-gray-300 dark:border-gray-700">
                    <img
                      src={note.imageUrl}
                      alt={note.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="mb-4 h-32 border border-black dark:border-white bg-[#e2e2e2] dark:bg-[#2a2a2a] flex items-center justify-center transition-colors">
                    <span className="font-label-md text-xl text-black/30 dark:text-white/30 uppercase tracking-widest transition-colors">
                      {note.name.slice(0, 2)}
                    </span>
                  </div>
                )}
                <div className="mt-auto pt-2 flex justify-between items-center text-gray-500 dark:text-gray-400 transition-colors">
                  <span className="font-label-sm text-xs">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </div>
              </article>
            </Link>
          ))}

          {/* No notes state */}
          {notes.length === 0 && (
            <div className="col-span-full text-center py-12 border border-black dark:border-white bg-white dark:bg-[#1c1b1b] p-8 transition-colors">
              <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">folder_open</span>
              <h2 className="font-headline-md text-lg text-gray-500 dark:text-gray-400">No notes yet.</h2>
              <p className="font-body-md text-sm text-gray-400 dark:text-gray-500 mt-1">Click New Note to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (mobile) */}
      <button
        onClick={() => {
          const el = document.querySelector('[data-radix-popper-content-wrapper]');
          if (el) (el as HTMLElement).click();
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center border-2 border-black dark:border-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors z-50 md:hidden"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
};

export default Dashboard;
