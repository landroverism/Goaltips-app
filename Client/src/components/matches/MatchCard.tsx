
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Match } from '../../types';
import { formatMatchDate, getMatchStatusClass } from '../../lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PredictionOptions from './PredictionOptions';
import { useAuth } from '../../context/AuthContext';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const [showPredictionOptions, setShowPredictionOptions] = useState(false);
  const { user } = useAuth();
  
  const statusClass = getMatchStatusClass(match.status);
  const matchDate = new Date(match.startTime);
  
  const togglePredictionOptions = () => {
    if (user) {
      setShowPredictionOptions(!showPredictionOptions);
    } else {
      // Redirect to login or show a message
    }
  };

  return (
    <Card className="match-card overflow-hidden">
      <CardContent className="p-0">
        {/* Match Header */}
        <div className="bg-secondary p-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge className={statusClass}>
              {match.status.toUpperCase()}
            </Badge>
            <span className="text-sm">{formatMatchDate(matchDate)}</span>
          </div>
          <Link to={`/leagues/${match.leagueId}`}>
            <Badge variant="outline">{match.leagueName}</Badge>
          </Link>
        </div>
        
        {/* Teams Section */}
        <Link to={`/matches/${match.id}`} className="block p-4 hover:bg-accent/5 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1">
              <img 
                src={match.homeTeam.logo} 
                alt={match.homeTeam.name} 
                className="w-8 h-8 object-contain"
              />
              <span className="font-medium truncate">{match.homeTeam.name}</span>
            </div>
            {match.status !== 'upcoming' && (
              <div className="px-3 py-1 font-bold">
                {match.score?.home}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <img 
                src={match.awayTeam.logo} 
                alt={match.awayTeam.name} 
                className="w-8 h-8 object-contain" 
              />
              <span className="font-medium truncate">{match.awayTeam.name}</span>
            </div>
            {match.status !== 'upcoming' && (
              <div className="px-3 py-1 font-bold">
                {match.score?.away}
              </div>
            )}
          </div>
        </Link>
        
        {/* Match Actions */}
        <div className="border-t border-border p-3 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">1:</span> {match.odds.homeWin.toFixed(2)} |{" "}
            <span className="font-medium">X:</span> {match.odds.draw.toFixed(2)} |{" "}
            <span className="font-medium">2:</span> {match.odds.awayWin.toFixed(2)}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost"
              size="sm"
              asChild
            >
              <Link to={`/matches/${match.id}`}>Details</Link>
            </Button>
            
            {match.status === 'upcoming' && (
              <Button 
                variant="default"
                size="sm"
                onClick={togglePredictionOptions}
              >
                {showPredictionOptions ? 'Hide' : 'Predict'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Prediction Options */}
        {showPredictionOptions && (
          <div className="border-t border-border">
            <PredictionOptions match={match} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
