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
    (r) => hasCoordinates(r) && (r.year === null || r.year <= year),
  );
}

export function hasCoordinates(record) {
  const c = record?.coordinates;
  return Boolean(c && Number.isFinite(c.lat) && Number.isFinite(c.lng) &&
    Math.abs(c.lat) <= 90 && Math.abs(c.lng) <= 180);
}

// Undated records follow dated records without assigning them a year.
export function adjacentPlace(records, id, year, direction) {
  const ordered = [...chronologicalRecords(records), ...records.filter((r) => r.year === null)];
  let index = ordered.findIndex((r) => r.id === id);
  const current = ordered[index];
  if (index < 0) {
    index = ordered.findLastIndex((r) => Number.isFinite(r.year) && r.year <= year);
    if (direction < 0) index += 1;
  }
  for (let i = index + direction; i >= 0 && i < ordered.length; i += direction) {
    const candidate = ordered[i];
    if (hasCoordinates(candidate) && (!hasCoordinates(current) ||
      candidate.coordinates.lat !== current.coordinates.lat ||
      candidate.coordinates.lng !== current.coordinates.lng)) return candidate;
  }
  return null;
}

// Curated source associations only; proximity, surname and event order are not evidence.
export function eligibleConnections(connections, records, selected, reached) {
  const points = new Map(records.map((p) => [p.id, p]));
  return connections.filter((c) => c.kind === "place_association" &&
    c.id && c.description && c.source_refs?.length &&
    c.source_refs.every((s) => s.page_ref && s.column_refs?.length) &&
    c.fromId !== c.toId && [c.fromId, c.toId].includes(selected) &&
    [c.fromId, c.toId].every((id) => hasCoordinates(points.get(id)) && reached.has(id)));
}
