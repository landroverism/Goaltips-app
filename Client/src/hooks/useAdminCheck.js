// src/hooks/useAdminCheck.js
import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import supabaseClient from '../supabaseClient';

const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // First check user_metadata from auth
        if (user.user_metadata?.role === 'admin') {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // If not found in metadata, query the database
        const { data, error } = await supabaseClient
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setIsAdmin(data?.role === 'admin');
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading, error };
};

export default useAdminCheck;
