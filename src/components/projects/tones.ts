import type { ProjectTone } from '@/content/schema';

// Each project card is painted in one M3 colour role. Classes only, so every
// colour still comes from the tokens.
export const toneClasses: Readonly<
  Record<ProjectTone, { card: string; panel: string; button: string }>
> = {
  primary: {
    card: 'bg-primary-c text-on-primary-c',
    panel: 'bg-primary',
    button: 'bg-primary text-on-primary',
  },
  inverse: {
    card: 'bg-inverse text-on-inverse',
    panel: 'bg-inverse-raised',
    button: 'bg-ia text-on-ia',
  },
  tertiary: {
    card: 'bg-tertiary-c text-on-tertiary-c',
    panel: 'bg-tertiary-panel',
    button: 'bg-on-tertiary-c text-tertiary-c',
  },
  secondary: {
    card: 'bg-secondary-c text-on-secondary-c',
    panel: 'bg-secondary-panel',
    button: 'bg-on-secondary-c text-secondary-c',
  },
};
