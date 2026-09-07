import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import yaml from "js-yaml";
import {
  searchManuscript,
  searchPeople,
  focusedLayout,
  filterEvents,
  focusZoom,
  validSelection,
  parseExplorerHash,
  explorerHash,
} from "../utils/explorers.mjs";
const data = yaml.load(
  fs.readFileSync(new URL("../public/data.yaml", import.meta.url), "utf8"),
);
const tree = yaml.load(
  fs.readFileSync(
    new URL("../public/family_tree.yaml", import.meta.url),
    "utf8",
  ),
);

test("manuscript search tolerates the real blank source columns without dropping later matches", () => {
  assert.ok(searchManuscript(data.pages, "Zhenbang").length);
  assert.equal(searchManuscript(data.pages, "").length, 0);
  assert.ok(searchManuscript(data.pages, "勞").length);
  assert.doesNotThrow(() => searchManuscript(data.pages, "nothing-matches"));
});
test("all 85 people, including unnamed child identities, are findable and selectable", () => {
  assert.equal(searchPeople(tree.people, "").length, 85);
  for (const p of tree.people) {
    assert.ok(searchPeople(tree.people, p.name_zh).some((x) => x.id === p.id));
    assert.ok(searchPeople(tree.people, p.id).some((x) => x.id === p.id));
    assert.ok(
      focusedLayout(tree.people, p.id).nodes.some((x) => x.id === p.id),
    );
  }
});
test("focused layouts are deterministic, unique and have no overlapping cards on each generation", () => {
  for (const mode of ["family", "ancestors", "branch"])
    for (const p of tree.people) {
      const a = focusedLayout(tree.people, p.id, mode),
        b = focusedLayout(tree.people, p.id, mode);
      assert.deepEqual(a.nodes, b.nodes);
      assert.equal(new Set(a.nodes.map((n) => n.id)).size, a.nodes.length);
      for (const n of a.nodes) {
        assert.ok(n.x >= 0 && n.x + 184 <= a.width);
        assert.ok(n.y >= 0 && n.y + 90 <= a.height);
        for (const m of a.nodes)
          if (m.id !== n.id && m.y === n.y)
            assert.ok(Math.abs(m.x - n.x) >= 184);
      }
    }
  assert.equal(
    focusedLayout(tree.people, tree.root_id, "branch").nodes.length,
    85,
  );
});
test("Zongrong appears once with natural Guanxin and adoptive Guanzhi edges", () => {
  const p = tree.people.find((x) => x.id === "gen17_zongrong");
  const a = focusedLayout(tree.people, p.id);
  assert.equal(a.nodes.filter((x) => x.id === p.id).length, 1);
  assert.ok(
    a.edges.some(
      (x) =>
        x.target === p.id &&
        x.kind === "natural" &&
        tree.people.find((p) => p.id === x.source).name_en === "Guanxin",
    ),
  );
  assert.ok(
    a.edges.some(
      (x) =>
        x.target === p.id &&
        x.kind === "adoptive" &&
        tree.people.find((p) => p.id === x.source).name_en === "Guanzhi",
    ),
  );
});
test("all events initially available; unknown geography remains selectable in fallback/list", () => {
  const points = data.migration.points;
  assert.equal(filterEvents(points).length, 14);
  assert.equal(filterEvents(points, "all", false).length, 5);
  for (const p of points.filter((p) => !p.coordinates))
    assert.equal(validSelection(filterEvents(points), p.id), p.id);
  assert.equal(validSelection(points, "invalid"), "");
  for (const p of filterEvents(points, "burial"))
    assert.equal(p.event_type, "burial");
});
test("validated explorer links round-trip and preserve old page links", () => {
  assert.equal(parseExplorerHash("#page=36", 36).page, 35);
  assert.equal(
    parseExplorerHash("#page=0&view=script-injection", 36).view,
    "digital",
  );
  assert.equal(parseExplorerHash("#page=999", 36).page, 0);
  const state = {
    page: 4,
    view: "tree",
    person: "gen17_zongrong",
    event: "port_elizabeth",
  };
  assert.deepEqual(parseExplorerHash(explorerHash(state), 36), state);
});

test("province-level Guangxi stays at regional scale; unresolved geography has no camera target", () => {
  const points = data.migration.points;
  assert.equal(focusZoom(points.find((p) => p.id === "guangxi")), 7);
  assert.equal(focusZoom(points.find((p) => p.id === "port_elizabeth")), 11);
  for (const p of points.filter((p) => !p.coordinates))
    assert.equal(focusZoom(p), null);
});
