import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Frown, RotateCcw, Play } from 'lucide-react';
import { GameStatus } from '@2048/core';

interface GameOverModalProps {
  status: GameStatus;
  score: number;
  bestScore: number;
  onRestart: () => void;
  onContinue: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  status,
  score,
  bestScore,
  onRestart,
  onContinue,
}) => {
  const isWon = status === 'WON';
  const isGameOver = status === 'GAME_OVER';

  useEffect(() => {
    if (isWon) {
      // Fire celebratory confetti bursts
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#edc22e', '#f59e0b', '#10b981', '#6366f1'],
        });
      } catch {
        // ignore
      }
    }
  }, [isWon]);

  if (!isWon && !isGameOver) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
        {isWon ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-4 shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              You Win!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Incredible! You reached the coveted <strong className="text-amber-500">2048 tile</strong>. Would you like to chase even higher numbers?
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mb-4 shadow-inner">
              <Frown className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              Game Over!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              No more valid moves left on the grid. Better luck on the next run!
            </p>
          </>
        )}

        {/* Final Score Summary */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Score
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              {score.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Best
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              {bestScore.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-2.5">
          {isWon && (
            <button
              onClick={onContinue}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Keep Playing</span>
            </button>
          )}

          <button
            onClick={onRestart}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
              isWon
                ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                : 'bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-amber-500/20'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
