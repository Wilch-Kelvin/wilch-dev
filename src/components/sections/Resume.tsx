import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Shape } from '@/components/ui/Shape';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  careerNodeCount,
  education,
  resumeHeadings,
  resumeGate,
  resumeIntro,
  skillGroups,
} from '@/content/resume';
import type { CSSProperties } from 'react';
import { revealProps } from '@/lib/reveal';
import { readResumeConfig } from '@/lib/resume-config';
import { ResumeRequest } from './ResumeRequest';

/**
 * The hand-drawn line from this step's node to the next one. pathLength="1"
 * makes the path's length exactly 1 whatever its real size, so CSS can hide
 * it with stroke-dashoffset: 1 and draw it with 0; the scroll position picks
 * the value in between (see .career-path in globals.css). It only runs
 * across: the banner is hidden on phones (2026-11-26), so the old downward
 * phone curve was removed with it.
 */
function CareerCurve() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 40"
      preserveAspectRatio="none"
      className="career-curve career-curve-x"
    >
      <path
        className="path-draw"
        pathLength={1}
        d="M0 18C30 4 70 2 110 16S170 34 200 20"
        style={{ fill: 'none', stroke: 'var(--primary)', strokeWidth: 3, strokeLinecap: 'round' }}
      />
    </svg>
  );
}

/**
 * The page is prerendered at build time, so this check runs during the
 * Vercel build: once the email settings exist there, the next deploy shows
 * the form. Without them it shows "PDF coming soon", never a broken form.
 * Only a yes/no reaches the page; no secret does.
 */
function DownloadPdf() {
  if (!readResumeConfig(process.env)) {
    return (
      <StatusPill className="border-outline text-on-surface-var min-h-[52px] border px-5 text-base">
        <Icon name="file" size={18} />
        {resumeGate.pending}
      </StatusPill>
    );
  }
  return <ResumeRequest />;
}

export function Resume() {
  return (
    <section id="resume" aria-labelledby="resume-title" className="pt-16 pb-24 md:pt-20 md:pb-32">
      <div className="container-page flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            intro={resumeIntro}
            titleId="resume-title"
            shape="burst8"
            badge="var(--secondary-c)"
          />
          <div {...revealProps(1)} data-print="hide">
            <DownloadPdf />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div {...revealProps(0)} className="flex">
            <div className="card bg-surface-high text-on-surface flex flex-1 flex-col gap-6">
              <h3 className="m-0 text-[34px] leading-none font-extrabold">
                {resumeHeadings.education}
              </h3>
              <ul className="m-0 flex list-none flex-col p-0">
                {education.map((item, i) => (
                  <li
                    key={item.degree}
                    className={`flex flex-col gap-2 ${i > 0 ? 'border-outline-var mt-6 border-t pt-6' : ''}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <span className="text-[24px] leading-tight font-bold">{item.degree}</span>
                      <StatusPill
                        className={
                          item.status === 'Completed'
                            ? 'bg-tertiary-c text-on-tertiary-c'
                            : 'bg-primary-c text-on-primary-c'
                        }
                      >
                        {item.status}
                      </StatusPill>
                    </div>
                    <span className="text-on-surface-var text-lg">{item.school}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div {...revealProps(1)} className="flex">
            <div className="card bg-inverse text-on-inverse flex flex-1 flex-col gap-6">
              <h3 className="m-0 text-[34px] leading-none font-extrabold">
                {resumeHeadings.skills}
              </h3>
              {skillGroups.map((group) => (
                <div key={group.label} className="flex flex-col gap-3">
                  <span className="label-mono text-ia">{group.label}</span>
                  <ul aria-label={group.label} className="m-0 flex list-none flex-wrap gap-2.5 p-0">
                    {group.items.map((skill) => (
                      <li
                        key={skill}
                        className="chip-spring bg-inverse-raised inline-flex min-h-11 items-center rounded-[14px] px-[18px] text-lg font-semibold"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* "Where I'm headed": text cleared for now (content/resume.ts), so
              the banner only holds the drawn path and is hidden from screen
              readers. The row draws as the page scrolls; each step's --step
              says which part of the scroll belongs to its curve. Hidden on
              phones (Kelvin, 2026-11-26): with no words it was only clutter
              there. */}
          <div {...revealProps(0)} className="hidden md:flex lg:col-span-2">
            <div
              aria-hidden="true"
              className="card bg-primary-c text-on-primary-c flex flex-1 flex-col"
            >
              <ol
                data-scroll-draw="row"
                style={{ '--steps': careerNodeCount - 1 } as CSSProperties}
                className="career-path m-0 grid list-none gap-8 p-0 md:grid-cols-3 md:gap-6"
              >
                {Array.from({ length: careerNodeCount }, (_, i) => (
                  <li
                    key={i}
                    data-scroll-draw=""
                    className="career-step relative flex flex-col items-center gap-2.5"
                    style={{ '--step': i } as CSSProperties}
                  >
                    {i < careerNodeCount - 1 ? <CareerCurve /> : null}
                    <Shape
                      name="cookie9"
                      color="var(--primary)"
                      className="career-node relative h-16 w-16 flex-none"
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
