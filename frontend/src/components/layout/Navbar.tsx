
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const isAdmin = user?.roles.includes('ROLE_ADMIN');

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link to="/" className="text-2xl font-bold text-primary">
          TurfZone
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={({isActive}) => `text-gray-600 hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`}>Home</NavLink>
          <NavLink to="/turfs" className={({isActive}) => `text-gray-600 hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`}>Turfs</NavLink>
          <NavLink to="/my-bookings" className={({isActive}) => `text-gray-600 hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`}>My Bookings</NavLink>
          {isAdmin && (
             <NavLink to="/admin" className={({isActive}) => `text-gray-600 hover:text-primary transition-colors ${isActive ? 'text-primary font-semibold' : ''}`}>Admin</NavLink>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-700 hidden sm:block">Welcome, {user?.username}!</span>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
