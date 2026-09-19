import React from 'react';
import { Tile as TileType } from '@2048/core';
import { Tile } from './Tile.js';

interface BoardProps {
  tiles: TileType[];
  size: number;
  touchRef: React.RefObject<HTMLDivElement | null>;
}

export const Board: React.FC<BoardProps> = ({ tiles, size, touchRef }) => {
  // Empty background grid cells
  const backgroundCells = Array.from({ length: size * size });

  return (
    <div
      ref={touchRef}
      className="relative w-full aspect-square max-w-lg mx-auto p-2 sm:p-3 bg-[#bbada0] dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/10 dark:shadow-black/50 overflow-hidden select-none touch-none border border-black/5 dark:border-white/5"
    >
      {/* Background grid placeholders */}
      <div
        className="grid w-full h-full gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {backgroundCells.map((_, i) => (
          <div
            key={i}
            className="w-full h-full rounded-xl sm:rounded-2xl bg-[#cdc1b4]/70 dark:bg-white/[0.04] transition-colors"
          />
        ))}
      </div>

      {/* Floating interactive tiles */}
      <div className="absolute inset-2 sm:inset-3">
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} size={size} />
        ))}
      </div>
    </div>
  );
};
