import type { ReactNode } from 'react';

type Props = { children: ReactNode; className?: string };

/** Small mono pill for states like Done / Now / In progress. */
export function StatusPill({ children, className = '' }: Props) {
  return (
    <span
      className={`inline-flex min-h-[30px] items-center gap-1.5 self-start rounded-full px-3 font-mono text-sm font-semibold ${className}`}
    >
      {children}
    </span>
  );
}
