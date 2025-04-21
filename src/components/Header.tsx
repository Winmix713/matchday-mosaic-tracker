
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onAddLeague: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, onAddLeague }) => {
  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-lg rounded-t-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-gray-300 text-sm">{subtitle}</p>}
        </div>
        <button
          onClick={onAddLeague}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow transition duration-200"
        >
          Add New League
        </button>
      </div>
    </header>
  );
};

export default Header;
