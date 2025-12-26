import React, { useState, useRef, useEffect } from 'react';
import { DocumentMetadata } from '../types';
import { Menu as MenuIcon, Moon, Sun, Type, Book, Search, FileText, Library, Code, Info, Network } from 'lucide-react';

type Tab = 'toc' | 'search' | 'docs' | 'glossary' | 'source';

interface HeaderProps {
  metadata: DocumentMetadata;
  isDarkMode: boolean;
  toggleDarkMode: (val: boolean) => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  onMenuToggle: () => void;
  onOpenTab: (tab: Tab) => void;
  activeTab: Tab;
  viewMode: string;
  setViewMode: (mode: any) => void;
}

const Header: React.FC<HeaderProps> = ({
  metadata,
  isDarkMode,
  toggleDarkMode,
  fontSize,
  setFontSize,
  onMenuToggle,
  onOpenTab,
  activeTab,
  viewMode,
  setViewMode
}) => {
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const mobileFontMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isOutsideDesktop = fontMenuRef.current && !fontMenuRef.current.contains(target);
      const isOutsideMobile = mobileFontMenuRef.current && !mobileFontMenuRef.current.contains(target);

      if (isOutsideDesktop && isOutsideMobile) {
        setIsFontMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* ==============================================
          MOBILE / TABLET HEADER (Top Bar)
          Visible on screens < lg
      =============================================== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between px-4 shadow-sm">

        {/* Branding - Clean Box Stamp */}
        <div className="flex items-center gap-3">
          <div className="
             flex flex-col items-center justify-center 
             bg-cinnabar dark:bg-red-800 
             text-stone-50 
             w-8 h-8 rounded-[2px]
             shadow-sm 
             border-2 border-red-900/10 dark:border-red-900/50
             leading-none
           ">
            <div className="w-[26px] h-[26px] border border-stone-50/30 rounded-[1px] absolute pointer-events-none"></div>
            <span className="font-serif-tc font-bold text-[9px] transform translate-y-[1px]">小</span>
            <span className="font-serif-tc font-bold text-sm transform -translate-y-[1px]">勞</span>
          </div>
          <div>
            <h1 className="text-base font-serif-tc font-bold text-stone-800 dark:text-zinc-100 leading-none tracking-tight">
              Xiaolao Village
            </h1>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleDarkMode(!isDarkMode)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-stone-500 active:bg-stone-100 dark:text-zinc-400 dark:active:bg-zinc-800 transition-all active:scale-90 duration-150"
          >
            <div className={`transition-transform duration-500 ${isDarkMode ? 'rotate-180' : 'rotate-0'}`}>
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
          </button>

          {/* Mobile Font Menu Wrapper */}
          <div className="relative" ref={mobileFontMenuRef}>
            <button
              onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 duration-150 ${isFontMenuOpen ? 'bg-stone-100 dark:bg-zinc-800 text-cinnabar dark:text-red-400' : 'text-stone-500 active:bg-stone-100 dark:text-zinc-400 dark:active:bg-zinc-800'}`}
            >
              <Type size={20} />
            </button>

            {/* Mobile Font Menu Popover */}
            {isFontMenuOpen && (
              <div className="absolute top-12 right-0 mt-2 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 shadow-xl rounded-xl p-3 flex items-baseline gap-4 animate-in fade-in zoom-in-95 duration-200 min-w-[160px] justify-center z-50">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`group flex flex-col items-center p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-zinc-800 ${fontSize === 'sm' ? 'opacity-100' : 'opacity-50'}`}
                  title="Small Text"
                >
                  <span className="text-sm font-sans font-medium text-ink dark:text-zinc-100">Aa</span>
                  <div className={`mt-1 w-1 h-1 rounded-full ${fontSize === 'sm' ? 'bg-cinnabar' : 'bg-transparent'}`}></div>
                </button>

                <button
                  onClick={() => setFontSize('md')}
                  className={`group flex flex-col items-center p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-zinc-800 ${fontSize === 'md' ? 'opacity-100' : 'opacity-50'}`}
                  title="Medium Text"
                >
                  <span className="text-lg font-sans font-medium text-ink dark:text-zinc-100">Aa</span>
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${fontSize === 'md' ? 'bg-cinnabar' : 'bg-transparent'}`}></div>
                </button>

                <button
                  onClick={() => setFontSize('lg')}
                  className={`group flex flex-col items-center p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-zinc-800 ${fontSize === 'lg' ? 'opacity-100' : 'opacity-50'}`}
                  title="Large Text"
                >
                  <span className="text-2xl font-sans font-medium text-ink dark:text-zinc-100">Aa</span>
                  <div className={`mt-1 w-2 h-2 rounded-full ${fontSize === 'lg' ? 'bg-cinnabar' : 'bg-transparent'}`}></div>
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-stone-200 dark:bg-zinc-800 mx-1"></div>

          <button
            onClick={onMenuToggle}
            className="w-10 h-10 flex items-center justify-center text-stone-600 dark:text-zinc-300 active:bg-stone-100 dark:active:bg-zinc-800 rounded-full active:scale-95 transition-all duration-150"
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </header>


      {/* ==============================================
          DESKTOP SIDEBAR (Vertical Power Menu)
          Visible on screens >= lg
      =============================================== */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 z-50 w-16 bg-white dark:bg-zinc-900 border-r border-stone-200 dark:border-zinc-800 flex-col items-center py-6 gap-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

        {/* Top: Branding Stamp (Clean Box) */}
        <button
          onClick={() => onOpenTab('docs')}
          className="relative group select-none mb-2 cursor-pointer focus:outline-none"
          title="Xiaolao (Small Lao)"
        >
          <div className="
            flex flex-col items-center justify-center 
            bg-cinnabar dark:bg-red-800 
            text-stone-50 
            w-10 h-10 rounded-[2px]
            shadow-sm 
            border-2 border-red-800/30 dark:border-red-900/50
            leading-none
          ">
            <div className="absolute inset-0.5 border border-stone-50/30 rounded-[1px]"></div>
            <span className="font-serif-tc font-bold text-[10px] transform translate-y-[1px]">小</span>
            <span className="font-serif-tc font-bold text-base transform -translate-y-[1px]">勞</span>
          </div>
        </button>

        {/* Divider */}
        <div className="w-8 h-px bg-stone-200 dark:bg-zinc-800"></div>

        {/* SETTINGS GROUP (Top Priority) */}
        <div className="flex flex-col items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={() => toggleDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900 transition-all duration-300"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className={`transition-transform duration-500 ${isDarkMode ? 'rotate-180' : 'rotate-0'}`}>
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
          </button>

          {/* Font Size Popover */}
          <div className="relative" ref={fontMenuRef}>
            <button
              onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isFontMenuOpen ? 'bg-stone-100 dark:bg-zinc-800 text-cinnabar dark:text-red-400' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900'}`}
              title="Text Size"
            >
              <Type size={20} />
            </button>

            {/* Popover Menu - Professional Baseline Layout */}
            {isFontMenuOpen && (
              <div className="absolute left-14 top-0 ml-2 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 shadow-xl rounded-lg p-3 flex items-baseline gap-4 animate-in fade-in zoom-in-95 duration-200 min-w-[160px] justify-center z-50">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`group flex flex-col items-center transition-opacity ${fontSize === 'sm' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                  title="Small Text"
                >
                  <span className="text-sm font-sans font-medium text-ink dark:text-zinc-100">Aa</span>
                  <div className={`mt-1 w-1 h-1 rounded-full ${fontSize === 'sm' ? 'bg-cinnabar' : 'bg-transparent group-hover:bg-stone-200'}`}></div>
                </button>

                <button
                  onClick={() => setFontSize('md')}
                  className={`group flex flex-col items-center transition-opacity ${fontSize === 'md' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                  title="Medium Text"
                >
                  <span className="text-lg font-sans font-medium text-ink dark:text-zinc-100">Aa</span>
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${fontSize === 'md' ? 'bg-cinnabar' : 'bg-transparent group-hover:bg-stone-200'}`}></div>
                </button>

                <button
                  onClick={() => setFontSize('lg')}
                  className={`group flex flex-col items-center transition-opacity ${fontSize === 'lg' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                  title="Large Text"
                >
                  <span className="text-2xl font-sans font-medium text-ink dark:text-zinc-100">Aa</span>
                  <div className={`mt-1 w-2 h-2 rounded-full ${fontSize === 'lg' ? 'bg-cinnabar' : 'bg-transparent group-hover:bg-stone-200'}`}></div>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Divider */}
        <div className="w-8 h-px bg-stone-200 dark:bg-zinc-800"></div>

        {/* APP ICONS (Direct Access) */}
        <div className="flex flex-col gap-4 w-full items-center">

          {[
            { id: 'docs', icon: Info, label: 'About' },
            { id: 'toc', icon: Book, label: 'Contents' },
            { id: 'search', icon: Search, label: 'Search' },
            { id: 'glossary', icon: Library, label: 'Glossary' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onOpenTab(item.id as Tab)}
              className={`sidebar-icon-btn group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                      ${activeTab === item.id
                  ? 'bg-cinnabar text-white shadow-md'
                  : 'text-stone-500 dark:text-zinc-400 hover:text-stone-800 dark:hover:text-zinc-200 hover:bg-stone-50 dark:hover:bg-zinc-900'}
                   `}
              title={item.label}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : ''} />
            </button>
          ))}

          {/* Tree View (View Mode) */}
          <button
            onClick={() => setViewMode(viewMode === 'tree' ? 'digital' : 'tree')}
            className={`sidebar-icon-btn group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                      ${viewMode === 'tree'
                ? 'bg-cinnabar text-white shadow-md'
                : 'text-stone-500 dark:text-zinc-400 hover:text-stone-800 dark:hover:text-zinc-200 hover:bg-stone-50 dark:hover:bg-zinc-900'}
                   `}
            title="Family Tree"
          >
            <Network size={20} className={viewMode === 'tree' ? 'text-white' : ''} />
          </button>

        </div>

        {/* Flexible Spacer */}
        <div className="flex-1"></div>

        {/* Bottom: Extras */}
        <div className="flex flex-col items-center gap-4 mb-2">

          <button
            onClick={() => onOpenTab('source')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                  ${activeTab === 'source'
                ? 'bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-md'
                : 'text-stone-400 dark:text-zinc-500 hover:text-stone-800 dark:hover:text-zinc-200 hover:bg-stone-50 dark:hover:bg-zinc-900'}
               `}
            title="Source Data"
          >
            <Code size={18} />
          </button>

        </div>
      </aside >
    </>
  );
};


export default Header;