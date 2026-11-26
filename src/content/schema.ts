// Content types, written before the content and the components (schema
// first). Every word on the site lives in src/content/ and must fit these.

export type Href = `https://${string}` | `mailto:${string}` | `#${string}` | `/${string}`;

export type ExternalLink = {
  label: string;
  href: `https://${string}`;
};

export type NavItem = {
  label: string;
  /** In-page section id, without the #. */
  target: SectionId;
};

export type SectionId = 'projects' | 'academics' | 'resume' | 'contact';
