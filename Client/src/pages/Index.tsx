
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MatchCard from '../components/matches/MatchCard';
import { Match } from '../types';
import { Calendar, TrendingUp, Search, Clock } from 'lucide-react';
import { fetchLiveMatches, fetchFixturesByDate, withLoading } from '../services/api';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const Index: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load real match data from API
    const loadMatches = async () => {
      try {
        setIsLoading(true);
        
        // Fetch both live and upcoming matches
        const [liveMatches, upcomingMatches] = await Promise.all([
          withLoading(() => fetchLiveMatches()),
          withLoading(() => fetchFixturesByDate(format(new Date(), 'yyyy-MM-dd')))
        ]);
        
        // Combine all matches
        const allMatches = [
          ...(liveMatches.data || []),
          ...(upcomingMatches.data || [])
        ];
        
        setMatches(allMatches);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMatches();
  }, []);

  // Filter live matches
  const liveMatches = matches.filter(match => match.status === 'live');
  
  // Filter upcoming matches (show only the next 3)
  const upcomingMatches = matches
    .filter(match => match.status === 'upcoming')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  // Loading skeleton for match cards
  const MatchCardSkeleton = () => (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-8 w-8" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-card via-card to-background border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your #1 Source for Football Predictions
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Get expert predictions, real-time updates and track your performance with HamtonGoalTips.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" onClick={() => navigate('/matches')}>
                  View All Matches
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>
                  Create Account
                </Button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-primary rounded-xl transform rotate-3"></div>
                <div className="relative bg-card rounded-xl border border-border overflow-hidden p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&fit=max" 
                    alt="Football" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search for teams, leagues or matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="shrink-0">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Live Matches Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Live Matches</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/matches')}>
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <MatchCardSkeleton key={i} />)}
            </div>
          ) : liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="bg-secondary rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Live Matches Right Now</h3>
              <p className="text-muted-foreground">Check back later for live match updates</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Upcoming Matches</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/matches')}>
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <MatchCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Choose HamtonGoalTips?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="bg-primary/20 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Predictions</h3>
              <p className="text-muted-foreground">
                Get access to expert predictions across multiple leagues and markets
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="bg-primary/20 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Stats</h3>
              <p className="text-muted-foreground">
                Analyze comprehensive statistics to make informed predictions
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="bg-primary/20 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-muted-foreground">
                Stay up-to-date with live scores and match events as they happen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary-foreground">Ready to make winning predictions?</h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Join HamtonGoalTips today and start your winning streak!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" variant="secondary" onClick={() => navigate('/signup')}>
              Create Free Account
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" onClick={() => navigate('/login')}>
              Login
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
