
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { leagues } from '@/lib/utils';

interface LeagueFilterProps {
  selectedLeagues: string[];
  onLeagueChange: (leagues: string[]) => void;
}

const LeagueFilter: React.FC<LeagueFilterProps> = ({ selectedLeagues, onLeagueChange }) => {
  const handleLeagueToggle = (leagueId: string) => {
    if (selectedLeagues.includes(leagueId)) {
      onLeagueChange(selectedLeagues.filter(id => id !== leagueId));
    } else {
      onLeagueChange([...selectedLeagues, leagueId]);
    }
  };

  const handleSelectAll = () => {
    onLeagueChange(leagues.map(league => league.id));
  };

  const handleClearAll = () => {
    onLeagueChange([]);
  };

  const selectedCount = selectedLeagues.length;
  const totalCount = leagues.length;
  
  // Group leagues by country
  const leaguesByCountry: Record<string, typeof leagues> = {};
  leagues.forEach(league => {
    if (!leaguesByCountry[league.country]) {
      leaguesByCountry[league.country] = [];
    }
    leaguesByCountry[league.country].push(league);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between">
          <span>Leagues</span>
          <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
            {selectedCount > 0 ? `${selectedCount}/${totalCount}` : 'All'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by League</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex justify-between px-2 py-1.5">
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>Select All</Button>
          <Button variant="ghost" size="sm" onClick={handleClearAll}>Clear</Button>
        </div>
        <DropdownMenuSeparator />
        
        {/* Display leagues grouped by country */}
        {Object.entries(leaguesByCountry).map(([country, countryLeagues]) => (
          <React.Fragment key={country}>
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{country}</div>
            {countryLeagues.map((league) => (
              <DropdownMenuCheckboxItem
                key={league.id}
                checked={selectedLeagues.includes(league.id)}
                onCheckedChange={() => handleLeagueToggle(league.id)}
              >
                {league.name}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeagueFilter;
