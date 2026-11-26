'use client';

import { MOTION_STORAGE_KEY, parseMotion, type MotionPreference } from '@/lib/motion';
import { useDocumentData, writeStorage } from './useDocumentData';

function readMotion(): MotionPreference {
  return parseMotion(document.documentElement.dataset.motion);
}

export function useMotion() {
  const motion = useDocumentData(readMotion);
  const setMotion = (next: MotionPreference) => {
    if (next === 'paused') document.documentElement.dataset.motion = 'paused';
    else delete document.documentElement.dataset.motion;
    writeStorage(MOTION_STORAGE_KEY, next);
  };
  return { motion, setMotion };
}
