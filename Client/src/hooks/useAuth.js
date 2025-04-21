// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import supabaseClient from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
          
          if (userError) {
            throw userError;
          }
          
          setUser(user);
        }
      } catch (err) {
        console.error('Session check error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
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

  // Sign up with email and password
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            role: 'user'
          }
        }
      });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabaseClient.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (err) {
      console.error('Update password error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    if (!user) return false;
    return user.user_metadata?.role === 'admin';
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
