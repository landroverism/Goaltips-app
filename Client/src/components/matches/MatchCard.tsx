import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Match } from '../../types';
import { formatMatchDate, getMatchStatusClass } from '../../lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PredictionOptions from './PredictionOptions';
import { useAuth } from '../../context/AuthContext';
import { Clock, Stadium, Whistle, TrendingUp, AlertCircle } from 'lucide-react';
import { FallbackImage } from '@/components/ui/fallback-image';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const [showPredictionOptions, setShowPredictionOptions] = useState(false);
  const { user } = useAuth();
  
  const statusClass = getMatchStatusClass(match.status || 'NS');
  const matchDate = formatMatchDate(match.startTime);
  
  const togglePredictionOptions = () => {
    if (user) {
      setShowPredictionOptions(!showPredictionOptions);
    } else {
      // Redirect to login or show a message
    }
  };

  // Safely access nested properties with fallbacks
  const homeTeamName = match.homeTeam?.name || 'TBD';
  const awayTeamName = match.awayTeam?.name || 'TBD';
  const homeTeamLogo = match.homeTeam?.logo || '';
  const awayTeamLogo = match.awayTeam?.logo || '';
  const leagueName = match.league?.name || 'Unknown League';
  const homeScore = match.score?.home ?? 0;
  const awayScore = match.score?.away ?? 0;
  
  // Check if odds are available
  const hasOdds = match.odds && match.odds.homeWin && match.odds.draw && match.odds.awayWin;

  return (
    <Card className="match-card overflow-hidden">
      <CardContent className="p-0">
        {/* Match Header */}
        <div className="bg-secondary p-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge className={statusClass}>
              {match.status?.toUpperCase() || 'NOT STARTED'}
            </Badge>
            <span className="text-sm">{formatMatchDate(new Date(match.startTime))}</span>
          </div>
          <Link to={`/leagues/${match.leagueId}`}>
            <Badge variant="outline">{leagueName}</Badge>
          </Link>
        </div>

        {/* Match Content */}
        <Link to={`/matches/${match.id}`} className="block p-4 hover:bg-accent/5 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1">
              <FallbackImage 
                src={homeTeamLogo} 
                alt={homeTeamName} 
                className="w-10 h-10 object-contain"
                fallbackIcon={<span className="font-bold text-xs">{homeTeamName.substring(0, 2)}</span>}
              />
              <span className="font-medium truncate">{homeTeamName}</span>
            </div>
            {match.status !== 'upcoming' && (
              <div className="px-3 py-1 font-bold">
                {homeScore}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <FallbackImage 
                src={awayTeamLogo} 
                alt={awayTeamName} 
                className="w-10 h-10 object-contain"
                fallbackIcon={<span className="font-bold text-xs">{awayTeamName.substring(0, 2)}</span>}
              />
              <span className="font-medium truncate">{awayTeamName}</span>
            </div>
            {match.status !== 'upcoming' && (
              <div className="px-3 py-1 font-bold">
                {awayScore}
              </div>
            )}
          </div>
        </Link>

        {/* Match Actions */}
        <div className="border-t border-border p-3 flex justify-between items-center">
          <div className="text-sm text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            {hasOdds ? (
              <>
                <span className="font-medium">1:</span> {match.odds.homeWin.toFixed(2)} |{" "}
                <span className="font-medium">X:</span> {match.odds.draw.toFixed(2)} |{" "}
                <span className="font-medium">2:</span> {match.odds.awayWin.toFixed(2)}
              </>
            ) : (
              <span>Odds not available</span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost"
              size="sm"
              asChild
              className="flex items-center gap-1"
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
