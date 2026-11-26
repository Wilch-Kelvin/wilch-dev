import { MotionToggle } from '@/components/layout/MotionToggle';
import { Icon } from '@/components/ui/Icon';
import { Shape } from '@/components/ui/Shape';
import { hero } from '@/content/site';

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-6 pb-16 md:pt-10 md:pb-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="flex flex-col items-start gap-6 md:gap-7">
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
              <Icon name="arrowDown" />
            </a>
            <a
              className="btn state-layer bg-surface-high text-on-surface"
              href={`#${hero.secondaryCta.target}`}
            >
              {hero.secondaryCta.label}
            </a>
          </div>
          <p className="rise rise-3 bg-tertiary-c text-on-tertiary-c m-0 inline-flex items-center gap-2.5 rounded-full py-2 pr-4 pl-3 text-base font-semibold">
            <span
              aria-hidden="true"
              className="pulse bg-on-tertiary-c h-2.5 w-2.5 flex-none rounded-full"
            />
            {hero.seeking}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[360px] md:max-w-[460px] lg:max-w-[560px]">
          <div aria-hidden="true" className="relative aspect-square w-full">
            <div className="px3 absolute inset-[9%]">
              <div className="rise rise-2 grid h-full w-full">
                <Shape
                  name="cookie12"
                  color="var(--primary-c)"
                  className="spin h-full w-full [grid-area:1/1]"
                />
                {/* relative: the spinning shape gets its own layer; this keeps the K above it. */}
                <span className="text-on-primary-c relative place-self-center text-[clamp(150px,32vw,260px)] leading-none font-black [grid-area:1/1]">
                  K
                </span>
              </div>
            </div>
            <div className="px1 absolute -top-[3%] -right-[2%] aspect-square w-[36%]">
              <Shape name="clover4" color="var(--tertiary-c)" className="spin-r h-full w-full" />
            </div>
            <div className="px2 absolute bottom-[3%] -left-[4%] aspect-square w-[30%]">
              <Shape name="flower6" color="var(--secondary-c)" className="spin-f h-full w-full" />
            </div>
            <div className="bob absolute right-[7%] -bottom-[1%] aspect-square w-[19%]">
              <Shape name="burst8" color="var(--inverse)" className="spin h-full w-full" />
            </div>
            <div className="bg-primary absolute top-[11%] left-[5%] h-[9%] w-[24%] -rotate-[24deg] rounded-full" />
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
        </div>
      </div>
    </section>
  );
}
