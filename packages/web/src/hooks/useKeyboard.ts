import { useEffect, useCallback } from 'react';
import { MoveDirection } from '@2048/core';

interface KeyboardProps {
  onMove: (dir: MoveDirection) => void;
  onUndo?: () => void;
  onHint?: () => void;
  onRestart?: () => void;
  enabled?: boolean;
}

export function useKeyboard({
  onMove,
  onUndo,
  onHint,
  onRestart,
  enabled = true,
}: KeyboardProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Don't capture inputs if user is inside an input/textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      let handled = false;

      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          onMove('UP');
          handled = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          onMove('DOWN');
          handled = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          onMove('LEFT');
          handled = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          onMove('RIGHT');
          handled = true;
          break;
        case 'KeyZ':
          if (e.ctrlKey || e.metaKey) {
            onUndo?.();
            handled = true;
          }
          break;
        case 'KeyU':
          onUndo?.();
          handled = true;
          break;
        case 'KeyH':
          onHint?.();
          handled = true;
          break;
        case 'KeyR':
          if (!e.ctrlKey && !e.metaKey) {
            onRestart?.();
            handled = true;
          }
          break;
      }

      if (handled) {
        e.preventDefault();
      }
    },
    [enabled, onMove, onUndo, onHint, onRestart]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
