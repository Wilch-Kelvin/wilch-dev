import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusPill } from '@/components/ui/StatusPill';
import { academicsIntro, graduationDate, milestoneLabels, milestones } from '@/content/academics';
import type { Milestone } from '@/content/schema';
import { formatShortDate, termLabel } from '@/lib/dates';
import { revealProps } from '@/lib/reveal';
import { drawSteps, segmentKinds } from '@/lib/timeline';
import type { CSSProperties } from 'react';

const WAVE = 'M0 64V32Q90 4 180 32T360 32T540 32T720 32T900 32T1080 32T1260 32T1440 32V64Z';

function Wave({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-12 w-full md:h-16 ${flip ? '-scale-y-100' : ''}`}
      style={{ fill: 'var(--surface-c)' }}
    >
      <path d={WAVE} />
    </svg>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  if (milestone.state === 'now') {
    const term = termLabel(milestone.term);
    return (
      <div className="card tl-card bg-primary-c text-on-primary-c flex flex-1 flex-col gap-3">
        <StatusPill className="bg-primary text-on-primary">
          <span className="h-2 w-2 rounded-full bg-current" />
          {milestoneLabels.now}
        </StatusPill>
        <h3 className="m-0 text-[28px] leading-tight font-bold">{term}</h3>
        <ul
          aria-label={milestoneLabels.coursesLabel(term)}
          className="m-0 flex list-none flex-col gap-3 p-0"
        >
          {milestone.term.courses.map((course) => (
            <li key={course.code} className="flex flex-col gap-0.5">
              <span className="font-mono text-sm font-semibold">{course.code}</span>
              <span className="text-lg leading-snug">{course.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const isNext = milestone.state === 'next';
  const detail = isNext
    ? `${milestone.detail} ${formatShortDate(graduationDate)}`
    : milestone.detail;
  return (
    <div className="card tl-card bg-surface text-on-surface flex flex-1 flex-col gap-3">
      {isNext ? (
        <StatusPill className="border-on-surface-var text-on-surface-var border-[1.5px]">
          {milestoneLabels.next}
        </StatusPill>
      ) : (
        <StatusPill className="bg-tertiary-c text-on-tertiary-c">
          <Icon name="check" size={16} strokeWidth={2.6} />
          {milestoneLabels.done}
        </StatusPill>
      )}
      <h3 className="m-0 text-[28px] leading-tight font-bold">{milestone.title}</h3>
      <p className="text-on-surface-var m-0 text-lg leading-normal">{detail}</p>
    </div>
  );
}

const step = (n: number) => ({ '--step': n }) as CSSProperties;

/**
 * Timeline. Each item draws its own dot and both halves of the line around
 * it (review M7), so nothing depends on % positions: vertical on phones and
 * tablets, horizontal in four columns from 1024px. The halves are a squiggle
 * (travelled) or flat (ahead), and they draw in one after another when the
 * list scrolls into view, like a pen moving along the road.
 */
export function Academics() {
  return (
    <section id="academics" aria-labelledby="academics-title">
      <Wave />
      <div className="bg-surface-c py-12 md:py-16">
        <div className="container-page flex flex-col gap-12">
          <SectionHeader
            intro={academicsIntro}
            titleId="academics-title"
            shape="clover4"
            badge="var(--tertiary-c)"
          />
          <ol
            aria-label={milestoneLabels.listLabel}
            {...revealProps()}
            className="timeline m-0 grid list-none gap-4 p-0 lg:grid-cols-4"
          >
            {milestones.map((milestone, i) => {
              const kinds = segmentKinds(milestone.state);
              const steps = drawSteps(i);
              return (
                <li
                  key={i}
                  data-state={milestone.state}
                  className="timeline-item flex"
                  style={{ '--i': i } as CSSProperties}
                >
                  <span
                    aria-hidden="true"
                    className={`tl-seg tl-before tl-${kinds.before}`}
                    style={step(steps.before)}
                  />
                  <span
                    aria-hidden="true"
                    className={`tl-seg tl-after tl-${kinds.after}`}
                    style={step(steps.after)}
                  />
                  <span aria-hidden="true" className="timeline-dot" style={step(steps.dot)} />
                  <MilestoneCard milestone={milestone} />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <Wave flip />
    </section>
  );
}
