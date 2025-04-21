
import React, { useState } from 'react';
import { LeagueData } from '../types';
import StandingsTable from './StandingsTable';
import MatchesTable from './MatchesTable';
import FormTable from './FormTable';

interface LeagueDetailsProps {
  league: LeagueData;
  onBack: () => void;
}

const LeagueDetails: React.FC<LeagueDetailsProps> = ({ league, onBack }) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'matches' | 'form'>('standings');

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">{league.name}</h2>
          <p className="text-gray-300">{league.country} | {league.season}</p>
        </div>
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow transition duration-200"
        >
          Back to Leagues
        </button>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-700 flex">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'standings'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('standings')}
          >
            Standings
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'matches'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'form'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('form')}
          >
            Form
          </button>
        </div>
      </div>

      {activeTab === 'standings' && league.standings && (
        <StandingsTable standings={league.standings} />
      )}
      
      {activeTab === 'matches' && (
        <MatchesTable matches={league.matches} />
      )}
      
      {activeTab === 'form' && league.teamForm && (
        <FormTable teamForms={league.teamForm} />
      )}
    </div>
  );
};

export default LeagueDetails;
