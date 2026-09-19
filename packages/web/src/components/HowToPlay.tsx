import React from 'react';
import { Lightbulb, Target, Compass, CornerDownRight } from 'lucide-react';

export const HowToPlay: React.FC = () => {
  return (
    <section className="w-full max-w-lg mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Strategy Guide: How to Win 2048
        </h2>
      </div>

      <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          While 2048 is easy to learn in seconds, reaching high scores requires deliberate mathematical strategy. Here are the top tactics used by master players:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200 mb-1">
              <CornerDownRight className="w-4 h-4 text-indigo-500" />
              <span>1. The Corner Anchor</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick one fixed corner (e.g. bottom-left) and build your largest tile there. Never swipe in the opposite direction (up or right) unless completely forced.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200 mb-1">
              <Target className="w-4 h-4 text-amber-500" />
              <span>2. Monotonic Snake</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arrange rows in descending numerical order (e.g., 1024 → 512 → 256 → 128) so domino merges cascade directly into your corner tile.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200 mb-1">
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>3. Keep Free Cells</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consolidate smaller numbers whenever possible. More empty cells provide maneuverability and prevent sudden game over states.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-200 mb-1">
              <Lightbulb className="w-4 h-4 text-rose-500" />
              <span>4. Use AI Hints</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Whenever stuck in a tricky position, press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px]">H</kbd> or click <strong>AI Hint</strong> to calculate the mathematically highest expectation move.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
