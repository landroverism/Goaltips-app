
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserStats } from '@/types';

interface PredictionChartProps {
  userStats: UserStats;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ userStats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Prediction Performance</CardTitle>
        <CardDescription>Win/loss ratio over the past weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={userStats.weeklyPerformance}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="week" 
                className="text-xs fill-muted-foreground" 
              />
              <YAxis className="fill-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend />
              <Bar dataKey="wins" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="losses" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionChart;
