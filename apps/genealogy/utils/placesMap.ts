import L from "leaflet";
import { focusZoom } from "./explorers.mjs";
import { hasCoordinates } from "./chronology.mjs";
import type { MigrationPoint, PlaceConnection } from "../types";

export type MapCamera = [number, number, number];
interface Options {
  camera: MapCamera | null;
  onSelect: (id: string) => void;
  onRest: (camera: MapCamera) => void;
  onTileError: () => void;
}

/** Marker objects and DOM paths survive selection for the map lifetime. */
export function createPlacesMap(host: HTMLDivElement, options: Options) {
  const camera = options.camera ?? [23.02, 113.13, 9];
  const map = L.map(host, {
    center: [camera[0], camera[1]],
    zoom: camera[2],
    zoomControl: false,
    scrollWheelZoom: true,
  });
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  tiles.on("tileerror", options.onTileError);
  L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);
  const markers = new Map<string, L.CircleMarker>();
  const paths = new Map<string, L.Polyline>();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let suppressRest = false;
  let pendingFocus: MigrationPoint | null = null;
  const moveEnd = () => {
    if (suppressRest) return;
    const c = map.getCenter();
    if (pendingFocus && (Math.abs(c.lat - pendingFocus.coordinates.lat) > 0.000001 ||
      Math.abs(c.lng - pendingFocus.coordinates.lng) > 0.000001 || map.getZoom() !== focusZoom(pendingFocus))) return;
    pendingFocus = null;
    options.onRest([c.lat, c.lng, map.getZoom()]);
  };
  map.on("moveend", moveEnd);
  // Leaflet stop() can synchronously emit moveend for an interrupted flight.
  // Do not let that old camera overwrite a newly selected event's pending focus.
  const cancelFlight = () => {
    suppressRest = true;
    try { map.stop(); } finally { suppressRest = false; }
  };
  const manualMove = () => {
    pendingFocus = null;
    map.stop();
  };
  host.addEventListener("pointerdown", manualMove);
  host.addEventListener("wheel", manualMove, { passive: true });
  host.addEventListener("keydown", manualMove);
  const stop = () => {
    if (document.hidden || reduced.matches) manualMove();
  };
  document.addEventListener("visibilitychange", stop);
  reduced.addEventListener("change", stop);
  const observer = new ResizeObserver(() => {
    const target = pendingFocus;
    suppressRest = true;
    try { map.invalidateSize({ pan: false, animate: false }); }
    finally { suppressRest = false; }
    // A legend/list layout change can interrupt Leaflet's flight while resizing.
    if (target) focus(target);
  });
  observer.observe(host);
  function focus(point: MigrationPoint) {
    cancelFlight();
    pendingFocus = null;
    if (!hasCoordinates(point)) {
      moveEnd();
      return;
    }
    const target: [number, number] = [
      point.coordinates.lat,
      point.coordinates.lng,
    ];
    const zoom = focusZoom(point)!;
    pendingFocus = point;
    if (reduced.matches) map.setView(target, zoom, { animate: false });
    else map.flyTo(target, zoom, { duration: 1.1 });
    moveEnd(); // Also persists a same-position selection when Leaflet emits no event.
  }
  function update(
    points: MigrationPoint[],
    selected: string,
    dark: boolean,
    reached: Set<string>,
    connections: PlaceConnection[] = [],
  ) {
    const allIds = new Set(points.filter(hasCoordinates).map((p) => p.id));
    for (const [id, marker] of markers)
      if (!allIds.has(id)) {
        marker.remove();
        markers.delete(id);
      }
    for (const point of points) {
      if (!hasCoordinates(point)) continue;
      let marker = markers.get(point.id);
      if (!marker) {
        marker = L.circleMarker(
          [point.coordinates.lat, point.coordinates.lng],
          { radius: 7, weight: 2 },
        );
        const label = document.createElement("span");
        label.textContent = `${point.name} · ${point.date_label}`;
        marker.bindTooltip(label, { direction: "top" });
        marker.on("click", () => options.onSelect(point.id));
        markers.set(point.id, marker);
      }
      marker.setStyle({
        color: point.id === selected ? "#6f211f" : dark ? "#b64036" : "#a63434",
        fillColor: point.id === selected ? "#fff5cd" : "#c45a4a",
        fillOpacity: point.year === null ? 0.45 : 0.85,
        weight: point.id === selected ? 3 : 2,
      });
      marker.setRadius(point.id === selected ? 10 : 7);
      if (reached.has(point.id)) {
        if (!map.hasLayer(marker)) marker.addTo(map);
      } else marker.remove();
      if (point.id === selected && reached.has(point.id)) {
        marker.bringToFront();
        marker.openTooltip();
      } else marker.closeTooltip();
    }
    const activePaths = new Set(connections.map((c) => c.id));
    for (const [id, path] of paths) {
      if (!activePaths.has(id)) path.remove();
    }
    for (const connection of connections) {
      const from = points.find((p) => p.id === connection.fromId);
      const to = points.find((p) => p.id === connection.toId);
      if (!hasCoordinates(from) || !hasCoordinates(to)) continue;
      let path = paths.get(connection.id);
      if (!path) {
        path = L.polyline([
          [from.coordinates.lat, from.coordinates.lng],
          [to.coordinates.lat, to.coordinates.lng],
        ], { weight: 2, dashArray: "6 6", interactive: false });
        paths.set(connection.id, path);
      }
      path.setStyle({ color: dark ? "#e0a19a" : "#6f211f", opacity: 0.8 });
      if (!map.hasLayer(path)) path.addTo(map);
      path.bringToBack();
    }
  }
  function fit(points: MigrationPoint[]) {
    const coordinates = points.flatMap((p) =>
      hasCoordinates(p)
        ? [[p.coordinates.lat, p.coordinates.lng] as [number, number]]
        : [],
    );
    if (!coordinates.length) return;
    pendingFocus = null;
    cancelFlight();
    map.fitBounds(coordinates, {
      padding: [35, 60],
      maxZoom: 9,
      animate: !reduced.matches,
      duration: 0.5,
    });
  }
  return {
    update,
    focus,
    fit,
    zoom: (offset: number) => {
      pendingFocus = null;
      cancelFlight();
      map.setZoom(map.getZoom() + offset, { animate: !reduced.matches });
    },
    dispose: () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", stop);
      reduced.removeEventListener("change", stop);
      host.removeEventListener("pointerdown", manualMove);
      host.removeEventListener("wheel", manualMove);
      host.removeEventListener("keydown", manualMove);
      map.off("moveend", moveEnd);
      map.remove();
      markers.clear();
      paths.clear();
    },
  };
}
