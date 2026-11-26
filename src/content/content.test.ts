import { graduationDate, milestones } from './academics';
import { projects } from './projects';
import { careerNodeCount, education, skillGroups } from './resume';
import { contact, hero, nav } from './site';
import { skillSamples } from './skills4u.samples';

// The type checker proves every field exists; these catch the things types
// can't: duplicates, empty strings, placeholders left in, broken link shapes.

const allText = JSON.stringify({
  projects,
  milestones,
  education,
  skillGroups,
  hero,
  contact,
  nav,
});

describe('content', () => {
  it('keeps the empty career banner drawable: at least two nodes for a curve', () => {
    expect(Number.isInteger(careerNodeCount)).toBe(true);
    expect(careerNodeCount).toBeGreaterThanOrEqual(2);
  });


  it('has four projects with unique ids, at most one open by default', () => {
    expect(projects).toHaveLength(4);
    expect(new Set(projects.map((p) => p.id)).size).toBe(4);
    expect(projects.filter((p) => p.openByDefault).length).toBeLessThanOrEqual(1);
  });

  it('gives every project link a unique label (review m4)', () => {
    const labels = projects.map((p) => p.link.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('uses https for every external link', () => {
    for (const p of projects) expect(p.link.href).toMatch(/^https:\/\//);
    expect(contact.linkedin.href).toMatch(/^https:\/\/www\.linkedin\.com\//);
  });

  it('has no unfilled [PLACEHOLDER] text', () => {
    expect(allText).not.toMatch(/\[[A-Z ]{4,}\]/);
  });

  it('does not ship the email as one scrapeable string', () => {
    expect(allText).not.toMatch(/[\w.]+@[\w-]+\.\w+/);
  });

  it('has a valid graduation date', () => {
    expect(graduationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('has exactly one current term', () => {
    expect(milestones.filter((m) => m.state === 'now')).toHaveLength(1);
  });

  it('nav points only at real sections', () => {
    const sections = new Set(['projects', 'academics', 'resume', 'contact']);
    for (const item of nav.items) expect(sections.has(item.target)).toBe(true);
  });

  it('skill samples share names with the Skills4u card and start with frontmatter', () => {
    expect(skillSamples.map((s) => s.plugin)).toEqual([
      'ui-ux',
      'project-documentation',
      'wiki-health',
      'inventory-auditor',
    ]);
    for (const s of skillSamples) {
      expect(s.source.startsWith('---\nname: ')).toBe(true);
      expect(s.source).toContain('description:');
    }
  });
});
