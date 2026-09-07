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

// One dated sequence for the transport, playback and slider. Other records remain in the list.
export function datedMapStops(records) {
  return chronologicalRecords(records).filter(hasCoordinates).filter((record, index, located) =>
    index === 0 || record.coordinates.lat !== located[index - 1].coordinates.lat ||
    record.coordinates.lng !== located[index - 1].coordinates.lng);
}

export function mapStopAtYear(stops, year) {
  return stops.findLast((record) => record.year <= year) ?? null;
}

function selectedMapStop(stops, selected) {
  if (!selected) return null;
  const exact = stops.find((record) => record.id === selected.id);
  if (exact) return exact;
  const previous = mapStopAtYear(stops, selected.year);
  return Number.isFinite(selected.year) && hasCoordinates(selected) && previous &&
    previous.coordinates.lat === selected.coordinates.lat &&
    previous.coordinates.lng === selected.coordinates.lng ? previous : null;
}

export function adjacentMapStop(stops, selected, year, direction) {
  return adjacentRecord(stops, selectedMapStop(stops, selected)?.id ?? "", year, direction);
}

export function mapPlaybackStart(stops, selected, year) {
  const current = selectedMapStop(stops, selected);
  if (current) return current === stops.at(-1) ? stops[0] : current;
  return mapStopAtYear(stops, year) ?? stops[0] ?? null;
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
