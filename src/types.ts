
export interface Match {
  id: string;
  round: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  played: boolean;
}

export interface TeamForm {
  teamName: string;
  form: ('W' | 'D' | 'L')[];
}

export interface StandingsEntry {
  position: number;
  previousPosition: number;
  teamName: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface LeagueData {
  id: string;
  name: string;
  country: string;
  season: string;
  matches: Match[];
  standings?: StandingsEntry[];
  teamForm?: TeamForm[];
}
