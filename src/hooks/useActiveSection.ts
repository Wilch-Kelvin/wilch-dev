'use client';

import { useEffect, useState } from 'react';
import { pickActiveSection } from '@/lib/active-section';

/** Which section is under the nav right now, for the nav's "you are here". */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        setActive(pickActiveSection(ids, visible));
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.01, 0.5, 1] },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
