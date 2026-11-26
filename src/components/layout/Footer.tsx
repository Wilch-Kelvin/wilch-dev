import { Icon } from '@/components/ui/Icon';
import { footer } from '@/content/site';
import { MotionToggle } from './MotionToggle';

export function Footer() {
  return (
    <footer className="container-page text-on-surface-var flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 text-base">
      <span>{footer.copy}</span>
      <span>{footer.tagline}</span>
      <span className="flex flex-wrap items-center gap-2" data-print="hide">
        <MotionToggle className="text-on-surface-var" />
        <a
          href="#top"
          className="state-layer inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 font-semibold no-underline"
        >
          {footer.top}
          <Icon name="arrowUp" size={18} />
        </a>
      </span>
    </footer>
  );
}
