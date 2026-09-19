import { GameStats, Grid } from './types.js';

const STORAGE_KEYS = {
  BEST_SCORE: '2048_best_score',
  SAVED_GAME: '2048_saved_game',
  STATS: '2048_game_stats',
};

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestScore: 0,
  highestTile: 0,
  totalMoves: 0,
};

export interface SavedGameData {
  board: Grid;
  score: number;
  bestScore: number;
  moveCount: number;
  size: number;
  timestamp: number;
}

export function loadStoredBestScore(defaultScore = 0): number {
  if (typeof window === 'undefined' || !window.localStorage) return defaultScore;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
    return stored ? parseInt(stored, 10) || defaultScore : defaultScore;
  } catch {
    return defaultScore;
  }
}

export function saveStoredBestScore(score: number): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const current = loadStoredBestScore(0);
    if (score > current) {
      window.localStorage.setItem(STORAGE_KEYS.BEST_SCORE, score.toString());
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function loadStoredStats(): GameStats {
  if (typeof window === 'undefined' || !window.localStorage) return { ...DEFAULT_STATS };
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.STATS);
    return stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : { ...DEFAULT_STATS };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStoredStats(stats: GameStats): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {
    // Ignore storage quota errors
  }
}

export function recordMove(currentScore: number, currentHighestTile: number): GameStats {
  const stats = loadStoredStats();
  if (stats.gamesPlayed === 0) {
    stats.gamesPlayed = 1;
  }
  stats.totalMoves++;
  if (currentScore > stats.bestScore) {
    stats.bestScore = currentScore;
    saveStoredBestScore(currentScore);
  }
  if (currentHighestTile > stats.highestTile) {
    stats.highestTile = currentHighestTile;
  }
  saveStoredStats(stats);
  return stats;
}

export function recordGameStart(): GameStats {
  const stats = loadStoredStats();
  stats.gamesPlayed++;
  saveStoredStats(stats);
  return stats;
}

export function recordGameFinished(
  won: boolean,
  score: number,
  highestTile: number,
  moves: number
): GameStats {
  const stats = loadStoredStats();
  if (won) stats.gamesWon++;
  if (score > stats.bestScore) stats.bestScore = score;
  if (highestTile > stats.highestTile) stats.highestTile = highestTile;
  if (moves > 0 && stats.totalMoves < moves) stats.totalMoves = moves;
  saveStoredStats(stats);
  saveStoredBestScore(stats.bestScore);
  return stats;
}

export function resetStoredStats(): GameStats {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.STATS);
      window.localStorage.removeItem(STORAGE_KEYS.BEST_SCORE);
    } catch {
      // ignore
    }
  }
  return { ...DEFAULT_STATS };
}

