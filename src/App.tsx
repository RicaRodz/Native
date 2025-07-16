import React from 'react';
import { useAuth } from '@/context/AuthContext';
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  return user ? <HomePage /> : <LandingPage />;
};

export default App;
