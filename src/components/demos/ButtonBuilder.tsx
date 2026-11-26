'use client';

import { useId, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { buttonDemo } from '@/content/demos';
import { useTheme } from '@/hooks/useTheme';
import {
  buildButtonCode,
  clampRadius,
  codeToText,
  defaultChoice,
  fillById,
  fills,
  RADIUS_MAX,
  RADIUS_MIN,
  shownLabel,
  type ButtonChoice,
} from '@/lib/button-code';
import { colors } from '@/theme/colors';
import { CodeView } from './CodeView';
import { useCopy } from './useCopy';

export function ButtonBuilder() {
  const [choice, setChoice] = useState<ButtonChoice>(() => defaultChoice(buttonDemo.defaultLabel));
  const { theme } = useTheme();
  const { state: copyState, copy } = useCopy();
  const labelId = useId();
  const radiusId = useId();

  const label = shownLabel(choice.label, buttonDemo.emptyLabel, buttonDemo.maxLabel);
  const fill = fillById(choice.fill);
  const lines = buildButtonCode(choice, label, colors[theme ?? 'light']);

  return (
    <article
      aria-labelledby="demo-button-title"
      className="card bg-surface-high text-on-surface flex flex-1 flex-col gap-5"
    >
      <div className="flex flex-col gap-2.5">
        <span className="label-mono text-primary">{buttonDemo.meta}</span>
        <h3
          id="demo-button-title"
          className="m-0 text-[clamp(34px,3.6vw,44px)] leading-none font-extrabold"
        >
          {buttonDemo.title}
        </h3>
        <p className="text-on-surface-var m-0 text-lg">{buttonDemo.body}</p>
      </div>

      <div className="card-inner bg-surface grid min-h-[168px] place-items-center p-4">
        <button
          type="button"
          className="btn state-layer min-h-14 px-8 text-xl"
          style={{
            borderRadius: `${choice.radius}px`,
            background: `var(--${fill.bg})`,
            color: `var(--${fill.fg})`,
          }}
        >
          {label}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={labelId} className="text-base font-bold">
            {buttonDemo.labelField}
          </label>
          <input
            id={labelId}
            type="text"
            value={choice.label}
            maxLength={buttonDemo.maxLabel}
            autoComplete="off"
            onChange={(e) => setChoice((c) => ({ ...c, label: e.target.value }))}
            className="border-outline bg-surface text-on-surface min-h-12 rounded-[14px] border px-3.5 font-sans text-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={radiusId} className="text-base font-bold">
            {buttonDemo.radiusField}: <output htmlFor={radiusId}>{choice.radius}px</output>
          </label>
          <input
            id={radiusId}
            type="range"
            min={RADIUS_MIN}
            max={RADIUS_MAX}
            step={1}
            value={choice.radius}
            onChange={(e) =>
              setChoice((c) => ({ ...c, radius: clampRadius(Number(e.target.value)) }))
            }
            className="accent-primary m-0 min-h-12"
          />
        </div>
      </div>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-2.5 p-0 text-base font-bold">{buttonDemo.fillLegend}</legend>
        <div className="flex flex-wrap gap-3">
          {fills.map((f) => {
            const selected = f.id === choice.fill;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={selected}
                aria-label={`${f.name} fill`}
                onClick={() => setChoice((c) => ({ ...c, fill: f.id }))}
                className="press h-12 w-12 cursor-pointer border-0 p-0 transition-[border-radius,scale] duration-[450ms] ease-[var(--ease-bounce)]"
                style={{
                  background: `var(--${f.bg})`,
                  borderRadius: selected ? '14px' : '50%',
                  boxShadow: selected
                    ? '0 0 0 3px var(--surface-high), 0 0 0 6px var(--on-surface)'
                    : 'inset 0 0 0 1px var(--outline)',
                }}
              />
            );
          })}
        </div>
      </fieldset>

      <div className="card-inner bg-inverse flex flex-col overflow-hidden">
        <CodeView lines={lines} label={buttonDemo.codeLabel} className="p-5" />
        <div className="bg-inverse-raised flex flex-wrap items-center justify-end gap-2 px-3 py-2">
          <span
            role="status"
            aria-live="polite"
            className="text-on-inverse-var mr-auto pl-2 text-base font-semibold"
          >
            {copyState === 'copied'
              ? buttonDemo.copied
              : copyState === 'failed'
                ? 'Copy failed'
                : ''}
          </span>
          <button
            type="button"
            className="state-layer text-on-inverse inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-0 bg-transparent px-4 font-semibold"
            onClick={() => setChoice(defaultChoice(buttonDemo.defaultLabel))}
          >
            <Icon name="reset" size={18} />
            {buttonDemo.reset}
          </button>
          <button
            type="button"
            className="btn btn-sm state-layer bg-ia text-on-ia"
            onClick={() => copy(codeToText(lines))}
          >
            <Icon
              name={copyState === 'copied' ? 'check' : 'copy'}
              size={18}
              className={copyState === 'copied' ? 'pop' : ''}
            />
            {buttonDemo.copy}
          </button>
        </div>
      </div>
    </article>
  );
}
