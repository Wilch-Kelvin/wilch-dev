import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Shape } from '@/components/ui/Shape';
import { notFound } from '@/content/site';

export const metadata: Metadata = { title: notFound.metaTitle, robots: { index: false } };

// The static export writes this as 404.html; Vercel serves it for any
// unknown path. Friendly line + one next step, never blaming the visitor.
export default function NotFound() {
  return (
    <main className="container-page flex min-h-[70dvh] flex-col items-start justify-center gap-6 py-16">
      <span className="relative inline-grid h-28 w-28">
        <Shape
          name="burst8"
          color="var(--secondary-c)"
          className="spin h-full w-full [grid-area:1/1]"
        />
        <span className="text-on-secondary-c relative place-self-center font-mono text-2xl font-semibold [grid-area:1/1]">
          404
        </span>
      </span>
      <h1 className="m-0 text-[clamp(64px,14vw,140px)] leading-[0.9] font-extrabold">
        {notFound.title}
      </h1>
      <p className="text-on-surface-var m-0 max-w-[44ch] text-xl">{notFound.body}</p>
      <Link className="btn state-layer bg-primary text-on-primary" href="/">
        <Icon name="arrowUp" className="-rotate-90" />
        {notFound.cta}
      </Link>
    </main>
  );
}
