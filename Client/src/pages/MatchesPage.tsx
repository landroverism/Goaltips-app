
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import LiveMatchesComponent from '../components/matches/LiveMatchesComponent';
import UpcomingMatchesComponent from '../components/matches/UpcomingMatchesComponent';
import LeagueFilter from '../components/matches/LeagueFilter';
import StatusFilter from '../components/matches/StatusFilter';
import SearchAutocomplete from '../components/matches/SearchAutocomplete';
import { Match } from '../types';
import { RefreshCw } from 'lucide-react';
import { leagues } from '../lib/utils';
import { fetchLiveMatches, fetchLivescores, fetchFixturesByDate } from '../services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import MatchCard from '../components/matches/MatchCard';

const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>(leagues.map(l => l.id));
  const [selectedStatuses, setSelectedStatuses] = useState<('upcoming' | 'live' | 'completed')[]>(['upcoming', 'live', 'completed']);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('live');
  
  useEffect(() => {
    // Load matches on initial render
    loadAllMatches();
  }, []);
  
  const loadAllMatches = async () => {
    setIsLoading(true);
    try {
      // Fetch both live and upcoming matches
      const [liveResponse, upcomingResponse] = await Promise.all([
        fetchLiveMatches(),
        fetchFixturesByDate(format(new Date(), 'yyyy-MM-dd'))
      ]);
      
      // Transform live matches
      const liveMatches: Match[] = liveResponse.data.data?.map((match: any) => transformMatch(match, 'live')) || [];
      
      // Transform upcoming matches
      const upcomingMatches: Match[] = upcomingResponse.data.data?.map((match: any) => transformMatch(match, 'upcoming')) || [];
      
      // Combine all matches
      const allMatches = [...liveMatches, ...upcomingMatches];
      setMatches(allMatches);
      setFilteredMatches(allMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to transform API response to Match type
  const transformMatch = (match: any, status: 'upcoming' | 'live' | 'completed'): Match => ({
    id: match.id.toString(),
    homeTeam: {
      id: match.participants?.[0]?.id.toString() || '',
      name: match.participants?.[0]?.name || 'Unknown Team',
      logo: match.participants?.[0]?.image_path || '',
    },
    awayTeam: {
      id: match.participants?.[1]?.id.toString() || '',
      name: match.participants?.[1]?.name || 'Unknown Team',
      logo: match.participants?.[1]?.image_path || '',
    },
    leagueId: match.league?.id.toString() || '',
    leagueName: match.league?.name || 'Unknown League',
    startTime: match.starting_at || new Date().toISOString(),
    status,
    score: status !== 'upcoming' ? {
      home: match.scores?.participant_1_score || 0,
      away: match.scores?.participant_2_score || 0,
    } : undefined,
    odds: {
      homeWin: 0,
      draw: 0,
      awayWin: 0,
      bttsYes: 0,
      bttsNo: 0,
      over25: 0,
      under25: 0,
    }
  });
  
  useEffect(() => {
    // Apply filters
    let results = matches;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        match =>
          match.homeTeam.name.toLowerCase().includes(query) ||
          match.awayTeam.name.toLowerCase().includes(query) ||
          match.leagueName.toLowerCase().includes(query)
      );
    }
    
    // Filter by leagues
    if (selectedLeagues.length > 0) {
      results = results.filter(match => selectedLeagues.includes(match.leagueId));
    }
    
    // Filter by status
    if (selectedStatuses.length > 0) {
      results = results.filter(match => selectedStatuses.includes(match.status));
    }
    
    setFilteredMatches(results);
  }, [matches, searchQuery, selectedLeagues, selectedStatuses]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleRefresh = async () => {
    await loadAllMatches();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">All Matches</h1>
        <p className="text-muted-foreground">
          View all upcoming, live and completed football matches
        </p>
      </div>
      
      {/* Tabs for different match types */}
      <Tabs defaultValue="live" onValueChange={setActiveTab}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="live">Live Matches</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
              <TabsTrigger value="all">All Matches</TabsTrigger>
            </TabsList>
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="ml-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="mb-4">
            <SearchAutocomplete onSearch={handleSearch} />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <LeagueFilter 
              selectedLeagues={selectedLeagues} 
              onLeagueChange={setSelectedLeagues} 
            />
            
            <StatusFilter
              selectedStatuses={selectedStatuses}
              onStatusChange={setSelectedStatuses}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredMatches.length} matches
          </div>
        </div>
        
        <TabsContent value="live">
          <LiveMatchesComponent />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <UpcomingMatchesComponent />
        </TabsContent>
        
        <TabsContent value="all">
          {/* Live Matches Section */}
          {filteredMatches.some(match => match.status === 'live') && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="inline-block w-3 h-3 bg-live rounded-full mr-2 animate-pulse"></span>
                Live Matches
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches
                  .filter(match => match.status === 'live')
                  .map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
              </div>
            </div>
          )}
          
          {/* Upcoming Matches Section */}
          {filteredMatches.some(match => match.status === 'upcoming') && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Upcoming Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches
                  .filter(match => match.status === 'upcoming')
                  .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                  .map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
              </div>
            </div>
          )}
          
          {/* Completed Matches Section */}
          {filteredMatches.some(match => match.status === 'completed') && (
            <div>
              <h2 className="text-xl font-bold mb-4">Completed Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches
                  .filter(match => match.status === 'completed')
                  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                  .map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* No Matches Found */}
      {filteredMatches.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No Matches Found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery('');
            setSelectedLeagues(leagues.map(l => l.id));
            setSelectedStatuses(['upcoming', 'live', 'completed']);
          }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
