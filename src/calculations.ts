
import { LeagueData, Match, StandingsEntry, TeamForm } from "./types";

export function calculateStandings(matches: Match[]): StandingsEntry[] {
  const teams = new Map<string, StandingsEntry>();
  
  // Get unique team names
  matches.forEach(match => {
    if (match.played) {
      if (!teams.has(match.homeTeam)) {
        teams.set(match.homeTeam, createInitialStandingsEntry(match.homeTeam));
      }
      if (!teams.has(match.awayTeam)) {
        teams.set(match.awayTeam, createInitialStandingsEntry(match.awayTeam));
      }
    }
  });
  
  // Calculate statistics
  matches.forEach(match => {
    if (match.played) {
      const homeTeam = teams.get(match.homeTeam)!;
      const awayTeam = teams.get(match.awayTeam)!;
      
      // Update matches played
      homeTeam.matchesPlayed += 1;
      awayTeam.matchesPlayed += 1;
      
      // Update goals
      homeTeam.goalsFor += match.homeGoals;
      homeTeam.goalsAgainst += match.awayGoals;
      awayTeam.goalsFor += match.awayGoals;
      awayTeam.goalsAgainst += match.homeGoals;
      
      // Calculate result and update points
      if (match.homeGoals > match.awayGoals) {
        // Home team wins
        homeTeam.wins += 1;
        homeTeam.points += 3;
        homeTeam.form.push('W');
        awayTeam.losses += 1;
        awayTeam.form.push('L');
      } else if (match.homeGoals < match.awayGoals) {
        // Away team wins
        awayTeam.wins += 1;
        awayTeam.points += 3;
        awayTeam.form.push('W');
        homeTeam.losses += 1;
        homeTeam.form.push('L');
      } else {
        // Draw
        homeTeam.draws += 1;
        homeTeam.points += 1;
        homeTeam.form.push('D');
        awayTeam.draws += 1;
        awayTeam.points += 1;
        awayTeam.form.push('D');
      }
    }
  });
  
  // Calculate goal difference and trim form to last 5 matches
  teams.forEach(team => {
    team.goalDifference = team.goalsFor - team.goalsAgainst;
    team.form = team.form.slice(-5);
  });
  
  // Convert Map to Array and sort
  const standingsArray = Array.from(teams.values());
  
  // Sort by points (desc), then goal difference (desc), then goals for (desc)
  standingsArray.sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points;
    if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
  
  // Assign positions
  standingsArray.forEach((team, index) => {
    team.position = index + 1;
    // For now, just set previousPosition equal to current position
    // In a real app, you'd compare with previous standings
    team.previousPosition = team.position;
  });
  
  return standingsArray;
}

export function calculateTeamForm(matches: Match[]): TeamForm[] {
  const teams = new Map<string, TeamForm>();
  
  // Get unique team names
  matches.forEach(match => {
    if (match.played) {
      if (!teams.has(match.homeTeam)) {
        teams.set(match.homeTeam, { teamName: match.homeTeam, form: [] });
      }
      if (!teams.has(match.awayTeam)) {
        teams.set(match.awayTeam, { teamName: match.awayTeam, form: [] });
      }
    }
  });
  
  // Sort matches by round to ensure chronological order
  const sortedMatches = [...matches].sort((a, b) => a.round - b.round);
  
  // Calculate form for each team
  sortedMatches.forEach(match => {
    if (match.played) {
      const homeTeam = teams.get(match.homeTeam)!;
      const awayTeam = teams.get(match.awayTeam)!;
      
      if (match.homeGoals > match.awayGoals) {
        homeTeam.form.push('W');
        awayTeam.form.push('L');
      } else if (match.homeGoals < match.awayGoals) {
        homeTeam.form.push('L');
        awayTeam.form.push('W');
      } else {
        homeTeam.form.push('D');
        awayTeam.form.push('D');
      }
    }
  });
  
  // Trim form to last 5 matches
  teams.forEach(team => {
    team.form = team.form.slice(-5);
  });
  
  return Array.from(teams.values());
}

function createInitialStandingsEntry(teamName: string): StandingsEntry {
  return {
    position: 0,
    previousPosition: 0,
    teamName,
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    form: []
  };
}

export function processLeagueData(league: LeagueData): LeagueData {
  // Calculate standings and team form based on matches
  const standings = calculateStandings(league.matches);
  const teamForm = calculateTeamForm(league.matches);
  
  return {
    ...league,
    standings,
    teamForm
  };
}
