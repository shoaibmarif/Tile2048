import { useState, useEffect } from 'react';
import { sound } from '../utils/soundEffects.js';

export function useSound() {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('2048_muted') === 'true';
  });

  useEffect(() => {
    sound.setEnabled(!muted);
    try {
      localStorage.setItem('2048_muted', String(muted));
    } catch {
      // ignore
    }
  }, [muted]);

  const toggleSound = () => {
    setMuted((prev) => !prev);
    sound.playClick();
  };

  return {
    muted,
    toggleSound,
    sound,
  };
}
