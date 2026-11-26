import { ProjectCard } from '@/components/projects/ProjectCard';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { projects, projectsIntro, projectsMore } from '@/content/projects';
import type { ReactNode } from 'react';

const revealSteps = ['reveal', 'reveal reveal-2'] as const;

export function Projects({ demos }: { demos?: ReactNode }) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="pt-12 pb-24 md:pt-16 md:pb-32"
    >
      <div className="container-page flex flex-col gap-12 md:gap-14">
        <SectionHeader
          intro={projectsIntro}
          titleId="projects-title"
          shape="cookie9"
          badge={{ fill: 'var(--primary-c)', ink: 'var(--on-primary-c)' }}
        />
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {projects.map((project, i) => (
            <div key={project.id} className={`${revealSteps[i % 2]} flex`}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
        {demos}
        <div className="reveal flex justify-center">
          <a className="btn state-layer bg-surface-high text-on-surface" href={projectsMore.href}>
            {projectsMore.label}
            <Icon name="arrowUpRight" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
