
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockMatches } from '../data/mockData';
import { Match } from '../types';
import MatchCard from '../components/matches/MatchCard';
import { Card } from '@/components/ui/card';
import { leagues } from '@/lib/utils';

const LeaguePage: React.FC = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  const leagueInfo = leagues.find(league => league.id === leagueId);
  
  useEffect(() => {
    // Simulate API call with a delay
    const fetchLeagueMatches = async () => {
      setLoading(true);
      // Delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const leagueMatches = mockMatches.filter(match => match.leagueId === leagueId);
      setMatches(leagueMatches);
      setLoading(false);
    };
    
    fetchLeagueMatches();
  }, [leagueId]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {leagueInfo?.name || 'League'}
        </h1>
        <p className="text-muted-foreground">
          {leagueInfo?.country ? `${leagueInfo.country} - ` : ''}
          View all matches for this league
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-[200px] animate-pulse" />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <>
          {/* Live Matches */}
          {matches.some(match => match.status === 'live') && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="inline-block w-3 h-3 bg-live rounded-full mr-2 animate-pulse"></span>
                Live Matches
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches
                  .filter(match => match.status === 'live')
                  .map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
              </div>
            </div>
          )}
          
          {/* Upcoming Matches */}
          {matches.some(match => match.status === 'upcoming') && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Upcoming Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches
                  .filter(match => match.status === 'upcoming')
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
              </div>
            </div>
          )}
          
          {/* Completed Matches */}
          {matches.some(match => match.status === 'completed') && (
            <div>
              <h2 className="text-xl font-bold mb-4">Completed Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches
                  .filter(match => match.status === 'completed')
                  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                  .map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
          <p className="text-muted-foreground">
            There are currently no matches for this league.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaguePage;
