/**
 * Picks the section to highlight in the nav: the first one (in page order)
 * that is inside the reading band, or null when none is (e.g. the hero).
 */
export function pickActiveSection(
  orderedIds: readonly string[],
  ratios: ReadonlyMap<string, number>,
): string | null {
  return orderedIds.find((id) => (ratios.get(id) ?? 0) > 0) ?? null;
}
