'use client';

import { useEffect } from 'react';
import { drawProgress, parseDrawMode, ROW_MIN_SPAN } from '@/lib/scroll-draw';

/** HTML or SVG: both have a box and an inline style to write to. */
type Drawable = HTMLElement | SVGElement;

/**
 * Keeps `--draw` on every `[data-scroll-draw]` element in step with the
 * scroll position (0 = hidden, 1 = fully drawn; see lib/scroll-draw.ts).
 * `data-scroll-draw="row"` spreads a short horizontal row over a longer
 * stretch of scrolling; any other value follows the pen exactly.
 *
 * Work is batched into one animation frame per scroll burst, and all the
 * layout reads happen before any style writes so the browser lays out once
 * per frame, not once per element. The OS reduce-motion setting and the
 * on-page pause are handled in CSS (they force `--draw: 1`), so this hook
 * never needs to know about them. Without JavaScript the CSS default is
 * also 1: the lines are simply drawn.
 */
export function useScrollDraw() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<Drawable>('[data-scroll-draw]'));
    if (elements.length === 0) return;

    const last = new Map<Drawable, number>();
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const minSpan = viewportHeight * ROW_MIN_SPAN;
      const next = elements.map((el) =>
        drawProgress(el.getBoundingClientRect(), viewportHeight, {
          minSpan: parseDrawMode(el.dataset.scrollDraw) === 'row' ? minSpan : 0,
        }),
      );
      elements.forEach((el, i) => {
        const value = next[i] ?? 1;
        if (last.get(el) === value) return;
        last.set(el, value);
        el.style.setProperty('--draw', String(value));
      });
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
}
