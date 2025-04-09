
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  favoriteLeagues?: string[];
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  leagueId: string;
  leagueName: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'completed';
  score?: Score;
  odds: Odds;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface Score {
  home: number;
  away: number;
}

export interface Odds {
  homeWin: number;
  draw: number;
  awayWin: number;
  bttsYes: number;
  bttsNo: number;
  over25: number;
  under25: number;
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  market: 'home' | 'draw' | 'away' | 'bttsYes' | 'bttsNo' | 'over25' | 'under25' | 
          'over15' | 'under15' | 'over35' | 'under35' | 'correctScore' | 'firstHalfResult' |
          'doubleChanceHomeOrDraw' | 'doubleChanceAwayOrDraw' | 'cornerOver85' | 'cornerUnder85' |
          'noGoal' | 'cleanSheetHome' | 'cleanSheetAway' | 'bothTeamsToScore2Plus' |
          'exactGoals' | 'winToNil' | 'multiGoalRange' | 'halfWithMostGoals';
  createdAt: string;
  result?: 'win' | 'loss' | 'pending';
  value?: string; // For markets like correct score (e.g. "2-1")
  confidence?: 'low' | 'medium' | 'high'; // Added confidence level
}

export interface UserStats {
  totalPredictions: number;
  wins: number;
  losses: number;
  winPercentage: number;
  streakCount: number;
  isWinningStreak: boolean;
  weeklyPerformance: WeeklyPerformance[];
}

export interface WeeklyPerformance {
  week: string;
  wins: number;
  losses: number;
}
