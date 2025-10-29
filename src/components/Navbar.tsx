import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, User } from 'lucide-react';
import { auth } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = auth.getCurrentUser();

  const handleLogout = () => {
    auth.logout();
    toast({ title: 'Logged out successfully' });
    navigate('/');
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary transition-colors">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          Volunteer Link
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/projects">
                <Button variant="ghost">Browse Projects</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="secondary">Admin Panel</Button>
                </Link>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/projects">
                <Button variant="ghost">Browse Projects</Button>
              </Link>
              <Link to="/auth">
                <Button variant="default">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
