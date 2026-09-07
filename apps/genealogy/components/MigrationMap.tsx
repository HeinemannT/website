import React, { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { validSelection } from "../utils/explorers.mjs";
import { createPlacesMap, MapCamera } from "../utils/placesMap";
import type { MigrationPoint } from "../types";
import "leaflet/dist/leaflet.css";
import "../styles/explorers.css";
export interface MapState {
  event: string;
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
    const id = validSelection(points, state.event);
    if (id !== state.event) onChange({ ...state, event: id });
    api.current?.update(points, id, isDarkMode);
  }, [points, state.event, isDarkMode]);
  useEffect(() => {
    const point = points.find((p) => p.id === state.event);
    if (point && !state.camera) api.current?.focus(point);
  }, [state.event]);
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
        <div className="places-map-stage">
          <nav className="places-map-controls" aria-label="Map area and zoom">
            <div>
              <button onClick={() => api.current?.fit(points)}>
                All places
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
        </div>
        <aside className="places-map-events" aria-label="Recorded events">
          <h2 className="places-list-heading">Recorded places</h2>
          <ol className="event-list">
            {points.map((p) => (
              <li key={p.id} id={`event-${p.id}`}>
                <button
                  className="event-select"
                  aria-pressed={state.event === p.id}
                  onClick={() => select(p.id)}
                >
                  <strong>{p.name}</strong>
                  <small>
                    {p.year === null
                      ? "Undated"
                      : `${p.date_label.trim().startsWith("c.") ? "c. " : ""}${p.year}${p.year_end && p.year_end !== p.year ? `–${p.year_end}` : ""}`}
                    {!p.coordinates ? " · Location unresolved" : ""}
                  </small>
                </button>
                {state.event === p.id && (
                  <div className="event-detail">
                    {expanded && (
                      <>
                        <p className="event-date">
                          {p.date_label} · {p.event_type.replaceAll("_", " ")}
                        </p>
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
        </aside>
      </div>
    </section>
  );
}
