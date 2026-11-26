// The visitor's motion choice (WCAG 2.2.2: anything that moves on its own for
// more than 5 seconds needs a way to pause it). The OS reduce-motion setting
// is handled in CSS; this is the on-page pause button.

export type MotionPreference = 'playing' | 'paused';
export const MOTION_STORAGE_KEY = 'wilch-motion';

export function parseMotion(value: string | null | undefined): MotionPreference {
  return value === 'paused' ? 'paused' : 'playing';
}

export function toggleMotion(current: MotionPreference): MotionPreference {
  return current === 'paused' ? 'playing' : 'paused';
}
