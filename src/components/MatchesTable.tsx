
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Match } from '../types';

interface MatchesTableProps {
  matches: Match[];
}

const MatchesTable: React.FC<MatchesTableProps> = ({ matches }) => {
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
  
  // Get unique rounds
  const rounds = Array.from(new Set(matches.map(match => match.round))).sort((a, b) => a - b);
  
  const filteredMatches = selectedRound === 'all' 
    ? matches 
    : matches.filter(match => match.round === selectedRound);

  return (
    <div>
      <div className="mb-4 flex items-center">
        <span className="mr-4">Round:</span>
        <select
          value={selectedRound === 'all' ? 'all' : selectedRound}
          onChange={(e) => setSelectedRound(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="bg-gray-700 text-white border border-gray-600 rounded-md p-2"
        >
          <option value="all">All Rounds</option>
          {rounds.map(round => (
            <option key={round} value={round}>
              Round {round}
            </option>
          ))}
        </select>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-700 border-b border-gray-600">
            <TableHead className="text-white">Round</TableHead>
            <TableHead className="text-white">Date</TableHead>
            <TableHead className="text-white">Home Team</TableHead>
            <TableHead className="text-white text-center">Score</TableHead>
            <TableHead className="text-white">Away Team</TableHead>
            <TableHead className="text-white text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMatches.map((match) => (
            <TableRow key={match.id} className="border-b border-gray-700 hover:bg-gray-700">
              <TableCell>{match.round}</TableCell>
              <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
              <TableCell className="font-medium text-right">{match.homeTeam}</TableCell>
              <TableCell className="text-center">
                {match.played ? (
                  <span className="font-bold">
                    {match.homeGoals} - {match.awayGoals}
                  </span>
                ) : (
                  <span className="text-gray-400">vs</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{match.awayTeam}</TableCell>
              <TableCell className="text-center">
                {match.played ? (
                  <span className="bg-green-800 text-white py-1 px-2 rounded-md text-xs">
                    Completed
                  </span>
                ) : (
                  <span className="bg-gray-600 text-white py-1 px-2 rounded-md text-xs">
                    Scheduled
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchesTable;
