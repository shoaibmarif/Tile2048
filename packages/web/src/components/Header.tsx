import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sun, Moon, Zap, BarChart2, RotateCcw } from 'lucide-react';
import { Theme } from '../hooks/useTheme.js';

interface HeaderProps {
  score: number;
  bestScore: number;
  theme: Theme;
  onThemeCycle: () => void;
  muted: boolean;
  onToggleSound: () => void;
  onOpenStats: () => void;
  onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  bestScore,
  theme,
  onThemeCycle,
  muted,
  onToggleSound,
  onOpenStats,
  onNewGame,
}) => {
  const [scoreGain, setScoreGain] = useState<number | null>(null);
  const [prevScore, setPrevScore] = useState(score);

  useEffect(() => {
    if (score > prevScore) {
      setScoreGain(score - prevScore);
      const timer = setTimeout(() => setScoreGain(null), 600);
      return () => clearTimeout(timer);
    }
    setPrevScore(score);
  }, [score, prevScore]);

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'classic':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'neon':
        return <Zap className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <header className="w-full max-w-lg mx-auto mb-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent select-none drop-shadow-sm">
            2048
          </h1>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 hidden sm:inline">
            Classic & AI
          </span>
        </div>

        {/* Score & Best badges */}
        <div className="flex items-center gap-2">
          {/* Score Badge */}
          <div className="relative flex flex-col items-center justify-center min-w-[76px] sm:min-w-[90px] py-2 px-3 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl border border-slate-300/40 dark:border-slate-700/50 shadow-sm backdrop-blur-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Score
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {score.toLocaleString()}
            </span>
            {scoreGain !== null && (
              <span className="absolute -top-3 right-2 text-xs font-bold text-amber-500 dark:text-amber-400 animate-scorePopup pointer-events-none">
                +{scoreGain}
              </span>
            )}
          </div>

          {/* Best Score Badge */}
          <div className="flex flex-col items-center justify-center min-w-[76px] sm:min-w-[90px] py-2 px-3 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl border border-slate-300/40 dark:border-slate-700/50 shadow-sm backdrop-blur-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Best
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {bestScore.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action controls row */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium">
          Join numbers to get to the <strong className="text-amber-500 font-bold">2048 tile!</strong>
        </p>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800/70 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle sound"
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme cycle button */}
          <button
            onClick={onThemeCycle}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800/70 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors shadow-sm capitalize"
            title={`Current theme: ${theme}. Click to switch.`}
            aria-label="Switch theme"
          >
            {getThemeIcon()}
          </button>

          {/* Stats modal button */}
          <button
            onClick={onOpenStats}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800/70 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            title="View Statistics"
            aria-label="View stats"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* New Game Button */}
          <button
            onClick={onNewGame}
            className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all"
            title="Start New Game (Shortcut: R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>
    </header>
  );
};
