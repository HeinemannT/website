import { treeLayout } from "./evidence.mjs";

export function searchManuscript(pages, query) {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return [];
  return pages.flatMap((page, pageIndex) =>
    page.columns.flatMap((col) => {
      const text = col.text_zh ?? "",
        translation = col.translation ?? "";
      return `${text} ${translation}`.toLocaleLowerCase().includes(q)
        ? [{ pageIndex, columnId: col.id, text, translation }]
        : [];
    }),
  );
}

export function searchPeople(people, query) {
  const q = query.trim().toLocaleLowerCase();
  return people.filter((p) =>
    `${p.name_en} ${p.name_zh} ${p.id} ${p.title ?? ""}`
      .toLocaleLowerCase()
      .includes(q),
  );
}

// Each identity has exactly one structural parent; adoption remains a distinct edge.
export function focusedLayout(people, selectedId, mode = "family") {
  const index = new Map(people.map((p) => [p.id, p]));
  const relationships = treeLayout(people);
  const parent = (id) =>
    relationships.naturalParent.get(id) ?? relationships.adoptedParent.get(id);
  const ids = new Set(index.has(selectedId) ? [selectedId] : []);
  if (mode === "ancestors") {
    let id = parent(selectedId);
    while (id && !ids.has(id)) {
      ids.add(id);
      id = parent(id);
    }
  } else if (mode === "branch") {
    const visit = (id) => {
      for (const child of [
        ...relationships.renderedChildren(index.get(id)),
        ...relationships.adoptionReferences(index.get(id)),
      ]) {
        if (!ids.has(child)) {
          ids.add(child);
          visit(child);
        }
      }
    };
    if (index.has(selectedId)) visit(selectedId);
  } else if (index.has(selectedId)) {
    for (const id of [
      relationships.naturalParent.get(selectedId),
      relationships.adoptedParent.get(selectedId),
      ...relationships.renderedChildren(index.get(selectedId)),
      ...relationships.adoptionReferences(index.get(selectedId)),
    ])
      if (id) ids.add(id);
    const p = index.get(parent(selectedId));
    if (p) for (const id of relationships.renderedChildren(p)) ids.add(id);
  }
  const visible = people.filter((p) => ids.has(p.id));
  const minGen = Math.min(...visible.map((p) => p.generation), 1e6);
  const rows = new Map();
  for (const p of visible) {
    const row = rows.get(p.generation) ?? [];
    row.push(p);
    rows.set(p.generation, row);
  }
  const width =
    Math.max(1, ...[...rows.values()].map((r) => r.length)) * 204 + 32;
  const nodes = visible.map((p) => {
    const row = rows.get(p.generation);
    return {
      ...p,
      x: (width - row.length * 204) / 2 + row.indexOf(p) * 204,
      y: (p.generation - minGen) * 134 + 24,
    };
  });
  const edges = [];
  for (const p of visible) {
    for (const [kind, source] of [
      ["natural", relationships.naturalParent.get(p.id)],
      ["adoptive", relationships.adoptedParent.get(p.id)],
    ]) {
      if (source && ids.has(source)) edges.push({ source, target: p.id, kind });
    }
  }
  return {
    nodes,
    edges,
    width,
    height: Math.max(160, ...nodes.map((p) => p.y + 118)),
    relationships,
  };
}

// Guangxi is a province-level identification, not an identified town/site.
export function focusZoom(point) {
  if (!point.coordinates) return null;
  return point.id === "guangxi" ? 7 : 11;
}
export function validSelection(items, id, fallback = "") {
  return items.some((p) => p.id === id) ? id : fallback;
}
export function parseExplorerHash(hash, pageCount) {
  const p = new URLSearchParams(hash.replace(/^#/, ""));
  const page = Number(p.get("page"));
  const year = Number(p.get("year"));
  return {
    ...(p.has("year") && Number.isInteger(year) && year >= 1 && year <= 9999
      ? { year }
      : {}),
    page:
      Number.isInteger(page) && page >= 1 && page <= pageCount ? page - 1 : 0,
    view: ["image", "digital", "map", "tree", "glossary"].includes(
      p.get("view"),
    )
      ? p.get("view")
      : "digital",
    person: p.get("person") ?? "",
    event: p.get("event") ?? "",
  };
}
export function explorerHash(state) {
  const p = new URLSearchParams({
    page: String(state.page + 1),
    view: state.view,
  });
  if (state.person) p.set("person", state.person);
  if (state.event) p.set("event", state.event);
  if (Number.isInteger(state.year)) p.set("year", String(state.year));
  return "#" + p.toString();
}
