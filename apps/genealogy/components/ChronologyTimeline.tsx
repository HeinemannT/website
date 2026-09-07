import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import type { MigrationPoint } from "../types";
import {
  adjacentRecord,
  chronologicalRecords,
  chronologyBounds,
  PLAYBACK_DELAY,
  recordAtYear,
} from "../utils/chronology.mjs";

interface Props {
  records: MigrationPoint[];
  year: number;
  selected: string;
  interaction: number;
  onSelect: (id: string, automatic?: boolean) => void;
  onYear: (year: number) => void;
}
export default function ChronologyTimeline({
  records,
  year,
  selected,
  interaction,
  onSelect,
  onYear,
}: Props) {
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;
  const dated = useMemo(() => chronologicalRecords(records), [records]);
  const bounds = useMemo(() => chronologyBounds(records), [records]);
  const [playing, setPlaying] = useState(false);
  const current = records.find((r) => r.id === selected);
  useEffect(() => {
    setPlaying(false);
  }, [interaction]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  useEffect(() => {
    if (!playing || document.hidden) return;
    const timer = window.setTimeout(() => {
      const next = adjacentRecord(dated, selected, year, 1);
      if (next) selectRef.current(next.id, true);
      else setPlaying(false);
    }, PLAYBACK_DELAY);
    return () => window.clearTimeout(timer);
  }, [playing, dated, selected, year]);
  if (!bounds)
    return (
      <div className="chronology-empty">
        No dated records. Undated records remain in the list.
      </div>
    );
  const prev = adjacentRecord(dated, selected, year, -1),
    next = adjacentRecord(dated, selected, year, 1);
  const stop = () => setPlaying(false);
  const choose = (id: string) => {
    stop();
    onSelect(id);
  };
  const ticks = [...new Set<number>(dated.map((r: MigrationPoint) => r.year!))];
  const undated = records.find((r) => r.year === null);
  const percent = (value: number) =>
    bounds.max === bounds.min
      ? 0
      : ((value - bounds.min) / (bounds.max - bounds.min)) * 100;
  return (
    <section className="chronology" aria-label="Family chronology">
      <div className="chronology-current">
        <div className="chronology-year">
          {current && current.year !== year ? (
            <>
              <small>Year cursor</small>
              {year}
            </>
          ) : (
            year
          )}
        </div>
        <div
          className="chronology-caption"
          aria-live={playing ? "off" : "polite"}
        >
          <strong>{current?.name ?? "Explore the family chronology"}</strong>
          <span>
            {current?.date_label ??
              "Drag the year slider or select a dated record."}
            {current && !current.coordinates ? " · Location unrecorded" : ""}
          </span>
        </div>
        <div className="chronology-buttons">
          <button
            aria-label="Reset timeline"
            onClick={() => choose(dated[0].id)}
          >
            <RotateCcw size={16} />
          </button>
          <button
            aria-label="Previous dated record"
            disabled={!prev}
            onClick={() => prev && choose(prev.id)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label={playing ? "Pause timeline" : "Play timeline"}
            onClick={() => {
              if (playing) {
                stop();
                return;
              }
              if (!next) onSelect(dated[0].id, true);
              setPlaying(true);
            }}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            aria-label="Next dated record"
            disabled={!next}
            onClick={() => next && choose(next.id)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="chronology-track">
        <div className="chronology-ticks" aria-hidden="true">
          {ticks.map((value) => (
            <span
              key={value}
              style={{ left: `${percent(value)}%` }}
              title={String(value)}
            />
          ))}
        </div>
        <input
          type="range"
          aria-label="Timeline year"
          aria-valuetext={`${year}, ${recordAtYear(dated, year)?.name ?? "no dated record"}`}
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={year}
          disabled={bounds.min === bounds.max}
          onPointerDown={stop}
          onKeyDown={stop}
          onChange={(e) => {
            stop();
            onYear(Number(e.target.value));
          }}
        />
        <div className="chronology-scale">
          <span>{bounds.min}</span>
          {undated && (
            <button
              className="chronology-undated"
              onClick={() => choose(undated.id)}
            >
              Undated / unresolved records
            </button>
          )}
          <span>{bounds.max}</span>
        </div>
      </div>
    </section>
  );
}
