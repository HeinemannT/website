import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MigrationPoint, MigrationPath } from '../types';
import L from 'leaflet';
import { Clock } from 'lucide-react';

interface MigrationMapProps {
  points: MigrationPoint[];
  paths: MigrationPath[];
  isDarkMode: boolean;
}

const MIN_YEAR = 1290;
const MAX_YEAR = 1955;

// --- TILE LAYERS ---
const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}';
const ATTR_TXT = 'Tiles &copy; Esri &mdash; National Geographic';

// --- ICONS (SVG STRINGS) ---
const ICON_ANCHOR = `
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="5" r="3"/><line x1="12" x2="12" y1="22" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
  </svg>
`;

const ICON_NAV = `
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
`;

// Helper to calculate quadratic bezier curve points for a nicer path
const getCurvedPathPoints = (
  start: { lat: number, lng: number },
  end: { lat: number, lng: number }
): [number, number][] => {
  const lat1 = start.lat;
  const lng1 = start.lng;
  const lat2 = end.lat;
  const lng2 = end.lng;

  // Calculate a control point that creates a curve
  // We offset the midpoint perpendicularly
  const offsetX = lng2 - lng1;
  const offsetY = lat2 - lat1;
  
  // Midpoint
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  // Perpendicular vector (-y, x) scaled by 0.15 (15% curve)
  // We check direction to ensure curve always "pops" nicely
  const curveIntensity = 0.2;
  const controlLat = midLat - (offsetX * curveIntensity);
  const controlLng = midLng + (offsetY * curveIntensity);

  const points: [number, number][] = [];
  const steps = 30; // Smoothness

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic Bezier: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;
    points.push([lat, lng]);
  }

  return points;
};

const MigrationMap: React.FC<MigrationMapProps> = ({ points, paths, isDarkMode }) => {
  const [currentYear, setCurrentYear] = useState<number>(MIN_YEAR);
  
  // Refs to hold Leaflet instances
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const linesLayerRef = useRef<L.LayerGroup | null>(null);

  const visiblePoints = useMemo(() => {
    return points.filter(p => p.year <= currentYear);
  }, [points, currentYear]);

  const currentEra = useMemo(() => {
    if (currentYear < 1368) return "Yuan Dynasty";
    if (currentYear < 1644) return "Ming Dynasty";
    if (currentYear < 1912) return "Qing Dynasty";
    return "Republic / Modern";
  }, [currentYear]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [25.4310, 119.0077],
      zoom: 6,
      zoomControl: false, 
      attributionControl: false 
    });

    // Add Tile Layer
    const tileLayer = L.tileLayer(TILE_URL, {
      maxZoom: 16,
      attribution: ATTR_TXT
    }).addTo(map);

    // Add Layer Groups
    // Lines first so they appear UNDER markers
    const linesLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    // Store refs
    mapRef.current = map;
    tileLayerRef.current = tileLayer;
    markersLayerRef.current = markersLayer;
    linesLayerRef.current = linesLayer;

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); 

  // 2. Render Markers and Lines based on Timeline
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current || !linesLayerRef.current) return;

    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    const linesLayer = linesLayerRef.current;

    // Clear existing
    markersLayer.clearLayers();
    linesLayer.clearLayers();

    // --- DRAW CURVED LINES ---
    paths.forEach(path => {
       if (path.year > currentYear) return;

       const from = points.find(p => p.id === path.fromId);
       const to = points.find(p => p.id === path.toId);

       if (from && to) {
         const curvedPoints = getCurvedPathPoints(from.coordinates, to.coordinates);
         
         L.polyline(curvedPoints, {
             color: isDarkMode ? '#F87171' : '#A63434',
             weight: 2,
             opacity: 0.8,
             className: 'migration-line-anim' // Uses CSS keyframes from index.html
           }
         ).addTo(linesLayer);
       }
    });

    // --- DRAW MARKERS ---
    visiblePoints.forEach((point, index) => {
      const isLatest = index === visiblePoints.length - 1;
      const isModern = point.year > 1900;
      
      const bgColor = isModern ? 'bg-blue-600' : 'bg-cinnabar';
      const iconSvg = isModern ? ICON_NAV : ICON_ANCHOR;
      
      // Custom HTML Marker
      const customIcon = L.divIcon({
        className: 'custom-div-icon', 
        html: `
          <div class="relative group" style="transform: translate(-50%, -50%);">
            <div class="w-8 h-8 ${bgColor} text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-800 transition-transform hover:scale-110 ${isLatest ? 'animate-bounce' : ''}">
              ${iconSvg}
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15] 
      });

      const marker = L.marker([point.coordinates.lat, point.coordinates.lng], { icon: customIcon });
      
      const popupContent = `
        <div class="p-3 text-center min-w-[150px]">
          <div class="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">${point.year}</div>
          <div class="text-sm font-bold text-ink dark:text-zinc-100 font-serif-tc mb-1">${point.name}</div>
          <div class="text-xs text-stone-500 dark:text-zinc-400 leading-tight">${point.description}</div>
        </div>
      `;
      marker.bindPopup(popupContent, { closeButton: false });
      
      markersLayer.addLayer(marker);
    });

    // --- CAMERA MOVEMENT ---
    const latestPoint = visiblePoints[visiblePoints.length - 1];
    if (latestPoint) {
      map.flyTo(
        [latestPoint.coordinates.lat, latestPoint.coordinates.lng], 
        latestPoint.year > 1900 ? 4 : 7, 
        { duration: 1.5 }
      );
    }

  }, [currentYear, points, paths, isDarkMode, visiblePoints]);

  return (
    <div className="relative w-full h-full flex flex-col">
        {/* --- TIMELINE CONTROLS (MOVED TO BOTTOM) --- */}
        <div className="absolute bottom-8 left-4 right-4 md:left-12 md:right-12 z-40">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-stone-200 dark:border-zinc-800 rounded-xl p-4 shadow-xl">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <div className="flex items-center gap-2 text-cinnabar dark:text-red-400 font-bold uppercase tracking-widest text-xs mb-1">
                            <Clock size={14} />
                            <span>Timeline</span>
                        </div>
                        <div className="text-2xl font-book font-bold text-ink dark:text-zinc-100">
                            {currentYear} <span className="text-base font-normal text-stone-400 dark:text-zinc-500 italic ml-2">{currentEra}</span>
                        </div>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-xs text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Latest Migration</div>
                        <div className="text-sm font-medium text-ink dark:text-zinc-300">
                            {visiblePoints[visiblePoints.length - 1]?.name || "Origins"}
                        </div>
                    </div>
                </div>

                <div className="relative h-6 flex items-center">
                    <input 
                        type="range"
                        min={MIN_YEAR}
                        max={MAX_YEAR}
                        value={currentYear}
                        onChange={(e) => setCurrentYear(Number(e.target.value))}
                        className="
                        w-full h-1 bg-stone-300 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer z-10
                        accent-cinnabar dark:accent-red-500
                        hover:accent-red-700 dark:hover:accent-red-400
                        "
                    />
                </div>
            </div>
        </div>

        {/* MAP CONTAINER */}
        <div className="flex-1 w-full relative bg-[#e6dccf] dark:bg-[#e6dccf]"> 
            {/* Kept explicit background color same as light mode for consistency as requested */}
            <div ref={mapContainerRef} className="absolute inset-0 z-0 outline-none" />
            
            {/* Overlay Gradient for vintage feel - adjusted to be consistent */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-stone-100/20 mix-blend-multiply z-20"></div>
        </div>
    </div>
  );
};

export default MigrationMap;