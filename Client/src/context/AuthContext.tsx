import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { login as apiLogin, signup as apiSignup, resetPassword as apiResetPassword } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        // Verify token is not expired
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          setUser(JSON.parse(storedUser));
        } else {
          // Token expired, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiLogin({ email });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      
      // Decode token to get user info
      const decodedToken: any = jwtDecode(token);
      
      const userData: User = {
        id: decodedToken.id || '',
        username: decodedToken.username || '',
        email: decodedToken.email || email, // Use email as email if not provided
        isAdmin: decodedToken.role === 'admin'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiSignup({ email, username, password });
      
      // If signup returns a token directly
      if (response.data.token) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // Decode token to get user info
        const decodedToken: any = jwtDecode(token);
        
        const userData: User = {
          id: decodedToken.id || '',
          username: decodedToken.username || username,
          email: decodedToken.email || email,
          isAdmin: decodedToken.role === 'admin'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      await apiResetPassword(email);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to send reset instructions');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
