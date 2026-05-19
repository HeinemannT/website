import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MigrationPoint, MigrationPath } from '../types';
import L from 'leaflet';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface MigrationMapProps {
  points: MigrationPoint[];
  paths: MigrationPath[];
  isDarkMode: boolean;
}

const MIN_YEAR = 1290;
const MAX_YEAR = 1955;
const PLAY_TICK_MS = 70;
const PLAY_STEP_YEARS = 4; // ~57 years/sec — full timeline plays in ~12s

// --- TILE LAYERS ---
const TILE_LIGHT_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}';
const TILE_LIGHT_ATTR = 'Tiles &copy; Esri &mdash; National Geographic';
const TILE_DARK_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_DARK_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Dynasty boundaries shown as tick marks on the timeline slider.
const DYNASTY_MARKS = [
  { year: 1368, label: 'Ming' },
  { year: 1644, label: 'Qing' },
  { year: 1912, label: 'Republic' },
];

// --- ICONS (SVG STRINGS) ---
const ICON_ANCIENT = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 2L12 9"></path>
    <path d="M12 15L12 22"></path>
    <path d="M2 12L9 12"></path>
    <path d="M15 12L22 12"></path>
    <path d="M18.36 5.64L16.24 7.76"></path>
    <path d="M7.76 16.24L5.64 18.36"></path>
    <path d="M18.36 18.36L16.24 16.24"></path>
    <path d="M7.76 7.76L5.64 5.64"></path>
  </svg>
`;

const ICON_NAV = `
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
`;

// Quadratic bezier curve between two coords — gives the migration paths a graceful arc.
const getCurvedPathPoints = (
  start: { lat: number, lng: number },
  end: { lat: number, lng: number }
): [number, number][] => {
  const { lat: lat1, lng: lng1 } = start;
  const { lat: lat2, lng: lng2 } = end;
  const offsetX = lng2 - lng1;
  const offsetY = lat2 - lat1;
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  const curveIntensity = 0.2;
  const controlLat = midLat - (offsetX * curveIntensity);
  const controlLng = midLng + (offsetY * curveIntensity);

  const points: [number, number][] = [];
  const steps = 45;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;
    points.push([lat, lng]);
  }
  return points;
};

const MigrationMap: React.FC<MigrationMapProps> = ({ points, paths, isDarkMode }) => {
  const [currentYear, setCurrentYear] = useState<number>(MIN_YEAR);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Refs to hold Leaflet instances
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const lastFlyTargetIdRef = useRef<string | null>(null);
  const playIntervalRef = useRef<number | null>(null);
  // Mirror of currentYear for the prep effect to consult without re-running on each tick.
  const currentYearRef = useRef<number>(MIN_YEAR);
  useEffect(() => { currentYearRef.current = currentYear; }, [currentYear]);

  // Cache for map objects to avoid re-creating them
  type CachedLayer = { layer: L.Layer; year: number; type: 'point' | 'path' };
  const staticLayersRef = useRef<{ [key: string]: CachedLayer }>({});
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const linesLayerRef = useRef<L.LayerGroup | null>(null);

  const visiblePoints = useMemo(() => {
    return [...points].filter(p => p.year <= currentYear).sort((a, b) => a.year - b.year);
  }, [points, currentYear]);

  const currentEra = useMemo(() => {
    if (currentYear < 1368) return "Yuan Dynasty";
    if (currentYear < 1644) return "Ming Dynasty";
    if (currentYear < 1912) return "Qing Dynasty";
    return "Republic / Modern";
  }, [currentYear]);

  // 1. Initialize Map (tile layer is added in a separate effect so dark mode can swap it).
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [25.4310, 119.0077],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
    });

    const linesLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersLayerRef.current = markersLayer;
    linesLayerRef.current = linesLayer;

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Swap tile layer when dark mode toggles.
  useEffect(() => {
    if (!mapRef.current) return;
    if (tileLayerRef.current) tileLayerRef.current.remove();
    tileLayerRef.current = L.tileLayer(
      isDarkMode ? TILE_DARK_URL : TILE_LIGHT_URL,
      {
        maxZoom: 16,
        attribution: isDarkMode ? TILE_DARK_ATTR : TILE_LIGHT_ATTR,
      }
    ).addTo(mapRef.current);
  }, [isDarkMode]);

  // 2. Pre-calculate Layers (Run when data or dark mode changes — paths recolor).
  useEffect(() => {
    if (!mapRef.current || !points.length) return;

    const newStaticLayers: { [key: string]: CachedLayer } = {};

    // --- PREPARE POINTS ---
    points.forEach((point) => {
      const isModern = point.year > 1900;
      const bgColor = isModern ? 'bg-blue-600' : 'bg-cinnabar';
      const iconSvg = isModern ? ICON_NAV : ICON_ANCIENT;

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="relative group" style="transform: translate(-50%, -50%);">
            <div id="icon-${point.id}" class="migration-marker w-8 h-8 ${bgColor} text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-800 transition-transform hover:scale-110">
              ${iconSvg}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([point.coordinates.lat, point.coordinates.lng], { icon: customIcon });

      // Hover tooltip — small "year · name" chip so identification doesn't require a click.
      marker.bindTooltip(`${point.year} · ${point.name}`, {
        direction: 'top',
        offset: [0, -12],
        className: 'migration-tooltip',
        opacity: 1,
      });

      const popupContent = `
        <div class="p-3 text-center min-w-[150px]">
          <div class="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">${point.year}</div>
          <div class="text-sm font-bold text-ink dark:text-zinc-100 font-serif-tc mb-1">${point.name}</div>
          <div class="text-xs text-stone-500 dark:text-zinc-400 leading-tight">${point.description}</div>
        </div>
      `;
      marker.bindPopup(popupContent, { closeButton: false });

      newStaticLayers[`p-${point.id}`] = { layer: marker, year: point.year, type: 'point' };
    });

    // --- PREPARE PATHS ---
    paths.forEach((path) => {
      const from = points.find(p => p.id === path.fromId);
      const to = points.find(p => p.id === path.toId);
      if (!from || !to) return;
      const curvedPoints = getCurvedPathPoints(from.coordinates, to.coordinates);
      const polyline = L.polyline(curvedPoints, {
        color: isDarkMode ? '#F87171' : '#A63434',
        weight: 2,
        opacity: 0.8,
        className: 'migration-line-anim',
      });
      const pathYear = path.year || to.year;
      newStaticLayers[`l-${path.fromId}-${path.toId}`] = { layer: polyline, year: pathYear, type: 'path' };
    });

    staticLayersRef.current = newStaticLayers;

    // Re-seed the layer groups based on the current year. Without this, toggling dark mode
    // (which re-runs this effect to recolor paths) would leave the *previous* marker
    // instances attached and the new ones absent — the visibility effect below only runs
    // on year changes, so it wouldn't fire here.
    markersLayerRef.current?.clearLayers();
    linesLayerRef.current?.clearLayers();
    Object.values(newStaticLayers).forEach((item) => {
      if (item.year <= currentYearRef.current) {
        const group = item.type === 'point' ? markersLayerRef.current : linesLayerRef.current;
        group?.addLayer(item.layer);
      }
    });
  }, [points, paths, isDarkMode]);

  // 3. Render loop — toggle visibility, mark the latest point as "is-latest" for the pulse ring,
  // and fly the camera to the newest visible point.
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current || !linesLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    const linesLayer = linesLayerRef.current;

    Object.values(staticLayersRef.current).forEach((item: CachedLayer) => {
      const isVisible = item.year <= currentYear;
      const layerGroup = item.type === 'point' ? markersLayer : linesLayer;
      if (isVisible) {
        if (!layerGroup.hasLayer(item.layer)) layerGroup.addLayer(item.layer);
      } else {
        if (layerGroup.hasLayer(item.layer)) layerGroup.removeLayer(item.layer);
      }
    });

    const latestVisible = visiblePoints[visiblePoints.length - 1];

    // Pulse ring on the newest revealed point.
    document.querySelectorAll('.migration-marker.is-latest').forEach(el => el.classList.remove('is-latest'));
    if (latestVisible) {
      const el = document.getElementById(`icon-${latestVisible.id}`);
      if (el) el.classList.add('is-latest');
    }

    // Fly to the latest target only when it changes.
    if (latestVisible && mapRef.current && lastFlyTargetIdRef.current !== latestVisible.id) {
      lastFlyTargetIdRef.current = latestVisible.id;
      mapRef.current.flyTo(
        [latestVisible.coordinates.lat, latestVisible.coordinates.lng],
        latestVisible.year > 1900 ? 5 : 8,
        { duration: 1.5, easeLinearity: 0.25 }
      );
    }
    // isDarkMode in deps: when the prep effect rebuilds markers on dark-mode toggle,
    // we need to re-apply .is-latest to the newly-created marker DOM.
  }, [currentYear, visiblePoints, isDarkMode]);

  // 4. Auto-play timeline — interval advances the year while isPlaying is true.
  useEffect(() => {
    if (!isPlaying) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      return;
    }
    playIntervalRef.current = window.setInterval(() => {
      setCurrentYear(y => {
        if (y >= MAX_YEAR) {
          setIsPlaying(false);
          return MAX_YEAR;
        }
        return Math.min(MAX_YEAR, y + PLAY_STEP_YEARS);
      });
    }, PLAY_TICK_MS);
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentYear(MIN_YEAR);
    lastFlyTargetIdRef.current = null;
  };

  // If the user scrubs the slider manually, pause auto-play.
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentYear(Number(e.target.value));
    if (isPlaying) setIsPlaying(false);
  };

  const atEnd = currentYear >= MAX_YEAR;

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* --- TIMELINE CONTROLS --- */}
      <div className="absolute bottom-24 md:bottom-8 left-4 right-4 md:left-12 md:right-12 z-40">
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-stone-200 dark:border-zinc-800 rounded-xl p-4 shadow-xl">
          <div className="flex justify-between items-end mb-3 gap-4">
            <div>
              <div className="flex items-center gap-2 text-cinnabar dark:text-red-400 font-bold uppercase tracking-widest text-xs mb-1">
                <Clock size={14} />
                <span>Timeline</span>
              </div>
              <div className="text-2xl font-bold text-ink dark:text-zinc-100">
                {currentYear} <span className="text-base font-normal text-stone-400 dark:text-zinc-500 italic ml-2">{currentEra}</span>
              </div>
            </div>

            {/* Play / Pause / Reset */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (atEnd) handleReset();
                  setIsPlaying(p => atEnd ? true : !p);
                }}
                aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-cinnabar text-white shadow-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-[1px]" />}
              </button>
              <button
                onClick={handleReset}
                aria-label="Reset timeline"
                disabled={currentYear === MIN_YEAR && !isPlaying}
                className="w-10 h-10 rounded-full flex items-center justify-center text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar/60"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="hidden md:block text-right">
              <div className="text-xs text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Latest Migration</div>
              <div className="text-sm font-medium text-ink dark:text-zinc-300 truncate max-w-[18ch]">
                {visiblePoints[visiblePoints.length - 1]?.name || "Origins"}
              </div>
            </div>
          </div>

          {/* Slider + dynasty tick marks */}
          <div className="relative pb-5">
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={currentYear}
              onChange={handleSliderChange}
              aria-label="Year"
              aria-valuetext={`${currentYear}, ${currentEra}`}
              className="
                w-full h-1 bg-stone-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer
                accent-cinnabar dark:accent-red-500
                hover:accent-red-700 dark:hover:accent-red-400
                focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900
              "
            />
            {/* Dynasty markers under the slider */}
            <div className="absolute inset-x-0 top-3 pointer-events-none select-none">
              {DYNASTY_MARKS.map(m => (
                <div
                  key={m.year}
                  className="absolute -top-[5px]"
                  style={{ left: `${((m.year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%` }}
                >
                  <div className="w-px h-2.5 bg-stone-400/70 dark:bg-zinc-500/70 mx-auto" />
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider font-medium text-stone-500 dark:text-zinc-500 whitespace-nowrap">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAP CONTAINER */}
      <div className="flex-1 w-full relative bg-[#e6dccf] dark:bg-zinc-900">
        <div ref={mapContainerRef} className="absolute inset-0 z-0 outline-none" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-stone-100/20 dark:to-zinc-950/20 mix-blend-multiply z-20"></div>
      </div>
    </div>
  );
};

export default MigrationMap;
