import { Grid, MoveDirection, AIHint } from './types.js';
import { moveGrid, getEmptyCells, getHighestTile } from './board.js';

const DIRECTIONS: MoveDirection[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

/**
 * Calculates smoothness: measures how close values of neighboring tiles are.
 * Smaller difference = smoother board = higher value.
 */
function calculateSmoothness(grid: Grid): number {
  let smoothness = 0;
  const size = grid.length;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const val = grid[r][c];
      if (val > 0) {
        const valLog = Math.log2(val);

        // Check right neighbor
        if (c + 1 < size && grid[r][c + 1] > 0) {
          smoothness -= Math.abs(valLog - Math.log2(grid[r][c + 1]));
        }

        // Check down neighbor
        if (r + 1 < size && grid[r + 1][c] > 0) {
          smoothness -= Math.abs(valLog - Math.log2(grid[r + 1][c]));
        }
      }
    }
  }

  return smoothness;
}

/**
 * Calculates monotonicity: measures whether values strictly increase or decrease along rows and columns.
 */
function calculateMonotonicity(grid: Grid): number {
  const size = grid.length;
  let totals = [0, 0, 0, 0]; // left/right, up/down

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size - 1; c++) {
      const current = grid[r][c] > 0 ? Math.log2(grid[r][c]) : 0;
      const next = grid[r][c + 1] > 0 ? Math.log2(grid[r][c + 1]) : 0;
      if (current > next) {
        totals[0] += next - current;
      } else {
        totals[1] += current - next;
      }
    }
  }

  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r < size - 1; r++) {
      const current = grid[r][c] > 0 ? Math.log2(grid[r][c]) : 0;
      const next = grid[r + 1][c] > 0 ? Math.log2(grid[r + 1][c]) : 0;
      if (current > next) {
        totals[2] += next - current;
      } else {
        totals[3] += current - next;
      }
    }
  }

  return Math.max(totals[0], totals[1]) + Math.max(totals[2], totals[3]);
}

/**
 * Gives a bonus if the highest tile is positioned in one of the 4 corners
 */
function calculateCornerBonus(grid: Grid): number {
  const size = grid.length;
  const maxTile = getHighestTile(grid);
  if (maxTile === 0) return 0;

  const corners = [
    grid[0][0],
    grid[0][size - 1],
    grid[size - 1][0],
    grid[size - 1][size - 1],
  ];

  if (corners.includes(maxTile)) {
    return Math.log2(maxTile) * 10;
  }
  return -Math.log2(maxTile) * 5;
}

/**
 * Evaluates the static utility score of a given board state
 */
export function evaluateBoard(grid: Grid): number {
  const emptyCells = getEmptyCells(grid).length;
  const smoothness = calculateSmoothness(grid);
  const monotonicity = calculateMonotonicity(grid);
  const cornerBonus = calculateCornerBonus(grid);
  const emptyScore = emptyCells > 0 ? Math.log(emptyCells) * 2.7 : 0;

  return smoothness * 0.15 + monotonicity * 1.2 + emptyScore * 2.5 + cornerBonus;
}

/**
 * Searches and returns the optimal next move for the given board
 */
export function getBestMove(grid: Grid, depth = 2): AIHint | null {
  let bestDirection: MoveDirection | null = null;
  let bestScore = -Infinity;
  const scores: { direction: MoveDirection; score: number }[] = [];

  for (const direction of DIRECTIONS) {
    const moveResult = moveGrid(grid, direction);
    if (!moveResult.changed) continue;

    // Search future moves
    const score = searchMove(moveResult.board, depth - 1, false) + moveResult.scoreGained * 0.5;
    scores.push({ direction, score });

    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
  }

  if (!bestDirection) return null;

  // Calculate confidence based on score differences
  const allScores = scores.map((s) => s.score);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const range = maxScore - minScore;
  const confidence = range === 0 ? 100 : Math.min(99, Math.round(75 + (bestScore - minScore) / (range || 1) * 24));

  return {
    direction: bestDirection,
    score: Math.round(bestScore * 10) / 10,
    confidence,
  };
}

/**
 * Recursive expectimax / minimax search over game tree
 */
function searchMove(grid: Grid, depth: number, isPlayerTurn: boolean): number {
  if (depth <= 0) {
    return evaluateBoard(grid);
  }

  if (isPlayerTurn) {
    let maxScore = -Infinity;
    let anyMoved = false;

    for (const dir of DIRECTIONS) {
      const result = moveGrid(grid, dir);
      if (result.changed) {
        anyMoved = true;
        const score = searchMove(result.board, depth - 1, false);
        if (score > maxScore) maxScore = score;
      }
    }

    return anyMoved ? maxScore : -1000;
  } else {
    // Chance turn: random tile spawn
    const emptyCells = getEmptyCells(grid);
    if (emptyCells.length === 0) return evaluateBoard(grid);

    // Sample up to 3 empty cells for performance
    const sampleCells = emptyCells.slice(0, 3);
    let expectedScore = 0;

    for (const cell of sampleCells) {
      // 90% chance of 2
      const gridWith2 = grid.map((r) => [...r]);
      gridWith2[cell.row][cell.col] = 2;
      expectedScore += 0.9 * searchMove(gridWith2, depth - 1, true);

      // 10% chance of 4
      const gridWith4 = grid.map((r) => [...r]);
      gridWith4[cell.row][cell.col] = 4;
      expectedScore += 0.1 * searchMove(gridWith4, depth - 1, true);
    }

    return expectedScore / sampleCells.length;
  }
}
