import { useState, useEffect } from 'react';
import { Match } from '../types';
import { fetchLiveMatches, withLoading } from '../services/api';

// Interval in milliseconds between live updates
const REFRESH_INTERVAL = 60000; // 1 minute

export function useLiveMatches() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const fetchMatches = async () => {
      try {
        setError(null);
        const response = await withLoading(() => fetchLiveMatches(), setIsLoading);
        
        if (isMounted) {
          setLiveMatches(response.data || []);
        }
      } catch (err) {
        console.error('Error fetching live matches:', err);
        if (isMounted) {
          setError('Failed to load live matches. Please try again.');
        }
      }
    };

    // Initial fetch
    fetchMatches();

    // Set up interval for live updates
    intervalId = setInterval(fetchMatches, REFRESH_INTERVAL);

    // Clean up on unmount
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { liveMatches, isLoading, error };
}