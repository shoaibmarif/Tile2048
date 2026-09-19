import { describe, it, expect } from 'vitest';
import { Game2048 } from '../src/game.js';

describe('Game2048 State Machine', () => {
  it('initializes with 2 tiles and score 0', () => {
    const game = new Game2048(4);
    const state = game.getState();
    expect(state.size).toBe(4);
    expect(state.score).toBe(0);
    expect(state.moveCount).toBe(0);
    expect(state.status).toBe('PLAYING');
    expect(state.tiles.length).toBe(2);
    expect(state.canUndo).toBe(false);
  });

  it('updates score and moveCount when move changes the board', () => {
    const game = new Game2048(4);
    // Load a known board
    game.loadState({
      board: [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      score: 0,
      bestScore: 0,
    });

    const result = game.move('LEFT');
    expect(result.moved).toBe(true);
    expect(result.scoreGained).toBe(4);
    expect(result.state.score).toBe(4);
    expect(result.state.moveCount).toBe(1);
    expect(result.state.canUndo).toBe(true);
  });

  it('supports undoing moves to restore previous state', () => {
    const game = new Game2048(4);
    game.loadState({
      board: [
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      score: 10,
      bestScore: 10,
    });

    game.move('LEFT');
    expect(game.getState().score).toBe(14);
    expect(game.getState().canUndo).toBe(true);

    const undoSuccess = game.undo();
    expect(undoSuccess).toBe(true);
    expect(game.getState().score).toBe(10);
    expect(game.getState().board[0][0]).toBe(2);
    expect(game.getState().board[0][1]).toBe(2);
    expect(game.getState().canUndo).toBe(false);
  });

  it('detects 2048 victory and transitions to WON state', () => {
    const game = new Game2048(4);
    game.loadState({
      board: [
        [1024, 1024, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      score: 1000,
      bestScore: 1000,
    });

    const result = game.move('LEFT');
    expect(result.state.status).toBe('WON');
    expect(result.state.hasWon).toBe(true);

    // Player continues after win
    const continuedState = game.continueAfterWin();
    expect(continuedState.status).toBe('PLAYING');
    expect(continuedState.keepPlaying).toBe(true);
  });

  it('detects GAME_OVER when no moves remain', () => {
    const game = new Game2048(4);
    // Setup a board where the only move results in a full grid with no adjacent matches
    game.loadState({
      board: [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2, 4],
        [8, 16, 32, 32], // merging right gives [0, 8, 16, 64], but let's test a dead board
      ],
      score: 500,
      bestScore: 500,
    });

    // Directly loading an unwinnable board
    game.loadState({
      board: [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ],
      score: 100,
      bestScore: 100,
    });

    expect(game.getState().status).toBe('GAME_OVER');
  });

  it('supports changing board sizes (3x3, 5x5)', () => {
    const game = new Game2048(4);
    game.changeSize(3);
    expect(game.getState().size).toBe(3);
    expect(game.getState().board.length).toBe(3);

    game.changeSize(5);
    expect(game.getState().size).toBe(5);
    expect(game.getState().board.length).toBe(5);
  });
});
