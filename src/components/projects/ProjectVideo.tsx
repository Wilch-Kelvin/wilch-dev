'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMotion } from '@/hooks/useMotion';
import { shouldPlayVideo, type ProjectVideo as Video } from '@/lib/project-video';

/**
 * A card's demo video. The poster sits on top and fades out once frames are
 * actually playing, so there's never a blank or half-typed first frame.
 *
 * `preload="none"`: nothing downloads until the first hover (or, on a phone,
 * until the card is on screen), so the page stays light. `muted` +
 * `playsInline` are what let browsers start it without a click.
 *
 * Decorative: the panel around it is aria-hidden, and it is never focusable.
 */
export function ProjectVideo({ video, engaged }: { video: Video; engaged: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const canHover = useMediaQuery('(hover: hover)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { motion } = useMotion();
  const inView = useInView(ref, canHover === false);

  const play = shouldPlayVideo({
    engaged,
    inView,
    canHover,
    reducedMotion,
    paused: motion === 'paused',
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (play) {
      // Each hover starts the story from the top.
      el.currentTime = 0;
      // play() rejects if a quick mouse-out pauses it first; that's fine.
      el.play().catch(() => {});
    } else if (!el.paused) {
      el.pause();
    }
  }, [play]);

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={video.src}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {/* Static export: plain <img>, sized by the panel. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={video.poster}
        alt=""
        loading="lazy"
        decoding="async"
        data-playing={playing}
        className="video-poster absolute inset-0 h-full w-full object-cover"
      />
    </>
  );
}
