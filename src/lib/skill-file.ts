import type { CodeLine, CodeToken } from '@/content/schema';

// Light syntax colouring for a SKILL.md excerpt: frontmatter keys, headings,
// fenced code and inline `code`. Enough to read well; not a full parser.

const t = (text: string, kind: CodeToken['kind']): CodeToken => ({ text, kind });

function inline(text: string): CodeToken[] {
  // Split on `code` spans, keeping the backticks with the code.
  return text
    .split(/(`[^`]+`)/)
    .filter((part) => part !== '')
    .map((part) =>
      part.startsWith('`') && part.endsWith('`') ? t(part, 'string') : t(part, 'text'),
    );
}

export function highlightSkill(source: string): CodeLine[] {
  const lines = source.split('\n');
  let inFrontmatter = false;
  let inFence = false;

  return lines.map((line, index): CodeLine => {
    if (line === '---' && (index === 0 || inFrontmatter)) {
      inFrontmatter = index === 0;
      return [t(line, 'muted')];
    }
    if (inFrontmatter) {
      const match = /^([\w-]+):(.*)$/.exec(line);
      return match
        ? [t(match[1]!, 'tag'), t(':', 'punct'), t(match[2]!, 'text')]
        : [t(line, 'text')];
    }
    if (line.startsWith('```')) {
      inFence = !inFence;
      return [t(line, 'muted')];
    }
    if (inFence) return [t(line, 'string')];
    if (/^#{1,6} /.test(line)) return [t(line, 'heading')];
    return line === '' ? [] : inline(line);
  });
}
