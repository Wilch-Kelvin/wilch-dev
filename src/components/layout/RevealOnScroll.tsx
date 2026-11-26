'use client';

import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

/** Mounted once in the layout; renders nothing, just starts the observer. */
export function RevealOnScroll() {
  useRevealOnScroll();
  return null;
}
