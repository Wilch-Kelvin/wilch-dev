'use client';

import { useCallback, useSyncExternalStore } from 'react';

// Reads a data-* attribute on <html> as React state. The attribute is the
// source of truth (the pre-paint script sets it), so React never fights it.
// The server snapshot is `undefined`, which tells React "unknown until
// hydrated" instead of guessing and causing a hydration mismatch.

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true });
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener('change', onChange);
  };
}

export function useDocumentData<T>(read: () => T): T | undefined {
  const getServer = useCallback(() => undefined, []);
  return useSyncExternalStore(subscribe, read, getServer);
}

export function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private windows can block storage; the choice still applies this visit.
  }
}
