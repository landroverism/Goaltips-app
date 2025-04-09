
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { leagues } from '@/lib/utils';
import { mockMatches } from '@/data/mockData';

type SearchResult = {
  id: string;
  name: string;
  type: 'team' | 'league';
  logo?: string;
  route: string;
};

interface SearchAutocompleteProps {
  onSearch: (query: string) => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onSearch }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  // Create a list of searchable items
  const searchItems: SearchResult[] = [
    // Add leagues
    ...leagues.map(league => ({
      id: league.id,
      name: league.name,
      type: 'league' as const,
      route: `/leagues/${league.id}`
    })),
    
    // Add teams without duplicates using flatMap
    ...Array.from(
      new Set(
        mockMatches.flatMap(match => [
          {
            id: match.homeTeam.id,
            name: match.homeTeam.name,
            logo: match.homeTeam.logo,
            type: 'team' as const,
            route: `/teams/${match.homeTeam.id}`
          },
          {
            id: match.awayTeam.id,
            name: match.awayTeam.name,
            logo: match.awayTeam.logo,
            type: 'team' as const,
            route: `/teams/${match.awayTeam.id}`
          }
        ])
      )
    )
  ];

  // Filter search results based on input
  useEffect(() => {
    if (value.length > 1) {
      const filtered = searchItems.filter(item => 
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
    setOpen(false);
  };

  const handleSelect = (selectedItem: SearchResult) => {
    setValue(selectedItem.name);
    setOpen(false);
    navigate(selectedItem.route);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex">
            <Input
              placeholder="Search for teams or leagues..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (e.target.value.length > 1) {
                  setOpen(true);
                } else {
                  setOpen(false);
                }
              }}
              onFocus={() => {
                if (value.length > 1) {
                  setOpen(true);
                }
              }}
              className="flex-1"
            />
            <Button type="submit" className="ml-2 shrink-0">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" sideOffset={4} side="bottom" style={{ width: 'calc(100% - 80px)' }}>
          <Command>
            <CommandInput placeholder="Search..." value={value} onValueChange={setValue} />
            <CommandList>
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup heading="Teams">
                {results.filter(item => item.type === 'team').map(team => (
                  <CommandItem
                    key={team.id}
                    value={team.id}
                    onSelect={() => handleSelect(team)}
                    className="flex items-center"
                  >
                    {team.logo && (
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-6 h-6 mr-2 object-contain"
                      />
                    )}
                    {team.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Leagues">
                {results.filter(item => item.type === 'league').map(league => (
                  <CommandItem
                    key={league.id}
                    value={league.id}
                    onSelect={() => handleSelect(league)}
                  >
                    {league.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </form>
  );
};

export default SearchAutocomplete;
