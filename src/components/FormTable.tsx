
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TeamForm } from '../types';

interface FormTableProps {
  teamForms: TeamForm[];
}

const FormTable: React.FC<FormTableProps> = ({ teamForms }) => {
  // Sort teams alphabetically
  const sortedTeamForms = [...teamForms].sort((a, b) => 
    a.teamName.localeCompare(b.teamName)
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-700 border-b border-gray-600">
          <TableHead className="text-white">Team</TableHead>
          <TableHead className="text-white">Last 5 Games</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTeamForms.map((teamForm) => (
          <TableRow key={teamForm.teamName} className="border-b border-gray-700 hover:bg-gray-700">
            <TableCell className="font-medium">{teamForm.teamName}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {teamForm.form.map((result, index) => (
                  <span
                    key={index}
                    className={`inline-block w-8 h-8 text-center rounded-full text-sm leading-8 font-bold ${
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
                {teamForm.form.length === 0 && (
                  <span className="text-gray-400">No matches played yet</span>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FormTable;
