import { ButtonBuilder } from '@/components/demos/ButtonBuilder';
import { SkillFileViewer } from '@/components/demos/SkillFileViewer';
import { demosIntro } from '@/content/demos';

export function Demos() {
  return (
    <div className="flex flex-col gap-6" data-print="hide">
      <div className="reveal flex items-center gap-3.5">
        <span className="label-mono text-on-surface-var">{demosIntro.eyebrow}</span>
        <span aria-hidden="true" className="bg-outline-var h-px flex-1" />
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="reveal flex">
          <ButtonBuilder />
        </div>
        <div className="reveal reveal-2 flex">
          <SkillFileViewer />
        </div>
      </div>
    </div>
  );
}
