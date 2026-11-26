'use client';

import { Icon } from '@/components/ui/Icon';
import { footer } from '@/content/site';
import { useMotion } from '@/hooks/useMotion';
import { toggleMotion } from '@/lib/motion';

type Props = { className?: string; showLabel?: boolean };

/** The on-page pause for the looping shapes (WCAG 2.2.2, review M5). */
export function MotionToggle({ className = '', showLabel = true }: Props) {
  const { motion, setMotion } = useMotion();
  const paused = motion === 'paused';
  const label = paused ? footer.playMotion : footer.pauseMotion;
  return (
    <button
      type="button"
      className={`state-layer inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 font-semibold ${className}`}
      aria-pressed={motion === undefined ? undefined : paused}
      aria-label={showLabel ? undefined : footer.pauseMotion}
      onClick={() => setMotion(toggleMotion(motion ?? 'playing'))}
    >
      <Icon name={paused ? 'play' : 'pause'} size={18} />
      {showLabel ? <span>{label}</span> : null}
    </button>
  );
}
