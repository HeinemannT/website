import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ViewerControls from './components/ViewerControls';
import DigitalRecreation from './components/DigitalRecreation';
import TranslationPanel from './components/TranslationPanel';
import MigrationMap from './components/MigrationMap';
import FamilyTree from './components/FamilyTree';
import ContextGlossary from './components/ContextGlossary';
import Menu from './components/Menu';
import { GenealogyData, GlossaryTerm, GlossaryData } from './types';
import { BookOpen, Image as ImageIcon, ScrollText, Map, Loader2, AlertTriangle, RefreshCw, FileX, Network, BookA } from 'lucide-react';
import jsyaml from 'js-yaml';
import { marked } from 'marked';
import { useDraggableScroll } from './hooks/useDraggableScroll';

type MobileViewMode = 'read' | 'image' | 'script' | 'map' | 'tree' | 'glossary';

// --- Helper Component for Robust Image Loading ---
const ImagePanel: React.FC<{ filename: string; pageIndex: number }> = ({ filename, pageIndex }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const dragProps = useDraggableScroll();

  // Reset status when filename changes
  useEffect(() => {
    setStatus('loading');
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
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 z-10">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-xs uppercase tracking-widest">Loading Scan...</span>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center p-8 text-stone-400 border-2 border-dashed border-stone-200 dark:border-zinc-700 rounded-lg">
            <FileX size={48} className="mb-4 opacity-50" />
            <p className="font-bold text-ink dark:text-zinc-300 mb-1">Image Not Found</p>
            <p className="text-xs font-mono mb-4 text-center">Expected: /images/{filename}</p>
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
            ${status === 'error' ? 'hidden' : 'block'}
            ${status === 'loading' ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-300
          `}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />

        {/* Vintage Overlay (only on loaded image) */}
        {status === 'loaded' && (
          <div className="absolute inset-0 bg-amber-900/5 mix-blend-multiply pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};


const GenealogyApp: React.FC = () => {
  const [data, setData] = useState<GenealogyData | null>(null);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [glossaryHtml, setGlossaryHtml] = useState<string>('');
  const [yamlSource, setYamlSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [desktopViewMode, setDesktopViewMode] = useState<'image' | 'digital' | 'map' | 'tree' | 'glossary'>('digital');
  const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>('read');
  const [hoveredColumnId, setHoveredColumnId] = useState<number | null>(null);

  // Settings State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Menu/Sidebar State
  type Tab = 'toc' | 'search' | 'docs' | 'source';
  const [activeTab, setActiveTab] = useState<Tab>('toc');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenTab = (tab: Tab) => {
    setActiveTab(tab);
    setIsMenuOpen(true);
  };

  // Fetch and Parse YAML Data
  const loadData = () => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      fetch('./data.yaml').then(res => {
        if (!res.ok) throw new Error(`Failed to fetch data.yaml (${res.status})`);
        return res.text();
      }),
      fetch('./glossary.yaml').then(res => {
        if (!res.ok) console.warn("Glossary fetch failed, skipping.");
        return res.ok ? res.text() : '';
      }),
      fetch('./glossary.md').then(res => {
        if (!res.ok) console.warn("Glossary Markdown fetch failed, skipping.");
        return res.ok ? res.text() : '';
      })
    ])
      .then(([dataText, glossaryText, glossaryMarkdown]) => {
        // 1. Process Main Data
        setYamlSource(dataText);
        try {
          const parsedData = jsyaml.load(dataText) as GenealogyData;
          if (!parsedData || !parsedData.pages) {
            throw new Error("Invalid Data Structure: Missing 'pages' array.");
          }
          setData(parsedData);
        } catch (e: any) {
          throw new Error("YAML Parse Error (data.yaml): " + e.message);
        }

        // 2. Process Glossary YAML (Terms)
        if (glossaryText) {
          try {
            const parsedGlossary = jsyaml.load(glossaryText) as GlossaryData;
            if (parsedGlossary && Array.isArray(parsedGlossary.terms)) {
              setGlossaryTerms(parsedGlossary.terms);
            } else {
              setGlossaryTerms([]);
            }
          } catch (e) {
            console.warn("Failed to parse glossary", e);
            setGlossaryTerms([]);
          }
        }

        // 3. Process Glossary Markdown
        if (glossaryMarkdown) {
          setGlossaryHtml(marked.parse(glossaryMarkdown) as string);
        }

        setIsLoading(false);
      })
      .catch(err => {
        console.error("Load Error", err);
        setError(err.message || "Failed to load application data.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const handleNavigate = (pageIndex: number, columnId?: number) => {
    if (!data) return;
    const safeIndex = Math.min(pageIndex, data.pages.length - 1);
    setCurrentPageIndex(safeIndex);

    if (columnId) {
      setHoveredColumnId(columnId);
      if (isMobile) {
        setMobileViewMode('read');
      }
      if (!isMobile && desktopViewMode === 'map') {
        setDesktopViewMode('digital');
      }
    }
  };

  // Helper for navigation from tree
  const handlePageIdNavigate = (pageId: string) => {
    if (!data) return;
    const index = data.pages.findIndex(p => p.page_id === pageId);
    if (index !== -1) {
      setCurrentPageIndex(index);
      // Auto switch to digital view to read
      if (isMobile) setMobileViewMode('read');
      else setDesktopViewMode('digital');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-paper dark:bg-zinc-950 text-stone-500">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-sm font-medium tracking-widest uppercase">Loading Archives...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-paper dark:bg-zinc-950 text-stone-500 p-8">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <AlertTriangle className="text-red-500" size={48} />
          <h2 className="text-xl font-bold text-ink dark:text-zinc-100">Data Loading Error</h2>
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
    <div className={`${isDarkMode ? 'dark' : ''} h-[100dvh] flex flex-col transition-colors duration-500 overflow-hidden`}>
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
        />

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">

          {/* LEFT SIDE (Desktop: Visuals / Mobile: Conditional) */}
          <div className={`
            flex-1 flex flex-col bg-[#F0EFEC] dark:bg-[#121214] relative transition-colors duration-500
            ${isMobile && (mobileViewMode === 'read' || mobileViewMode === 'glossary') ? 'hidden' : 'flex'}
            ${isMobile ? 'absolute inset-0 z-10' : ''}
          `}>
            {/* Desktop Controls */}
            <div className="hidden lg:block">
              <ViewerControls
                viewMode={desktopViewMode}
                setViewMode={setDesktopViewMode}
                pageIndex={currentPageIndex}
                totalPageCount={data.pages.length}
                onPrevPage={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                onNextPage={() => setCurrentPageIndex(Math.min(data.pages.length - 1, currentPageIndex + 1))}
              />
            </div>

            <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-texture-paper pb-20 lg:pb-0">
              {/* VIEW 1: IMAGE */}
              {((!isMobile && desktopViewMode === 'image') || (isMobile && mobileViewMode === 'image')) && (
                <ImagePanel
                  filename={currentPage.metadata.image_file}
                  pageIndex={currentPageIndex}
                />
              )}

              {/* VIEW 2: DIGITAL SCRIPT */}
              {((!isMobile && desktopViewMode === 'digital') || (isMobile && mobileViewMode === 'script')) && (
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

              {/* VIEW 3: MIGRATION MAP */}
              {((!isMobile && desktopViewMode === 'map') || (isMobile && mobileViewMode === 'map')) && (
                <MigrationMap
                  points={data.migration.points}
                  paths={data.migration.paths}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* VIEW 4: FAMILY TREE */}
              {((!isMobile && desktopViewMode === 'tree') || (isMobile && mobileViewMode === 'tree')) && (
                <FamilyTree onNavigate={handlePageIdNavigate} isDarkMode={isDarkMode} />
              )}

              {/* VIEW 5: GLOSSARY (Desktop Only - Mobile puts it in 'read' slot equivalent or own slot) */}
              {(!isMobile && desktopViewMode === 'glossary') && (
                <ContextGlossary terms={glossaryTerms} glossaryHtml={glossaryHtml} />
              )}
            </div>
          </div>

          {/* RIGHT SIDE (Desktop: Translation / Mobile: Conditional) */}
          {(isMobile || (desktopViewMode !== 'map' && desktopViewMode !== 'tree' && desktopViewMode !== 'glossary')) && (
            <div className={`
              w-full lg:w-[480px] xl:w-[600px] flex-none 
              border-l border-stone-200 dark:border-zinc-800 
              bg-paper dark:bg-zinc-900 
              shadow-[rgba(0,0,0,0.05)_0px_0px_40px] z-20
              transition-all duration-500
              ${isMobile && (mobileViewMode !== 'read' && mobileViewMode !== 'glossary') ? 'hidden' : 'flex flex-col h-full'}
              ${isMobile ? 'absolute inset-0 pt-0 pb-20' : ''}
            `}>
              {mobileViewMode === 'glossary' ? (
                <ContextGlossary terms={glossaryTerms} glossaryHtml={glossaryHtml} />
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
              { id: 'read', icon: BookOpen, label: 'READ' },
              { id: 'image', icon: ImageIcon, label: 'SCAN' },
              { id: 'script', icon: ScrollText, label: 'SCRIPT' },
              { id: 'map', icon: Map, label: 'MAP' },
              { id: 'tree', icon: Network, label: 'TREE' },
              { id: 'glossary', icon: BookA, label: 'CTX' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setMobileViewMode(btn.id as MobileViewMode)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg min-w-[3.5rem]
                  active:bg-stone-50 dark:active:bg-zinc-900 transition-all duration-200 active:scale-95
                  ${mobileViewMode === btn.id
                    ? 'text-cinnabar dark:text-red-400'
                    : 'text-stone-400 dark:text-zinc-600'}
                `}
              >
                <btn.icon size={20} strokeWidth={mobileViewMode === btn.id ? 2.5 : 2} />
                <span className="text-[9px] font-bold tracking-wider">{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Floating Pagination */}
          {(mobileViewMode !== 'map' && mobileViewMode !== 'tree' && mobileViewMode !== 'glossary') && (
            <div className="lg:hidden absolute bottom-24 right-4 z-40">
              <div className="flex items-center gap-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-stone-200 dark:border-zinc-700 rounded-full shadow-lg px-4 py-2 transition-all">
                <button
                  disabled={currentPageIndex === 0}
                  onClick={() => setCurrentPageIndex(p => p - 1)}
                  className="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-zinc-300 active:text-cinnabar border border-stone-200 dark:border-zinc-700 rounded-full bg-stone-50 dark:bg-zinc-800 disabled:opacity-30 transition-colors active:scale-95"
                >
                  <span className="text-xl font-bold pb-1">‹</span>
                </button>

                <span className="text-xs font-bold font-mono text-stone-600 dark:text-zinc-300 min-w-[3.5rem] text-center">
                  {currentPageIndex + 1} / {data.pages.length}
                </span>

                <button
                  disabled={currentPageIndex === data.pages.length - 1}
                  onClick={() => setCurrentPageIndex(p => p + 1)}
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