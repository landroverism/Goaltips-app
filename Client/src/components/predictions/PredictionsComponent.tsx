import React, { useState, useEffect } from 'react';
import { fetchPredictions } from '../../services/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface PredictionsComponentProps {
  matchId: string;
}

const PredictionsComponent: React.FC<PredictionsComponentProps> = ({ matchId }) => {
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        setLoading(true);
        const response = await fetchPredictions(matchId);
        setPredictions(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError('Failed to load predictions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, [matchId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Match Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Match Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictions || !predictions.predictions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Match Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No predictions available for this match</p>
        </CardContent>
      </Card>
    );
  }

  const prediction = predictions.predictions;
  const homeWinProb = prediction.home_win_probability || 0;
  const drawProb = prediction.draw_probability || 0;
  const awayWinProb = prediction.away_win_probability || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Predictions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Home Win</span>
            <span>{homeWinProb}%</span>
          </div>
          <Progress value={homeWinProb} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Draw</span>
            <span>{drawProb}%</span>
          </div>
          <Progress value={drawProb} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Away Win</span>
            <span>{awayWinProb}%</span>
          </div>
          <Progress value={awayWinProb} className="h-2" />
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <h3 className="font-medium mb-2">Predicted Result</h3>
          <div className="p-3 bg-primary/10 rounded-md text-center font-medium">
            {prediction.result || 'Unknown'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionsComponent;