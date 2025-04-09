
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatMatchDate, getMatchStatusClass } from '@/lib/utils';
import { mockMatches } from '../data/mockData';
import { Match } from '../types';
import { ArrowLeft, Calendar, Users, ListChecks, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../context/AuthContext';
import PredictionOptions from '../components/matches/PredictionOptions';

const MatchDetailsPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;
  
  // Find the match from the mock data
  const match = mockMatches.find(m => m.id === matchId);
  
  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Match not found</h1>
        <Button asChild>
          <Link to="/matches">Back to Matches</Link>
        </Button>
      </div>
    );
  }

  const matchDate = new Date(match.startTime);
  const statusClass = getMatchStatusClass(match.status);

  // Mock head-to-head data
  const h2hData = {
    totalMatches: 12,
    homeWins: 5,
    awayWins: 4,
    draws: 3,
    lastFiveMatches: [
      { winner: 'home', score: { home: 2, away: 1 } },
      { winner: 'away', score: { home: 0, away: 2 } },
      { winner: 'draw', score: { home: 1, away: 1 } },
      { winner: 'home', score: { home: 3, away: 0 } },
      { winner: 'away', score: { home: 1, away: 2 } },
    ]
  };

  // Mock community predictions data
  const communityPredictions = {
    homeWin: 45,
    draw: 30,
    awayWin: 25,
    bttsYes: 60,
    bttsNo: 40,
    over25: 55,
    under25: 45
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/matches" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Matches
          </Link>
        </Button>
      </div>

      {/* Match Header Card */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="bg-secondary p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Badge className={statusClass}>
                {match.status.toUpperCase()}
              </Badge>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatMatchDate(matchDate)}</span>
              </div>
            </div>
            <Link to={`/leagues/${match.leagueId}`}>
              <Badge variant="outline">{match.leagueName}</Badge>
            </Link>
          </div>
          
          {/* Teams and Score */}
          <div className="p-6">
            <div className="grid grid-cols-11 items-center">
              {/* Home Team */}
              <div className="col-span-5 flex flex-col items-center md:items-end">
                <img 
                  src={match.homeTeam.logo} 
                  alt={match.homeTeam.name} 
                  className="w-16 h-16 object-contain mb-2"
                />
                <h3 className="text-lg font-bold text-center md:text-right">{match.homeTeam.name}</h3>
              </div>
              
              {/* Score */}
              <div className="col-span-1 flex justify-center">
                {match.status !== 'upcoming' ? (
                  <div className="text-2xl font-bold text-center">
                    {match.score?.home} - {match.score?.away}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-center">VS</div>
                )}
              </div>
              
              {/* Away Team */}
              <div className="col-span-5 flex flex-col items-center md:items-start">
                <img 
                  src={match.awayTeam.logo} 
                  alt={match.awayTeam.name} 
                  className="w-16 h-16 object-contain mb-2"
                />
                <h3 className="text-lg font-bold text-center md:text-left">{match.awayTeam.name}</h3>
              </div>
            </div>
          </div>
          
          {/* Odds */}
          <div className="border-t border-border p-4 flex justify-center">
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Home</div>
                <div className="font-bold">{match.odds.homeWin.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Draw</div>
                <div className="font-bold">{match.odds.draw.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Away</div>
                <div className="font-bold">{match.odds.awayWin.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Prediction Form */}
      {isAdmin && match.status === 'upcoming' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Admin Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminPredictionForm match={match} />
          </CardContent>
        </Card>
      )}

      {/* Make Prediction Card for regular users */}
      {match.status === 'upcoming' && !isAdmin && user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Make Your Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <PredictionOptions match={match} />
          </CardContent>
        </Card>
      )}

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="h2h">Head to Head</TabsTrigger>
          <TabsTrigger value="predictions">Community Predictions</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Match Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Match Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">League</div>
                    <div className="font-medium">{match.leagueName}</div>
                  </div>
                  <div className="p-4 bg-secondary rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                    <div className="font-medium">{formatMatchDate(matchDate)}</div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Betting Odds</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-secondary rounded-md text-center">
                    <div className="text-sm text-muted-foreground mb-1">1X2</div>
                    <div className="font-medium">{match.homeTeam.name}: {match.odds.homeWin.toFixed(2)}</div>
                    <div className="font-medium">Draw: {match.odds.draw.toFixed(2)}</div>
                    <div className="font-medium">{match.awayTeam.name}: {match.odds.awayWin.toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-secondary rounded-md text-center">
                    <div className="text-sm text-muted-foreground mb-1">Both Teams To Score</div>
                    <div className="font-medium">Yes: {match.odds.bttsYes.toFixed(2)}</div>
                    <div className="font-medium">No: {match.odds.bttsNo.toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-secondary rounded-md text-center">
                    <div className="text-sm text-muted-foreground mb-1">Over/Under 2.5</div>
                    <div className="font-medium">Over: {match.odds.over25.toFixed(2)}</div>
                    <div className="font-medium">Under: {match.odds.under25.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Head to Head Tab */}
        <TabsContent value="h2h" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Head to Head Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 text-center">
                <div>
                  <div className="text-2xl font-bold">{h2hData.homeWins}</div>
                  <div className="text-muted-foreground">{match.homeTeam.name}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{h2hData.draws}</div>
                  <div className="text-muted-foreground">Draws</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{h2hData.awayWins}</div>
                  <div className="text-muted-foreground">{match.awayTeam.name}</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3">Last 5 Meetings</h3>
                <div className="space-y-2">
                  {h2hData.lastFiveMatches.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-md">
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${
                          result.winner === 'home' ? 'bg-green-500' : 
                          result.winner === 'away' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></span>
                        <span>
                          {match.homeTeam.name} {result.score.home} - {result.score.away} {match.awayTeam.name}
                        </span>
                      </div>
                      <Badge variant="outline">
                        {result.winner === 'home' ? match.homeTeam.name + ' win' : 
                          result.winner === 'away' ? match.awayTeam.name + ' win' : 'Draw'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Community Predictions Tab */}
        <TabsContent value="predictions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Predictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Match Result</h3>
                <div className="h-8 bg-secondary rounded-md overflow-hidden flex">
                  <div 
                    className="bg-green-500 h-full" 
                    style={{width: `${communityPredictions.homeWin}%`}}
                  ></div>
                  <div 
                    className="bg-yellow-500 h-full" 
                    style={{width: `${communityPredictions.draw}%`}}
                  ></div>
                  <div 
                    className="bg-red-500 h-full" 
                    style={{width: `${communityPredictions.awayWin}%`}}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <div>{match.homeTeam.name}: {communityPredictions.homeWin}%</div>
                  <div>Draw: {communityPredictions.draw}%</div>
                  <div>{match.awayTeam.name}: {communityPredictions.awayWin}%</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Both Teams to Score</h3>
                  <div className="h-8 bg-secondary rounded-md overflow-hidden flex">
                    <div 
                      className="bg-green-500 h-full" 
                      style={{width: `${communityPredictions.bttsYes}%`}}
                    ></div>
                    <div 
                      className="bg-red-500 h-full" 
                      style={{width: `${communityPredictions.bttsNo}%`}}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <div>Yes: {communityPredictions.bttsYes}%</div>
                    <div>No: {communityPredictions.bttsNo}%</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Over/Under 2.5 Goals</h3>
                  <div className="h-8 bg-secondary rounded-md overflow-hidden flex">
                    <div 
                      className="bg-green-500 h-full" 
                      style={{width: `${communityPredictions.over25}%`}}
                    ></div>
                    <div 
                      className="bg-red-500 h-full" 
                      style={{width: `${communityPredictions.under25}%`}}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <div>Over 2.5: {communityPredictions.over25}%</div>
                    <div>Under 2.5: {communityPredictions.under25}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Admin Prediction Form Component
const AdminPredictionForm = ({ match }: { match: Match }) => {
  const [prediction, setPrediction] = useState({
    homeScore: '',
    awayScore: '',
    analysis: ''
  });
  
  const handlePredictionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the admin prediction to the database
    console.log('Admin prediction submitted:', prediction);
    // Add toast notification
    alert('Prediction saved successfully!');
  };
  
  return (
    <form onSubmit={handlePredictionSubmit} className="space-y-4">
      <div className="grid grid-cols-5 gap-4 items-center">
        <div className="text-right col-span-2">{match.homeTeam.name}</div>
        <div className="flex space-x-2 col-span-1 justify-center">
          <input
            type="number"
            min="0"
            className="w-12 h-12 text-center text-lg font-bold border border-input rounded-md"
            value={prediction.homeScore}
            onChange={(e) => setPrediction({...prediction, homeScore: e.target.value})}
            required
          />
          <span className="text-xl font-bold self-center">-</span>
          <input
            type="number"
            min="0"
            className="w-12 h-12 text-center text-lg font-bold border border-input rounded-md"
            value={prediction.awayScore}
            onChange={(e) => setPrediction({...prediction, awayScore: e.target.value})}
            required
          />
        </div>
        <div className="col-span-2">{match.awayTeam.name}</div>
      </div>
      
      <div>
        <label htmlFor="analysis" className="block text-sm font-medium mb-1">
          Prediction Analysis
        </label>
        <textarea
          id="analysis"
          className="w-full min-h-[100px] rounded-md border border-input p-2"
          value={prediction.analysis}
          onChange={(e) => setPrediction({...prediction, analysis: e.target.value})}
          placeholder="Enter your analysis and reasoning for the prediction..."
        ></textarea>
      </div>
      
      <Button type="submit" className="w-full">Save Prediction</Button>
    </form>
  );
};

export default MatchDetailsPage;
