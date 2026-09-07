import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { validSelection } from "../utils/explorers.mjs";
import { createPlacesMap, MapCamera } from "../utils/placesMap";
import ChronologyTimeline from "./ChronologyTimeline";
import {
  chronologicalRecords,
  chronologyBounds,
  reachedPlaces,
  recordAtYear,
  adjacentPlace,
  eligibleConnections,
  hasCoordinates,
} from "../utils/chronology.mjs";
import type { MigrationPoint, PlaceConnection } from "../types";
import connectionData from "../public/place-connections.json";
import "leaflet/dist/leaflet.css";
import "../styles/explorers.css";
export interface MapState {
  event: string;
  year: number | null;
  camera: MapCamera | null;
}
interface Props {
  points: MigrationPoint[];
  isDarkMode: boolean;
  onNavigate?: (id: string) => void;
  state: MapState;
  onChange: (s: MapState) => void;
}
let chronologyRequest: Promise<MigrationPoint[]> | undefined;
function loadChronology() {
  return (chronologyRequest ??= fetch("./chronology.json")
    .then((r) => {
      if (!r.ok) throw Error("Chronology unavailable");
      return r.json();
    })
    .then((data) => {
      if (
        !Array.isArray(data.points) ||
        !data.points.every(
          (p) =>
            typeof p.id === "string" &&
            (p.year === null || Number.isFinite(p.year)),
        )
      )
        throw Error("Invalid chronology");
      return data.points as MigrationPoint[];
    })
    .catch((error) => {
      chronologyRequest = undefined;
      throw error;
    }));
}
export default function MigrationMap(props: Props) {
  const [additions, setAdditions] = useState<MigrationPoint[] | null>(null);
  const [warning, setWarning] = useState(false);
  useEffect(() => {
    let active = true;
    loadChronology()
      .then((data) => {
        if (active) setAdditions(data);
      })
      .catch(() => {
        if (active) {
          setAdditions([]);
          setWarning(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);
  const records = useMemo(
    () => [...props.points, ...(additions ?? [])],
    [props.points, additions],
  );
  if (additions === null)
    return (
      <p className="p-6 text-sm text-stone-500">
        Loading the reviewed chronology…
      </p>
    );
  return (
    <RecordedMap {...props} points={records} chronologyWarning={warning} />
  );
}

function RecordedMap({
  points,
  isDarkMode,
  onNavigate,
  state,
  onChange,
  chronologyWarning,
}: Props & { chronologyWarning: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<ReturnType<typeof createPlacesMap> | null>(null);
  const latest = useRef({ state, onChange });
  latest.current = { state, onChange };
  const [fallback, setFallback] = useState(false),
    [tileError, setTileError] = useState(false),
    [expanded, setExpanded] = useState(true);
  const [interaction, setInteraction] = useState(0);
  const [focusRequest, setFocusRequest] = useState(0);
  const pause = () => setInteraction((n) => n + 1);
  const dated = useMemo(() => chronologicalRecords(points), [points]);
  const bounds = useMemo(() => chronologyBounds(points), [points]);
  const requestedYear =
    state.year ??
    points.find((p) => p.id === state.event)?.year ??
    bounds?.min ??
    0;
  const currentYear = bounds
    ? Math.max(bounds.min, Math.min(bounds.max, requestedYear))
    : requestedYear;
  const reached = useMemo(
    () => reachedPlaces(points, currentYear),
    [points, currentYear],
  );
  const ordered = useMemo(
    () => [...dated, ...points.filter((p) => p.year === null)],
    [points, dated],
  );
  const connections = useMemo(() => eligibleConnections(
    connectionData.connections as PlaceConnection[], points, state.event,
    new Set(reached.map((p) => p.id)),
  ), [points, state.event, reached]);
  const previousPlace = adjacentPlace(points, state.event, currentYear, -1);
  const nextPlace = adjacentPlace(points, state.event, currentYear, 1);
  const selectRef = useRef<(id: string) => void>(() => {});
  const select = (id: string, automatic = false) => {
    if (!automatic) pause();
    const { state: s, onChange: change } = latest.current;
    const point = points.find((p) => p.id === id);
    const next = {
      ...s,
      event: id,
      year: point?.year ?? s.year ?? currentYear,
      camera: null,
    };
    latest.current.state = next;
    change(next);
    setExpanded(true);
    setFocusRequest((n) => n + 1);
  };
  selectRef.current = select;
  const scrub = (year: number) => {
    pause();
    const record = recordAtYear(dated, year);
    const { state: s, onChange: change } = latest.current;
    const next = {
      ...s,
      year,
      event: record?.id ?? "",
      camera: null,
    };
    latest.current.state = next;
    change(next);
    setFocusRequest((n) => n + 1);
  };
  useEffect(() => {
    if (!bounds) return;
    const existing = points.find((p) => p.id === state.event);
    const record =
      existing && (existing.year === null || existing.year <= currentYear)
        ? existing
        : recordAtYear(dated, currentYear);
    if (state.year !== currentYear || state.event !== record?.id) {
      const next = { ...state, year: currentYear, event: record?.id ?? "" };
      latest.current.state = next;
      onChange(next);
    }
  }, [bounds, state.year, state.event]);
  useEffect(() => {
    if (!host.current) return;
    try {
      api.current = createPlacesMap(host.current, {
        camera: latest.current.state.camera,
        onSelect: (id) => selectRef.current(id),
        onRest: (camera) => {
          const { state: s, onChange: change } = latest.current;
          const next = { ...s, camera };
          latest.current.state = next;
          change(next);
        },
        onTileError: () => setTileError(true),
      });
    } catch {
      setFallback(true);
    }
    return () => {
      api.current?.dispose();
      api.current = null;
    };
  }, []);
  useEffect(() => {
    const id = validSelection(points, state.event);
    if (!bounds && id !== state.event) onChange({ ...state, event: id });
    api.current?.update(
      points,
      id,
      isDarkMode,
      new Set(reached.map((p) => p.id)),
      connections,
    );
  }, [points, state.event, isDarkMode, reached, connections]);
  useEffect(() => {
    const point = points.find((p) => p.id === state.event);
    if (point && !state.camera) api.current?.focus(point);
  }, [state.event, focusRequest]);
  useEffect(() => {
    document
      .getElementById(`event-${state.event}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [state.event]);
  return (
    <section
      className="explorer places-map-explorer"
      aria-label="Recorded places explorer"
    >
      <div className="places-map-body">
        <div
          className="places-map-stage"
          onPointerDownCapture={pause}
          onWheelCapture={pause}
          onKeyDownCapture={pause}
        >
          <nav className="places-map-controls" aria-label="Map area and zoom">
            <div>
              <button onClick={() => api.current?.fit(reached)}>
                Places reached
              </button>
              <button
                onClick={() =>
                  api.current?.fit(
                    points.filter(
                      (p) =>
                        p.coordinates &&
                        p.coordinates.lat > 22 &&
                        p.coordinates.lat < 24 &&
                        p.coordinates.lng > 112 &&
                        p.coordinates.lng < 114,
                    ),
                  )
                }
              >
                Guangdong
              </button>
              <button
                onClick={() =>
                  api.current?.fit(
                    points.filter(
                      (p) => p.coordinates && p.coordinates.lat < 0,
                    ),
                  )
                }
              >
                South Africa
              </button>
            </div>
            <div>
              <button
                aria-label="Zoom out map"
                onClick={() => api.current?.zoom(-1)}
              >
                <Minus size={16} />
              </button>
              <button
                aria-label="Zoom in map"
                onClick={() => api.current?.zoom(1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </nav>
          <nav className="recorded-place-controls" aria-label="Recorded place navigation">
            <button disabled={!previousPlace} onClick={() => previousPlace && select(previousPlace.id)}>
              ← Previous place
            </button>
            <button disabled={!nextPlace} onClick={() => nextPlace && select(nextPlace.id)}>
              Next place →
            </button>
          </nav>
          <div className="places-map-view">
            <div ref={host} className="places-map-canvas" />
            {fallback && (
              <div className="places-map-fallback" role="status">
                The map is unavailable.
                <br />
                All records and source links remain available in the list.
              </div>
            )}
            {tileError && (
              <p className="map-tile-error" role="status">
                Some map tiles could not load. The event list remains available.
              </p>
            )}
          </div>
          {connections.length > 0 && (
            <p className="map-connection-key">Dashed line: source-linked places · approximate areas, not a travel route</p>
          )}
        </div>
        <aside
          className="places-map-events"
          aria-label="Recorded events"
          onPointerDownCapture={pause}
          onWheelCapture={pause}
          onKeyDownCapture={pause}
        >
          <h2 className="places-list-heading">Recorded events</h2>
          {chronologyWarning && (
            <p className="p-3 text-xs" role="status">
              Additional chronology could not load. The original place records
              remain available.
            </p>
          )}
          <ol className="event-list">
            {ordered.map((p) => (
              <li key={p.id} id={`event-${p.id}`}>
                <button
                  className="event-select"
                  aria-pressed={state.event === p.id}
                  onClick={() => select(p.id)}
                >
                  <strong>{p.name}</strong>
                  <small>
                    {p.source_refs
                      ? p.date_label
                      : p.year === null
                        ? "Undated"
                        : `${p.date_label.trim().startsWith("c.") ? "c. " : ""}${p.year}${p.year_end && p.year_end !== p.year ? `–${p.year_end}` : ""}`}
                    {!hasCoordinates(p) ? " · Location unrecorded" : ""}
                  </small>
                </button>
                {state.event === p.id && (
                  <div className="event-detail">
                    {expanded && (
                      <>
                        <p className="event-date">
                          {p.date_label} · {p.event_type.replaceAll("_", " ")}
                        </p>
                        {(
                          p.source_refs ?? [
                            {
                              page_ref: p.page_ref,
                              column_refs: p.column_refs,
                            },
                          ]
                        ).map((ref) => (
                          <button
                            key={`${ref.page_ref}-${ref.column_refs.join("-")}`}
                            className="source-link block"
                            onClick={() => onNavigate?.(ref.page_ref)}
                          >
                            Read page {Number(ref.page_ref.slice(4))}, columns{" "}
                            {ref.column_refs.join(", ")} →
                          </button>
                        ))}
                        <p>{p.description.split("\n\nSource:")[0]}</p>
                        {connections.map((connection) => (
                          <div key={connection.id} className="place-connection-detail">
                            <p>{connection.description}</p>
                            {connection.source_refs.map((ref) => (
                              <button key={ref.page_ref} className="source-link block" onClick={() => onNavigate?.(ref.page_ref)}>
                                Connection source: page {Number(ref.page_ref.slice(4))}, columns {ref.column_refs.join(", ")} →
                              </button>
                            ))}
                            <button className="source-link" onClick={() => api.current?.fit(points.filter((p) => [connection.fromId, connection.toId].includes(p.id)))}>
                              Show both connected places
                            </button>
                          </div>
                        ))}
                        {p.coordinates &&
                          points
                            .filter(
                              (other) =>
                                other.id !== p.id &&
                                other.coordinates?.lat === p.coordinates?.lat &&
                                other.coordinates?.lng === p.coordinates?.lng,
                            )
                            .map((other) => (
                              <button
                                key={other.id}
                                className="source-link"
                                onClick={() => select(other.id)}
                              >
                                Also recorded here: {other.name} ·{" "}
                                {other.date_label}
                              </button>
                            ))}
                        <p className="evidence">
                          {p.evidence}.{" "}
                          {hasCoordinates(p)
                            ? `Location: ${p.coordinate_precision}.`
                            : "Location unrecorded."}
                        </p>
                        {p.description.includes("\n\nSource:") && (
                          <details className="chronology-source">
                            <summary>Transcription and translation</summary>
                            <div>
                              {p.description.slice(
                                p.description.indexOf("\n\nSource:") + 2,
                              )}
                            </div>
                          </details>
                        )}
                      </>
                    )}
                    <button
                      className="block text-xs underline text-stone-500 mt-2"
                      onClick={() => setExpanded((v) => !v)}
                    >
                      {expanded ? "Collapse details" : "Show details"}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <ChronologyTimeline
        records={points}
        year={currentYear}
        selected={state.event}
        interaction={interaction}
        onSelect={select}
        onYear={scrub}
      />
    </section>
  );
}
