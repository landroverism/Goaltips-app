
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isYesterday, isTomorrow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatMatchDate = (date: Date): string => {
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MMM d, h:mm a');
};

export const getMatchStatusClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'live':
      return 'bg-live text-white';
    case 'upcoming':
      return 'bg-upcoming text-white';
    case 'completed':
      return 'bg-completed text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

// Expanded list of European football leagues
export const leagues = [
  { id: 'premier-league', name: 'Premier League', country: 'England' },
  { id: 'la-liga', name: 'La Liga', country: 'Spain' },
  { id: 'bundesliga', name: 'Bundesliga', country: 'Germany' },
  { id: 'serie-a', name: 'Serie A', country: 'Italy' },
  { id: 'ligue-1', name: 'Ligue 1', country: 'France' },
  { id: 'eredivisie', name: 'Eredivisie', country: 'Netherlands' },
  { id: 'liga-portugal', name: 'Liga Portugal', country: 'Portugal' },
  { id: 'champions-league', name: 'Champions League', country: 'Europe' },
  { id: 'europa-league', name: 'Europa League', country: 'Europe' },
  { id: 'conference-league', name: 'Conference League', country: 'Europe' }
];

export const predictionMarkets = [
  { id: '1x2', name: '1X2' },
  { id: 'btts', name: 'Both Teams to Score' },
  { id: 'over-under', name: 'Over/Under 2.5' },
  { id: 'double-chance', name: 'Double Chance' }
];
