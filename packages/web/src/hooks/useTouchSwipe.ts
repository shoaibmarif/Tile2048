import { useEffect, useRef } from 'react';
import { MoveDirection } from '@2048/core';

interface TouchSwipeProps {
  onMove: (dir: MoveDirection) => void;
  enabled?: boolean;
}

export function useTouchSwipe({ onMove, enabled = true }: TouchSwipeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent scrolling while actively swiping inside the game board
      if (startPos.current && e.cancelable) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startPos.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startPos.current.x;
      const dy = touch.clientY - startPos.current.y;
      startPos.current = null;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const minDistance = 25;

      if (Math.max(absX, absY) < minDistance) {
        return; // Too short to be a swipe
      }

      if (absX > absY) {
        onMove(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onMove(dy > 0 ? 'DOWN' : 'UP');
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, onMove]);

  return containerRef;
}
