'use client';

import { useEffect } from 'react';
import { isOnScreen, shouldAnimateEntrances } from '@/lib/reveal';

/**
 * Finds every `[data-reveal]` element once, hides the ones that are still
 * off screen ("waiting"), and flips each to "shown" the first time it scrolls
 * into view. CSS does the actual animating (see globals.css, Motion).
 *
 * Nothing is hidden before this runs, so if JavaScript fails the page is
 * simply static: progressive enhancement, not a dependency.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const allowed = shouldAnimateEntrances({
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      paused: root.dataset.motion === 'paused',
      hasObserver: 'IntersectionObserver' in window,
    });
    if (!allowed) return;

    const viewportHeight = window.innerHeight;
    const waiting = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
      (el) => !isOnScreen(el.getBoundingClientRect(), viewportHeight),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = 'shown';
          observer.unobserve(entry.target);
        }
      },
      // Trigger a little before the bottom edge so the spring is mid-flight,
      // not just starting, when the eye gets there.
      { rootMargin: '0px 0px -10% 0px' },
    );

    for (const el of waiting) {
      el.dataset.reveal = 'waiting';
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}
