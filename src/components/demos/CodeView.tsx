import type { CodeLine, CodeToken } from '@/content/schema';

const kindClass: Record<CodeToken['kind'], string> = {
  tag: 'text-code-tag',
  attr: 'text-code-attr',
  string: 'text-code-string',
  punct: 'text-on-inverse',
  text: 'text-on-inverse',
  muted: 'text-code-muted',
  heading: 'text-code-attr font-bold',
};

type Props = {
  lines: readonly CodeLine[];
  label: string;
  className?: string;
  wrap?: boolean;
};

/** Highlighted code block. Focusable so keyboard users can scroll it. */
export function CodeView({ lines, label, className = '', wrap = false }: Props) {
  return (
    <pre
      tabIndex={0}
      aria-label={label}
      className={`m-0 overflow-auto font-mono text-[14px] leading-[1.65] ${wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'} ${className}`}
    >
      <code>
        {lines.map((line, i) => (
          <span key={i} className="block min-h-[1.65em]">
            {line.map((token, j) => (
              <span key={j} className={kindClass[token.kind]}>
                {token.text}
              </span>
            ))}
          </span>
        ))}
      </code>
    </pre>
  );
}
