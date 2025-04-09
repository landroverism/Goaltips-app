
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  Menu,
  Search,
  Sun,
  Moon,
  User,
  LogOut,
  BarChart3,
  Settings
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-white text-lg">HG</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">HamtonGoalTips</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/matches" className="text-foreground hover:text-primary transition-colors">
              Matches
            </Link>
            <Link to="/leagues" className="text-foreground hover:text-primary transition-colors">
              Leagues
            </Link>
            <Link to="/predictions" className="text-foreground hover:text-primary transition-colors">
              My Predictions
            </Link>
          </div>

          {/* Search, User Menu and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/search')}
              className="text-foreground hover:bg-secondary"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="text-foreground hover:bg-secondary"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-foreground hover:bg-secondary"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-5 w-5 mr-1" />
                  <span className="hidden sm:block">{user.username}</span>
                </Button>
              </div>
            ) : (
              <Button variant="default" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-foreground hover:bg-secondary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="container mx-auto px-4 py-2 space-y-2">
            <Link 
              to="/" 
              className="block py-2 text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/matches" 
              className="block py-2 text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Matches
            </Link>
            <Link 
              to="/leagues" 
              className="block py-2 text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Leagues
            </Link>
            <Link 
              to="/predictions" 
              className="block py-2 text-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Predictions
            </Link>

            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="block py-2 text-foreground hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </div>
              </Link>
            )}

            {user && (
              <>
                <Link 
                  to="/profile" 
                  className="block py-2 text-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Profile Settings</span>
                  </div>
                </Link>
                <button
                  className="flex items-center space-x-2 w-full text-left py-2 text-foreground hover:text-primary"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
