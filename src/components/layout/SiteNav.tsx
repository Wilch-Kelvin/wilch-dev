'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Shape } from '@/components/ui/Shape';
import { nav } from '@/content/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useSlidingIndicator } from '@/hooks/useSlidingIndicator';
import { ThemeToggle } from './ThemeToggle';

const sectionIds = nav.items.map((item) => item.target);

/**
 * Sticky liquid-glass pill. From 768px it shows every link, a sliding
 * underline under the current section and a filled GitHub button (as in the
 * 2026-11-26 mockups). Below that it collapses to logo + Résumé + a menu
 * button that opens a glass sheet (review M4), so it never wraps.
 */
export function SiteNav() {
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indicator = useSlidingIndicator(listRef, active);

  // Escape and outside taps close the sheet; focus goes back to the button.
  useEffect(() => {
    if (!open) return;
    const close = (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) buttonRef.current?.focus();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!sheetRef.current?.contains(target) && !buttonRef.current?.contains(target)) close(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    sheetRef.current?.querySelector('a')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <header
      data-print="hide"
      className="pointer-events-none sticky top-0 z-40 flex justify-center px-4 pt-3 pb-2 md:pt-4"
    >
      <nav
        aria-label="Main"
        className="glass pointer-events-auto relative flex w-full max-w-[880px] items-center gap-1 rounded-[32px] p-2 md:w-auto"
      >
        <Link
          href="/#top"
          className="nav-link state-layer gap-2.5 text-[20px] font-extrabold"
          aria-label={nav.homeLabel}
        >
          <Shape name="cookie9" color="var(--primary)" className="h-7 w-7" />
          <span aria-hidden="true">{nav.brand}</span>
        </Link>

        <ul ref={listRef} className="relative m-0 hidden list-none items-center gap-1 p-0 md:flex">
          {nav.items.map((item) => (
            <li key={item.target}>
              <a
                data-target={item.target}
                className="nav-link nav-link-underline state-layer"
                href={`/#${item.target}`}
                aria-current={active === item.target ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
          {indicator.geometry ? (
            <li
              aria-hidden="true"
              className="nav-indicator"
              style={{
                translate: `${indicator.geometry.x}px 0`,
                width: indicator.geometry.width,
                opacity: indicator.visible ? 1 : 0,
              }}
            />
          ) : null}
        </ul>

        <div className="ml-auto flex items-center gap-1">
          <span className="hidden md:inline-flex">
            <ThemeToggle />
          </span>
          <a
            className="btn btn-sm state-layer bg-primary text-on-primary hidden md:inline-flex"
            href={nav.github.href}
            aria-label={nav.githubAria}
          >
            {nav.github.label}
            <Icon name="arrowUpRight" size={18} className="nudge-diag" />
          </a>
          <a
            className="btn btn-sm state-layer bg-primary text-on-primary md:hidden"
            href={`/#${nav.cta.target}`}
            aria-current={active === nav.cta.target ? 'true' : undefined}
          >
            {nav.cta.label}
          </a>
          <button
            ref={buttonRef}
            type="button"
            className="icon-btn state-layer md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? nav.menuClose : nav.menuOpen}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>

        <span
          aria-hidden="true"
          className="scroll-progress bg-primary absolute right-7 bottom-[3px] left-7 h-[3px] rounded-full md:invisible"
        />

        <div
          ref={sheetRef}
          id={menuId}
          hidden={!open}
          className="glass absolute top-[calc(100%+8px)] right-0 left-0 rounded-[28px] p-2 md:hidden"
        >
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {nav.items.map((item) => (
              <li key={item.target}>
                <a
                  className="nav-link state-layer min-h-12 w-full text-[20px]"
                  href={`/#${item.target}`}
                  aria-current={active === item.target ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex items-center justify-between border-t border-hairline px-2 pt-2">
            <a className="nav-link state-layer gap-2" href={nav.github.href}>
              <Icon name="github" />
              {nav.github.label}
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
