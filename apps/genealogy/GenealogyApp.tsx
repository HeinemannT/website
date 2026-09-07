import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import Header from "./components/Header";
import ViewerControls from "./components/ViewerControls";
import DigitalRecreation from "./components/DigitalRecreation";
import TranslationPanel from "./components/TranslationPanel";
import ContextGlossary from "./components/ContextGlossary";
import Menu from "./components/Menu";

// Explorer code and Leaflet load only when their view is opened.
const MigrationMap = lazy(() => import("./components/MigrationMap"));
const FamilyTree = lazy(() => import("./components/FamilyTree"));
import { GenealogyData, GlossaryTerm, GlossaryData } from "./types";
import {
  BookOpen,
  Image as ImageIcon,
  ScrollText,
  Map,
  Loader2,
  AlertTriangle,
  RefreshCw,
  FileX,
  Network,
  BookA,
} from "lucide-react";
import jsyaml from "js-yaml";
import { marked } from "marked";
import { useDraggableScroll } from "./hooks/useDraggableScroll";

import { explorerHash, parseExplorerHash } from "./utils/explorers.mjs";
import type { TreeState } from "./components/FamilyTree";
import type { MapState } from "./components/MigrationMap";

type MobileViewMode = "read" | "image" | "script" | "map" | "tree" | "glossary";

// --- Helper Component for Robust Image Loading ---
const ImagePanel: React.FC<{ filename: string; pageIndex: number }> = ({
  filename,
  pageIndex,
}) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const dragProps = useDraggableScroll();

  // Reset status when filename changes
  useEffect(() => {
    setStatus("loading");
  }, [filename]);

  // Construct path - Assumes images are in a folder named 'images' in public directory
  // If hosted on a sub-path (Github Pages), the relative path './images/' usually works best
  // if index.html is at root.
  const imagePath = `images/${filename}`;

  return (
    <div
      ref={dragProps.ref}
      {...dragProps.events}
      className={`
        w-full h-full p-4 lg:p-12 flex items-center justify-center overflow-auto
        scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
        ${dragProps.cursorClass}
      `}
    >
      <div className="relative shadow-2xl transition-transform duration-300 min-w-[200px] min-h-[300px] flex items-center justify-center bg-white dark:bg-zinc-900 pointer-events-none">
        {/* Loading State */}
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 z-10">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-xs uppercase tracking-widest">
              Loading Scan...
            </span>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center p-8 text-stone-400 border-2 border-dashed border-stone-200 dark:border-zinc-700 rounded-lg">
            <FileX size={48} className="mb-4 opacity-50" />
            <p className="font-bold text-ink dark:text-zinc-300 mb-1">
              Image Not Found
            </p>
            <p className="text-xs font-mono mb-4 text-center">
              Expected: /images/{filename}
            </p>
            <p className="text-[10px] uppercase tracking-widest max-w-[200px] text-center opacity-70">
              Please ensure the file exists in the 'public/images' folder.
            </p>
          </div>
        )}

        {/* The Image */}
        <img
          src={imagePath}
          alt={`Page ${pageIndex + 1}`}
          className={`
            max-h-[85vh] lg:max-h-[calc(100vh-200px)] max-w-full object-contain 
            ${status === "error" ? "hidden" : "block"}
            ${status === "loading" ? "opacity-0" : "opacity-100"}
            transition-opacity duration-300
          `}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />

        {/* Vintage Overlay (only on loaded image) */}
        {status === "loaded" && (
          <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

const GenealogyApp: React.FC = () => {
  const [data, setData] = useState<GenealogyData | null>(null);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [glossaryHtml, setGlossaryHtml] = useState<string>("");
  const [yamlSource, setYamlSource] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [desktopViewMode, setDesktopViewModeState] = useState<
    "image" | "digital" | "map" | "tree" | "glossary"
  >("digital");
  const [mobileViewMode, setMobileViewModeState] =
    useState<MobileViewMode>("read");
  const initialRoute = useRef(parseExplorerHash(window.location.hash, 36));
  const [treeState, setTreeState] = useState<TreeState>({
    person: initialRoute.current.person,
    mode: "family",
    query: "",
  });
  const [mapState, setMapState] = useState<MapState>({
    event: initialRoute.current.event,
    year: initialRoute.current.year ?? null,
    camera: null,
  });
  const [returnView, setReturnView] = useState<"tree" | "map" | null>(null);
  const routeReady = useRef(false);
  const routeEpoch = useRef(0);
  const handledRoute = useRef(0);
  const [routeRevision, setRouteRevision] = useState(0);
  const setDesktopViewMode = (mode: typeof desktopViewMode) => {
    setDesktopViewModeState(mode);
    setMobileViewModeState(mode === "digital" ? "read" : mode);
  };
  const setMobileViewMode = (mode: MobileViewMode) => {
    setMobileViewModeState(mode);
    setDesktopViewModeState(
      mode === "read" || mode === "script" ? "digital" : mode,
    );
  };
  const [hoveredColumnId, setHoveredColumnId] = useState<number | null>(null);

  // Settings State — initialized from localStorage, with prefers-color-scheme fallback for dark mode.
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem("genealogy.darkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">(() => {
    if (typeof window === "undefined") return "md";
    const saved = window.localStorage.getItem("genealogy.fontSize");
    return saved === "sm" || saved === "md" || saved === "lg" ? saved : "md";
  });

  // Apply dark class to <html> so both Tailwind dark:* and the .dark body rule in index.html fire.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem("genealogy.darkMode", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    window.localStorage.setItem("genealogy.fontSize", fontSize);
  }, [fontSize]);

  // Menu/Sidebar State
  type Tab = "toc" | "search" | "docs" | "source" | "glossary";
  const [activeTab, setActiveTab] = useState<Tab>("toc");
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 1024,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenTab = (tab: Tab) => {
    if (activeTab === tab && isMenuOpen) {
      setIsMenuOpen(false);
    } else {
      setActiveTab(tab);
      setIsMenuOpen(true);
    }
  };

  // Optional references load independently; the manuscript never waits for them.
  const loadData = () => {
    setIsLoading(true);
    setError(null);
    fetch("./data.yaml")
      .then((res) => {
        if (!res.ok) throw Error(`Failed to fetch data.yaml (${res.status})`);
        return res.text();
      })
      .then((text) => {
        const parsed = jsyaml.load(text) as GenealogyData;
        if (!parsed?.pages) throw Error("Invalid data: missing pages.");
        setYamlSource(text);
        setData(parsed);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unable to load the manuscript.");
        setIsLoading(false);
      });
  };
  useEffect(() => {
    loadData();
    const controller = new AbortController();
    fetch("./smart-text-glossary.yaml", { signal: controller.signal })
      .then((r) => (r.ok ? r.text() : ""))
      .then((text) => {
        if (!text) return;
        const glossary = jsyaml.load(text) as GlossaryData;
        if (Array.isArray(glossary?.terms)) setGlossaryTerms(glossary.terms);
      })
      .catch(() => {});
    fetch("./glossary.md", { signal: controller.signal })
      .then((r) => (r.ok ? r.text() : ""))
      .then((text) => {
        if (text) setGlossaryHtml(marked.parse(text) as string);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Hash state supports old page links, explorer links, and browser history.
  useEffect(() => {
    if (!data) return;
    const read = () => {
      const r = parseExplorerHash(location.hash, data.pages.length);
      routeEpoch.current += 1;
      setRouteRevision(routeEpoch.current);
      setCurrentPageIndex(r.page);
      setDesktopViewMode(r.view as typeof desktopViewMode);
      setMobileViewMode(
        r.view === "digital" ? "read" : (r.view as MobileViewMode),
      );
      setTreeState((s) => ({ ...s, person: r.person }));
      setMapState((s) => ({
        ...s,
        event: r.event,
        year: r.year ?? null,
        camera: null,
      }));
      routeReady.current = true;
    };
    read();
    window.addEventListener("popstate", read);
    window.addEventListener("hashchange", read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener("hashchange", read);
    };
  }, [data]);
  useEffect(() => {
    if (!data || !routeReady.current) return;
    if (routeRevision !== routeEpoch.current) return;
    const view = isMobile
      ? mobileViewMode === "read" || mobileViewMode === "script"
        ? "digital"
        : mobileViewMode
      : desktopViewMode;
    const desired = explorerHash({
      page: currentPageIndex,
      view,
      person: treeState.person,
      event: mapState.event,
      year: mapState.year,
    });
    if (handledRoute.current !== routeRevision) {
      handledRoute.current = routeRevision;
      if (location.hash !== desired) history.replaceState(null, "", desired);
      return;
    }
    if (location.hash !== desired) {
      const previous = parseExplorerHash(location.hash, data.pages.length);
      const sameRecord =
        previous.page === currentPageIndex &&
        previous.view === view &&
        previous.person === treeState.person &&
        previous.event === mapState.event;
      if (sameRecord) history.replaceState(null, "", desired);
      else history.pushState(null, "", desired);
    }
  }, [
    data,
    currentPageIndex,
    desktopViewMode,
    mobileViewMode,
    isMobile,
    treeState.person,
    mapState.event,
    mapState.year,
    routeRevision,
  ]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update Data from Menu Editor
  const handleYamlUpdate = (newSource: string, newData: GenealogyData) => {
    setYamlSource(newSource);
    setData(newData);
    // If the new data has fewer pages than current index, reset index
    if (currentPageIndex >= newData.pages.length) {
      setCurrentPageIndex(0);
    }
  };

  const openReader = () => {
    const view = isMobile ? mobileViewMode : desktopViewMode;
    if (view === "tree" || view === "map") setReturnView(view);
    setDesktopViewMode("digital");
    setMobileViewMode("read");
  };
  const handleNavigate = (pageIndex: number, columnId?: number) => {
    if (!data) return;
    setCurrentPageIndex(
      Math.max(0, Math.min(pageIndex, data.pages.length - 1)),
    );
    setHoveredColumnId(columnId ?? null);
    openReader();
  };
  const handlePageIdNavigate = (pageId: string) => {
    const index = data?.pages.findIndex((p) => p.page_id === pageId) ?? -1;
    if (index >= 0) handleNavigate(index);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-paper dark:bg-zinc-950 text-stone-500">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-sm font-medium tracking-widest uppercase">
            Loading Archives...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-paper dark:bg-zinc-950 text-stone-500 p-8">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertTriangle className="text-red-500" size={48} />
          <h2 className="text-xl font-bold text-ink dark:text-zinc-100">
            Data Loading Error
          </h2>
          <p className="text-sm text-stone-600 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-900 p-4 rounded-md font-mono text-left w-full break-words">
            {error}
          </p>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-cinnabar text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const currentPage = data.pages[currentPageIndex];

  return (
    <div className="h-[100dvh] flex flex-col transition-colors duration-500 overflow-hidden">
      <div className="flex flex-col h-full bg-paper dark:bg-zinc-950 text-ink dark:text-zinc-200 font-sans pt-16 lg:pt-0 lg:pl-16 transition-all duration-300">
        <Header
          metadata={data.metadata}
          isDarkMode={isDarkMode}
          toggleDarkMode={setIsDarkMode}
          fontSize={fontSize}
          setFontSize={setFontSize}
          onMenuToggle={() => setIsMenuOpen(true)}
          onOpenTab={handleOpenTab}
          activeTab={activeTab}
          viewMode={desktopViewMode}
          setViewMode={setDesktopViewMode}
        />

        <Menu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          data={data}
          onNavigate={handleNavigate}
          yamlSource={yamlSource}
          onUpdateYaml={handleYamlUpdate}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          glossaryTerms={glossaryTerms}
          glossaryHtml={glossaryHtml}
        />

        {returnView &&
          (isMobile
            ? mobileViewMode === "read"
            : desktopViewMode === "digital" || desktopViewMode === "image") && (
            <div className="px-4 py-2 border-b border-stone-200 dark:border-zinc-800 text-sm">
              <button
                className="underline text-cinnabar dark:text-red-400"
                onClick={() => {
                  setDesktopViewMode(returnView);
                  setMobileViewMode(returnView);
                }}
              >
                ← Return to{" "}
                {returnView === "tree" ? "selected person" : "selected event"}
              </button>
            </div>
          )}
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row flex-1 min-w-0 min-h-0 overflow-hidden relative">
          {/* LEFT SIDE (Desktop: Visuals / Mobile: Conditional) */}
          <div
            className={`
            flex-1 min-w-0 min-h-0 flex flex-col bg-[#F0EFEC] dark:bg-[#121214] relative transition-colors duration-500
            ${isMobile && (mobileViewMode === "read" || mobileViewMode === "glossary") ? "hidden" : "flex"}
            ${isMobile ? "absolute inset-0 z-10" : ""}
          `}
          >
            {/* Desktop Controls */}
            <div className="hidden lg:block">
              <ViewerControls
                viewMode={desktopViewMode}
                setViewMode={setDesktopViewMode}
                pageIndex={currentPageIndex}
                totalPageCount={data.pages.length}
                onPrevPage={() =>
                  setCurrentPageIndex(Math.max(0, currentPageIndex - 1))
                }
                onNextPage={() =>
                  setCurrentPageIndex(
                    Math.min(data.pages.length - 1, currentPageIndex + 1),
                  )
                }
              />
            </div>

            <div className="flex-1 min-w-0 min-h-0 overflow-hidden relative flex items-center justify-center bg-texture-paper pb-20 lg:pb-0">
              {/* VIEW 1: IMAGE */}
              {((!isMobile && desktopViewMode === "image") ||
                (isMobile && mobileViewMode === "image")) && (
                <ImagePanel
                  filename={currentPage.metadata.image_file}
                  pageIndex={currentPageIndex}
                />
              )}

              {/* VIEW 2: DIGITAL SCRIPT */}
              {((!isMobile && desktopViewMode === "digital") ||
                (isMobile && mobileViewMode === "script")) && (
                <DigitalRecreation
                  columns={currentPage.columns}
                  activeColumnId={hoveredColumnId}
                  onColumnHover={setHoveredColumnId}
                  isMobile={isMobile}
                  marginalia={currentPage.metadata.marginalia}
                  fontSize={fontSize}
                  glossaryTerms={glossaryTerms}
                />
              )}

              {/* VIEW 3: MAP — Leaflet loads only when opened */}
              {((!isMobile && desktopViewMode === "map") ||
                (isMobile && mobileViewMode === "map")) && (
                <Suspense
                  fallback={
                    <div className="text-stone-400 text-sm tracking-widest uppercase">
                      Loading map…
                    </div>
                  }
                >
                  <MigrationMap
                    onNavigate={handlePageIdNavigate}
                    points={data.migration.points}
                    state={mapState}
                    onChange={setMapState}
                    isDarkMode={isDarkMode}
                  />
                </Suspense>
              )}

              {/* VIEW 4: FAMILY TREE — lazy-loaded */}
              {((!isMobile && desktopViewMode === "tree") ||
                (isMobile && mobileViewMode === "tree")) && (
                <Suspense
                  fallback={
                    <div className="text-stone-400 text-sm tracking-widest uppercase">
                      Loading tree…
                    </div>
                  }
                >
                  <FamilyTree
                    onNavigate={handlePageIdNavigate}
                    isDarkMode={isDarkMode}
                    state={treeState}
                    onChange={setTreeState}
                  />
                </Suspense>
              )}

              {/* VIEW 5: GLOSSARY (Desktop Only - Mobile puts it in 'read' slot equivalent or own slot) */}
              {!isMobile && desktopViewMode === "glossary" && (
                <ContextGlossary
                  terms={glossaryTerms}
                  glossaryHtml={glossaryHtml}
                />
              )}
            </div>
          </div>

          {/* RIGHT SIDE (Desktop: Translation / Mobile: Conditional) */}
          {(isMobile ||
            (desktopViewMode !== "map" &&
              desktopViewMode !== "tree" &&
              desktopViewMode !== "glossary")) && (
            <div
              className={`
              w-full lg:w-[480px] xl:w-[600px] flex-none 
              border-l border-stone-200 dark:border-zinc-800 
              bg-paper dark:bg-zinc-900 
              shadow-[rgba(0,0,0,0.05)_0px_0px_40px] z-20
              transition-all duration-500
              ${isMobile && mobileViewMode !== "read" && mobileViewMode !== "glossary" ? "hidden" : "flex flex-col h-full"}
              ${isMobile ? "absolute inset-0 pt-0 pb-20" : ""}
            `}
            >
              {mobileViewMode === "glossary" ? (
                <ContextGlossary
                  terms={glossaryTerms}
                  glossaryHtml={glossaryHtml}
                />
              ) : (
                <TranslationPanel
                  columns={currentPage.columns}
                  activeColumnId={hoveredColumnId}
                  onColumnHover={setHoveredColumnId}
                  summary={currentPage.metadata.title}
                  pageMetadata={currentPage.metadata}
                  isMobile={isMobile}
                  marginalia={currentPage.metadata.marginalia}
                  fontSize={fontSize}
                  glossaryTerms={glossaryTerms}
                />
              )}
            </div>
          )}

          {/* MOBILE BOTTOM NAVIGATION - FIXED */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-950 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-around z-[100] px-4 pb-1 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            {[
              { id: "read", icon: BookOpen, label: "READ" },
              { id: "image", icon: ImageIcon, label: "SCAN" },
              { id: "script", icon: ScrollText, label: "SCRIPT" },
              { id: "map", icon: Map, label: "MAP" },
              { id: "tree", icon: Network, label: "TREE" },
              { id: "glossary", icon: BookA, label: "CTX" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() =>
                  setMobileViewMode(
                    mobileViewMode === btn.id
                      ? "read"
                      : (btn.id as MobileViewMode),
                  )
                }
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg min-w-[3.5rem]
                  active:bg-stone-50 dark:active:bg-zinc-900 transition-all duration-200 active:scale-95
                  ${
                    mobileViewMode === btn.id
                      ? "text-cinnabar dark:text-red-400"
                      : "text-stone-400 dark:text-zinc-600"
                  }
                `}
              >
                <btn.icon
                  size={20}
                  strokeWidth={mobileViewMode === btn.id ? 2.5 : 2}
                />
                <span className="text-[9px] font-bold tracking-wider">
                  {btn.label}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile Floating Pagination */}
          {mobileViewMode !== "map" &&
            mobileViewMode !== "tree" &&
            mobileViewMode !== "glossary" && (
              <div className="lg:hidden absolute bottom-24 right-4 z-40">
                <div className="flex items-center gap-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-stone-200 dark:border-zinc-700 rounded-full shadow-lg px-4 py-2 transition-all">
                  <button
                    disabled={currentPageIndex === 0}
                    onClick={() => setCurrentPageIndex((p) => p - 1)}
                    className="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-zinc-300 active:text-cinnabar border border-stone-200 dark:border-zinc-700 rounded-full bg-stone-50 dark:bg-zinc-800 disabled:opacity-30 transition-colors active:scale-95"
                  >
                    <span className="text-xl font-bold pb-1">‹</span>
                  </button>

                  <span className="text-xs font-bold font-mono text-stone-600 dark:text-zinc-300 min-w-[3.5rem] text-center">
                    {currentPageIndex + 1} / {data.pages.length}
                  </span>

                  <button
                    disabled={currentPageIndex === data.pages.length - 1}
                    onClick={() => setCurrentPageIndex((p) => p + 1)}
                    className="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-zinc-300 active:text-cinnabar border border-stone-200 dark:border-zinc-700 rounded-full bg-stone-50 dark:bg-zinc-800 disabled:opacity-30 transition-colors active:scale-95"
                  >
                    <span className="text-xl font-bold pb-1">›</span>
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GenealogyApp;
