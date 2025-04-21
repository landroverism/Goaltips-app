import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import supabaseClient from '../supabaseClient';

interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  user_metadata?: {
    username?: string;
    role?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on component mount
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          // Get user data
          const { data: { user: supabaseUser }, error: userError } = await supabaseClient.auth.getUser();
          
          if (userError) {
            throw userError;
          }
          
          if (supabaseUser) {
            const userData: User = {
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || '',
              isAdmin: supabaseUser.user_metadata?.role === 'admin',
              user_metadata: supabaseUser.user_metadata
            };
            
            setUser(userData);
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
            isAdmin: session.user.user_metadata?.role === 'admin',
            user_metadata: session.user.user_metadata
          };
          
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );
    
    // Clean up subscription on unmount
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || '',
          isAdmin: data.user.user_metadata?.role === 'admin',
          user_metadata: data.user.user_metadata
        };
        
        setUser(userData);
        toast.success('Login successful!');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role: 'user'
          }
        }
      });
      
      if (error) throw error;
      
      // Note: Supabase requires email verification by default
      // The user won't be fully signed in until they verify their email
      toast.success('Account created! Please check your email to verify your account.');
      
      // If email confirmation is disabled in your Supabase project settings,
      // the user will be automatically signed in
      if (data.user && !data.user.identities?.[0].identity_data.email_verified) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          username: username,
          isAdmin: false,
          user_metadata: data.user.user_metadata
        };
        
        setUser(userData);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabaseClient.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      toast.info('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to send reset instructions');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Update password (new function for Supabase)
  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
    } catch (error: any) {
      console.error('Update password error:', error);
      toast.error(error.message || 'Failed to update password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, updatePassword }}>
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
