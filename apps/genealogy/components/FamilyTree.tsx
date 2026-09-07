import React, { useEffect, useMemo, useState } from "react";
import jsyaml from "js-yaml";
import { Search, Plus, Minus, Scan } from "lucide-react";
import {
  focusedLayout,
  searchPeople,
  validSelection,
} from "../utils/explorers.mjs";
import { useTreeViewport } from "../hooks/useTreeViewport";
import "../styles/explorers.css";

export interface FamilyMember {
  id: string;
  name_zh: string;
  name_en: string;
  generation: number;
  title?: string;
  page_ref?: string;
  children?: string[];
  adopted_children?: string[];
  note?: string;
  natural_parent_label?: string;
  adoptive_parent_label?: string;
  unidentified_adoption?: string;
}
export interface TreeState {
  person: string;
  mode: "family" | "ancestors" | "branch";
  query: string;
}
interface Props {
  onNavigate: (id: string) => void;
  isDarkMode: boolean;
  state: TreeState;
  onChange: (s: TreeState) => void;
}
let treeRequest:
  Promise<{ root_id: string; people: FamilyMember[] }> | undefined;
function loadTree() {
  return (treeRequest ??= fetch("./family_tree.yaml")
    .then((r) => {
      if (!r.ok) throw Error("The family register could not be loaded.");
      return r.text();
    })
    .then((t) => jsyaml.load(t) as { root_id: string; people: FamilyMember[] })
    .catch((e) => {
      treeRequest = undefined;
      throw e;
    }));
}
export default function FamilyTree({ onNavigate, state, onChange }: Props) {
  const [data, setData] = useState<{
    root_id: string;
    people: FamilyMember[];
  } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    loadTree()
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const people = data?.people ?? [];
  const selectedId = validSelection(people, state.person, data?.root_id ?? "");
  useEffect(() => {
    if (data && selectedId !== state.person)
      onChange({ ...state, person: selectedId });
  }, [data, selectedId, state.person]);
  const layout = useMemo(
    () => focusedLayout(people, selectedId, state.mode),
    [data, selectedId, state.mode],
  );
  const viewport = useTreeViewport(
    layout.width,
    layout.height,
    `${selectedId}:${state.mode}`,
  );
  const selected = people.find((p) => p.id === selectedId);
  const results = useMemo(
    () => searchPeople(people, state.query),
    [data, state.query],
  );
  const index = useMemo(() => new Map(people.map((p) => [p.id, p])), [data]);
  const choose = (id: string) => onChange({ ...state, person: id, query: "" });
  if (error)
    return (
      <p className="p-6" role="alert">
        {error}{" "}
        <button className="underline" onClick={() => location.reload()}>
          Retry
        </button>
      </p>
    );
  if (!data || !selected)
    return <p className="p-6">Loading family register…</p>;
  const relative = (id: string, label: string) => (
    <button
      key={`${label}-${id}`}
      className="relative-link"
      onClick={() => choose(id)}
    >
      <span>{label}</span>
      <strong>
        {index.get(id)?.name_en}{" "}
        <span lang="zh-Hant">{index.get(id)?.name_zh}</span>
      </strong>
    </button>
  );
  const natural = layout.relationships.naturalParent.get(selectedId),
    adoptive = layout.relationships.adoptedParent.get(selectedId);
  return (
    <section
      className="explorer tree-explorer"
      aria-label="Family tree explorer"
    >
      <div className="explorer-heading">
        <div>
          <h2>Family register</h2>
          <p>Follow a person through the generations.</p>
        </div>
        <span className="text-xs text-stone-500">{people.length} people</span>
      </div>
      <div className="tree-body">
        <aside className="tree-sidebar">
          <label className="explorer-search">
            <Search size={16} />
            <input
              aria-label="Find a person"
              placeholder="Chinese or English name"
              value={state.query}
              onChange={(e) => onChange({ ...state, query: e.target.value })}
            />
          </label>
          {state.query ? (
            <div className="person-results">
              <p className="text-xs text-stone-500 mb-2">
                {results.length} matches
              </p>
              {results.map((p) => (
                <button key={p.id} onClick={() => choose(p.id)}>
                  <span lang="zh-Hant" className="font-serif-tc">
                    {p.name_zh}
                  </span>{" "}
                  {p.name_en}
                  <small>Generation {p.generation}</small>
                </button>
              ))}
              {!results.length && (
                <p>No matching record. Try part of a name.</p>
              )}
            </div>
          ) : (
            <div className="person-detail">
              <span className="text-xs text-stone-500">
                Generation {selected.generation}
              </span>
              <h3>
                <span lang="zh-Hant">{selected.name_zh}</span>
                <span>{selected.name_en}</span>
              </h3>
              {selected.title && <p>{selected.title}</p>}
              {selected.page_ref && (
                <button
                  className="source-link"
                  onClick={() => onNavigate(selected.page_ref!)}
                >
                  Read manuscript · Page {Number(selected.page_ref.slice(4))} →
                </button>
              )}
              <div className="relatives">
                {natural && relative(natural, "Natural parent")}
                {adoptive && relative(adoptive, "Adoptive parent")}
                {(selected.children ?? []).map((id) => relative(id, "Child"))}
                {(selected.adopted_children ?? []).map((id) =>
                  relative(id, "Adopted heir"),
                )}
              </div>
              {selected.natural_parent_label && (
                <p>Natural parent: {selected.natural_parent_label}.</p>
              )}
              {selected.adoptive_parent_label && (
                <p>Adoptive parent: {selected.adoptive_parent_label}.</p>
              )}
              {selected.unidentified_adoption && (
                <p>
                  Unidentified adopted heir: {selected.unidentified_adoption}
                </p>
              )}
              {selected.note && <p className="person-note">{selected.note}</p>}
              <p className="text-xs text-stone-500">
                A missing continuation does not imply childlessness. [?] marks
                an unresolved reading.
              </p>
            </div>
          )}
        </aside>
        <div className="tree-chart">
          <div className="tree-tools">
            <div className="flex flex-wrap gap-1">
              {(
                [
                  ["family", "Close family"],
                  ["ancestors", "Ancestor path"],
                  ["branch", "Descendants"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  aria-pressed={state.mode === mode}
                  onClick={() => onChange({ ...state, mode })}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                aria-label="Zoom out tree"
                onClick={() => viewport.zoom(0.8)}
              >
                <Minus size={16} />
              </button>
              <button aria-label="Fit tree" onClick={viewport.fit}>
                <Scan size={16} />
              </button>
              <button
                aria-label="Zoom in tree"
                onClick={() => viewport.zoom(1.25)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div
            ref={viewport.ref}
            {...viewport.events}
            className="tree-viewport"
            tabIndex={0}
            aria-label="Lineage diagram. Drag to pan. Arrow keys pan, plus and minus zoom, Home fits."
          >
            <div
              ref={viewport.contentRef}
              className="tree-transform"
              style={{ width: layout.width, height: layout.height }}
            >
              <svg
                width={layout.width}
                height={layout.height}
                aria-hidden="true"
              >
                {layout.edges.map((edge) => {
                  const a = layout.nodes.find((n) => n.id === edge.source)!,
                    b = layout.nodes.find((n) => n.id === edge.target)!;
                  return (
                    <path
                      key={`${edge.kind}-${edge.source}-${edge.target}`}
                      d={`M ${a.x + 92} ${a.y + 90} V ${(a.y + b.y + 90) / 2} H ${b.x + 92} V ${b.y}`}
                      fill="none"
                      stroke={edge.kind === "adoptive" ? "#a63434" : "#a8a29e"}
                      strokeWidth="1.5"
                      strokeDasharray={
                        edge.kind === "adoptive" ? "5 4" : undefined
                      }
                    />
                  );
                })}
              </svg>
              {layout.nodes.map((p) => (
                <button
                  key={p.id}
                  id={`node-${p.id}`}
                  data-person={p.id}
                  aria-pressed={p.id === selectedId}
                  className={`tree-node ${p.id === selectedId ? "selected" : ""}`}
                  style={{ left: p.x, top: p.y }}
                  onClick={() => choose(p.id)}
                >
                  <small>Generation {p.generation}</small>
                  <span lang="zh-Hant">{p.name_zh}</span>
                  <strong>{p.name_en}</strong>
                </button>
              ))}
            </div>
          </div>
          <div className="tree-legend">
            <span>― Natural descent</span>
            <span className="text-cinnabar dark:text-red-400">┄ Adoption</span>
            <span>Drag to pan · + / − to zoom</span>
          </div>
        </div>
      </div>
    </section>
  );
}
