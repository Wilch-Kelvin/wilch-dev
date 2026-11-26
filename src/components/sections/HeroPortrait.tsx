'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { COOKIE_CLIP_ID } from '@/components/ui/Shape';
import { hero } from '@/content/site';
import { profilePhoto } from '@/content/profile-photo';
import { imageFailed, photoFallbackSrc, photoSrcSet } from '@/lib/profile-photo';
import { heroMorph, shapeStroke } from '@/lib/shapes';

// The portrait is the hero's largest image (its LCP element), so it must
// start downloading straight away: high priority, never lazy.
// Rendered width ≈ art width × 0.82 (cookie) × 0.9 (photo inside the mat).
const SIZES = '(min-width: 1024px) 420px, (min-width: 768px) 340px, 74vw';

/**
 * Kelvin's photo inside the scalloped cookie frame.
 *
 * Three layers share one grid cell:
 * 1. a lavender "mat": the cookie, spinning slowly and morphing (CSS `d`),
 * 2. the photo, clipped to the same cookie and spinning in step,
 * 3. inside it, the <img> spins the other way at the same speed. The two
 *    rotations cancel, so the scallops turn around a face that stays still.
 * If the photo is missing or fails, the K monogram takes its place.
 */
export function HeroPortrait() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  const src = profilePhoto ? photoFallbackSrc(profilePhoto.sources) : null;

  // An error that fires before React hydrates never reaches onError, so
  // check once on mount as well.
  useEffect(() => {
    if (imgRef.current && imageFailed(imgRef.current)) setFailed(true);
  }, []);

  const showPhoto = Boolean(profilePhoto && src && !failed);
  const morph = {
    '--morph-from': `path("${heroMorph.from}")`,
    '--morph-to': `path("${heroMorph.to}")`,
  } as CSSProperties;

  return (
    <div data-portrait className="grid h-full w-full">
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        focusable="false"
        className="spin h-full w-full overflow-visible [grid-area:1/1]"
      >
        <path
          d={heroMorph.from}
          className="morph"
          style={{
            ...morph,
            fill: 'var(--primary-c)',
            stroke: 'var(--primary-c)',
            strokeWidth: shapeStroke.cookie12,
            strokeLinejoin: 'round',
          }}
        />
      </svg>

      {showPhoto && profilePhoto && src ? (
        // relative: the spinning mat gets its own layer; this keeps the photo above it.
        <div
          className="spin relative m-[5%] overflow-hidden [grid-area:1/1]"
          style={{ clipPath: `url(#${COOKIE_CLIP_ID})` }}
        >
          {/* Plain <img>: the static export has no image optimiser, and the
              files are already sized and stripped on Vercel Blob. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            data-portrait-face
            src={src}
            srcSet={photoSrcSet(profilePhoto.sources)}
            sizes={SIZES}
            width={800}
            height={800}
            alt={hero.portraitAlt}
            fetchPriority="high"
            decoding="async"
            onError={() => setFailed(true)}
            className="spin-counter bg-primary-c h-full w-full object-cover object-[50%_45%]"
          />
        </div>
      ) : (
        <span
          data-portrait-face
          aria-hidden="true"
          className="text-on-primary-c relative place-self-center text-[clamp(150px,32vw,260px)] leading-none font-black [grid-area:1/1]"
        >
          {hero.monogram}
        </span>
      )}
    </div>
  );
}
