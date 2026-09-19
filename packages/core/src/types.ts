export type MoveDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'PLAYING' | 'WON' | 'GAME_OVER';

export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
  mergedInto?: string;
}

export type Grid = number[][];

export interface MoveResult {
  changed: boolean;
  scoreGained: number;
  board: Grid;
  highestMerged: number;
}

export interface GameSnapshot {
  board: Grid;
  tiles: Tile[];
  score: number;
  moveCount: number;
  status: GameStatus;
  hasWon: boolean;
}

export interface GameState {
  size: number;
  board: Grid;
  tiles: Tile[];
  score: number;
  bestScore: number;
  moveCount: number;
  status: GameStatus;
  hasWon: boolean;
  keepPlaying: boolean;
  canUndo: boolean;
  historyLength: number;
}

export interface AIHint {
  direction: MoveDirection;
  score: number;
  confidence: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestScore: number;
  highestTile: number;
  totalMoves: number;
}
