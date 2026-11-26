import { highlightSkill } from './skill-file';

const sample = [
  '---',
  'name: wiki-health',
  'description: Use when…',
  '---',
  '',
  '# Wiki health',
  '',
  'Run `audit.py` now.',
  '```bash',
  'python3 x.py',
  '```',
].join('\n');

describe('highlightSkill', () => {
  const lines = highlightSkill(sample);

  it('keeps one output line per input line', () => {
    expect(lines).toHaveLength(11);
  });

  it('mutes the frontmatter fences and colours keys', () => {
    expect(lines[0]).toEqual([{ text: '---', kind: 'muted' }]);
    expect(lines[1]![0]).toEqual({ text: 'name', kind: 'tag' });
    expect(lines[3]).toEqual([{ text: '---', kind: 'muted' }]);
  });

  it('marks headings, inline code and fenced code', () => {
    expect(lines[5]).toEqual([{ text: '# Wiki health', kind: 'heading' }]);
    expect(lines[7]).toContainEqual({ text: '`audit.py`', kind: 'string' });
    expect(lines[8]![0]!.kind).toBe('muted');
    expect(lines[9]).toEqual([{ text: 'python3 x.py', kind: 'string' }]);
  });

  it('does not treat a later --- as frontmatter', () => {
    expect(highlightSkill('# Title\n---')[1]).toEqual([{ text: '---', kind: 'text' }]);
  });

  it('never loses text', () => {
    const text = lines.map((l) => l.map((tok) => tok.text).join('')).join('\n');
    expect(text).toBe(sample);
  });
});
