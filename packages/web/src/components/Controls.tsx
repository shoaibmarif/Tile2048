import React from 'react';
import { Undo2, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Pause } from 'lucide-react';
import { MoveDirection, AIHint } from '@2048/core';

interface ControlsProps {
  canUndo: boolean;
  onUndo: () => void;
  onGetHint: () => void;
  hint: AIHint | null;
  size: number;
  onChangeSize: (newSize: number) => void;
  onMove: (dir: MoveDirection) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  canUndo,
  onUndo,
  onGetHint,
  hint,
  size,
  onChangeSize,
  onMove,
  isAutoPlaying,
  onToggleAutoPlay,
}) => {
  const getDirectionArrow = (dir: MoveDirection) => {
    switch (dir) {
      case 'UP':
        return <ArrowUp className="w-4 h-4 text-emerald-500 animate-bounce" />;
      case 'DOWN':
        return <ArrowDown className="w-4 h-4 text-emerald-500 animate-bounce" />;
      case 'LEFT':
        return <ArrowLeft className="w-4 h-4 text-emerald-500 animate-bounce" />;
      case 'RIGHT':
        return <ArrowRight className="w-4 h-4 text-emerald-500 animate-bounce" />;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-5 flex flex-col gap-4">
      {/* Top action row: Undo, Hint, AutoPlay & Grid Size */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Undo */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              canUndo
                ? 'bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 active:scale-95'
                : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
            }`}
            title="Undo Last Move (Shortcut: U or Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
            <span>Undo</span>
          </button>

          {/* AI Hint */}
          <button
            onClick={onGetHint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm"
            title="Get AI Best Move Suggestion (Shortcut: H)"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>AI Hint</span>
            {hint && (
              <span className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-900/80 font-bold text-xs">
                {getDirectionArrow(hint.direction)}
                {hint.direction}
              </span>
            )}
          </button>

          {/* Auto-Play Toggle */}
          <button
            onClick={onToggleAutoPlay}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              isAutoPlaying
                ? 'bg-emerald-500 text-white animate-pulse'
                : 'bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100'
            }`}
            title="Toggle AI Auto Play"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAutoPlaying ? 'Pause AI' : 'AI Play'}</span>
          </button>
        </div>

        {/* Grid Size Selector */}
        <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-300/40 dark:border-slate-700/50">
          {[3, 4, 5, 6].map((sz) => (
            <button
              key={sz}
              onClick={() => onChangeSize(sz)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                size === sz
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={`${sz}x${sz} Grid`}
            >
              {sz}x{sz}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Directional Touch Controls */}
      <div className="flex sm:hidden flex-col items-center gap-1.5 py-2">
        <button
          onClick={() => onMove('UP')}
          className="w-12 h-10 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow active:scale-95"
          aria-label="Move Up"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-6">
          <button
            onClick={() => onMove('LEFT')}
            className="w-12 h-10 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow active:scale-95"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onMove('DOWN')}
            className="w-12 h-10 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow active:scale-95"
            aria-label="Move Down"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => onMove('RIGHT')}
            className="w-12 h-10 flex items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow active:scale-95"
            aria-label="Move Right"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
