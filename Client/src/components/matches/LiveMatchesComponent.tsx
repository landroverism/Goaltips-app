import React, { useState, useEffect } from 'react';
import { fetchLiveMatches } from '../../services/api';
import MatchCard from './MatchCard';
import { Match } from '../../types';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';

const LiveMatchesComponent: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await fetchLiveMatches();
      
      // Transform the Sportmonks API response to match your Match type
      const transformedMatches: Match[] = response.data.data.map((match: any) => ({
        id: match.id.toString(),
        homeTeam: {
          id: match.participants[0]?.id.toString() || '',
          name: match.participants[0]?.name || 'Unknown Team',
          logo: match.participants[0]?.image_path || '',
        },
        awayTeam: {
          id: match.participants[1]?.id.toString() || '',
          name: match.participants[1]?.name || 'Unknown Team',
          logo: match.participants[1]?.image_path || '',
        },
        leagueId: match.league?.id.toString() || '',
        leagueName: match.league?.name || 'Unknown League',
        startTime: match.starting_at || new Date().toISOString(),
        status: 'live',
        score: {
          home: match.scores?.participant_1_score || 0,
          away: match.scores?.participant_2_score || 0,
        },
        odds: {
          homeWin: 0,
          draw: 0,
          awayWin: 0,
          bttsYes: 0,
          bttsNo: 0,
          over25: 0,
          under25: 0,
        }
      }));
      
      setMatches(transformedMatches);
      setError(null);
    } catch (err) {
      console.error('Error fetching live matches:', err);
      setError('Failed to load live matches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
    
    // Poll for updates every minute
    const interval = setInterval(loadMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Matches</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadMatches} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      
      {loading && !matches.length ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse text-center">
            <div className="h-6 w-32 bg-muted rounded mx-auto mb-2"></div>
            <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No live matches available right now</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMatchesComponent;