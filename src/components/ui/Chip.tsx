import type { ReactNode } from 'react';

/** Outline chip that takes the colour of the card it sits on. */
export function Chip({ children }: { children: ReactNode }) {
  return <li className="chip chip-spring">{children}</li>;
}

export function ChipList({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <ul aria-label={label} className="m-0 flex list-none flex-wrap gap-2 p-0">
      {items.map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
    </ul>
  );
}
