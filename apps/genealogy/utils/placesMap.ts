import L from "leaflet";
import { focusZoom } from "./explorers.mjs";
import type { MigrationPoint } from "../types";

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
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const moveEnd = () => {
    const c = map.getCenter();
    options.onRest([c.lat, c.lng, map.getZoom()]);
  };
  map.on("moveend", moveEnd);
  const stop = () => {
    if (document.hidden || reduced.matches) map.stop();
  };
  document.addEventListener("visibilitychange", stop);
  reduced.addEventListener("change", stop);
  const observer = new ResizeObserver(() =>
    map.invalidateSize({ pan: false, animate: false }),
  );
  observer.observe(host);
  function focus(point: MigrationPoint) {
    map.stop();
    if (!point.coordinates) return;
    const target: [number, number] = [
      point.coordinates.lat,
      point.coordinates.lng,
    ];
    const zoom = focusZoom(point)!;
    if (reduced.matches) map.setView(target, zoom, { animate: false });
    else map.flyTo(target, zoom, { duration: 1.1 });
  }
  function update(
    points: MigrationPoint[],
    selected: string,
    dark: boolean,
    reached: Set<string>,
  ) {
    const allIds = new Set(points.map((p) => p.id));
    for (const [id, marker] of markers)
      if (!allIds.has(id)) {
        marker.remove();
        markers.delete(id);
      }
    for (const point of points) {
      if (!point.coordinates) continue;
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
  }
  function fit(points: MigrationPoint[]) {
    const coordinates = points.flatMap((p) =>
      p.coordinates
        ? [[p.coordinates.lat, p.coordinates.lng] as [number, number]]
        : [],
    );
    if (!coordinates.length) return;
    map.stop();
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
      map.stop();
      map.setZoom(map.getZoom() + offset, { animate: !reduced.matches });
    },
    dispose: () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", stop);
      reduced.removeEventListener("change", stop);
      map.off("moveend", moveEnd);
      map.remove();
      markers.clear();
    },
  };
}
