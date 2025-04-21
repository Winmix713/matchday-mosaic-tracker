
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { LeagueData } from '../types';

interface LeagueTableProps {
  leagues: LeagueData[];
  onViewLeague: (id: string) => void;
  onEditLeague: (id: string) => void;
  onDeleteLeague: (id: string) => void;
}

const LeagueTable: React.FC<LeagueTableProps> = ({ 
  leagues, 
  onViewLeague, 
  onEditLeague, 
  onDeleteLeague 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLeagues = leagues.filter(league => 
    league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    league.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    league.season.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mb-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search leagues..."
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-700 border-b border-gray-600">
            <TableHead className="text-white">League Name</TableHead>
            <TableHead className="text-white">Country</TableHead>
            <TableHead className="text-white">Season</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeagues.length > 0 ? (
            filteredLeagues.map((league) => (
              <TableRow 
                key={league.id} 
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <TableCell className="font-medium">{league.name}</TableCell>
                <TableCell>{league.country}</TableCell>
                <TableCell>{league.season}</TableCell>
                <TableCell className="space-x-2">
                  <button
                    onClick={() => onViewLeague(league.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md shadow transition duration-200"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEditLeague(league.id)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded-md shadow transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteLeague(league.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md shadow transition duration-200"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No leagues found. Please add a new league.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueTable;
