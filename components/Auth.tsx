
import React, { useState } from 'react';

interface AuthProps {
  onAuth: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onAuth(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-blue-400 mb-2">Welcome to Zenith To-Do</h1>
        <p className="text-center text-slate-400 mb-8">Enter a username to get started.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign Up & Start Organizing
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
