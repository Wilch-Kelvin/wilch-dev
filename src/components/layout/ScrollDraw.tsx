'use client';

import { useScrollDraw } from '@/hooks/useScrollDraw';

/** Mounted once in the layout; renders nothing, just tracks the scroll. */
export function ScrollDraw() {
  useScrollDraw();
  return null;
}
