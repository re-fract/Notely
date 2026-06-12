import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const UserButton = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 border-2 border-black bg-gray-200 flex items-center justify-center text-black">
        <span className="material-symbols-outlined text-sm">person</span>
      </div>
      <span className="font-label-md text-sm text-black">
        {user.firstName || user.email}
      </span>
      <button
        onClick={toggleTheme}
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors border border-transparent hover:border-black"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="material-symbols-outlined text-sm">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
      <button
        onClick={handleSignOut}
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors border border-transparent hover:border-black"
        title="Sign out"
      >
        <span className="material-symbols-outlined text-sm">logout</span>
      </button>
    </div>
  );
};

export default UserButton;
