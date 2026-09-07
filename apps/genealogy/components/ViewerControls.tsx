import React from "react";
import {
  Image,
  ScrollText,
  Map,
  Network,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
type View = "image" | "digital" | "map" | "tree" | "glossary";
interface Props {
  viewMode: View;
  setViewMode: (view: View) => void;
  pageIndex: number;
  totalPageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}
export default function ViewerControls(p: Props) {
  return (
    <nav
      aria-label="Archive views"
      className="h-16 shrink-0 flex items-center justify-between gap-2 px-3 border-b border-stone-200 dark:border-zinc-800 bg-paper dark:bg-zinc-900"
    >
      <div className="flex gap-1">
        {(
          [
            ["image", "Scan", Image],
            ["digital", "Script", ScrollText],
            ["tree", "Tree", Network],
            ["map", "Map", Map],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            aria-pressed={p.viewMode === id}
            onClick={() => p.setViewMode(id)}
            className={`flex items-center gap-2 px-3 py-2 text-sm border-b-2 ${p.viewMode === id ? "border-cinnabar text-cinnabar dark:text-red-400" : "border-transparent text-stone-600 dark:text-zinc-400 hover:text-ink dark:hover:text-white"}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
      {p.viewMode !== "map" && p.viewMode !== "tree" && (
        <div className="flex items-center gap-1 text-sm">
          <button
            aria-label="Previous page"
            disabled={!p.pageIndex}
            onClick={p.onPrevPage}
            className="p-2 disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="whitespace-nowrap">
            {p.pageIndex + 1} / {p.totalPageCount}
          </span>
          <button
            aria-label="Next page"
            disabled={p.pageIndex === p.totalPageCount - 1}
            onClick={p.onNextPage}
            className="p-2 disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </nav>
  );
}
