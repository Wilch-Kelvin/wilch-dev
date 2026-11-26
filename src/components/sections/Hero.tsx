import type { CSSProperties, ReactNode } from 'react';
import { MotionToggle } from '@/components/layout/MotionToggle';
import { Icon } from '@/components/ui/Icon';
import { Shape } from '@/components/ui/Shape';
import { hero } from '@/content/site';
import { HeroPortrait } from './HeroPortrait';
import { PointerParallax } from './PointerParallax';

/**
 * One floating shape, built from nested wrappers because each motion owns a
 * different CSS property and they would overwrite each other on one element:
 * scroll parallax (`translate`, outer) → pointer parallax (`translate`, by
 * depth) → entrance pop (`scale`) → the shape's own spin (`rotate`).
 */
function Layer({
  scroll,
  depth,
  step,
  className,
  children,
}: {
  scroll?: 'px1' | 'px2' | 'px3';
  depth: number;
  step: number;
  className: string;
  children: ReactNode;
}) {
  return (
    <div className={`${scroll ?? ''} absolute ${className}`}>
      <div className="parallax h-full w-full" style={{ '--depth': depth } as CSSProperties}>
        <div className="pop-in h-full w-full" style={{ '--i': step } as CSSProperties}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  // overflow-x-clip: the rotating, drifting shapes may poke past the right
  // edge; clip (unlike hidden) makes no scroll box, so nothing else changes.
  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip pt-6 pb-16 md:pt-10 md:pb-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="flex flex-col items-start gap-6 md:gap-7">
          <p className="rise rise-solid label-mono bg-tertiary-c text-on-tertiary-c m-0 inline-flex items-center gap-2.5 rounded-full py-2 pr-4 pl-3 normal-case">
            <Shape name="cookie12" color="currentColor" flat className="h-4 w-4 flex-none" />
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="rise rise-solid rise-1 m-0 text-[clamp(84px,19vw,176px)] leading-[0.86] font-extrabold tracking-[-0.015em]"
          >
            {hero.greeting} <span className="stretch-in text-primary">{hero.name}</span>
          </h1>
          <p className="rise rise-solid rise-2 text-on-surface-var m-0 max-w-[44ch] text-[clamp(19px,1.6vw,22px)] leading-relaxed">
            {hero.body}
          </p>
          <div className="rise rise-3 flex flex-wrap gap-3">
            <a
              className="btn state-layer bg-primary text-on-primary"
              href={`#${hero.primaryCta.target}`}
            >
              {hero.primaryCta.label}
              <Icon name="arrowDown" className="nudge-down" />
            </a>
            <a
              className="btn state-layer bg-surface-high text-on-surface"
              href={`#${hero.secondaryCta.target}`}
            >
              {hero.secondaryCta.label}
            </a>
          </div>
          <p className="rise rise-3 text-on-surface-var m-0 inline-flex items-center gap-2.5 text-base font-semibold">
            <span
              aria-hidden="true"
              className="pulse bg-primary h-2.5 w-2.5 flex-none rounded-full"
            />
            {hero.seeking}
          </p>
        </div>

        <PointerParallax className="relative mx-auto w-full max-w-[360px] md:max-w-[460px] lg:max-w-[560px]">
          <div className="relative aspect-square w-full">
            {/* The portrait: real content (alt text), so not aria-hidden. */}
            <Layer scroll="px3" depth={0.35} step={0} className="inset-[9%]">
              <HeroPortrait />
            </Layer>

            <div aria-hidden="true">
              <Layer
                scroll="px1"
                depth={1}
                step={2}
                className="-top-[3%] -right-[2%] aspect-square w-[36%]"
              >
                <Shape name="clover4" color="var(--tertiary-c)" className="spin-r h-full w-full" />
              </Layer>
              <Layer
                scroll="px2"
                depth={0.8}
                step={3}
                className="bottom-[3%] -left-[4%] aspect-square w-[30%]"
              >
                <Shape name="flower6" color="var(--secondary-c)" className="spin-f h-full w-full" />
              </Layer>
              <Layer depth={1.3} step={4} className="right-[7%] -bottom-[1%] aspect-square w-[19%]">
                <div className="bob h-full w-full">
                  <Shape name="burst8" color="var(--inverse)" className="spin h-full w-full" />
                </div>
              </Layer>
              <Layer depth={0.6} step={1} className="top-[11%] left-[5%] h-[9%] w-[24%]">
                <div className="bg-primary h-full w-full -rotate-[24deg] rounded-full" />
              </Layer>
            </div>
          </div>

          {/* Floating liquid-glass chrome over the art: real blur is earned
              here because busy shapes sit behind it. */}
          <span
            aria-hidden="true"
            className="glass text-on-surface absolute bottom-[18%] left-[2%] inline-flex items-center gap-2 rounded-full py-2 pr-4 pl-2.5 text-lg font-bold"
          >
            <Shape name="flower6" color="var(--primary)" flat className="h-5 w-5" />
            {hero.nameTag}
          </span>
          <MotionToggle className="glass text-on-surface absolute top-[2%] left-[2%] text-base motion-reduce:hidden" />
        </PointerParallax>
      </div>
    </section>
  );
}
