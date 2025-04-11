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
import { toast } from 'sonner';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { leagueLogos } from '@/lib/league-logos';

interface LeagueFilterProps {
  selectedLeagues: string[];
  onLeagueChange: (leagues: string[]) => void;
}

const LeagueFilter: React.FC<LeagueFilterProps> = ({ selectedLeagues, onLeagueChange }) => {
  const handleLeagueToggle = (leagueId: string) => {
    const league = leagues.find(l => l.id === leagueId);
    if (!league) return;

    if (selectedLeagues.includes(leagueId)) {
      onLeagueChange(selectedLeagues.filter(id => id !== leagueId));
      toast.success(`Removed ${league.name} from selection`);
    } else {
      onLeagueChange([...selectedLeagues, leagueId]);
      toast.success(`Added ${league.name} to selection`);
    }
  };

  const handleSelectAll = () => {
    const allLeagueIds = leagues.map(league => league.id);
    onLeagueChange(allLeagueIds);
    toast.success(`Selected all ${leagues.length} leagues`);
  };

  const handleClearAll = () => {
    onLeagueChange([]);
    toast.success('Cleared all league selections');
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
          <>
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{country}</div>
            {countryLeagues.map((league) => (
              <DropdownMenuCheckboxItem
                key={league.id}
                checked={selectedLeagues.includes(league.id)}
                onCheckedChange={() => handleLeagueToggle(league.id)}
                className="flex items-center gap-2"
              >
                <div className="relative w-6 h-6 rounded-full">
                  <ImageWithFallback
                    src={leagueLogos[league.id as keyof typeof leagueLogos].src}
                    fallbackSrc={leagueLogos[league.id as keyof typeof leagueLogos].fallback}
                    alt={leagueLogos[league.id as keyof typeof leagueLogos].alt}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="flex-1 truncate">{league.name}</span>
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeagueFilter;
