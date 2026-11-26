import { nav } from '@/content/site';

export function SkipLink() {
  return (
    <a className="skip-link" href="#projects">
      {nav.skip}
    </a>
  );
}
