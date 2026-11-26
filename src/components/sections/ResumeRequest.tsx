'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { resumeGate, type ResumeReturnReason } from '@/content/resume';
import { requestResumeLink, returnReasonFrom, type ResumeFormState } from '@/lib/resume-form';

/**
 * "Download PDF" opens a small form instead of downloading straight away:
 * the visitor's email gets a 15-minute link (see lib/resume-handlers.ts).
 * The logic lives in lib/resume-form.ts; this file is only the UI.
 */
export function ResumeRequest() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ResumeFormState>({ status: 'idle' });
  const [returned, setReturned] = useState<ResumeReturnReason | null>(null);
  const panelId = useId();
  const emailId = useId();
  const noteId = useId();

  // Coming back from a link that didn't work (?resume=expired): open the
  // form with the reason, then tidy the address bar so a refresh is clean.
  useEffect(() => {
    const reason = returnReasonFrom(window.location.search);
    if (!reason) return;
    setReturned(reason);
    setOpen(true);
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState({ status: 'sending' });
    setReturned(null);
    setState(
      await requestResumeLink(String(data.get('email') ?? ''), String(data.get('website') ?? '')),
    );
  };

  const sending = state.status === 'sending';

  return (
    <div className="flex flex-col items-start gap-4">
      <button
        type="button"
        className="btn state-layer bg-primary text-on-primary"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="download" />
        {resumeGate.label}
      </button>

      <div
        id={panelId}
        // Tailwind's preflight makes [hidden] win over `flex` (!important).
        hidden={!open}
        className="card bg-surface-high text-on-surface flex w-[min(460px,calc(100vw-48px))] flex-col gap-4"
      >
        {returned ? (
          <p role="status" className="m-0 text-lg font-semibold">
            {resumeGate.returned[returned]}
          </p>
        ) : null}

        {state.status === 'sent' ? (
          <div role="status" className="flex flex-col items-start gap-3">
            <h3 className="m-0 text-[28px] leading-none font-extrabold">{resumeGate.sentTitle}</h3>
            <p className="text-on-surface-var m-0 text-lg">{resumeGate.sent(state.email)}</p>
            <button
              type="button"
              className="btn state-layer bg-surface text-on-surface"
              onClick={() => setState({ status: 'idle' })}
            >
              {resumeGate.again}
            </button>
          </div>
        ) : (
          <form className="flex flex-col items-start gap-4" onSubmit={onSubmit}>
            <h3 className="m-0 text-[28px] leading-none font-extrabold">{resumeGate.formTitle}</h3>
            <div className="flex w-full flex-col gap-2">
              <label htmlFor={emailId} className="text-base font-bold">
                {resumeGate.emailLabel}
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder={resumeGate.emailPlaceholder}
                aria-describedby={noteId}
                className="border-outline bg-surface text-on-surface min-h-12 w-full rounded-[14px] border px-3.5 font-sans text-lg"
              />
            </div>
            {/* Honeypot: invisible to people and skipped by keyboard and
                screen readers. Only bots fill it in. */}
            <div aria-hidden="true" className="sr-only">
              <label>
                Website
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <p id={noteId} className="text-on-surface-var m-0 text-base leading-relaxed">
              {resumeGate.note}
            </p>
            {state.status === 'error' ? (
              <p role="alert" className="m-0 text-lg font-semibold">
                {resumeGate.errors[state.code]}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={sending}
              className="btn state-layer bg-primary text-on-primary disabled:opacity-70"
            >
              <Icon name="mail" />
              {sending ? resumeGate.sending : resumeGate.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
