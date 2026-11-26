'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { pointerOffset } from '@/lib/parallax';

/**
 * Sets `--mx` / `--my` (-1…1) on its box from the pointer position. Children
 * with the `parallax` class shift by that × their own `--depth`, with a
 * spring transition, so the shape cluster drifts toward the cursor in layers.
 *
 * Only on devices with a real hover pointer and with motion allowed; writes
 * happen at most once per animation frame (rAF), never per mouse event.
 */
export function PointerParallax({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || !fine || reduce) return;

    let frame = 0;
    let last = { x: 0, y: 0 };
    const onMove = (event: PointerEvent) => {
      last = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const { x, y } = pointerOffset(last.x, last.y, el.getBoundingClientRect());
        el.style.setProperty('--mx', String(x));
        el.style.setProperty('--my', String(y));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
