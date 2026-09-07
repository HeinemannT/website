import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Minus, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { filterEvents, validSelection } from "../utils/explorers.mjs";
import { createPlacesMap, MapCamera } from "../utils/placesMap";
import type { MigrationPoint } from "../types";
import "leaflet/dist/leaflet.css";
import "../styles/explorers.css";
export interface MapState {
  event: string;
  kind: string;
  undated: boolean;
  camera: MapCamera | null;
}
interface Props {
  points: MigrationPoint[];
  isDarkMode: boolean;
  onNavigate?: (id: string) => void;
  state: MapState;
  onChange: (s: MapState) => void;
}
export default function MigrationMap({
  points,
  isDarkMode,
  onNavigate,
  state,
  onChange,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<ReturnType<typeof createPlacesMap> | null>(null);
  const latest = useRef({ state, onChange });
  latest.current = { state, onChange };
  const [fallback, setFallback] = useState(false),
    [tileError, setTileError] = useState(false),
    [expanded, setExpanded] = useState(true);
  const visible = useMemo(
    () => filterEvents(points, state.kind, state.undated),
    [points, state.kind, state.undated],
  );
  const select = (id: string) => {
    const { state: s, onChange: change } = latest.current;
    const next = { ...s, event: id, camera: null };
    latest.current.state = next;
    change(next);
    setExpanded(true);
    const point = points.find((p) => p.id === id);
    if (point) api.current?.focus(point);
  };
  useEffect(() => {
    if (!host.current) return;
    try {
      api.current = createPlacesMap(host.current, {
        camera: latest.current.state.camera,
        onSelect: select,
        onRest: (camera) => {
          const { state: s, onChange: change } = latest.current;
          change({ ...s, camera });
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
    const id = validSelection(visible, state.event);
    if (id !== state.event) onChange({ ...state, event: id });
    api.current?.update(
      points,
      new Set(visible.map((p) => p.id)),
      id,
      isDarkMode,
    );
  }, [points, visible, state.event, isDarkMode]);
  useEffect(() => {
    const point = visible.find((p) => p.id === state.event);
    if (point && !state.camera) api.current?.focus(point);
  }, [state.event]);
  useEffect(() => {
    document
      .getElementById(`event-${state.event}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [state.event]);
  const kinds = [...new Set(points.map((p) => p.event_type))];
  const step = (offset: number) => {
    if (!visible.length) return;
    const i = visible.findIndex((p) => p.id === state.event);
    select(visible[(i + offset + visible.length) % visible.length].id);
  };
  return (
    <section
      className="explorer places-map-explorer"
      aria-label="Recorded places explorer"
    >
      <div className="explorer-heading">
        <div>
          <h2>Places in the family record</h2>
          <p>Approximate recorded places; no traveled route is established.</p>
        </div>
        <MapPin size={22} className="hidden sm:block text-stone-500" />
      </div>
      <div className="places-map-body">
        <div className="places-map-stage">
          <div ref={host} className="places-map-canvas" />
          {fallback ? (
            <div className="places-map-fallback" role="status">
              The map is unavailable.
              <br />
              All records and source links remain available in the event list.
            </div>
          ) : (
            <div className="places-map-controls">
              <div>
                <button onClick={() => api.current?.fit(visible)}>
                  All places
                </button>
                <button
                  onClick={() =>
                    api.current?.fit(
                      visible.filter(
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
                      visible.filter(
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
            </div>
          )}
          {tileError && (
            <p className="map-tile-error" role="status">
              Some map tiles could not load. The event list remains available.
            </p>
          )}
        </div>
        <aside className="places-map-events" aria-label="Recorded events">
          <div className="event-filters">
            <label>
              Event{" "}
              <select
                aria-label="Filter event kind"
                value={state.kind}
                onChange={(e) => onChange({ ...state, kind: e.target.value })}
              >
                <option value="all">All kinds</option>
                {kinds.map((k) => (
                  <option key={k} value={k}>
                    {k.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={state.undated}
                onChange={(e) =>
                  onChange({ ...state, undated: e.target.checked })
                }
              />{" "}
              Include undated
            </label>
            <div className="event-navigation w-full">
              <button
                aria-label="Previous event"
                onClick={() => step(-1)}
                disabled={!visible.length}
              >
                <ChevronLeft size={16} />
              </button>
              <span>
                {visible.length} records ·{" "}
                {visible.filter((p) => !p.coordinates).length} unresolved
                locations
              </span>
              <button
                aria-label="Next event"
                onClick={() => step(1)}
                disabled={!visible.length}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <ol className="event-list">
            {visible.map((p) => (
              <li key={p.id} id={`event-${p.id}`}>
                <button
                  className="event-select"
                  aria-pressed={state.event === p.id}
                  onClick={() => select(p.id)}
                >
                  <strong>{p.name}</strong>
                  <small>
                    {p.date_label} · {p.event_type.replaceAll("_", " ")}
                    {!p.coordinates ? " · Location unresolved" : ""}
                  </small>
                </button>
                {state.event === p.id && (
                  <div className="event-detail">
                    {expanded && (
                      <>
                        <p>{p.description}</p>
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
                                onClick={() => {
                                  const next = {
                                    ...state,
                                    kind: "all",
                                    undated: true,
                                    event: other.id,
                                    camera: null,
                                  };
                                  latest.current.state = next;
                                  onChange(next);
                                  api.current?.focus(other);
                                }}
                              >
                                Also recorded here: {other.name} ·{" "}
                                {other.date_label}
                              </button>
                            ))}
                        <p className="evidence">
                          {p.evidence} · {p.coordinate_precision}
                          {p.coordinates ? " coordinates" : " location"}. Dates
                          retain the record’s uncertainty.
                        </p>
                        <button
                          className="source-link"
                          onClick={() => onNavigate?.(p.page_ref)}
                        >
                          Read page {Number(p.page_ref.slice(4))}, columns{" "}
                          {p.column_refs.join(", ")} →
                        </button>
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
          {!visible.length && (
            <p className="p-4 text-sm">No records match these filters.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
