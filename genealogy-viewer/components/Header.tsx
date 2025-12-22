import React, { useState, useRef, useEffect } from 'react';
import { DocumentMetadata } from '../types';
import { Menu as MenuIcon, ALargeSmall, Monitor, Moon, Sun, ChevronsDown } from 'lucide-react';

interface HeaderProps {
  metadata: DocumentMetadata;
  isDarkMode: boolean;
  toggleDarkMode: (val: boolean) => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  metadata, 
  isDarkMode, 
  toggleDarkMode, 
  fontSize,
  setFontSize,
  onMenuToggle 
}) => {
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const styleMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (styleMenuRef.current && !styleMenuRef.current.contains(event.target as Node)) {
        setIsStyleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 dark:bg-zinc-950/90 backdrop-blur-md border-b border-stone-200 dark:border-zinc-800 px-4 md:px-8 py-3 transition-colors duration-300 z-30 shadow-sm relative">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        
        {/* Logo / Title Area - Redesigned to honor Xiaolao Village */}
        <div className="flex items-center gap-4">
          
          {/* 
             Traditional Seal (Stamp) Design 
             - Rotated slightly for organic feel
             - Double border effect using box-shadow and border
          */}
          <div className="relative group transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="
              flex flex-col items-center justify-center 
              bg-cinnabar dark:bg-red-800 
              text-stone-50 
              w-10 h-10 rounded-[2px]
              shadow-sm 
              border-2 border-red-800/30 dark:border-red-900/50
              leading-none
            ">
               {/* Inner Border for Stamp Effect */}
               <div className="absolute inset-0.5 border border-stone-50/30 rounded-[1px]"></div>
               
               <span className="font-serif-tc font-bold text-xs transform translate-y-[1px]">小</span>
               <span className="font-serif-tc font-bold text-lg transform -translate-y-[1px]">勞</span>
            </div>
          </div>

          <div className="flex flex-col justify-center border-l border-stone-300 dark:border-zinc-700 pl-4 h-9">
            <h1 className="text-lg font-serif-tc font-bold text-ink dark:text-zinc-100 tracking-wide leading-none mb-1">
              小勞村 <span className="text-stone-400 dark:text-zinc-500 font-normal mx-1">|</span> Xiaolao Village
            </h1>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-cinnabar dark:text-red-400 font-bold">
              Lao Clan Genealogy
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
           {/* Desktop Metadata */}
           <div className="hidden md:flex flex-col text-right text-[10px] md:text-xs text-stone-400 dark:text-zinc-600 font-medium uppercase tracking-widest">
              <span>{metadata.origin_location}</span>
           </div>

           <div className="flex items-center gap-2">
             
             {/* STYLE PICKER DROPDOWN */}
             <div className="relative" ref={styleMenuRef}>
               <button 
                 onClick={() => setIsStyleOpen(!isStyleOpen)}
                 className={`p-2 rounded-full transition-colors ${isStyleOpen ? 'bg-stone-100 dark:bg-zinc-800 text-ink dark:text-white' : 'hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-400'}`}
                 aria-label="Appearance Settings"
               >
                 <ALargeSmall size={20} />
               </button>

               {isStyleOpen && (
                 <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-stone-200 dark:border-zinc-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Theme Section */}
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Theme</span>
                      <div className="flex bg-stone-100 dark:bg-zinc-800 rounded-lg p-1">
                        <button 
                          onClick={() => toggleDarkMode(false)} 
                          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${!isDarkMode ? 'bg-white text-ink shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:text-zinc-400'}`}
                        >
                          <Sun size={14} /> Light
                        </button>
                        <button 
                          onClick={() => toggleDarkMode(true)} 
                          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${isDarkMode ? 'bg-zinc-700 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700 dark:text-zinc-400'}`}
                        >
                          <Moon size={14} /> Dark
                        </button>
                      </div>
                    </div>

                    {/* Font Size Section */}
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Text Size</span>
                      <div className="flex items-center justify-between gap-2">
                         <button 
                           onClick={() => setFontSize('sm')}
                           className={`h-8 w-8 flex items-center justify-center rounded border transition-all ${fontSize === 'sm' ? 'border-cinnabar text-cinnabar bg-cinnabar/5' : 'border-stone-200 dark:border-zinc-700 text-stone-500 hover:border-stone-300'}`}
                           aria-label="Small Text"
                         >
                           <span className="text-xs font-serif font-bold">A</span>
                         </button>
                         <button 
                           onClick={() => setFontSize('md')}
                           className={`h-8 w-8 flex items-center justify-center rounded border transition-all ${fontSize === 'md' ? 'border-cinnabar text-cinnabar bg-cinnabar/5' : 'border-stone-200 dark:border-zinc-700 text-stone-500 hover:border-stone-300'}`}
                           aria-label="Medium Text"
                         >
                           <span className="text-base font-serif font-bold">A</span>
                         </button>
                         <button 
                           onClick={() => setFontSize('lg')}
                           className={`h-8 w-8 flex items-center justify-center rounded border transition-all ${fontSize === 'lg' ? 'border-cinnabar text-cinnabar bg-cinnabar/5' : 'border-stone-200 dark:border-zinc-700 text-stone-500 hover:border-stone-300'}`}
                           aria-label="Large Text"
                         >
                           <span className="text-xl font-serif font-bold">A</span>
                         </button>
                      </div>
                    </div>

                 </div>
               )}
             </div>
             
             {/* Divider */}
             <div className="w-px h-5 bg-stone-300 dark:bg-zinc-700 mx-1"></div>

             <button 
               onClick={onMenuToggle}
               className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-300 transition-colors"
               aria-label="Open Menu"
             >
               <MenuIcon size={20} />
             </button>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;