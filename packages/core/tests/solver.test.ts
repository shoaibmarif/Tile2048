import { describe, it, expect } from 'vitest';
import { evaluateBoard, getBestMove } from '../src/solver.js';

describe('AI Solver & Heuristics', () => {
  it('evaluates boards with more empty cells and corner max higher', () => {
    // Board A: corner max tile with plenty of empty cells
    const boardA = [
      [1024, 512, 256, 128],
      [64, 32, 16, 8],
      [4, 2, 0, 0],
      [0, 0, 0, 0],
    ];

    // Board B: max tile trapped in center, scattered tiles
    const boardB = [
      [2, 4, 8, 16],
      [32, 1024, 64, 2],
      [4, 8, 16, 32],
      [2, 4, 8, 16],
    ];

    const scoreA = evaluateBoard(boardA);
    const scoreB = evaluateBoard(boardB);

    expect(scoreA).toBeGreaterThan(scoreB);
  });

  it('suggests a valid and optimal move direction', () => {
    const board = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    const hint = getBestMove(board, 2);
    expect(hint).not.toBeNull();
    expect(['LEFT', 'RIGHT', 'UP', 'DOWN']).toContain(hint!.direction);
    expect(hint!.confidence).toBeGreaterThanOrEqual(50);
  });

  it('returns null when no valid moves exist', () => {
    const deadBoard = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];

    const hint = getBestMove(deadBoard, 2);
    expect(hint).toBeNull();
  });
});
