'use client';

import { useId, useState } from 'react';
import { ChipList } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { projectCard } from '@/content/projects';
import type { Project } from '@/content/schema';
import { ProjectArt } from './ProjectArt';
import { toneClasses } from './tones';

/**
 * Summary, chips and the link are always visible (review M1). The "More"
 * button is a real disclosure: a <button aria-expanded> that works by tap,
 * keyboard and screen reader, not a hover trick.
 */
export function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(project.openByDefault);
  const detailsId = useId();
  const titleId = useId();
  const tone = toneClasses[project.tone];

  return (
    <article
      aria-labelledby={titleId}
      className={`card card-interactive flex flex-1 flex-col gap-5 overflow-hidden ${tone.card}`}
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

      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2.5">
          <span className="label-mono">{project.meta}</span>
          <h3 id={titleId} className="m-0 text-[clamp(40px,5vw,56px)] leading-none font-extrabold">
            {project.name}
          </h3>
        </div>
        <button
          type="button"
          className="state-layer inline-flex min-h-11 flex-none cursor-pointer items-center gap-1.5 rounded-full border border-current/30 bg-transparent px-4 font-semibold text-current"
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={projectCard.moreAbout(project.name)}
          onClick={() => setOpen((value) => !value)}
        >
          {projectCard.more}
          <Icon name="chevronDown" size={18} className="chevron" />
        </button>
      </div>

      {/* One wrapper so a collapsed disclosure doesn't leave an extra flex gap. */}
      <div>
        <p className="m-0 max-w-[54ch] text-lg leading-relaxed">{project.summary}</p>
        <div id={detailsId} className="disclosure" data-open={open} inert={!open}>
          <div>
            <p className="m-0 max-w-[54ch] pt-3 text-lg leading-relaxed">{project.details}</p>
          </div>
        </div>
      </div>

      <ChipList label={project.chipsLabel} items={project.chips} />

      <div className="flex flex-wrap gap-3">
        <a className={`btn state-layer ${tone.button}`} href={project.link.href}>
          {project.link.label}
          <Icon name="arrowUpRight" size={18} />
        </a>
      </div>
    </article>
  );
}
