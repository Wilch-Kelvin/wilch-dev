import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Shape } from '@/components/ui/Shape';
import { StatusPill } from '@/components/ui/StatusPill';
import {
  careerPath,
  education,
  resumeHeadings,
  resumeIntro,
  resumePdf,
  skillGroups,
} from '@/content/resume';
import type { CSSProperties } from 'react';
import { revealProps } from '@/lib/reveal';

/**
 * The hand-drawn line from this step's node to the next one. pathLength="1"
 * makes the path's length exactly 1 whatever its real size, so CSS can hide
 * it with stroke-dashoffset: 1 and draw it by animating to 0. Two drawings:
 * across on wide screens, down between stacked steps on phones.
 */
function CareerCurve() {
  const stroke = {
    fill: 'none',
    stroke: 'var(--primary)',
    strokeWidth: 3,
    strokeLinecap: 'round',
  } as const;
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        className="career-curve career-curve-x hidden md:block"
      >
        <path
          className="path-draw"
          pathLength={1}
          d="M0 18C30 4 70 2 110 16S170 34 200 20"
          style={stroke}
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 40 100"
        preserveAspectRatio="none"
        className="career-curve career-curve-y md:hidden"
      >
        <path
          className="path-draw"
          pathLength={1}
          d="M20 0C6 25 34 50 20 70S14 92 20 100"
          style={stroke}
        />
      </svg>
    </>
  );
}

function DownloadPdf() {
  if (!resumePdf.href) {
    // TODO(Kelvin): placeholder until public/resume.pdf exists (no dead link).
    return (
      <StatusPill className="border-outline text-on-surface-var min-h-[52px] border px-5 text-base">
        <Icon name="file" size={18} />
        {resumePdf.pending}
      </StatusPill>
    );
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <a className="btn state-layer bg-primary text-on-primary" href={resumePdf.href} download>
        <Icon name="download" />
        {resumePdf.label}
      </a>
      {resumePdf.updated ? (
        <span className="text-on-surface-var font-mono text-sm">{resumePdf.updated}</span>
      ) : null}
    </div>
  );
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

          <div {...revealProps(0)} className="flex lg:col-span-2">
            <div className="card bg-primary-c text-on-primary-c flex flex-1 flex-col gap-7">
              <h3 className="m-0 text-[34px] leading-none font-extrabold">{resumeHeadings.path}</h3>
              <ol
                aria-label={resumeHeadings.path}
                className="m-0 grid list-none gap-8 p-0 md:grid-cols-3 md:gap-6"
              >
                {careerPath.map((step, i) => (
                  <li
                    key={step.title}
                    className="career-step relative flex items-center gap-4 md:flex-col md:gap-2.5 md:text-center"
                    style={{ '--step': i } as CSSProperties}
                  >
                    {i < careerPath.length - 1 ? <CareerCurve /> : null}
                    <Shape
                      name="cookie9"
                      color="var(--primary)"
                      className="career-node relative h-16 w-16 flex-none"
                    />
                    <span className="flex flex-col gap-1 md:gap-2.5">
                      <span className="text-[24px] leading-tight font-bold">{step.title}</span>
                      <span className="text-lg leading-snug">{step.detail}</span>
                    </span>
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
