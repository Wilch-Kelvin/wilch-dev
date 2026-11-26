'use client';

import { parseTheme, resolveTheme, THEME_STORAGE_KEY, type Theme } from '@/lib/theme';
import { useDocumentData, writeStorage } from './useDocumentData';

function readTheme(): Theme {
  const saved = parseTheme(document.documentElement.dataset.theme);
  return resolveTheme(saved, window.matchMedia('(prefers-color-scheme: dark)').matches);
}

export function useTheme() {
  const theme = useDocumentData(readTheme);
  const setTheme = (next: Theme) => {
    document.documentElement.dataset.theme = next;
    writeStorage(THEME_STORAGE_KEY, next);
  };
  return { theme, setTheme };
}
