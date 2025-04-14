import React from 'react';
import MatchCard from './MatchCard';
import { useLiveMatches } from '../../hooks/useLiveMatches';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const LiveMatchesComponent: React.FC = () => {
  const { liveMatches, isLoading, error } = useLiveMatches();

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

  // Manual refresh function
  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <MatchCardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Matches</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (liveMatches.length === 0) {
    return (
      <div className="bg-secondary rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No Live Matches Right Now</h3>
        <p className="text-muted-foreground mb-4">Check back later for live match updates</p>
        <div className="text-xs text-muted-foreground">
          Auto-refreshing every minute
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveMatches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
      <div className="text-xs text-muted-foreground text-center mt-4">
        Live matches auto-refresh every minute
      </div>
    </>
  );
};

export default LiveMatchesComponent;