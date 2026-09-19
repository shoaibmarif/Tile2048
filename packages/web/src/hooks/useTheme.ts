import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'classic' | 'neon';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('2048_theme') as Theme;
    if (saved === 'dark' || saved === 'classic' || saved === 'neon') {
      return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Reset theme classes
    root.classList.remove('dark', 'light');
    body.classList.remove('theme-dark', 'theme-classic', 'theme-neon');

    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('theme-dark');
    } else if (theme === 'classic') {
      root.classList.add('light');
      body.classList.add('theme-classic');
    } else if (theme === 'neon') {
      root.classList.add('dark');
      body.classList.add('theme-neon');
    }

    try {
      localStorage.setItem('2048_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const cycleTheme = () => {
    const next: Record<Theme, Theme> = {
      dark: 'classic',
      classic: 'neon',
      neon: 'dark',
    };
    setTheme(next[theme]);
  };

  return {
    theme,
    setTheme,
    cycleTheme,
  };
}
