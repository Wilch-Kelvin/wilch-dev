'use client';

import { useEffect, useState, type RefObject } from 'react';
import { indicatorFor, type IndicatorGeometry } from '@/lib/indicator';

/**
 * Measures the link for `activeId` inside `listRef` and returns where the
 * underline goes. The last position is kept when nothing is active, so the
 * bar fades out in place instead of flying back to the start.
 */
export function useSlidingIndicator(
  listRef: RefObject<HTMLElement | null>,
  activeId: string | null,
): { geometry: IndicatorGeometry | null; visible: boolean } {
  const [geometry, setGeometry] = useState<IndicatorGeometry | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !activeId) return;
    const measure = () => {
      const link = list.querySelector<HTMLElement>(`[data-target="${activeId}"]`);
      // display:none lists (the mobile layout) measure as 0 wide: skip them.
      if (!link || link.offsetWidth === 0) return;
      const a = link.getBoundingClientRect();
      const b = list.getBoundingClientRect();
      setGeometry(indicatorFor({ left: a.left, width: a.width }, { left: b.left, width: b.width }));
    };
    measure();
    // Re-measure when the layout changes (resize, web font swap).
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [listRef, activeId]);

  return { geometry, visible: activeId !== null && geometry !== null };
}
