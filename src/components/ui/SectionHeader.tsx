import type { SectionIntro } from '@/content/schema';
import { revealProps } from '@/lib/reveal';
import type { ShapeName } from '@/lib/shapes';
import { Shape } from './Shape';

type Props = {
  intro: SectionIntro;
  titleId: string;
  shape: ShapeName;
  /** Fill token for the shape badge, e.g. `var(--primary-c)`. */
  badge: string;
  className?: string;
};

/** Shape badge + mono eyebrow + big heading + intro line (as in the mockups). */
export function SectionHeader({ intro, titleId, shape, badge, className = '' }: Props) {
  return (
    <div {...revealProps()} className={`flex max-w-[760px] flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-3.5">
        {/* The badge twirls in a beat after the heading rises (see .badge-pop). */}
        <Shape name={shape} color={badge} className="badge-pop h-12 w-12 flex-none" />
        <span className="label-mono text-on-surface-var">{intro.eyebrow}</span>
      </div>
      <h2
        id={titleId}
        className="m-0 text-[clamp(52px,9vw,104px)] leading-[0.92] font-extrabold tracking-[-0.01em]"
      >
        {intro.title}
      </h2>
      <p className="text-on-surface-var m-0 max-w-[56ch] text-xl leading-relaxed">{intro.body}</p>
    </div>
  );
}
