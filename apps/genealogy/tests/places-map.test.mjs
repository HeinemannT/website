import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import { hasCoordinates } from "../utils/chronology.mjs";
import { focusZoom } from "../utils/explorers.mjs";

test("map cancels stale flights, reselects places, retains layers, and disposes listeners", (t) => {
  const globals = ["document", "matchMedia", "ResizeObserver"];
  const originals = globals.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  t.after(() => globals.forEach((key, i) => originals[i] ? Object.defineProperty(globalThis, key, originals[i]) : delete globalThis[key]));
  const events = new Map(), listeners = new Map(), layers = new Set(), rests = [];
  let center = { lat: 23, lng: 113 }, zoom = 9, flying = false, removed = false, disconnected = false;
  const flights = [], markers = [], paths = [];
  let resize;
  const reduced = { matches: false, addEventListener() {}, removeEventListener() {} };
  globalThis.matchMedia = () => reduced;
  globalThis.document = { hidden: false, addEventListener() {}, removeEventListener() {}, createElement: () => ({}) };
  globalThis.ResizeObserver = class { constructor(callback) { resize = callback; } observe() {} disconnect() { disconnected = true; } };
  const map = {
    on: (name, fn) => events.set(name, fn), off: (name) => events.delete(name),
    getCenter: () => center, getZoom: () => zoom,
    stop() { if (flying) { flying = false; events.get("moveend")?.(); } },
    flyTo(target, z) { flying = true; flights.push(target); zoom = z; },
    setView(target, z) { center = { lat: target[0], lng: target[1] }; zoom = z; events.get("moveend")?.(); },
    hasLayer: (layer) => layers.has(layer),
    invalidateSize() {}, fitBounds() {}, setZoom() {}, remove() { removed = true; },
  };
  const layer = () => ({
    addTo() { layers.add(this); return this; }, remove() { layers.delete(this); },
    bindTooltip() {}, on() {}, setStyle(style) { this.style = style; }, setRadius() {},
    bringToFront() {}, bringToBack() {}, openTooltip() {}, closeTooltip() {},
  });
  const leaflet = {
    map: () => map, tileLayer: () => ({ addTo() { return this; }, on() {} }),
    control: { scale: () => ({ addTo() {} }) },
    circleMarker: () => { const item = layer(); markers.push(item); return item; },
    polyline: () => { const item = layer(); paths.push(item); return item; },
  };
  const source = fs.readFileSync(new URL("../utils/placesMap.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  const exports = {};
  new Function("require", "exports", compiled)((name) => name === "leaflet" ? leaflet : name.includes("chronology") ? { hasCoordinates } : { focusZoom }, exports);
  const host = { addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: (name) => listeners.delete(name) };
  const api = exports.createPlacesMap(host, { camera: null, onRest: (c) => rests.push(c), onSelect() {}, onTileError() {} });
  const a = { id: "a", year: 1400, coordinates: { lat: 22, lng: 113 } };
  const b = { id: "b", year: 1955, coordinates: { lat: -32, lng: 27 } };
  api.focus(a);
  api.focus(b);
  assert.equal(rests.length, 0, "canceling the previous flight must not persist its camera");
  assert.deepEqual(flights, [[22, 113], [-32, 27]]);
  api.focus(b);
  assert.equal(flights.length, 3, "same-event reselection refocuses");
  resize();
  assert.deepEqual(flights.at(-1), [-32, 27], "resizing during a flight retains its requested destination");
  assert.equal(rests.length, 0);
  api.focus({ coordinates: null });
  assert.equal(flying, false);
  assert.equal(rests.length, 1, "unlocated records preserve the stopped camera");
  reduced.matches = true;
  api.focus(b);
  assert.deepEqual(rests.at(-1), [-32, 27, 11]);
  const connection = { id: "ab", fromId: "a", toId: "b" };
  api.update([a, b], "a", false, new Set(["a", "b"]), [connection]);
  api.update([a, b], "b", true, new Set(["a", "b"]), [connection]);
  assert.equal(markers.length, 2);
  assert.equal(paths.length, 1);
  api.update([a, b], "none", true, new Set(["a", "b"]), []);
  assert.equal(layers.has(paths[0]), false);
  api.update([a, b], "a", false, new Set(["a", "b"]), [connection]);
  assert.equal(paths.length, 1, "the same path instance is reused when the association returns");
  reduced.matches = false;
  api.focus(a);
  listeners.get("pointerdown")();
  assert.equal(flying, false, "manual pan can interrupt programmatic flights");
  api.focus(b);
  api.stop();
  assert.equal(flying, false, "an empty slider selection can stop without inventing coordinates");
  api.dispose();
  assert.equal(listeners.size, 0);
  assert.equal(events.size, 0);
  assert.ok(removed && disconnected);
});
