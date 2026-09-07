import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import yaml from "js-yaml";
import {
  adjacentRecord,
  chronologicalRecords,
  chronologyBounds,
  PLAYBACK_DELAY,
  reachedPlaces,
  recordAtYear,
} from "../utils/chronology.mjs";
import { explorerHash, parseExplorerHash } from "../utils/explorers.mjs";
const data = yaml.load(
  fs.readFileSync(new URL("../public/data.yaml", import.meta.url), "utf8"),
);
const additions = JSON.parse(
  fs.readFileSync(
    new URL("../public/chronology.json", import.meta.url),
    "utf8",
  ),
).points;
const full = [...data.migration.points, ...additions];

test("reviewed chronology merges 191 unique records, 175 dated and 16 unresolved, with valid cross-page sources", () => {
  assert.equal(full.length, 191);
  assert.equal(new Set(full.map((p) => p.id)).size, 191);
  assert.equal(chronologicalRecords(full).length, 175);
  assert.equal(full.filter((p) => p.year === null).length, 16);
  const pages = new Map(data.pages.map((p) => [p.page_id, p]));
  for (const p of additions) {
    assert.ok(
      p.name &&
        p.date_label &&
        p.description &&
        p.evidence &&
        p.coordinate_precision,
    );
    assert.ok(p.source_refs.length);
    for (const ref of p.source_refs)
      for (const col of ref.column_refs)
        assert.ok(
          pages.get(ref.page_ref)?.columns.some((c) => c.id === col),
          `${p.id}: ${ref.page_ref}/${col}`,
        );
    if (p.year_end) assert.ok(p.year_end >= p.year);
  }
});

test("reviewed life dates stay ungeocoded and the three added burial locations remain event-specific", () => {
  assert.equal(additions.filter((p) => p.coordinates).length, 3);
  for (const p of additions.filter((p) => p.coordinates))
    assert.ok(["joint_burial", "reburial"].includes(p.event_type));
  for (const p of additions.filter((p) =>
    ["birth", "death"].includes(p.event_type),
  ))
    assert.equal(p.coordinates, null);
  assert.equal(full.filter((p) => p.id === "port_elizabeth").length, 1);
  assert.ok(
    !additions.some(
      (p) => p.name.includes("Zhenbang") && p.event_type === "death",
    ),
  );
});

test("nominal calendar placement, uncertain readings and era ranges retain their reviewed labels", () => {
  const era = additions.find((p) => p.id === "chronology_177");
  assert.equal(era.year, 1621);
  assert.equal(era.year_end, 1627);
  assert.match(era.date_label, /unspecified/);
  assert.ok(
    additions
      .filter((p) => p.year === null)
      .every((p) => p.date_label === "Year unresolved"),
  );
  assert.equal(
    additions.find((p) => p.id === "chronology_001").coordinates,
    null,
  );
  assert.match(
    additions.find((p) => p.id === "chronology_001").description,
    /not a verified Western day/,
  );
});

test("real map chronology preserves five dated events and nine genuinely undated records", () => {
  const dates = chronologicalRecords(data.migration.points);
  assert.equal(dates.length, 5);
  assert.deepEqual(chronologyBounds(data.migration.points), {
    min: 1378,
    max: 1955,
  });
  assert.equal(recordAtYear(dates, 1850).id, "yuebu_1848");
  assert.equal(recordAtYear(dates, 1955).id, "port_elizabeth");
});

test("playback steps actual records, including several in one year, then stops at either endpoint", () => {
  const records = [
    { id: "b", year: 1906, sort_date: "1906-09-08" },
    { id: "a", year: 1906, sort_date: "1906-01-02" },
    { id: "c", year: 1955 },
    { id: "unknown", year: null },
  ];
  const dates = chronologicalRecords(records);
  assert.deepEqual(
    dates.map((p) => p.id),
    ["a", "b", "c"],
  );
  assert.equal(adjacentRecord(dates, "a", 1906, 1).id, "b");
  assert.equal(adjacentRecord(dates, "b", 1906, 1).id, "c");
  assert.equal(adjacentRecord(dates, "c", 1955, 1), null);
  assert.equal(adjacentRecord(dates, "a", 1906, -1), null);
  assert.ok(PLAYBACK_DELAY >= 2000);
});

test("cursor gaps, unknown selection, one-year and undated-only chronologies behave consistently", () => {
  const dates = chronologicalRecords([
    { id: "a", year: 1400 },
    { id: "b", year: 1800 },
  ]);
  assert.equal(recordAtYear(dates, 1700).id, "a");
  assert.equal(adjacentRecord(dates, "unknown", 1700, 1).id, "b");
  assert.equal(adjacentRecord(dates, "unknown", 1700, -1).id, "a");
  assert.equal(chronologyBounds([{ id: "u", year: null }]), null);
  assert.equal(recordAtYear([], 1700), null);
  assert.deepEqual(
    chronologyBounds([
      { id: "a", year: 1906 },
      { id: "b", year: 1906 },
    ]),
    { min: 1906, max: 1906 },
  );
});

test("timeline never invents coordinates for life events or dates for undated places", () => {
  const life = { id: "life", year: 1400, coordinates: null };
  const records = [...data.migration.points, life];
  const early = reachedPlaces(records, 1378);
  assert.ok(early.some((p) => p.id === "xiaolao"));
  assert.ok(early.some((p) => p.year === null));
  assert.ok(!early.some((p) => p.id === "port_elizabeth"));
  assert.ok(!reachedPlaces(records, 1955).some((p) => p.id === "life"));
  assert.equal(records.find((p) => p.id === "queenstown").year, null);
});

test("timeline links preserve an in-between cursor year through source inspection", () => {
  const state = {
    page: 3,
    view: "map",
    person: "",
    event: "xiaolao",
    year: 1450,
  };
  assert.deepEqual(parseExplorerHash(explorerHash(state), 36), state);
  assert.equal(
    parseExplorerHash("#page=4&year=not-a-date", 36).year,
    undefined,
  );
  assert.equal(parseExplorerHash("#page=4&year=-1", 36).year, undefined);
});
