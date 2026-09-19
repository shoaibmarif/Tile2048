import React, { useState } from 'react';
import { X, Trophy, Hash, RotateCcw, Flame, CheckCircle, Activity } from 'lucide-react';
import { GameStats } from '@2048/core';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  currentScore: number;
  currentHighestTile: number;
  currentMoves: number;
  boardSize: number;
  onResetStats?: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  currentScore,
  currentHighestTile,
  currentMoves,
  boardSize,
  onResetStats,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  // Games played accounts for any started games or stored count
  const effectiveGamesPlayed = Math.max(stats.gamesPlayed, currentMoves > 0 ? 1 : 0);
  const winRate =
    effectiveGamesPlayed > 0
      ? Math.round((stats.gamesWon / effectiveGamesPlayed) * 100)
      : 0;

  const allTimeHighestTile = Math.max(stats.highestTile, currentHighestTile);
  const allTimeBestScore = Math.max(stats.bestScore, currentScore);

  const getTileBg = (val: number) => {
    switch (val) {
      case 2:
        return 'bg-[#eee4da] text-[#776e65]';
      case 4:
        return 'bg-[#ede0c8] text-[#776e65]';
      case 8:
        return 'bg-[#f2b179] text-white';
      case 16:
        return 'bg-[#f59563] text-white';
      case 32:
        return 'bg-[#f67c5f] text-white';
      case 64:
        return 'bg-[#f65e3b] text-white';
      case 128:
      case 256:
      case 512:
        return 'bg-[#edcf72] text-white shadow-amber-500/30';
      case 1024:
      case 2048:
        return 'bg-[#edc22e] text-white shadow-amber-400/50';
      default:
        return val > 2048
          ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white'
          : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  const handleResetClick = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    onResetStats?.();
    setConfirmReset(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close statistics"
        >
          <X className="w-5 h-5" />
        </button>

        <header className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h3 className="text-2xl font-black">Game Statistics</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time analytics and lifetime records stored in your browser
          </p>
        </header>

        {/* Section 1: Current Run */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 mb-2.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Active Session ({boardSize}x{boardSize})</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                Score
              </span>
              <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                {currentScore.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                Highest
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-black shadow-sm ${getTileBg(
                    currentHighestTile
                  )}`}
                >
                  {currentHighestTile || 2}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                Moves
              </span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-200">
                {currentMoves}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: All-Time Career Statistics */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2.5">
            <Flame className="w-3.5 h-3.5" />
            <span>All-Time Career Records</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col">
              <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Games Played
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {effectiveGamesPlayed}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col">
              <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Win Rate
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-500">
                  {winRate}%
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  ({stats.gamesWon} won)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col">
              <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Best Score
              </span>
              <span className="text-2xl font-black text-amber-500">
                {allTimeBestScore.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col">
              <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Highest Tile Ever
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`px-2.5 py-1 rounded-lg text-sm font-black shadow-sm ${getTileBg(
                    allTimeHighestTile
                  )}`}
                >
                  {allTimeHighestTile || 2}
                </span>
              </div>
            </div>
          </div>

          {/* Lifetime Moves Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Lifetime Moves Made
              </span>
            </div>
            <span className="text-lg font-black text-slate-900 dark:text-slate-100">
              {(stats.totalMoves + currentMoves).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Back to Game</span>
            </button>

            {onResetStats && (
              <button
                onClick={handleResetClick}
                className={`px-3 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  confirmReset
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title="Reset all stats and best score"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{confirmReset ? 'Confirm Reset?' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
