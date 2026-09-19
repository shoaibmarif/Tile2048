import React from 'react';
import { Home, AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Let&apos;s get you back to the game!
      </p>
      <a
        href="/"
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Tile 2048</span>
      </a>
    </div>
  );
};
