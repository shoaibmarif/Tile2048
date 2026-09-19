import {
  Grid,
  Tile,
  MoveDirection,
  GameState,
  GameStatus,
  GameSnapshot,
  Position,
} from './types.js';
import {
  createEmptyGrid,
  cloneGrid,
  hasValidMoves,
  getHighestTile,
} from './board.js';

let tileIdCounter = 0;
function generateTileId(): string {
  return `tile-${Date.now()}-${++tileIdCounter}`;
}

export class Game2048 {
  private size: number;
  private board: Grid;
  private tiles: Tile[] = [];
  private score = 0;
  private bestScore = 0;
  private moveCount = 0;
  private status: GameStatus = 'PLAYING';
  private hasWon = false;
  private keepPlaying = false;
  private history: GameSnapshot[] = [];
  private maxHistory = 30;

  constructor(size = 4, initialBestScore = 0) {
    this.size = size;
    this.bestScore = initialBestScore;
    this.board = createEmptyGrid(size);
    this.startNewGame();
  }

  /**
   * Resets and starts a brand-new game with 2 initial tiles
   */
  public startNewGame(): GameState {
    this.board = createEmptyGrid(this.size);
    this.score = 0;
    this.moveCount = 0;
    this.status = 'PLAYING';
    this.hasWon = false;
    this.keepPlaying = false;
    this.history = [];
    this.tiles = [];

    // Spawn 2 initial tiles
    this.spawnTile();
    this.spawnTile();

    return this.getState();
  }

  /**
   * Spawns a single tile into an empty cell
   */
  private spawnTile(): boolean {
    const occupied = new Set<string>();
    for (const t of this.tiles) {
      if (!t.mergedInto) {
        occupied.add(`${t.row},${t.col}`);
      }
    }

    const empty: Position[] = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!occupied.has(`${r},${c}`)) {
          empty.push({ row: r, col: c });
        }
      }
    }

    if (empty.length === 0) return false;

    const chosen = empty[Math.floor(Math.random() * empty.length)];
    const val = Math.random() < 0.1 ? 4 : 2;

    const newTile: Tile = {
      id: generateTileId(),
      value: val,
      row: chosen.row,
      col: chosen.col,
      isNew: true,
    };

    this.tiles.push(newTile);
    this.board[chosen.row][chosen.col] = val;
    return true;
  }

  /**
   * Changes the board dimensions and restarts the game
   */
  public changeSize(newSize: number): GameState {
    if (newSize < 3 || newSize > 8) {
      throw new Error('Board size must be between 3 and 8');
    }
    this.size = newSize;
    return this.startNewGame();
  }

  /**
   * Cleans up temporary absorbed tiles from merge animations
   */
  public cleanUpAbsorbedTiles(): GameState {
    this.tiles = this.tiles
      .filter((t) => !t.mergedInto)
      .map((t) => ({ ...t, isNew: false, isMerged: false }));
    return this.getState();
  }

  /**
   * Executes a move with persistent tile identity tracking for smooth sliding animations
   */
  public move(direction: MoveDirection): {
    moved: boolean;
    state: GameState;
    scoreGained: number;
  } {
    if (this.status === 'GAME_OVER') {
      return { moved: false, state: this.getState(), scoreGained: 0 };
    }

    if (this.status === 'WON' && !this.keepPlaying) {
      return { moved: false, state: this.getState(), scoreGained: 0 };
    }

    // Clean up any absorbed tiles from previous animation frame
    this.cleanUpAbsorbedTiles();

    // 1. Build grid mapping of active tiles
    const tileGrid: (Tile | null)[][] = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null)
    );
    for (const t of this.tiles) {
      if (t.row >= 0 && t.row < this.size && t.col >= 0 && t.col < this.size) {
        tileGrid[t.row][t.col] = t;
      }
    }

    // 2. Build lines of positions corresponding to move direction
    const lines: Position[][] = [];
    if (direction === 'LEFT') {
      for (let r = 0; r < this.size; r++) {
        const line: Position[] = [];
        for (let c = 0; c < this.size; c++) line.push({ row: r, col: c });
        lines.push(line);
      }
    } else if (direction === 'RIGHT') {
      for (let r = 0; r < this.size; r++) {
        const line: Position[] = [];
        for (let c = this.size - 1; c >= 0; c--) line.push({ row: r, col: c });
        lines.push(line);
      }
    } else if (direction === 'UP') {
      for (let c = 0; c < this.size; c++) {
        const line: Position[] = [];
        for (let r = 0; r < this.size; r++) line.push({ row: r, col: c });
        lines.push(line);
      }
    } else if (direction === 'DOWN') {
      for (let c = 0; c < this.size; c++) {
        const line: Position[] = [];
        for (let r = this.size - 1; r >= 0; r--) line.push({ row: r, col: c });
        lines.push(line);
      }
    }

    // 3. Slide & merge along each line
    let moved = false;
    let scoreGained = 0;
    const nextTiles: Tile[] = [];

    for (const line of lines) {
      const lineTiles: Tile[] = [];
      for (const pos of line) {
        const t = tileGrid[pos.row][pos.col];
        if (t !== null) {
          lineTiles.push(t);
        }
      }

      let targetIdx = 0;
      for (let i = 0; i < lineTiles.length; i++) {
        const current = lineTiles[i];
        const targetPos = line[targetIdx];

        // Check if mergeable with next tile in line
        if (
          i + 1 < lineTiles.length &&
          lineTiles[i].value === lineTiles[i + 1].value
        ) {
          const next = lineTiles[i + 1];
          const mergedValue = current.value * 2;
          scoreGained += mergedValue;
          moved = true;

          const mergedTileId = generateTileId();
          const mergedTile: Tile = {
            id: mergedTileId,
            value: mergedValue,
            row: targetPos.row,
            col: targetPos.col,
            isMerged: true,
          };

          // Slide both original tiles to destination position
          nextTiles.push({
            ...current,
            row: targetPos.row,
            col: targetPos.col,
            mergedInto: mergedTileId,
            isNew: false,
            isMerged: false,
          });

          nextTiles.push({
            ...next,
            row: targetPos.row,
            col: targetPos.col,
            mergedInto: mergedTileId,
            isNew: false,
            isMerged: false,
          });

          // Merged tile appears at destination
          nextTiles.push(mergedTile);

          targetIdx++;
          i++; // skip next merged tile
        } else {
          // Slide single tile without merge
          if (current.row !== targetPos.row || current.col !== targetPos.col) {
            moved = true;
          }

          nextTiles.push({
            ...current,
            row: targetPos.row,
            col: targetPos.col,
            isNew: false,
            isMerged: false,
          });

          targetIdx++;
        }
      }
    }

    if (!moved) {
      return { moved: false, state: this.getState(), scoreGained: 0 };
    }

    // Save snapshot for undo BEFORE applying state change
    this.saveSnapshot();

    // 4. Spawn new tile in empty cell
    const occupied = new Set<string>();
    for (const t of nextTiles) {
      if (!t.mergedInto) {
        occupied.add(`${t.row},${t.col}`);
      }
    }

    const emptyCells: Position[] = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!occupied.has(`${r},${c}`)) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const spawnPos =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const spawnVal = Math.random() < 0.1 ? 4 : 2;
      const spawnedTile: Tile = {
        id: generateTileId(),
        value: spawnVal,
        row: spawnPos.row,
        col: spawnPos.col,
        isNew: true,
      };
      nextTiles.push(spawnedTile);
    }

    this.tiles = nextTiles;

    // 5. Update board grid representation
    this.board = createEmptyGrid(this.size);
    for (const t of this.tiles) {
      if (!t.mergedInto) {
        this.board[t.row][t.col] = t.value;
      }
    }

    this.score += scoreGained;
    this.moveCount++;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }

    // Check win condition
    const highest = getHighestTile(this.board);
    if (highest >= 2048 && !this.hasWon) {
      this.hasWon = true;
      if (!this.keepPlaying) {
        this.status = 'WON';
      }
    }

    // Check game over condition
    if (!hasValidMoves(this.board)) {
      this.status = 'GAME_OVER';
    }

    return {
      moved: true,
      state: this.getState(),
      scoreGained,
    };
  }

  /**
   * Allows player to keep playing even after reaching 2048
   */
  public continueAfterWin(): GameState {
    this.keepPlaying = true;
    if (hasValidMoves(this.board)) {
      this.status = 'PLAYING';
    } else {
      this.status = 'GAME_OVER';
    }
    return this.getState();
  }

  /**
   * Undoes the last move
   */
  public undo(): boolean {
    if (this.history.length === 0) return false;

    const previousSnapshot = this.history.pop()!;
    this.board = cloneGrid(previousSnapshot.board);
    this.tiles = previousSnapshot.tiles.map((t) => ({ ...t }));
    this.score = previousSnapshot.score;
    this.moveCount = previousSnapshot.moveCount;
    this.status = previousSnapshot.status;
    this.hasWon = previousSnapshot.hasWon;

    return true;
  }

  private saveSnapshot(): void {
    const snapshot: GameSnapshot = {
      board: cloneGrid(this.board),
      tiles: this.tiles.map((t) => ({ ...t })),
      score: this.score,
      moveCount: this.moveCount,
      status: this.status,
      hasWon: this.hasWon,
    };

    this.history.push(snapshot);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Returns a complete immutable representation of the current game state
   */
  public getState(): GameState {
    return {
      size: this.size,
      board: cloneGrid(this.board),
      tiles: [...this.tiles],
      score: this.score,
      bestScore: this.bestScore,
      moveCount: this.moveCount,
      status: this.status,
      hasWon: this.hasWon,
      keepPlaying: this.keepPlaying,
      canUndo: this.history.length > 0,
      historyLength: this.history.length,
    };
  }

  /**
   * Directly sets board state (useful for tests or loading saved states)
   */
  public loadState(state: {
    board: Grid;
    score: number;
    bestScore: number;
    moveCount?: number;
  }): void {
    this.size = state.board.length;
    this.board = cloneGrid(state.board);
    this.score = state.score;
    this.bestScore = Math.max(state.bestScore, state.score);
    this.moveCount = state.moveCount ?? 0;
    this.hasWon = getHighestTile(this.board) >= 2048;
    this.status = hasValidMoves(this.board) ? 'PLAYING' : 'GAME_OVER';

    this.tiles = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];
        if (val > 0) {
          this.tiles.push({
            id: generateTileId(),
            value: val,
            row: r,
            col: c,
          });
        }
      }
    }
  }
}

