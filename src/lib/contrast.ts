// WCAG 2.x contrast maths, as pure functions. Used by the theme tests to
// prove every text pair passes AA, including text on translucent glass.

export type Rgba = { r: number; g: number; b: number; a: number };

/** Parses #RGB, #RRGGBB, #RRGGBBAA or rgba(r, g, b, a). */
export function parseColor(input: string): Rgba {
  const value = input.trim();
  const rgba = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(
    value,
  );
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value)?.[1];
  if (!hex) throw new Error(`Unsupported colour: ${input}`);
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  const channel = (i: number) => parseInt(full.slice(i, i + 2), 16);
  return {
    r: channel(0),
    g: channel(2),
    b: channel(4),
    a: full.length === 8 ? channel(6) / 255 : 1,
  };
}

/** Paints `top` over an opaque `bottom` (alpha compositing, "source over"). */
export function composite(top: Rgba, bottom: Rgba): Rgba {
  const mix = (t: number, b: number) => t * top.a + b * (1 - top.a);
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 };
}

function linear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance({ r, g, b }: Rgba): number {
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Contrast ratio (1–21) between two opaque colours. */
export function contrastRatio(a: Rgba, b: Rgba): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

/** Ratio of text over a background, flattening any translucent layers first. */
export function textContrast(text: string, ...layersTopToBottom: string[]): number {
  const layers = layersTopToBottom.map(parseColor);
  const base = layers.pop();
  if (!base || base.a < 1) throw new Error('The bottom layer must be opaque');
  const background = layers.reduceRight((under, layer) => composite(layer, under), base);
  const fg = parseColor(text);
  return contrastRatio(fg.a < 1 ? composite(fg, background) : fg, background);
}

export const AA_TEXT = 4.5;
export const AA_LARGE_OR_UI = 3;
