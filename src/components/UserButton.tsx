import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

const UserButton = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
        <User className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium">
        {user.firstName || user.email}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={signOut}
        className="text-gray-500 hover:text-gray-700"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default UserButton;
