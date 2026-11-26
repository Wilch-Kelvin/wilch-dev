// Content types, written before the content and the components (schema
// first). Every word on the site lives in src/content/ and must fit these, so
// a missing field is a type error at build time, not a blank on the page.

export type ExternalLink = {
  label: string;
  href: `https://${string}`;
};

export type SectionId = 'projects' | 'academics' | 'resume' | 'contact';

export type NavItem = {
  label: string;
  /** In-page section id, without the #. */
  target: SectionId;
};

export type SectionIntro = {
  eyebrow: string;
  title: string;
  body: string;
};

// ---------- Projects ----------

export type ProjectId = 'classping' | 'ro5n3r' | 'nativex' | 'skills4u';

/** Which M3 colour role the card is painted in. */
export type ProjectTone = 'primary' | 'inverse' | 'tertiary' | 'secondary';

export type Project = {
  id: ProjectId;
  name: string;
  /** Mono line above the name: "Flagship · classping.space". */
  meta: string;
  /** First sentence(s), shown first when the card opens. */
  summary: string;
  /** Revealed by the "More" disclosure. */
  details: string;
  chipsLabel: string;
  chips: readonly string[];
  link: ExternalLink;
  tone: ProjectTone;
  /** Start expanded. All false since the 2026-11-26 mockups. */
  openByDefault: boolean;
  /** TODO(Kelvin): real screenshots (review M2). Null shows the shape art. */
  screenshot: { src: `/${string}`; alt: string } | null;
};

// ---------- Academics ----------

export type Course = { code: string; name: string };

export type Term = {
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  year: number;
  courses: readonly Course[];
};

export type Milestone =
  | { state: 'done'; title: string; detail: string }
  | { state: 'now'; term: Term }
  | { state: 'next'; title: string; detail: string };

// ---------- Resume ----------

export type Education = {
  degree: string;
  school: string;
  status: 'In progress' | 'Completed';
};

export type SkillGroup = { label: string; items: readonly string[] };

export type CareerStep = { title: string; detail: string };

// ---------- Demos ----------

export type CodeToken = {
  text: string;
  kind: 'tag' | 'attr' | 'string' | 'punct' | 'text' | 'muted' | 'heading';
};
export type CodeLine = readonly CodeToken[];

export type SkillSample = {
  id: string;
  /** Plugin folder name; the tab label and the Skills4u card tile use it too. */
  plugin: string;
  path: string;
  extras: string;
  /** The real SKILL.md text (frontmatter + start of the body). */
  source: string;
};
