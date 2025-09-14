
import React from 'react';

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm p-4 sticky top-0 z-20 border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-blue-400">Zenith</span> To-Do
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-slate-300 hidden sm:block">Welcome, <span className="font-semibold text-white">{username}</span></span>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
