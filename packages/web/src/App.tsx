import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Game2048,
  MoveDirection,
  GameState,
  AIHint,
  getBestMove,
  loadStoredBestScore,
  loadStoredStats,
  recordGameFinished,
  recordMove,
  recordGameStart,
  resetStoredStats,
} from '@2048/core';
import { useTheme } from './hooks/useTheme.js';
import { useSound } from './hooks/useSound.js';
import { useKeyboard } from './hooks/useKeyboard.js';
import { useTouchSwipe } from './hooks/useTouchSwipe.js';
import { Header } from './components/Header.js';
import { Board } from './components/Board.js';
import { Controls } from './components/Controls.js';
import { GameOverModal } from './components/GameOverModal.js';
import { StatsModal } from './components/StatsModal.js';
import { HowToPlay } from './components/HowToPlay.js';
import { FaqSection } from './components/FaqSection.js';
import { PrivacyPolicy } from './components/PrivacyPolicy.js';
import { Sitemap } from './components/Sitemap.js';
import { NotFound } from './components/NotFound.js';

export const App: React.FC = () => {
  const { theme, cycleTheme } = useTheme();
  const { muted, toggleSound, sound } = useSound();

  // Instantiate Game2048 engine
  const gameRef = useRef<Game2048 | null>(null);
  if (!gameRef.current) {
    const initialBest = loadStoredBestScore(0);
    gameRef.current = new Game2048(4, initialBest);
  }
  const game = gameRef.current;

  // React state reflecting engine state
  const [gameState, setGameState] = useState<GameState>(() => game.getState());
  const [hint, setHint] = useState<AIHint | null>(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [stats, setStats] = useState(() => loadStoredStats());
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Auto-play interval ref
  const autoPlayTimerRef = useRef<number | null>(null);

  // Update stats on game won or game over
  useEffect(() => {
    if (gameState.status === 'WON' || gameState.status === 'GAME_OVER') {
      const updated = recordGameFinished(
        gameState.hasWon,
        gameState.score,
        Math.max(...gameState.board.flat()),
        gameState.moveCount
      );
      setStats(updated);

      if (gameState.status === 'WON') {
        sound.playWin();
      } else if (gameState.status === 'GAME_OVER') {
        sound.playGameOver();
      }
    }
  }, [gameState.status, gameState.hasWon, gameState.score, gameState.board, gameState.moveCount, sound]);

  // Clean up temporary absorbed tiles after 160ms slide animation completes
  useEffect(() => {
    const hasMerged = gameState.tiles.some((t) => t.mergedInto);
    if (hasMerged) {
      const timer = window.setTimeout(() => {
        const cleaned = game.cleanUpAbsorbedTiles();
        setGameState(cleaned);
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [gameState.tiles, game]);

  // Execute a move
  const handleMove = useCallback(
    (direction: MoveDirection) => {
      const result = game.move(direction);
      if (result.moved) {
        if (result.scoreGained > 0) {
          sound.playMerge(result.scoreGained);
        } else {
          sound.playMove();
        }
        setGameState(result.state);
        setHint(null); // clear old hint

        // Live stats recording: update highest tile, best score, total moves in real-time
        const currentHighest = Math.max(...result.state.board.flat());
        const updatedStats = recordMove(result.state.score, currentHighest);
        setStats(updatedStats);
      }
    },
    [game, sound]
  );

  // Undo move
  const handleUndo = useCallback(() => {
    const success = game.undo();
    if (success) {
      sound.playClick();
      setGameState(game.getState());
      setHint(null);
    }
  }, [game, sound]);

  // Start new game
  const handleNewGame = useCallback(() => {
    sound.playClick();
    if (gameState.moveCount > 0) {
      recordGameStart();
      setStats(loadStoredStats());
    }
    const newState = game.startNewGame();
    setGameState(newState);
    setHint(null);
    setIsAutoPlaying(false);
  }, [game, gameState.moveCount, sound]);

  // Continue after 2048 win
  const handleContinueAfterWin = useCallback(() => {
    sound.playClick();
    const newState = game.continueAfterWin();
    setGameState(newState);
  }, [game, sound]);

  // Change board size
  const handleChangeSize = useCallback(
    (newSize: number) => {
      if (newSize === gameState.size) return;
      sound.playClick();
      const newState = game.changeSize(newSize);
      setGameState(newState);
      setHint(null);
      setIsAutoPlaying(false);
    },
    [game, gameState.size, sound]
  );

  // Calculate best AI move hint
  const handleGetHint = useCallback(() => {
    sound.playClick();
    const best = getBestMove(gameState.board, 2);
    setHint(best);
  }, [gameState.board, sound]);

  // Toggle AI auto play mode
  const handleToggleAutoPlay = useCallback(() => {
    sound.playClick();
    setIsAutoPlaying((prev) => !prev);
  }, [sound]);

  // Reset lifetime statistics
  const handleResetStats = useCallback(() => {
    sound.playClick();
    const fresh = resetStoredStats();
    setStats(fresh);
  }, [sound]);

  // Run auto-play loop
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    if (gameState.status !== 'PLAYING') {
      setIsAutoPlaying(false);
      return;
    }

    autoPlayTimerRef.current = window.setInterval(() => {
      const best = getBestMove(game.getState().board, 2);
      if (best) {
        const result = game.move(best.direction);
        if (result.moved) {
          if (result.scoreGained > 0) sound.playMerge(result.scoreGained);
          setGameState(result.state);
        } else {
          setIsAutoPlaying(false);
        }
      } else {
        setIsAutoPlaying(false);
      }
    }, 180);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [isAutoPlaying, gameState.status, game, sound]);

  // Keyboard controls listener
  useKeyboard({
    onMove: handleMove,
    onUndo: handleUndo,
    onHint: handleGetHint,
    onRestart: handleNewGame,
    enabled: gameState.status === 'PLAYING',
  });

  // Touch swipe listener on game board
  const touchContainerRef = useTouchSwipe({
    onMove: handleMove,
    enabled: gameState.status === 'PLAYING',
  });

  // Route matching per Master Boilerplate specification
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isPrivacyRoute =
    pathname === '/privacy' || pathname === '/privacy/' || pathname === '/privacy.html';
  const isSitemapRoute =
    pathname === '/sitemap' || pathname === '/sitemap/' || pathname === '/sitemap.html';
  const isKnownRoute = pathname === '/' || pathname === '' || isPrivacyRoute || isSitemapRoute;

  if (!isKnownRoute) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col">
        <Header
          score={gameState.score}
          bestScore={gameState.bestScore}
          theme={theme}
          onThemeCycle={cycleTheme}
          muted={muted}
          onToggleSound={toggleSound}
          onOpenStats={() => setStatsOpen(true)}
          onNewGame={handleNewGame}
        />
        <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
          <NotFound />
        </main>
      </div>
    );
  }

  if (isPrivacyRoute) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
        <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full">
          <PrivacyPolicy />
        </main>
        <footer className="w-full py-6 px-4 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © 2026 Tile 2048 by{' '}
              <a
                href="https://shoaibarif.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:underline font-semibold"
              >
                Shoaib M. Arif
              </a>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/shoaibmarif/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/shoaibmarif/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="/sitemap"
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Sitemap
              </a>
              <a
                href="/"
                className="text-amber-500 hover:underline font-semibold"
              >
                Return to Tile 2048
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (isSitemapRoute) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
        <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full">
          <Sitemap />
        </main>
        <footer className="w-full py-6 px-4 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © 2026 Tile 2048 by{' '}
              <a
                href="https://shoaibarif.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:underline font-semibold"
              >
                Shoaib M. Arif
              </a>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/shoaibmarif/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/shoaibmarif/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="/privacy"
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                Privacy
              </a>
              <a
                href="/"
                className="text-amber-500 hover:underline font-semibold"
              >
                Return to Tile 2048
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-amber-400 selection:text-black">
      <div className="w-full px-4 pt-6 pb-8 flex-1">
        {/* Main Header */}
        <Header
          score={gameState.score}
          bestScore={gameState.bestScore}
          theme={theme}
          onThemeCycle={cycleTheme}
          muted={muted}
          onToggleSound={toggleSound}
          onOpenStats={() => setStatsOpen(true)}
          onNewGame={handleNewGame}
        />

        {/* 2048 Game Board */}
        <main className="w-full">
          <Board
            tiles={gameState.tiles}
            size={gameState.size}
            touchRef={touchContainerRef}
          />

          {/* Interactive Controls (Undo, AI Hint, Grid Sizes, D-Pad) */}
          <Controls
            canUndo={gameState.canUndo}
            onUndo={handleUndo}
            onGetHint={handleGetHint}
            hint={hint}
            size={gameState.size}
            onChangeSize={handleChangeSize}
            onMove={handleMove}
            isAutoPlaying={isAutoPlaying}
            onToggleAutoPlay={handleToggleAutoPlay}
          />

          {/* Educational & Strategy Guide */}
          <HowToPlay />

          {/* Interactive FAQ Accordion */}
          <FaqSection />
        </main>
      </div>

      {/* Footer with links */}
      <footer className="w-full py-6 px-4 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 Tile 2048 by{' '}
            <a
              href="https://shoaibarif.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline font-semibold"
            >
              Shoaib M. Arif
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/shoaibmarif"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/shoaibmarif/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="/privacy"
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Privacy
            </a>
            <a
              href="/sitemap"
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GameOverModal
        status={gameState.status}
        score={gameState.score}
        bestScore={gameState.bestScore}
        onRestart={handleNewGame}
        onContinue={handleContinueAfterWin}
      />

      <StatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        stats={stats}
        currentScore={gameState.score}
        currentHighestTile={Math.max(...gameState.board.flat())}
        currentMoves={gameState.moveCount}
        boardSize={gameState.size}
        onResetStats={handleResetStats}
      />
    </div>
  );
};
