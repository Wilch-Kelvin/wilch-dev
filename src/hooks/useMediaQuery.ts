'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Live result of a CSS media query. `undefined` on the server and during
 * hydration ("unknown"), so callers must pick a safe default rather than
 * guess and cause a hydration mismatch.
 */
export function useMediaQuery(query: string): boolean | undefined {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );
  const read = useCallback(() => window.matchMedia(query).matches, [query]);
  const readServer = useCallback(() => undefined, []);
  return useSyncExternalStore(subscribe, read, readServer);
}
