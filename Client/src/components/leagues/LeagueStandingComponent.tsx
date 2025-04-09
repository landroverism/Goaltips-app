import React, { useState, useEffect } from 'react';
import { fetchStandings } from '../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface LeagueStandingsComponentProps {
  seasonId: string;
}

const LeagueStandingsComponent: React.FC<LeagueStandingsComponentProps> = ({ seasonId }) => {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStandings = async () => {
      try {
        setLoading(true);
        const response = await fetchStandings(seasonId);
        setStandings(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching standings:', err);
        setError('Failed to load standings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadStandings();
  }, [seasonId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>League Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>League Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!standings.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>League Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No standings available for this league</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>League Standings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Pos</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-center">P</TableHead>
              <TableHead className="text-center">W</TableHead>
              <TableHead className="text-center">D</TableHead>
              <TableHead className="text-center">L</TableHead>
              <TableHead className="text-center">GF</TableHead>
              <TableHead className="text-center">GA</TableHead>
              <TableHead className="text-center">GD</TableHead>
              <TableHead className="text-right">Pts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((team, index) => (
              <TableRow key={team.participant_id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <img 
                    src={team.participant?.image_path || ''} 
                    alt={team.participant?.name || ''} 
                    className="w-5 h-5 object-contain" 
                  />
                  <span>{team.participant?.name}</span>
                </TableCell>
                <TableCell className="text-center">{team.details?.games_played || 0}</TableCell>
                <TableCell className="text-center">{team.details?.won || 0}</TableCell>
                <TableCell className="text-center">{team.details?.draw || 0}</TableCell>
                <TableCell className="text-center">{team.details?.lost || 0}</TableCell>
                <TableCell className="text-center">{team.details?.goals_scored || 0}</TableCell>
                <TableCell className="text-center">{team.details?.goals_against || 0}</TableCell>
                <TableCell className="text-center">{(team.details?.goals_scored || 0) - (team.details?.goals_against || 0)}</TableCell>
                <TableCell className="text-right font-bold">{team.details?.points || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeagueStandingsComponent;