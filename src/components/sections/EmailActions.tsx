'use client';

import { useState, useSyncExternalStore } from 'react';
import { Icon } from '@/components/ui/Icon';
import { contact } from '@/content/site';
import { assembleEmail, mailtoHref } from '@/lib/email';

const noop = () => () => {};

type CopyState = 'idle' | 'copied' | 'failed';

/**
 * The address only exists after the page loads in a browser: the static HTML
 * says "Email me" and points at #contact, which keeps it out of the source
 * that scrapers read. After hydration the real mailto link and address appear.
 */
export function EmailActions() {
  // Server snapshot null, client snapshot the address: no effect, no mismatch.
  const address = useSyncExternalStore(
    noop,
    () => assembleEmail(contact.email),
    () => null,
  );
  const [copy, setCopy] = useState<CopyState>('idle');

  const onCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopy('copied');
    } catch {
      setCopy('failed');
    }
    window.setTimeout(() => setCopy('idle'), 2400);
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <a
        className="btn state-layer bg-inverse-raised text-on-inverse"
        href={address ? mailtoHref(contact.email) : '#contact'}
      >
        <Icon name="mail" />
        {address ?? contact.emailFallback}
      </a>
      {address ? (
        <button
          type="button"
          className="icon-btn state-layer bg-inverse-raised text-on-inverse h-[52px] w-[52px]"
          aria-label={contact.copyEmail}
          data-copied={copy === 'copied'}
          onClick={onCopy}
        >
          <Icon
            name={copy === 'copied' ? 'check' : 'copy'}
            className={copy === 'copied' ? 'pop' : ''}
          />
        </button>
      ) : null}
      {/* Polite announcement for screen readers; also a small visible toast. */}
      <span
        role="status"
        aria-live="polite"
        className="text-on-inverse-var text-base font-semibold"
      >
        {copy === 'copied'
          ? contact.copied
          : copy === 'failed'
            ? 'Copy failed. Select the address instead.'
            : ''}
      </span>
    </span>
  );
}
