import { Grid, Position, MoveDirection, MoveResult } from './types.js';

/**
 * Creates an empty square grid of the specified size (default 4x4)
 */
export function createEmptyGrid(size = 4): Grid {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

/**
 * Deep clones a grid
 */
export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

/**
 * Returns all coordinates of empty cells (cells with value 0)
 */
export function getEmptyCells(grid: Grid): Position[] {
  const empty: Position[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 0) {
        empty.push({ row: r, col: c });
      }
    }
  }
  return empty;
}

/**
 * Spawns a random tile (90% chance of 2, 10% chance of 4) in an empty cell
 */
export function spawnRandomTile(
  grid: Grid,
  probabilityFor4 = 0.1
): { grid: Grid; pos: Position; value: number } | null {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return null;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < probabilityFor4 ? 4 : 2;
  const newGrid = cloneGrid(grid);
  newGrid[randomCell.row][randomCell.col] = value;

  return { grid: newGrid, pos: randomCell, value };
}

/**
 * Slides and merges a single 1D row/column towards index 0.
 * Respects strict 2048 non-cascading merge rules:
 * - Each tile merges at most once per move.
 * - e.g. [2, 2, 2, 2] -> [4, 4, 0, 0]
 * - e.g. [4, 2, 2, 0] -> [4, 4, 0, 0]
 */
export function slideAndMergeLine(line: number[]): {
  newLine: number[];
  score: number;
  mergedValues: number[];
} {
  const nonZeros = line.filter((v) => v !== 0);
  const result: number[] = [];
  const mergedValues: number[] = [];
  let score = 0;

  for (let i = 0; i < nonZeros.length; i++) {
    if (i + 1 < nonZeros.length && nonZeros[i] === nonZeros[i + 1]) {
      const mergedVal = nonZeros[i] * 2;
      result.push(mergedVal);
      mergedValues.push(mergedVal);
      score += mergedVal;
      i++; // skip next tile because it was merged
    } else {
      result.push(nonZeros[i]);
    }
  }

  // Pad the rest of the line with zeros
  while (result.length < line.length) {
    result.push(0);
  }

  return { newLine: result, score, mergedValues };
}

/**
 * Transposes a matrix (rows become columns)
 */
export function transpose(grid: Grid): Grid {
  const size = grid.length;
  const result = createEmptyGrid(size);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      result[c][r] = grid[r][c];
    }
  }
  return result;
}

/**
 * Reverses each row of the grid horizontally
 */
export function reverseRows(grid: Grid): Grid {
  return grid.map((row) => [...row].reverse());
}

/**
 * Executes a move in the given direction.
 * Returns whether the grid changed, score gained, the new grid, and highest merged value.
 */
export function moveGrid(grid: Grid, direction: MoveDirection): MoveResult {
  const size = grid.length;
  let workingGrid = cloneGrid(grid);
  let totalScore = 0;
  let highestMerged = 0;

  // Transform matrix so movement is equivalent to sliding rows LEFT
  switch (direction) {
    case 'LEFT':
      // no transformation needed
      break;
    case 'RIGHT':
      workingGrid = reverseRows(workingGrid);
      break;
    case 'UP':
      workingGrid = transpose(workingGrid);
      break;
    case 'DOWN':
      workingGrid = transpose(workingGrid);
      workingGrid = reverseRows(workingGrid);
      break;
  }

  // Apply slide and merge to each row
  const processedGrid: Grid = [];
  for (let r = 0; r < size; r++) {
    const { newLine, score, mergedValues } = slideAndMergeLine(workingGrid[r]);
    processedGrid.push(newLine);
    totalScore += score;
    for (const val of mergedValues) {
      if (val > highestMerged) highestMerged = val;
    }
  }

  // Invert transformations back to original coordinate space
  let resultGrid: Grid;
  switch (direction) {
    case 'LEFT':
      resultGrid = processedGrid;
      break;
    case 'RIGHT':
      resultGrid = reverseRows(processedGrid);
      break;
    case 'UP':
      resultGrid = transpose(processedGrid);
      break;
    case 'DOWN':
      resultGrid = reverseRows(processedGrid);
      resultGrid = transpose(resultGrid);
      break;
  }

  // Check if grid state changed
  let changed = false;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== resultGrid[r][c]) {
        changed = true;
        break;
      }
    }
    if (changed) break;
  }

  return {
    changed,
    scoreGained: totalScore,
    board: resultGrid,
    highestMerged,
  };
}

/**
 * Checks if any valid moves remain on the board.
 * Returns true if there is an empty cell or two adjacent matching numbers.
 */
export function hasValidMoves(grid: Grid): boolean {
  const size = grid.length;

  // 1. Check for any empty cells
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) return true;
    }
  }

  // 2. Check for horizontal adjacent matches
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size - 1; c++) {
      if (grid[r][c] === grid[r][c + 1]) return true;
    }
  }

  // 3. Check for vertical adjacent matches
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === grid[r + 1][c]) return true;
    }
  }

  return false;
}

/**
 * Returns the highest tile value currently on the board
 */
export function getHighestTile(grid: Grid): number {
  let max = 0;
  for (const row of grid) {
    for (const val of row) {
      if (val > max) max = val;
    }
  }
  return max;
}
