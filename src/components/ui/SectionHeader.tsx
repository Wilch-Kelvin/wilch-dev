import type { SectionIntro } from '@/content/schema';
import type { ShapeName } from '@/lib/shapes';
import { Shape } from './Shape';

type Props = {
  intro: SectionIntro;
  titleId: string;
  shape: ShapeName;
  /** Token pair for the numbered badge, e.g. primary-c / on-primary-c. */
  badge: { fill: string; ink: string };
  className?: string;
};

/** Numbered shape badge + mono eyebrow + big heading + intro line. */
export function SectionHeader({ intro, titleId, shape, badge, className = '' }: Props) {
  return (
    <div className={`reveal flex max-w-[760px] flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-3.5">
        <span className="inline-grid h-14 w-14">
          <Shape name={shape} color={badge.fill} className="[grid-area:1/1] h-full w-full" />
          <span
            className="relative font-mono text-base font-semibold [grid-area:1/1] place-self-center"
            style={{ color: badge.ink }}
          >
            {intro.number}
          </span>
        </span>
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
