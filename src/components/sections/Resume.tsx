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
import type { ShapeName } from '@/lib/shapes';
import { revealProps } from '@/lib/reveal';

const pathShapes: readonly ShapeName[] = ['cookie9', 'clover4', 'burst8'];

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
                        className="bg-inverse-raised inline-flex min-h-11 items-center rounded-[14px] px-[18px] text-lg font-semibold"
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
                className="career m-0 grid list-none gap-8 p-0 md:grid-cols-3 md:gap-6"
              >
                {careerPath.map((step, i) => (
                  <li
                    key={step.title}
                    className="career-step flex flex-col items-center gap-2.5 text-center"
                  >
                    <span className="inline-grid h-20 w-20">
                      <Shape
                        name={pathShapes[i % pathShapes.length]!}
                        color="var(--primary)"
                        className="h-full w-full [grid-area:1/1]"
                      />
                      <span className="text-on-primary relative place-self-center font-mono text-base font-semibold [grid-area:1/1]">
                        {i + 1}
                      </span>
                    </span>
                    <span className="text-[24px] leading-tight font-bold">{step.title}</span>
                    <span className="text-lg leading-snug">{step.detail}</span>
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
