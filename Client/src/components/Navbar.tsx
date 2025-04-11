import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Settings,
  UserPlus,
  Bell,
  ChevronDown,
  Home,
  Calendar,
  Trophy,
  LineChart
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="font-bold text-white text-lg">HG</span>
            </div>
            <span className="font-bold text-xl hidden sm:block group-hover:text-primary transition-colors">HamtonGoalTips</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" label="Home" />
            <NavLink to="/matches" label="Matches" />
            <NavLink to="/leagues" label="Leagues" />
            <NavLink to="/predictions" label="My Predictions" />
          </div>

          {/* Search, User Menu and Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/search')}
              className="text-foreground hover:bg-secondary rounded-full p-2"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Notification Bell with Badge */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/notifications')}
                className="text-foreground hover:bg-secondary rounded-full p-2"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </div>
            
            <Button
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              className="text-foreground hover:bg-secondary rounded-full p-2"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-foreground hover:bg-secondary rounded-full p-2 sm:pl-2 sm:pr-3"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.username}</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-70" />
                </Button>
                
                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 border border-border z-50">
                    <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-border">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    
                    <Link to="/profile" className="block px-3 py-2 sm:px-4 sm:py-3 text-sm hover:bg-secondary">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Your Profile</span>
                      </div>
                    </Link>
                    
                    <Link to="/settings" className="block px-3 py-2 sm:px-4 sm:py-3 text-sm hover:bg-secondary">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </div>
                    </Link>
                    
                    {user.isAdmin && (
                      <Link to="/admin" className="block px-3 py-2 sm:px-4 sm:py-3 text-sm hover:bg-secondary">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </div>
                      </Link>
                    )}
                    
                    <div className="border-t border-border mt-1"></div>
                    
                    <button
                      className="w-full text-left px-3 py-2 sm:px-4 sm:py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                        navigate('/');
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button 
                  variant="outline" 
                  className="hidden sm:flex"
                  onClick={() => navigate('/signup')}
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  <span>Sign Up</span>
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => navigate('/login')}
                  size="sm"
                >
                  Login
                </Button>
              </div>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-foreground hover:bg-secondary p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with animation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-2 py-2 space-y-1">
            <MobileNavLink to="/" label="Home" icon={<Home className="h-5 w-5" />} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink to="/matches" label="Matches" icon={<Calendar className="h-5 w-5" />} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink to="/leagues" label="Leagues" icon={<Trophy className="h-5 w-5" />} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink to="/predictions" label="My Predictions" icon={<LineChart className="h-5 w-5" />} onClick={() => setIsMobileMenuOpen(false)} />

            {user?.isAdmin && (
              <MobileNavLink to="/admin" label="Admin Dashboard" icon={<BarChart3 className="h-5 w-5" />} onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {user ? (
              <>
                <MobileNavLink to="/profile" label="Profile Settings" icon={<Settings className="h-5 w-5" />} onClick={() => setIsMobileMenuOpen(false)} />
                <button
                  className="flex items-center space-x-2 w-full text-left py-2 px-3 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
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
            ) : (
              <>
                <MobileNavLink to="/login" label="Login" icon={<User className="h-5 w-5" />} onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavLink to="/signup" label="Sign Up" icon={<UserPlus className="h-5 w-5" />} onClick={() => setIsMobileMenuOpen(false)} />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper component for desktop nav links
const NavLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-foreground hover:bg-secondary hover:text-primary'
      }`}
    >
      {label}
    </Link>
  );
};

// Helper component for mobile nav links
const MobileNavLink: React.FC<{ 
  to: string; 
  label: string; 
  icon: React.ReactNode;
  onClick?: () => void;
}> = ({ to, label, icon, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'text-foreground hover:bg-secondary'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
};

export default Navbar;
