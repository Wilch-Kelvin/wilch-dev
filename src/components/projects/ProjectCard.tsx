'use client';

import { useId, useState, type CSSProperties } from 'react';
import { ChipList } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { projectCard } from '@/content/projects';
import type { Project } from '@/content/schema';
import { ProjectArt } from './ProjectArt';
import { toneClasses } from './tones';

const step = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * Collapsed, the card is art + eyebrow + title + a round chevron (as in the
 * 2026-11-26 mockups). The chevron is a real disclosure button
 * (<button aria-expanded>), so tap, keyboard and screen readers all work.
 * Opening springs the height (grid rows 0fr → 1fr) and the text, chips and
 * link rise in one after another.
 */
export function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(project.openByDefault);
  const detailsId = useId();
  const titleId = useId();
  const tone = toneClasses[project.tone];

  return (
    <article
      aria-labelledby={titleId}
      className={`card card-interactive flex min-w-0 flex-1 flex-col overflow-hidden ${tone.card}`}
    >
      <div
        aria-hidden="true"
        className={`card-inner relative h-[240px] overflow-hidden md:h-[260px] ${tone.panel}`}
      >
        {project.screenshot ? (
          // Static export: plain <img> with fixed size reserved by the panel.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.screenshot.src} alt="" className="h-full w-full object-cover" />
        ) : (
          <ProjectArt id={project.id} />
        )}
      </div>

      <div className="flex items-end justify-between gap-4 pt-5">
        <div className="flex min-w-0 flex-col gap-2.5">
          <span className="label-mono">{project.meta}</span>
          <h3 id={titleId} className="m-0 text-[clamp(40px,5vw,56px)] leading-none font-extrabold">
            {project.name}
          </h3>
        </div>
        <button
          type="button"
          className="icon-btn state-layer h-12 w-12 flex-none border border-current/35 text-current"
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={projectCard.moreAbout(project.name)}
          onClick={() => setOpen((value) => !value)}
        >
          <Icon name="chevronDown" size={20} className="chevron" />
        </button>
      </div>

      <div id={detailsId} className="disclosure" data-open={open} inert={!open}>
        <div>
          <div className="flex flex-col gap-5 pt-5">
            <p className="disclosure-item m-0 max-w-[54ch] text-lg leading-relaxed" style={step(0)}>
              {project.summary} {project.details}
            </p>
            <div className="disclosure-item" style={step(1)}>
              <ChipList label={project.chipsLabel} items={project.chips} />
            </div>
            <div className="disclosure-item flex flex-wrap gap-3" style={step(2)}>
              <a className={`btn state-layer ${tone.button}`} href={project.link.href}>
                {project.link.label}
                <Icon name="arrowUpRight" size={18} className="nudge-diag" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
