import { describe, it, expect } from 'vitest';
import {
  createEmptyGrid,
  slideAndMergeLine,
  moveGrid,
  hasValidMoves,
  getHighestTile,
  getEmptyCells,
  spawnRandomTile,
} from '../src/board.js';

describe('Board Mechanics', () => {
  describe('createEmptyGrid', () => {
    it('creates a 4x4 grid of zeros by default', () => {
      const grid = createEmptyGrid(4);
      expect(grid.length).toBe(4);
      expect(grid[0].length).toBe(4);
      expect(grid.flat().every((cell) => cell === 0)).toBe(true);
    });

    it('creates grids of custom sizes', () => {
      const grid3 = createEmptyGrid(3);
      expect(grid3.length).toBe(3);
      const grid5 = createEmptyGrid(5);
      expect(grid5.length).toBe(5);
    });
  });

  describe('slideAndMergeLine (strict 2048 non-cascading rules)', () => {
    it('merges simple identical adjacent pairs', () => {
      const { newLine, score, mergedValues } = slideAndMergeLine([2, 2, 0, 0]);
      expect(newLine).toEqual([4, 0, 0, 0]);
      expect(score).toBe(4);
      expect(mergedValues).toEqual([4]);
    });

    it('handles non-cascading merge for four identical numbers [2, 2, 2, 2] -> [4, 4, 0, 0]', () => {
      const { newLine, score, mergedValues } = slideAndMergeLine([2, 2, 2, 2]);
      expect(newLine).toEqual([4, 4, 0, 0]);
      expect(score).toBe(8);
      expect(mergedValues).toEqual([4, 4]);
    });

    it('prioritizes merge towards the sliding direction [2, 2, 2, 0] -> [4, 2, 0, 0]', () => {
      const { newLine, score } = slideAndMergeLine([2, 2, 2, 0]);
      expect(newLine).toEqual([4, 2, 0, 0]);
      expect(score).toBe(4);
    });

    it('does not merge already merged tiles with neighboring identicals [4, 2, 2, 0] -> [4, 4, 0, 0]', () => {
      const { newLine, score } = slideAndMergeLine([4, 2, 2, 0]);
      expect(newLine).toEqual([4, 4, 0, 0]);
      expect(score).toBe(4);
    });

    it('slides tiles across empty spaces [2, 0, 0, 2] -> [4, 0, 0, 0]', () => {
      const { newLine, score } = slideAndMergeLine([2, 0, 0, 2]);
      expect(newLine).toEqual([4, 0, 0, 0]);
      expect(score).toBe(4);
    });

    it('leaves non-mergeable tiles in compacted order [2, 4, 8, 16] -> [2, 4, 8, 16]', () => {
      const { newLine, score } = slideAndMergeLine([2, 4, 8, 16]);
      expect(newLine).toEqual([2, 4, 8, 16]);
      expect(score).toBe(0);
    });
  });

  describe('moveGrid in all 4 directions', () => {
    it('moves LEFT correctly', () => {
      const grid = [
        [2, 0, 0, 2],
        [4, 4, 2, 2],
        [0, 0, 0, 0],
        [8, 8, 8, 8],
      ];
      const result = moveGrid(grid, 'LEFT');
      expect(result.changed).toBe(true);
      expect(result.scoreGained).toBe(4 + 8 + 4 + 16 + 16);
      expect(result.board[0]).toEqual([4, 0, 0, 0]);
      expect(result.board[1]).toEqual([8, 4, 0, 0]);
      expect(result.board[2]).toEqual([0, 0, 0, 0]);
      expect(result.board[3]).toEqual([16, 16, 0, 0]);
    });

    it('moves RIGHT correctly', () => {
      const grid = [
        [2, 0, 0, 2],
        [4, 4, 2, 2],
        [0, 0, 0, 0],
        [8, 8, 8, 8],
      ];
      const result = moveGrid(grid, 'RIGHT');
      expect(result.changed).toBe(true);
      expect(result.board[0]).toEqual([0, 0, 0, 4]);
      expect(result.board[1]).toEqual([0, 0, 8, 4]);
      expect(result.board[3]).toEqual([0, 0, 16, 16]);
    });

    it('moves UP correctly', () => {
      const grid = [
        [2, 4, 0, 8],
        [2, 4, 0, 8],
        [0, 2, 0, 8],
        [0, 2, 0, 8],
      ];
      const result = moveGrid(grid, 'UP');
      expect(result.changed).toBe(true);
      expect(result.board[0]).toEqual([4, 8, 0, 16]);
      expect(result.board[1]).toEqual([0, 4, 0, 16]);
      expect(result.board[2]).toEqual([0, 0, 0, 0]);
      expect(result.board[3]).toEqual([0, 0, 0, 0]);
    });

    it('moves DOWN correctly', () => {
      const grid = [
        [2, 4, 0, 8],
        [2, 4, 0, 8],
        [0, 2, 0, 8],
        [0, 2, 0, 8],
      ];
      const result = moveGrid(grid, 'DOWN');
      expect(result.changed).toBe(true);
      expect(result.board[0]).toEqual([0, 0, 0, 0]);
      expect(result.board[1]).toEqual([0, 0, 0, 0]);
      expect(result.board[2]).toEqual([0, 8, 0, 16]);
      expect(result.board[3]).toEqual([4, 4, 0, 16]);
    });

    it('detects when move causes no change', () => {
      const grid = [
        [4, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      const result = moveGrid(grid, 'LEFT');
      expect(result.changed).toBe(false);
      expect(result.scoreGained).toBe(0);
    });
  });

  describe('hasValidMoves', () => {
    it('returns true when there are empty cells', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2, 4],
        [8, 16, 32, 0],
      ];
      expect(hasValidMoves(grid)).toBe(true);
    });

    it('returns true when full board has horizontal match', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2, 2], // 2 and 2 can merge
        [8, 16, 32, 64],
      ];
      expect(hasValidMoves(grid)).toBe(true);
    });

    it('returns true when full board has vertical match', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 4, 128, 256], // 4 matches row above
        [512, 1024, 2, 4],
        [8, 16, 32, 64],
      ];
      expect(hasValidMoves(grid)).toBe(true);
    });

    it('returns false when no empty cells and no adjacent matches', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 256],
      ];
      expect(hasValidMoves(grid)).toBe(false);
    });
  });

  describe('getHighestTile and spawnRandomTile', () => {
    it('returns the maximum tile on the board', () => {
      const grid = [
        [2, 0, 0, 0],
        [0, 1024, 0, 0],
        [0, 0, 2048, 0],
        [0, 0, 0, 512],
      ];
      expect(getHighestTile(grid)).toBe(2048);
    });

    it('spawns a 2 or 4 in an empty cell', () => {
      const grid = createEmptyGrid(4);
      const result = spawnRandomTile(grid);
      expect(result).not.toBeNull();
      expect([2, 4]).toContain(result!.value);
      expect(getEmptyCells(result!.grid).length).toBe(15);
    });
  });
});
