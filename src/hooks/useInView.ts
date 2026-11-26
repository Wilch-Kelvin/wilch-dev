'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * True while `threshold` of the element is on screen. Only observes while
 * `enabled`, so hover devices never pay for an observer they don't use.
 */
export function useInView(
  ref: RefObject<Element | null>,
  enabled: boolean,
  threshold = 0.6,
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, enabled, threshold]);

  return enabled && inView;
}
