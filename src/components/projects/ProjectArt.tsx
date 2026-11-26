import type { CSSProperties } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Shape } from '@/components/ui/Shape';
import type { ProjectId } from '@/content/schema';
import { skillSamples } from '@/content/skills4u.samples';

// Abstract art for each project card, from the design. Purely decorative
// (the panel is aria-hidden). TODO(Kelvin): swap in real screenshots (M2).

function ClassPingArt() {
  return (
    <div className="grid h-full place-items-center">
      {(['ping', 'ping ping-2', 'ping ping-3'] as const).map((cls, i) => (
        <span
          key={cls}
          className={`${cls} border-primary-c h-60 w-60 rounded-full border-2 [grid-area:1/1]`}
          style={{ opacity: [0.5, 0.3, 0.15][i], transform: `scale(${[0.55, 0.85, 1.15][i]})` }}
        />
      ))}
      <div className="grid h-[124px] w-[124px] [grid-area:1/1]">
        <Shape
          name="cookie12"
          color="var(--primary-c)"
          className="hover-spin h-full w-full [grid-area:1/1]"
        />
        <Icon
          name="bell"
          size={46}
          className="text-on-primary-c relative place-self-center [grid-area:1/1]"
          strokeWidth={2}
        />
      </div>
      <span className="bob bg-tertiary-c text-on-tertiary-c absolute top-[26%] left-[58%] rounded-full px-3.5 py-2 font-mono text-sm font-semibold">
        ping!
      </span>
    </div>
  );
}

function Ro5n3RArt() {
  return (
    <>
      <span className="absolute top-[22px] left-1/2 h-[34px] w-[58%] -translate-x-1/2 rounded-full bg-[color-mix(in_srgb,var(--on-inverse)_14%,var(--inverse))]" />
      <div className="wiggle absolute top-[82px] left-[7%] h-[124px] w-[124px]">
        <Shape name="clover4" color="var(--ia)" className="h-full w-full" />
      </div>
      <div className="wiggle wiggle-2 absolute top-[100px] left-[39%] h-[100px] w-[100px]">
        <Shape name="cookie9" color="var(--primary-c)" className="h-full w-full" />
      </div>
      <span className="wiggle bg-secondary-c absolute top-[92px] right-[7%] h-[62px] w-[132px] rounded-full" />
      <div className="wiggle wiggle-2 absolute right-[13%] bottom-3.5 h-[70px] w-[70px]">
        <Shape name="flower6" color="var(--primary)" className="h-full w-full" />
      </div>
      <span className="bg-primary absolute bottom-[22px] left-[31%] h-[34px] w-[34px] rounded-full" />
    </>
  );
}

function NativeXArt() {
  const line = 'h-2.5 rounded-[5px]';
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-[22px]">
      <span className="bg-on-tertiary-c text-tertiary-c inline-flex items-center gap-2 self-start rounded-full px-3 py-[7px] font-mono text-[13px]">
        <span className="h-2 w-2 rounded-full bg-current" />
        runs offline
      </span>
      <div className="bg-surface flex w-[62%] flex-col gap-2 self-start rounded-[22px_22px_22px_6px] px-4 py-3.5">
        <span
          className={`${line} w-[92%] bg-[color-mix(in_srgb,var(--on-surface)_18%,var(--surface))]`}
        />
        <span
          className={`${line} w-[58%] bg-[color-mix(in_srgb,var(--on-surface)_18%,var(--surface))]`}
        />
      </div>
      <div className="bg-on-tertiary-c flex w-[52%] flex-col gap-2 self-end rounded-[22px_22px_6px_22px] px-4 py-3.5">
        <span
          className={`${line} w-[86%] bg-[color-mix(in_srgb,var(--tertiary-c)_45%,var(--on-tertiary-c))]`}
        />
        <span
          className={`${line} w-[64%] bg-[color-mix(in_srgb,var(--tertiary-c)_45%,var(--on-tertiary-c))]`}
        />
      </div>
      <div className="bg-surface flex gap-1.5 self-start rounded-[22px_22px_22px_6px] px-[18px] py-3.5">
        {(['typing', 'typing typing-2', 'typing typing-3'] as const).map((cls) => (
          <span key={cls} className={`${cls} bg-on-surface-var h-2 w-2 rounded-full`} />
        ))}
      </div>
    </div>
  );
}

// The fanned tiles use the same plugin names as the SKILL.md viewer (review m1).
const tileShapes = ['flower6', 'cookie9', 'clover4', 'burst8'] as const;
const tileFan = [
  { r: '-7deg', x: '-10px', y: '4px', rh: '-12deg', xh: '-36px', yh: '0px' },
  { r: '-2deg', x: '4px', y: '0px', rh: '-4deg', xh: '-12px', yh: '-2px' },
  { r: '3deg', x: '-4px', y: '0px', rh: '5deg', xh: '14px', yh: '-2px' },
  { r: '8deg', x: '10px', y: '-2px', rh: '13deg', xh: '38px', yh: '-4px' },
] as const;

function Skills4uArt() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2.5 p-4">
      {skillSamples.map((sample, i) => {
        const fan = tileFan[i % tileFan.length]!;
        const style = {
          '--r': fan.r,
          '--x': fan.x,
          '--y': fan.y,
          '--rh': fan.rh,
          '--xh': fan.xh,
          '--yh': fan.yh,
        } as CSSProperties;
        return (
          <div
            key={sample.id}
            style={style}
            className="fan-tile bg-surface text-on-surface flex h-12 w-[300px] max-w-[92%] items-center gap-3 rounded-[18px] px-4 font-mono text-sm shadow-[0_8px_18px_-12px_var(--shadow)]"
          >
            <Shape
              name={tileShapes[i % tileShapes.length]!}
              color={i % 2 === 0 ? 'var(--primary)' : 'var(--on-surface)'}
              flat
              className="h-[22px] w-[22px] flex-none"
            />
            {sample.plugin}
          </div>
        );
      })}
    </div>
  );
}

const art: Record<ProjectId, () => React.JSX.Element> = {
  classping: ClassPingArt,
  ro5n3r: Ro5n3RArt,
  nativex: NativeXArt,
  skills4u: Skills4uArt,
};

export function ProjectArt({ id }: { id: ProjectId }) {
  const Art = art[id];
  return <Art />;
}
