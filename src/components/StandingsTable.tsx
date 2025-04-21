
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StandingsEntry } from '../types';

interface StandingsTableProps {
  standings: StandingsEntry[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ standings }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-700 border-b border-gray-600">
          <TableHead className="text-white w-12">Pos</TableHead>
          <TableHead className="text-white">Team</TableHead>
          <TableHead className="text-white text-center">MP</TableHead>
          <TableHead className="text-white text-center">W</TableHead>
          <TableHead className="text-white text-center">D</TableHead>
          <TableHead className="text-white text-center">L</TableHead>
          <TableHead className="text-white text-center">GF</TableHead>
          <TableHead className="text-white text-center">GA</TableHead>
          <TableHead className="text-white text-center">GD</TableHead>
          <TableHead className="text-white text-center">Pts</TableHead>
          <TableHead className="text-white">Form</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {standings.map((entry) => (
          <TableRow key={entry.teamName} className="border-b border-gray-700 hover:bg-gray-700">
            <TableCell className="font-medium">
              <div className="flex items-center">
                {entry.position}
                {entry.position < entry.previousPosition && (
                  <span className="text-green-500 ml-1">↑</span>
                )}
                {entry.position > entry.previousPosition && (
                  <span className="text-red-500 ml-1">↓</span>
                )}
              </div>
            </TableCell>
            <TableCell>{entry.teamName}</TableCell>
            <TableCell className="text-center">{entry.matchesPlayed}</TableCell>
            <TableCell className="text-center">{entry.wins}</TableCell>
            <TableCell className="text-center">{entry.draws}</TableCell>
            <TableCell className="text-center">{entry.losses}</TableCell>
            <TableCell className="text-center">{entry.goalsFor}</TableCell>
            <TableCell className="text-center">{entry.goalsAgainst}</TableCell>
            <TableCell className="text-center">{entry.goalDifference}</TableCell>
            <TableCell className="text-center font-bold">{entry.points}</TableCell>
            <TableCell>
              <div className="flex space-x-1">
                {entry.form.map((result, index) => (
                  <span
                    key={index}
                    className={`inline-block w-6 h-6 text-center rounded-full text-xs leading-6 font-bold ${
                      result === 'W'
                        ? 'bg-green-600'
                        : result === 'D'
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                  >
                    {result}
                  </span>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StandingsTable;
