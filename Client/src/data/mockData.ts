
import { Match, Prediction, UserStats } from '../types';

export const mockMatches: Match[] = [
  {
    id: '1',
    homeTeam: {
      id: 't1',
      name: 'Arsenal',
      logo: 'https://resources.premierleague.com/premierleague/badges/t3.png',
    },
    awayTeam: {
      id: 't2',
      name: 'Chelsea',
      logo: 'https://resources.premierleague.com/premierleague/badges/t8.png',
    },
    leagueId: 'premier-league',
    leagueName: 'Premier League',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    status: 'upcoming',
    odds: {
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.2,
      bttsYes: 1.8,
      bttsNo: 2.0,
      over25: 1.9,
      under25: 2.1,
    },
  },
  {
    id: '2',
    homeTeam: {
      id: 't3',
      name: 'Manchester City',
      logo: 'https://resources.premierleague.com/premierleague/badges/t43.png',
    },
    awayTeam: {
      id: 't4',
      name: 'Liverpool',
      logo: 'https://resources.premierleague.com/premierleague/badges/t14.png',
    },
    leagueId: 'premier-league',
    leagueName: 'Premier League',
    startTime: new Date(Date.now()).toISOString(),
    status: 'live',
    score: {
      home: 1,
      away: 1,
    },
    odds: {
      homeWin: 1.8,
      draw: 3.5,
      awayWin: 4.2,
      bttsYes: 1.6,
      bttsNo: 2.3,
      over25: 1.7,
      under25: 2.2,
    },
  },
  {
    id: '3',
    homeTeam: {
      id: 't5',
      name: 'Barcelona',
      logo: 'https://media.api-sports.io/football/teams/529.png',
    },
    awayTeam: {
      id: 't6',
      name: 'Real Madrid',
      logo: 'https://media.api-sports.io/football/teams/541.png',
    },
    leagueId: 'la-liga',
    leagueName: 'La Liga',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: 'completed',
    score: {
      home: 2,
      away: 1,
    },
    odds: {
      homeWin: 2.0,
      draw: 3.2,
      awayWin: 3.5,
      bttsYes: 1.7,
      bttsNo: 2.1,
      over25: 1.8,
      under25: 2.0,
    },
  },
  {
    id: '4',
    homeTeam: {
      id: 't7',
      name: 'Bayern Munich',
      logo: 'https://media.api-sports.io/football/teams/157.png',
    },
    awayTeam: {
      id: 't8',
      name: 'Borussia Dortmund',
      logo: 'https://media.api-sports.io/football/teams/165.png',
    },
    leagueId: 'bundesliga',
    leagueName: 'Bundesliga',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: 'upcoming',
    odds: {
      homeWin: 1.5,
      draw: 4.5,
      awayWin: 6.0,
      bttsYes: 1.9,
      bttsNo: 1.9,
      over25: 1.6,
      under25: 2.4,
    },
  },
  {
    id: '5',
    homeTeam: {
      id: 't9',
      name: 'AC Milan',
      logo: 'https://media.api-sports.io/football/teams/489.png',
    },
    awayTeam: {
      id: 't10',
      name: 'Inter Milan',
      logo: 'https://media.api-sports.io/football/teams/505.png',
    },
    leagueId: 'serie-a',
    leagueName: 'Serie A',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    status: 'upcoming',
    odds: {
      homeWin: 2.7,
      draw: 3.3,
      awayWin: 2.5,
      bttsYes: 1.6,
      bttsNo: 2.3,
      over25: 1.7,
      under25: 2.1,
    },
  },
  {
    id: '6',
    homeTeam: {
      id: 't11',
      name: 'PSG',
      logo: 'https://media.api-sports.io/football/teams/85.png',
    },
    awayTeam: {
      id: 't12',
      name: 'Lyon',
      logo: 'https://media.api-sports.io/football/teams/80.png',
    },
    leagueId: 'ligue-1',
    leagueName: 'Ligue 1',
    startTime: new Date(Date.now()).toISOString(),
    status: 'live',
    score: {
      home: 2,
      away: 0,
    },
    odds: {
      homeWin: 1.3,
      draw: 5.0,
      awayWin: 9.0,
      bttsYes: 1.8,
      bttsNo: 2.0,
      over25: 1.4,
      under25: 2.8,
    },
  },
];

export const mockPredictions: Prediction[] = [
  {
    id: 'p1',
    userId: '2',
    matchId: '3',
    market: 'home',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    result: 'win',
  },
  {
    id: 'p2',
    userId: '2',
    matchId: '2',
    market: 'bttsYes',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    result: 'pending',
  },
  {
    id: 'p3',
    userId: '2',
    matchId: '1',
    market: 'away',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    result: 'pending',
  },
];

export const mockUserStats: UserStats = {
  totalPredictions: 32,
  wins: 18,
  losses: 14,
  winPercentage: 56.25,
  streakCount: 3,
  isWinningStreak: true,
  weeklyPerformance: [
    { week: 'Week 1', wins: 2, losses: 3 },
    { week: 'Week 2', wins: 3, losses: 2 },
    { week: 'Week 3', wins: 4, losses: 1 },
    { week: 'Week 4', wins: 5, losses: 0 },
    { week: 'Week 5', wins: 4, losses: 2 },
    { week: 'Week 6', wins: 0, losses: 6 },
  ],
};

export const getMoreMatches = (count: number): Match[] => {
  const result: Match[] = [];
  const teams = [
    { id: 't1', name: 'Arsenal', logo: 'https://resources.premierleague.com/premierleague/badges/t3.png' },
    { id: 't2', name: 'Chelsea', logo: 'https://resources.premierleague.com/premierleague/badges/t8.png' },
    { id: 't3', name: 'Manchester City', logo: 'https://resources.premierleague.com/premierleague/badges/t43.png' },
    { id: 't4', name: 'Liverpool', logo: 'https://resources.premierleague.com/premierleague/badges/t14.png' },
    { id: 't5', name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
    { id: 't6', name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
    { id: 't7', name: 'Bayern Munich', logo: 'https://media.api-sports.io/football/teams/157.png' },
    { id: 't8', name: 'Borussia Dortmund', logo: 'https://media.api-sports.io/football/teams/165.png' }
  ];
  
  const leagues = [
    { id: 'premier-league', name: 'Premier League' },
    { id: 'la-liga', name: 'La Liga' },
    { id: 'bundesliga', name: 'Bundesliga' },
    { id: 'serie-a', name: 'Serie A' },
    { id: 'ligue-1', name: 'Ligue 1' }
  ];
  
  const statuses = ['upcoming', 'live', 'completed'] as const;
  
  for (let i = 0; i < count; i++) {
    const homeTeamIndex = Math.floor(Math.random() * teams.length);
    let awayTeamIndex = Math.floor(Math.random() * teams.length);
    
    while (awayTeamIndex === homeTeamIndex) {
      awayTeamIndex = Math.floor(Math.random() * teams.length);
    }
    
    const leagueIndex = Math.floor(Math.random() * leagues.length);
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIndex];
    
    const match: Match = {
      id: `additional-${i}`,
      homeTeam: teams[homeTeamIndex],
      awayTeam: teams[awayTeamIndex],
      leagueId: leagues[leagueIndex].id,
      leagueName: leagues[leagueIndex].name,
      startTime: new Date(Date.now() + (Math.random() * 2 - 1) * 86400000 * 3).toISOString(),
      status,
      odds: {
        homeWin: 1 + Math.random() * 3,
        draw: 2 + Math.random() * 3,
        awayWin: 2 + Math.random() * 4,
        bttsYes: 1 + Math.random() * 1,
        bttsNo: 1 + Math.random() * 2,
        over25: 1 + Math.random() * 1,
        under25: 1 + Math.random() * 2
      }
    };
    
    if (status === 'live' || status === 'completed') {
      match.score = {
        home: Math.floor(Math.random() * 4),
        away: Math.floor(Math.random() * 3)
      };
    }
    
    result.push(match);
  }
  
  return result;
};
