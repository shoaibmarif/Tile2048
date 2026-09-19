import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Game2048, MoveDirection, GameState, AIHint, getBestMove } from '@2048/core';
import { Undo2, Sparkles, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import './popup.css';

export const Popup: React.FC = () => {
  const gameRef = useRef<Game2048 | null>(null);
  if (!gameRef.current) {
    gameRef.current = new Game2048(4, 0);
  }
  const game = gameRef.current;

  const [state, setState] = useState<GameState>(() => game.getState());
  const [hint, setHint] = useState<AIHint | null>(null);

  // Load saved state from chrome.storage.local if available
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['savedBoard', 'savedScore', 'bestScore'], (res) => {
        if (res.savedBoard && res.savedScore !== undefined) {
          game.loadState({
            board: res.savedBoard,
            score: res.savedScore,
            bestScore: res.bestScore || 0,
          });
          setState(game.getState());
        }
      });
    }
  }, [game]);

  // Save state on change
  const persistState = useCallback((currentState: GameState) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({
        savedBoard: currentState.board,
        savedScore: currentState.score,
        bestScore: currentState.bestScore,
      });
    }
  }, []);

  const handleMove = useCallback(
    (dir: MoveDirection) => {
      const result = game.move(dir);
      if (result.moved) {
        setState(result.state);
        setHint(null);
        persistState(result.state);
      }
    },
    [game, persistState]
  );

  const handleUndo = useCallback(() => {
    if (game.undo()) {
      const s = game.getState();
      setState(s);
      setHint(null);
      persistState(s);
    }
  }, [game, persistState]);

  const handleNewGame = useCallback(() => {
    const s = game.startNewGame();
    setState(s);
    setHint(null);
    persistState(s);
  }, [game, persistState]);

  const handleHint = useCallback(() => {
    const best = getBestMove(state.board, 2);
    setHint(best);
  }, [state.board]);

  // Keyboard handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        handleMove('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        handleMove('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        handleMove('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        handleMove('RIGHT');
      } else if (e.code === 'KeyU') {
        handleUndo();
      } else if (e.code === 'KeyH') {
        handleHint();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleMove, handleUndo, handleHint]);

  const getTileBg = (v: number) => {
    switch (v) {
      case 2:
        return '#2e374d';
      case 4:
        return '#3b4562';
      case 8:
        return '#d97706';
      case 16:
        return '#ea580c';
      case 32:
        return '#dc2626';
      case 64:
        return '#e11d48';
      case 128:
        return '#ca8a04';
      case 256:
        return '#b45309';
      case 512:
        return '#a16207';
      case 1024:
      case 2048:
        return '#edc22e';
      default:
        return '#9333ea';
    }
  };

  return (
    <div className="popup-container">
      {/* Header */}
      <div className="popup-header">
        <h1 className="popup-title">2048</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="score-box">
            <div className="score-label">Score</div>
            <div className="score-val">{state.score}</div>
          </div>
          <div className="score-box">
            <div className="score-label" style={{ color: '#edc22e' }}>
              Best
            </div>
            <div className="score-val">{state.bestScore}</div>
          </div>
        </div>
      </div>

      {/* 4x4 Board */}
      <div className="popup-board">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="popup-cell" />
        ))}
        {state.tiles.map((t) => (
          <div
            key={t.id}
            className="popup-tile"
            style={{
              transform: `translate3d(calc(${t.col} * (100% + 10px)), calc(${t.row} * (100% + 10px)), 0)`,
              backgroundColor: getTileBg(t.value),
              color: t.value <= 4 ? '#f8fafc' : '#ffffff',
              zIndex: t.mergedInto ? 1 : t.isMerged ? 10 : 5,
              opacity: t.mergedInto ? 0.6 : 1,
            }}
          >
            {t.value}
          </div>
        ))}
      </div>

      {/* Control Actions */}
      <div className="popup-actions">
        <button
          onClick={handleUndo}
          disabled={!state.canUndo}
          className="btn"
          style={{ opacity: state.canUndo ? 1 : 0.4 }}
          title="Undo (U)"
        >
          <Undo2 size={14} />
          <span>Undo</span>
        </button>

        <button onClick={handleHint} className="btn btn-hint" title="AI Hint (H)">
          <Sparkles size={14} />
          <span>{hint ? `${hint.direction}` : 'Hint'}</span>
        </button>

        <button onClick={handleNewGame} className="btn btn-primary" title="Restart Game">
          <RotateCcw size={14} />
          <span>New</span>
        </button>

        <a
          href="https://tile2048.netlify.app/"
          target="_blank"
          rel="noreferrer"
          className="btn"
          title="Open Tile 2048 Web App"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Compact D-Pad for mouse / touch users */}
      <div className="d-pad">
        <button onClick={() => handleMove('UP')} className="d-btn" aria-label="Up">
          <ArrowUp size={16} />
        </button>
        <div className="d-pad-row">
          <button onClick={() => handleMove('LEFT')} className="d-btn" aria-label="Left">
            <ArrowLeft size={16} />
          </button>
          <button onClick={() => handleMove('DOWN')} className="d-btn" aria-label="Down">
            <ArrowDown size={16} />
          </button>
          <button onClick={() => handleMove('RIGHT')} className="d-btn" aria-label="Right">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
