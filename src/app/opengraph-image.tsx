import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { meta, person } from '@/content/site';
import { shapePaths } from '@/lib/shapes';
import { colors } from '@/theme/colors';

// Rendered once at build time into a static PNG (works with static export).
// Uses the site's own font (Barlow Condensed, OFL, in assets/fonts) and shapes.
export const dynamic = 'force-static';
export const alt = meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const c = colors.light;

function shapeSvg(d: string, fill: string, stroke: number) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 220 220"><path d="${d}" fill="${fill}" stroke="${fill}" stroke-width="${stroke}" stroke-linejoin="round"/></svg>`,
  )}`;
}

export default async function OpengraphImage() {
  const fontDir = join(process.cwd(), 'assets', 'fonts');
  const [extraBold, semiBold] = await Promise.all([
    readFile(join(fontDir, 'BarlowCondensed-ExtraBold.ttf')),
    readFile(join(fontDir, 'BarlowCondensed-SemiBold.ttf')),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: c.surface,
        color: c['on-surface'],
        fontFamily: 'Barlow Condensed',
        position: 'relative',
      }}
    >
      <img
        alt=""
        src={shapeSvg(shapePaths.cookie12, c['primary-c'], 10)}
        width={500}
        height={500}
        style={{ position: 'absolute', right: 40, top: 65 }}
      />
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: 65,
          width: 500,
          height: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 330,
          fontWeight: 800,
          color: c['on-primary-c'],
        }}
      >
        K
      </div>
      <img
        alt=""
        src={shapeSvg(shapePaths.clover4, c['tertiary-c'], 14)}
        width={190}
        height={190}
        style={{ position: 'absolute', right: 10, top: 10 }}
      />
      <img
        alt=""
        src={shapeSvg(shapePaths.flower6, c['secondary-c'], 12)}
        width={150}
        height={150}
        style={{ position: 'absolute', right: 20, bottom: 10 }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          width: 760,
        }}
      >
        <div style={{ display: 'flex', fontSize: 36, fontWeight: 600, color: c.primary }}>
          wilch.dev
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 150, fontWeight: 800, lineHeight: 0.9 }}>
            Kelvin
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 150,
              fontWeight: 800,
              lineHeight: 0.9,
              color: c.primary,
            }}
          >
            Wilch.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 38,
              fontWeight: 600,
              color: c['on-surface-var'],
              marginTop: 28,
            }}
          >
            {person.role}
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Barlow Condensed', data: extraBold, weight: 800, style: 'normal' },
        { name: 'Barlow Condensed', data: semiBold, weight: 600, style: 'normal' },
      ],
    },
  );
}
