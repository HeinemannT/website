export const PLAYBACK_DELAY = 2500;

export function chronologicalRecords(records) {
  return records
    .filter((r) => Number.isFinite(r.year))
    .slice()
    .sort(
      (a, b) =>
        a.year - b.year ||
        (a.sort_date ?? "9999").localeCompare(b.sort_date ?? "9999") ||
        a.id.localeCompare(b.id),
    );
}

export function chronologyBounds(records) {
  const dated = chronologicalRecords(records);
  if (!dated.length) return null;
  return {
    min: dated[0].year,
    max: Math.max(...dated.map((r) => r.year_end ?? r.year)),
  };
}

export function recordAtYear(dated, year) {
  return dated.filter((r) => r.year <= year).at(-1) ?? dated[0] ?? null;
}

export function adjacentRecord(dated, id, year, direction) {
  const current = dated.findIndex((r) => r.id === id);
  if (current >= 0) return dated[current + direction] ?? null;
  return direction > 0
    ? (dated.find((r) => r.year > year) ?? null)
    : (dated.filter((r) => r.year <= year).at(-1) ?? null);
}

export function reachedPlaces(records, year) {
  return records.filter(
    (r) => r.coordinates && (r.year === null || r.year <= year),
  );
}
