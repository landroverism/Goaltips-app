
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockPredictions, mockMatches } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { formatMatchDate } from '@/lib/utils';

const UserPredictionsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string | null>(null);
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-6">
              Please log in to view your predictions.
            </p>
            <Button onClick={() => navigate('/login')}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Get user predictions
  const userPredictions = mockPredictions;
  
  const getMatchByPrediction = (predictionId: string) => {
    const prediction = userPredictions.find(p => p.id === predictionId);
    if (!prediction) return null;
    return mockMatches.find(match => match.id === prediction.matchId);
  };
  
  const getMarketLabel = (market: string): string => {
    switch (market) {
      case 'home': return 'Home Win';
      case 'away': return 'Away Win';
      case 'draw': return 'Draw';
      case 'bttsYes': return 'Both Teams to Score: Yes';
      case 'bttsNo': return 'Both Teams to Score: No';
      case 'over25': return 'Over 2.5 Goals';
      case 'under25': return 'Under 2.5 Goals';
      default: return market;
    }
  };
  
  const getResultBadge = (result: string) => {
    switch (result) {
      case 'win':
        return <Badge className="bg-completed hover:bg-completed">Win</Badge>;
      case 'loss':
        return <Badge variant="destructive">Loss</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };
  
  const filteredPredictions = filter 
    ? userPredictions.filter(p => p.result === filter) 
    : userPredictions;
    
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Predictions</h1>
        <p className="text-muted-foreground">
          View and track all your predictions
        </p>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <Button 
          variant={filter === null ? 'default' : 'outline'}
          onClick={() => setFilter(null)}
        >
          All
        </Button>
        <Button 
          variant={filter === 'win' ? 'default' : 'outline'}
          onClick={() => setFilter('win')}
        >
          Wins
        </Button>
        <Button 
          variant={filter === 'loss' ? 'default' : 'outline'}
          onClick={() => setFilter('loss')}
        >
          Losses
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
      </div>
      
      {filteredPredictions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              No predictions found.
            </p>
            <Button onClick={() => navigate('/matches')}>
              Browse Matches
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPredictions.map(prediction => {
            const match = mockMatches.find(m => m.id === prediction.matchId);
            if (!match) return null;
            
            return (
              <Card key={prediction.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {match.leagueName}
                    </CardTitle>
                    {getResultBadge(prediction.result || 'pending')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatMatchDate(new Date(match.startTime))}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col items-center">
                      <img 
                        src={match.homeTeam.logo} 
                        alt={match.homeTeam.name}
                        className="w-8 h-8 object-contain mb-1" 
                      />
                      <span className="text-sm font-medium text-center">{match.homeTeam.name}</span>
                    </div>
                    
                    <div className="text-center">
                      {match.status !== 'upcoming' && match.score ? (
                        <div className="text-lg font-bold">
                          {match.score.home} - {match.score.away}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">vs</div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <img 
                        src={match.awayTeam.logo} 
                        alt={match.awayTeam.name}
                        className="w-8 h-8 object-contain mb-1" 
                      />
                      <span className="text-sm font-medium text-center">{match.awayTeam.name}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm bg-secondary p-2 rounded-md text-center">
                    <span>Your Prediction: </span>
                    <strong>{getMarketLabel(prediction.market)}</strong>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={() => navigate(`/matches/${match.id}`)}
                      variant="outline"
                      className="w-full"
                    >
                      Match Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserPredictionsPage;
