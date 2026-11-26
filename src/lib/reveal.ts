import type { CSSProperties } from 'react';

// Springy entrances on scroll. The old reveals were scroll-*scrubbed*
// (animation-timeline: view()), which is linear by nature: the animation is
// glued to the scrollbar, so it can't overshoot and settle like a spring.
// These are *triggered*: an IntersectionObserver flips `data-reveal` to
// "shown" once, and a normal time-based CSS animation with the spring curve
// plays. The pure rules live here; the hook only wires them to the DOM.

/** The bit of a DOMRect we need, so tests don't have to build one. */
export type VerticalBox = { readonly top: number; readonly bottom: number };

/**
 * True when any part of the box is on screen right now. Those elements are
 * left alone (no animation) so content the visitor can already see never
 * blinks out and back in when the page hydrates.
 */
export function isOnScreen(box: VerticalBox, viewportHeight: number): boolean {
  return box.bottom > 0 && box.top < viewportHeight;
}

/**
 * Entrances only run when the OS allows motion, the visitor hasn't pressed
 * "Pause motion", and the browser can tell us when things scroll into view.
 * Otherwise everything simply shows, which is the safe default.
 */
export function shouldAnimateEntrances(opts: {
  reducedMotion: boolean;
  paused: boolean;
  hasObserver: boolean;
}): boolean {
  return !opts.reducedMotion && !opts.paused && opts.hasObserver;
}

/** Stagger steps are capped so a long list never makes people wait. */
export const MAX_STAGGER_STEP = 6;

export function staggerIndex(index: number): number {
  if (!Number.isFinite(index) || index < 0) return 0;
  return Math.min(Math.floor(index), MAX_STAGGER_STEP);
}

/**
 * Props that mark an element for a springy entrance. `index` staggers
 * siblings (CSS multiplies `--i` by the step delay).
 */
export function revealProps(index = 0): { 'data-reveal': ''; style: CSSProperties } {
  return { 'data-reveal': '', style: { '--i': staggerIndex(index) } as CSSProperties };
}
