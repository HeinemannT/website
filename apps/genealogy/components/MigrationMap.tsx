import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { MigrationPoint, MigrationPath } from '../types';
import { escapeHtml, nextTimelineYear, timelineBounds, visibleEvents } from '../utils/evidence.mjs';

interface Props {
  points: MigrationPoint[];
  paths: MigrationPath[];
  isDarkMode: boolean;
  onNavigate?: (pageId: string) => void;
}

export default function MigrationMap({ points, isDarkMode, onNavigate }: Props) {
  const bounds = useMemo(() => timelineBounds(points), [points]);
  const [year, setYear] = useState(bounds?.min ?? 0);
  const [playing, setPlaying] = useState(false);
  const [showUndated, setShowUndated] = useState(true);
  const [showList, setShowList] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, L.CircleMarker>());
  const visible = useMemo(() => visibleEvents(points, year, showUndated), [points, year, showUndated]);
  const latest = visible.filter(p => p.year !== null).at(-1);
  useEffect(() => { map.current?.invalidateSize(); }, [showList]);
  useEffect(() => {
    if (latest?.coordinates) map.current?.setView([latest.coordinates.lat, latest.coordinates.lng], latest.year! > 1900 ? 7 : 9);
  }, [latest?.id]);

  useEffect(() => { setYear(bounds?.min ?? 0); setPlaying(false); }, [bounds]);
  useEffect(() => {
    if (!container.current) return;
    const instance = L.map(container.current, { center: [23, 113.1], zoom: 8 });
    map.current = instance;
    return () => { instance.remove(); map.current = null; };
  }, []);
  useEffect(() => {
    if (!map.current) return;
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 16,
    }).addTo(map.current);
    return () => { tiles.remove(); };
  }, [isDarkMode]);
  useEffect(() => {
    if (!map.current) return;
    markers.current.forEach(marker => marker.remove());
    markers.current.clear();
    visible.forEach(point => {
      if (!point.coordinates) return;
      const marker = L.circleMarker([point.coordinates.lat, point.coordinates.lng], {
        radius: 7, color: isDarkMode ? '#f87171' : '#a63434', weight: 2,
        fillOpacity: point.year === null ? 0.2 : 0.8,
      }).addTo(map.current!);
      marker.bindTooltip(escapeHtml(`${point.name} · ${point.event_type.replaceAll('_', ' ')}`));
      marker.bindPopup(`<strong>${escapeHtml(point.name)}</strong><p>${escapeHtml(point.date_label)}</p><p>${escapeHtml(point.description)}</p><p>${escapeHtml(point.evidence)} · ${escapeHtml(point.coordinate_precision)} coordinates</p><p>Source: ${escapeHtml(point.page_ref)}, columns ${point.column_refs.join(', ')}</p>`);
      markers.current.set(point.id, marker);
    });
  }, [visible, isDarkMode]);
  useEffect(() => {
    if (!playing || !bounds) return;
    const interval = window.setInterval(() => setYear(current => {
      const next = nextTimelineYear(current, bounds);
      if (next === bounds.max) setPlaying(false);
      return next!;
    }), 90);
    return () => window.clearInterval(interval);
  }, [playing, bounds]);

  const focusPoint = (point: MigrationPoint) => {
    if (point.coordinates) {
      map.current?.setView([point.coordinates.lat, point.coordinates.lng], point.year && point.year > 1900 ? 8 : 10);
      markers.current.get(point.id)?.openPopup();
    }
  };
  return <div className="relative w-full h-full flex flex-col bg-stone-100 dark:bg-zinc-950">
    <div className="p-3 md:pt-28 border-b border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm z-10">
      <div className="flex flex-wrap items-center gap-3">
        <strong>Places and recorded events</strong>
        <label className="flex items-center gap-2"><input type="checkbox" checked={showUndated} onChange={e => setShowUndated(e.target.checked)} /> Include undated events ({points.filter(p => p.year === null).length})</label>
        <button className="underline" onClick={() => setShowList(value => !value)}>{showList ? 'Hide event list' : 'Show event list'}</button>
      </div>
      <p className="mt-1 text-stone-600 dark:text-zinc-400">Markers identify approximate areas. Events include burials, property, offices and travel; no traveled route is established.</p>
    </div>
    <div className="relative flex-1 min-h-0 flex">
      <div ref={container} className="flex-1 min-w-0 z-0" aria-label="Map of recorded places" />
      {showList && <div className="absolute md:relative right-0 top-0 bottom-0 w-64 max-w-[65%] overflow-y-auto border-l border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm z-10 p-3">
        {!visible.length && <p>No events in this selection.</p>}
        <ol className="space-y-4">
          {visible.map(point => <li key={point.id}>
            <button className="font-semibold text-left underline" onClick={() => focusPoint(point)} disabled={!point.coordinates}>{point.name}</button>
            <p className="text-stone-600 dark:text-zinc-400">{point.event_type.replaceAll('_', ' ')} · {point.date_label}</p>
            <p className="mt-1">{point.description}</p>
            <p className="mt-1 text-stone-600 dark:text-zinc-400">{point.evidence}; {point.coordinate_precision}{point.coordinates ? ' coordinates' : ' location'}</p>
            <button className="mt-1 underline text-cinnabar dark:text-red-400" onClick={() => onNavigate?.(point.page_ref)}>Page {Number(point.page_ref.slice(4))}, columns {point.column_refs.join(', ')}</button>
          </li>)}
        </ol>
      </div>}
    </div>
    <div className="p-4 border-t border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10">
      <div className="flex items-center gap-3 mb-2">
        <button disabled={!bounds || bounds.min === bounds.max} aria-label={playing ? 'Pause timeline' : 'Play timeline'} className="p-2 border rounded disabled:opacity-40" onClick={() => { if(bounds && year>=bounds.max)setYear(bounds.min);setPlaying(value=>!value); }}>{playing ? <Pause size={18}/> : <Play size={18}/>}</button>
        <button disabled={!bounds} aria-label="Reset timeline" className="p-2 border rounded disabled:opacity-40" onClick={() => {setYear(bounds?.min ?? 0);setPlaying(false);}}><RotateCcw size={18}/></button>
        <span>{bounds ? `${year} · ${latest?.name ?? 'Start of dated records'}` : 'No dated events; undated records remain available.'}</span>
      </div>
      {bounds && <input className="w-full accent-cinnabar" type="range" aria-label="Timeline year" min={bounds.min} max={bounds.max} value={year} disabled={bounds.min===bounds.max} onChange={e=>{setPlaying(false);setYear(Number(e.target.value));}}/>}
    </div>
  </div>;
}
