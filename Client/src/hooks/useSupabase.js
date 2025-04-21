// src/hooks/useSupabase.js
import { useState } from 'react';
import supabaseClient from '../supabaseClient';
import useAuth from './useAuth';

const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Generic fetch function with error handling
  const fetchData = async (tableName, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabaseClient.from(tableName).select(options.select || '*');
      
      // Apply filters if provided
      if (options.filters) {
        options.filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value);
        });
      }
      
      // Apply order if provided
      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending });
      }
      
      // Apply pagination if provided
      if (options.pagination) {
        query = query.range(
          options.pagination.from, 
          options.pagination.to
        );
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (err) {
      console.error(`Error fetching ${tableName}:`, err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Get all matches
  const getMatches = async (options = {}) => {
    return await fetchData('matches', options);
  };

  // Get match by ID
  const getMatchById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabaseClient
        .from('matches')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching match:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Get all predictions
  const getPredictions = async (options = {}) => {
    const defaultSelect = `
      id, 
      match_id,
      predicted_winner,
      matches (
        id, 
        home_team, 
        away_team
      )
    `;
    
    return await fetchData('predictions', {
      ...options,
      select: options.select || defaultSelect
    });
  };

  // Get user profile
  const getUserProfile = async () => {
    if (!user) return { data: null, error: new Error('Not authenticated') };
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!user) return { data: null, error: new Error('Not authenticated') };
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getMatches,
    getMatchById,
    getPredictions,
    getUserProfile,
    updateUserProfile
  };
};

export default useSupabase;
