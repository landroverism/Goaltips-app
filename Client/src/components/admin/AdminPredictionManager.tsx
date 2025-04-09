
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockMatches } from '@/data/mockData';
import { Match, Prediction } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Search, ArrowUpDown, CheckCircle2, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  matchId: z.string({
    required_error: "Please select a match",
  }),
  market: z.enum([
    'home', 'away', 'draw', 
    'bttsYes', 'bttsNo', 
    'over25', 'under25',
    'over15', 'under15',
    'over35', 'under35',
    'correctScore',
    'firstHalfResult',
    'doubleChanceHomeOrDraw',
    'doubleChanceAwayOrDraw',
    'cornerOver85',
    'cornerUnder85',
    'noGoal',
    'cleanSheetHome',
    'cleanSheetAway',
    'bothTeamsToScore2Plus',
    'exactGoals',
    'winToNil',
    'multiGoalRange',
    'halfWithMostGoals',
  ], {
    required_error: "Please select a prediction market",
  }),
  value: z.string().optional(), // For correct score or other markets with specific values
  confidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

const AdminPredictionManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>([]);
  const [activeTab, setActiveTab] = useState('create');
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredMatches = mockMatches.filter(match => {
    const query = searchQuery.toLowerCase();
    return (
      match.homeTeam.name.toLowerCase().includes(query) ||
      match.awayTeam.name.toLowerCase().includes(query) ||
      match.leagueName.toLowerCase().includes(query)
    );
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confidence: 'medium'
    }
  });

  const selectedMarket = form.watch('market');
  const needsValue = ['correctScore', 'firstHalfResult', 'exactGoals', 'multiGoalRange', 'halfWithMostGoals'].includes(selectedMarket || '');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedMatch = mockMatches.find(match => match.id === values.matchId);
      
      if (!selectedMatch) {
        throw new Error('Match not found');
      }
      
      const newPrediction: Prediction = {
        id: `admin-pred-${Date.now()}`,
        userId: 'admin',
        matchId: values.matchId,
        market: values.market as any,
        createdAt: new Date().toISOString(),
        result: 'pending',
        value: values.value,
        confidence: values.confidence,
      };
      
      setRecentPredictions(prev => [newPrediction, ...prev].slice(0, 10));
      
      form.reset();
      
      toast({
        title: "Prediction Added",
        description: `Prediction for ${selectedMatch.homeTeam.name} vs ${selectedMatch.awayTeam.name} added successfully.`,
      });

      sonnerToast.success(`Admin prediction for ${selectedMatch.homeTeam.name} vs ${selectedMatch.awayTeam.name} added!`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      case 'over15': return 'Over 1.5 Goals';
      case 'under15': return 'Under 1.5 Goals';
      case 'over35': return 'Over 3.5 Goals';
      case 'under35': return 'Under 3.5 Goals';
      case 'correctScore': return 'Correct Score';
      case 'firstHalfResult': return 'First Half Result';
      case 'doubleChanceHomeOrDraw': return 'Double Chance: Home or Draw';
      case 'doubleChanceAwayOrDraw': return 'Double Chance: Away or Draw';
      case 'cornerOver85': return 'Corners Over 8.5';
      case 'cornerUnder85': return 'Corners Under 8.5';
      case 'noGoal': return 'No Goal';
      case 'cleanSheetHome': return 'Clean Sheet Home';
      case 'cleanSheetAway': return 'Clean Sheet Away';
      case 'bothTeamsToScore2Plus': return 'Both Teams to Score 2+';
      case 'exactGoals': return 'Exact Goals';
      case 'winToNil': return 'Win to Nil';
      case 'multiGoalRange': return 'Multi-Goal Range';
      case 'halfWithMostGoals': return 'Half with Most Goals';
      default: return market;
    }
  };

  const getValuePlaceholder = (market: string): string => {
    switch (market) {
      case 'correctScore': return '2-1';
      case 'exactGoals': return '3';
      case 'multiGoalRange': return '2-4';
      case 'halfWithMostGoals': return 'first';
      case 'firstHalfResult': return 'Home';
      default: return '';
    }
  };

  const getConfidenceColor = (confidence: string): string => {
    switch (confidence) {
      case 'low': return 'text-orange-500';
      case 'medium': return 'text-blue-500';
      case 'high': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const matchLabel = (match: Match): string => {
    return `${match.homeTeam.name} vs ${match.awayTeam.name} (${match.leagueName})`;
  };
  
  const viewMatch = (matchId: string) => {
    navigate(`/matches/${matchId}`);
  };

  const updatePredictionResult = (predictionId: string, result: 'win' | 'loss' | 'pending') => {
    setRecentPredictions(prev => 
      prev.map(p => p.id === predictionId ? {...p, result} : p)
    );
    
    toast({
      title: "Prediction Updated",
      description: `Prediction status updated to ${result}.`,
    });
  };

  // Generate stats based on current predictions
  const winPercentage = recentPredictions.length > 0 
    ? Math.round((recentPredictions.filter(p => p.result === 'win').length / recentPredictions.length) * 100) 
    : 0;
  
  const marketDistribution = recentPredictions.reduce((acc: Record<string, number>, pred) => {
    acc[pred.market] = (acc[pred.market] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="create">Create Prediction</TabsTrigger>
          <TabsTrigger value="history">Prediction History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Admin Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for matches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="matchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Match</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a match" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {filteredMatches.map((match) => (
                              <SelectItem key={match.id} value={match.id} className="py-3">
                                <div className="flex items-center gap-2">
                                  <img src={match.homeTeam.logo} alt="" className="w-4 h-4" />
                                  <span>{match.homeTeam.name}</span>
                                  <span>vs</span>
                                  <img src={match.awayTeam.logo} alt="" className="w-4 h-4" />
                                  <span>{match.awayTeam.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="market"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prediction Market</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select market" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="home">Home Win</SelectItem>
                            <SelectItem value="away">Away Win</SelectItem>
                            <SelectItem value="draw">Draw</SelectItem>
                            <SelectItem value="bttsYes">Both Teams to Score: Yes</SelectItem>
                            <SelectItem value="bttsNo">Both Teams to Score: No</SelectItem>
                            <SelectItem value="over25">Over 2.5 Goals</SelectItem>
                            <SelectItem value="under25">Under 2.5 Goals</SelectItem>
                            <SelectItem value="over15">Over 1.5 Goals</SelectItem>
                            <SelectItem value="under15">Under 1.5 Goals</SelectItem>
                            <SelectItem value="over35">Over 3.5 Goals</SelectItem>
                            <SelectItem value="under35">Under 3.5 Goals</SelectItem>
                            <SelectItem value="correctScore">Correct Score</SelectItem>
                            <SelectItem value="firstHalfResult">First Half Result</SelectItem>
                            <SelectItem value="doubleChanceHomeOrDraw">Double Chance: Home/Draw</SelectItem>
                            <SelectItem value="doubleChanceAwayOrDraw">Double Chance: Away/Draw</SelectItem>
                            <SelectItem value="cornerOver85">Corners Over 8.5</SelectItem>
                            <SelectItem value="cornerUnder85">Corners Under 8.5</SelectItem>
                            <SelectItem value="noGoal">No Goal</SelectItem>
                            <SelectItem value="cleanSheetHome">Clean Sheet Home</SelectItem>
                            <SelectItem value="cleanSheetAway">Clean Sheet Away</SelectItem>
                            <SelectItem value="bothTeamsToScore2Plus">Both Teams to Score 2+</SelectItem>
                            <SelectItem value="exactGoals">Exact Goals</SelectItem>
                            <SelectItem value="winToNil">Win to Nil</SelectItem>
                            <SelectItem value="multiGoalRange">Multi-Goal Range</SelectItem>
                            <SelectItem value="halfWithMostGoals">Half with Most Goals</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {needsValue && (
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Value
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={getValuePlaceholder(selectedMarket)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="confidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confidence Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select confidence level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Prediction...
                      </>
                    ) : (
                      "Add Prediction"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentPredictions.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  No predictions created yet. Use the form to add predictions.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentPredictions.map(prediction => {
                    const match = mockMatches.find(m => m.id === prediction.matchId);
                    return match ? (
                      <div key={prediction.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                        <div className="flex-1">
                          <div className="font-medium">{matchLabel(match)}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            Market: {getMarketLabel(prediction.market)}
                            {prediction.value && <span>({prediction.value})</span>}
                            {prediction.confidence && (
                              <span className={`ml-2 text-xs ${getConfidenceColor(prediction.confidence)}`}>
                                • {prediction.confidence} confidence
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="text-xs text-muted-foreground">
                              {new Date(prediction.createdAt).toLocaleString()}
                            </div>
                            {prediction.result === 'win' && (
                              <span className="flex items-center text-xs text-green-500">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Win
                              </span>
                            )}
                            {prediction.result === 'loss' && (
                              <span className="flex items-center text-xs text-red-500">
                                <XCircle className="h-3 w-3 mr-1" />
                                Loss
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="text-green-500" 
                              onClick={() => updatePredictionResult(prediction.id, 'win')}>
                              Win
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500"
                              onClick={() => updatePredictionResult(prediction.id, 'loss')}>
                              Loss
                            </Button>
                            <Button size="sm" variant="outline"
                              onClick={() => updatePredictionResult(prediction.id, 'pending')}>
                              Pending
                            </Button>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => viewMatch(match.id)}>
                            View Match
                          </Button>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Prediction Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{recentPredictions.length}</div>
                  <div className="text-sm text-muted-foreground">Total Predictions</div>
                </div>
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {recentPredictions.filter(p => p.result === 'win').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Wins</div>
                </div>
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {recentPredictions.filter(p => p.result === 'loss').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Losses</div>
                </div>
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {recentPredictions.filter(p => p.result === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Win Rate</h3>
                  <div className="w-full bg-secondary h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full" 
                      style={{ width: `${winPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>{winPercentage}%</span>
                    <span>Goal: 60%</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Markets Breakdown</h3>
                  <div className="space-y-2">
                    {Object.entries(marketDistribution).map(([market, count]) => (
                      <div key={market} className="flex justify-between items-center">
                        <span>{getMarketLabel(market)}</span>
                        <span className="text-sm text-muted-foreground">
                          {count} prediction{count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
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

export default AdminPredictionManager;
