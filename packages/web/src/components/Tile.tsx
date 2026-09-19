import React from 'react';
import { Tile as TileType } from '@2048/core';

interface TileProps {
  tile: TileType;
  size: number;
}

export const Tile: React.FC<TileProps> = ({ tile, size }) => {
  const { value, row, col, isNew, isMerged, mergedInto } = tile;

  // Percentage dimensions based on grid size
  const cellSizePercent = 100 / size;

  const getTileStyles = (val: number) => {
    switch (val) {
      case 2:
        return 'bg-[#eee4da] text-[#776e65] dark:bg-[#2e374d] dark:text-[#f8fafc]';
      case 4:
        return 'bg-[#ede0c8] text-[#776e65] dark:bg-[#3b4562] dark:text-[#f8fafc]';
      case 8:
        return 'bg-[#f2b179] text-white shadow-sm dark:bg-[#d97706]';
      case 16:
        return 'bg-[#f59563] text-white shadow-sm dark:bg-[#ea580c]';
      case 32:
        return 'bg-[#f67c5f] text-white shadow-md dark:bg-[#dc2626]';
      case 64:
        return 'bg-[#f65e3b] text-white shadow-md dark:bg-[#e11d48]';
      case 128:
        return 'bg-[#edcf72] text-white shadow-lg shadow-amber-300/30 dark:bg-[#eab308] dark:shadow-amber-500/20';
      case 256:
        return 'bg-[#edcc61] text-white shadow-lg shadow-amber-400/40 dark:bg-[#ca8a04] dark:shadow-amber-500/30';
      case 512:
        return 'bg-[#edc850] text-white shadow-xl shadow-amber-500/50 dark:bg-[#a16207] dark:shadow-amber-500/40';
      case 1024:
        return 'bg-[#edc53f] text-white shadow-xl shadow-amber-500/60 dark:bg-[#eab308] dark:shadow-amber-400/50';
      case 2048:
        return 'bg-[#edc22e] text-white shadow-2xl shadow-amber-400/80 ring-2 ring-yellow-300 animate-pulse dark:bg-[#facc15]';
      default:
        // 4096+ Cosmic High Tiers
        return 'bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-400 text-white shadow-2xl ring-2 ring-pink-400';
    }
  };

  const getFontSize = (val: number, boardSize: number) => {
    if (boardSize >= 6) {
      if (val < 100) return 'text-lg sm:text-xl';
      if (val < 1000) return 'text-sm sm:text-base';
      return 'text-xs sm:text-sm';
    }
    if (boardSize === 5) {
      if (val < 100) return 'text-2xl sm:text-3xl';
      if (val < 1000) return 'text-xl sm:text-2xl';
      return 'text-base sm:text-lg';
    }
    // Default 4x4 or 3x3
    if (val < 100) return 'text-3xl sm:text-4xl';
    if (val < 1000) return 'text-2xl sm:text-3xl';
    if (val < 10000) return 'text-xl sm:text-2xl';
    return 'text-base sm:text-lg';
  };

  return (
    <div
      className="absolute p-1 sm:p-1.5 transition-transform duration-150 ease-out will-change-transform pointer-events-none"
      style={{
        width: `${cellSizePercent}%`,
        height: `${cellSizePercent}%`,
        top: 0,
        left: 0,
        transform: `translate3d(${col * 100}%, ${row * 100}%, 0)`,
        zIndex: mergedInto ? 1 : isMerged ? 20 : isNew ? 15 : 10,
        opacity: mergedInto ? 0.6 : 1,
      }}
    >
      <div
        className={`w-full h-full rounded-xl sm:rounded-2xl flex items-center justify-center font-black select-none ${getTileStyles(
          value
        )} ${getFontSize(value, size)} ${
          isNew ? 'animate-spawn' : isMerged ? 'animate-pop' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
};
