import { ButtonBuilder } from '@/components/demos/ButtonBuilder';
import { SkillFileViewer } from '@/components/demos/SkillFileViewer';
import { demosIntro } from '@/content/demos';
import { revealProps } from '@/lib/reveal';

export function Demos() {
  return (
    <div className="flex flex-col gap-6" data-print="hide">
      <div {...revealProps()} className="flex items-center gap-3.5">
        <span className="label-mono text-on-surface-var">{demosIntro.eyebrow}</span>
        <span aria-hidden="true" className="bg-outline-var h-px flex-1" />
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div {...revealProps(0)} className="flex">
          <ButtonBuilder />
        </div>
        {/* Phones skip the SKILL.md viewer (Kelvin, 2026-11-26): a tall
            code block is clutter on a small screen. */}
        <div {...revealProps(1)} className="hidden md:flex">
          <SkillFileViewer />
        </div>
      </div>
    </div>
  );
}
