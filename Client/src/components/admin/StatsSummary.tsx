
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserStats } from '@/types';
import { ArrowUp, ArrowDown, Percent } from 'lucide-react';

interface StatsSummaryProps {
  userStats: UserStats;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ userStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Predictions</p>
              <h3 className="text-2xl font-bold mt-1">{userStats.totalPredictions}</h3>
            </div>
            <div className="rounded-full bg-primary/20 p-2">
              <Percent className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Across all leagues and markets
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
              <h3 className="text-2xl font-bold mt-1">{userStats.winPercentage}%</h3>
            </div>
            <div className="rounded-full bg-primary/20 p-2">
              <Percent className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className={`flex items-center ${userStats.winPercentage > 50 ? 'text-green-500' : 'text-red-500'}`}>
              {userStats.winPercentage > 50 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>
                {userStats.wins} wins / {userStats.losses} losses
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
              <h3 className="text-2xl font-bold mt-1">{userStats.streakCount}</h3>
            </div>
            <div className={`rounded-full p-2 ${userStats.isWinningStreak ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {userStats.isWinningStreak ? (
                <ArrowUp className={`h-4 w-4 ${userStats.isWinningStreak ? 'text-green-500' : 'text-red-500'}`} />
              ) : (
                <ArrowDown className={`h-4 w-4 ${userStats.isWinningStreak ? 'text-green-500' : 'text-red-500'}`} />
              )}
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {userStats.isWinningStreak ? 'Consecutive wins' : 'Consecutive losses'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Best Week</p>
              <h3 className="text-2xl font-bold mt-1">Week 4</h3>
            </div>
            <div className="rounded-full bg-primary/20 p-2">
              <ArrowUp className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            5 wins, 0 losses (100% success)
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSummary;
