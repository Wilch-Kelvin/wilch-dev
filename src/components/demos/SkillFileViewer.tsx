'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { skillDemo } from '@/content/demos';
import { skillSamples } from '@/content/skills4u.samples';
import { highlightSkill } from '@/lib/skill-file';
import { CodeView } from './CodeView';

export function SkillFileViewer() {
  const [selectedId, setSelectedId] = useState(skillSamples[0]!.id);
  const sample = skillSamples.find((s) => s.id === selectedId) ?? skillSamples[0]!;

  return (
    <article
      aria-labelledby="demo-skill-title"
      className="card bg-surface-high text-on-surface flex flex-1 flex-col gap-5"
    >
      <div className="flex flex-col gap-2.5">
        <span className="label-mono text-primary">{skillDemo.meta}</span>
        <h3
          id="demo-skill-title"
          className="m-0 text-[clamp(34px,3.6vw,44px)] leading-none font-extrabold"
        >
          {skillDemo.title}
        </h3>
        <p className="text-on-surface-var m-0 text-lg">{skillDemo.body}</p>
      </div>

      <div role="group" aria-label={skillDemo.pickLabel} className="flex flex-wrap gap-1.5">
        {skillSamples.map((s) => {
          const selected = s.id === sample.id;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setSelectedId(s.id)}
              className={`state-layer min-h-11 cursor-pointer border-0 px-4 font-mono text-sm font-semibold transition-[border-radius,background-color] duration-[450ms] ease-[var(--ease-bounce)] ${
                selected
                  ? 'bg-primary text-on-primary rounded-full'
                  : 'bg-surface text-on-surface rounded-xl'
              }`}
            >
              {s.plugin}
            </button>
          );
        })}
      </div>

      <div className="card-inner bg-inverse text-on-inverse flex flex-col overflow-hidden">
        <div className="bg-inverse-raised flex items-center gap-2.5 px-[18px] py-3 font-mono text-[13px] [overflow-wrap:anywhere]">
          <Icon name="file" size={18} className="text-ia flex-none" />
          <span>{sample.path}</span>
        </div>
        <CodeView
          key={sample.id}
          lines={highlightSkill(sample.source)}
          label={`${sample.plugin} ${skillDemo.fileLabel}`}
          className="h-[320px] p-[18px]"
          wrap
        />
        <div className="text-code-muted border-hairline border-t px-[18px] py-2.5 font-mono text-[13px]">
          {skillDemo.excerptNote}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-on-surface-var font-mono text-sm leading-snug">
          {skillDemo.extras} {sample.extras}
        </span>
        <a className="btn state-layer bg-primary text-on-primary" href={skillDemo.cta.href}>
          {skillDemo.cta.label}
          <Icon name="arrowUpRight" size={18} />
        </a>
      </div>
    </article>
  );
}
