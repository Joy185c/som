'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId = 'light' | 'dark' | 'brand' | 'purple';

const ThemeContext = createContext<{
  theme: ThemeId;
  toggleTheme: () => void;
  setTheme: (id: ThemeId) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeId | null;
    const valid: ThemeId[] = ['light', 'dark', 'brand', 'purple'];
    const initial = (stored && valid.includes(stored)) ? stored : 'dark';
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const applyTheme = (id: ThemeId) => {
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-brand', 'theme-purple');
    document.documentElement.classList.add(`theme-${id}`);
    document.documentElement.classList.toggle('dark', id === 'dark' || id === 'brand' || id === 'purple');
  };

  const setTheme = (id: ThemeId) => {
    setThemeState(id);
    localStorage.setItem('theme', id);
    applyTheme(id);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
