import React, { useState } from 'react';
import { ContentColumn, MarginaliaItem } from '../types';
import { X, Globe } from 'lucide-react';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface DigitalRecreationProps {
  columns: ContentColumn[];
  activeColumnId: number | null;
  onColumnHover: (id: number | null) => void;
  isMobile: boolean;
  marginalia?: MarginaliaItem[];
  fontSize: 'sm' | 'md' | 'lg';
}

const DigitalRecreation: React.FC<DigitalRecreationProps> = ({
  columns,
  activeColumnId,
  onColumnHover,
  isMobile,
  marginalia,
  // fontSize is purposely ignored for the Chinese script to maintain layout integrity
}) => {
  const [mobileSelectedId, setMobileSelectedId] = useState<number | null>(null);
  const dragProps = useDraggableScroll();

  const handleColumnClick = (id: number) => {
    // Enable selection on both mobile and desktop
    setMobileSelectedId(id);
  };

  const selectedColumn = columns.find(c => c.id === mobileSelectedId);

  // Helper to position marginalia
  const getMarginaliaStyle = (pos: string): React.CSSProperties => {
    switch (pos) {
      case 'top_left': return { top: '30px', left: '30px' };
      case 'top_right': return { top: '30px', right: '30px' };
      case 'center_right': return { top: '50%', right: '10px', transform: 'translateY(-50%)' };
      case 'bottom_left': return { bottom: '30px', left: '30px' };
      default: return { top: '30px', right: '30px' };
    }
  };

  return (
    <div className="w-full h-full relative bg-texture-paper overflow-hidden">

      {/* 
        Scrollable Container 
        dir="rtl" is CRITICAL here. 
        It forces the browser to treat the 'start' of the scrollable area as the Right side.
        This matches the 'vertical-rl' text flow where content starts right and grows left.
        Without this, content growing leftwards goes into negative scroll space and is unreachable on LTR systems.
      */}
      <div
        ref={dragProps.ref}
        className={`
          absolute inset-0 overflow-auto flex flex-row
          scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
          ${dragProps.cursorClass}
        `}
        dir="rtl"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        {...dragProps.events}
      >

        {/* Container for the paper. margin-auto centers it if smaller than viewport */}
        <div className="m-auto p-4 pb-24 md:p-8 min-h-full flex items-center">
          <div className="
            relative h-fit min-h-[600px] w-auto flex-shrink-0
            bg-texture-silk dark:bg-zinc-900 dark:bg-none
            p-3 md:p-4
            shadow-xl
            rounded-sm
            border border-stone-300 dark:border-zinc-700
            select-none
            ">
            {/* Inner Border Decoration */}
            <div className="absolute inset-2 border border-stone-400/30 dark:border-white/10 pointer-events-none rounded-sm"></div>

            <div
              className="
                relative 
                min-h-[600px] 
                bg-[#fdfbf7] dark:bg-[#0f0f10]
                shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]
                py-16 px-10 md:px-16
                transition-colors duration-500
                flex flex-col flex-wrap content-start items-start
                "
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'upright',
                boxShadow: '0 0 10px rgba(0,0,0,0.05)'
              }}
            >
              {/* Noise Texture Overlay (Cleaner in Dark Mode) */}
              <div className="absolute inset-0 pointer-events-none opacity-40 dark:hidden mix-blend-multiply"
                style={{
                  filter: 'contrast(1.1) brightness(0.98)',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`
                }}>
              </div>

              {/* Paper Grain Lines */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{
                  backgroundImage: 'linear-gradient(to left, #A63434 1px, transparent 1px)',
                  backgroundSize: '40px 100%'
                }}>
              </div>

              {marginalia?.map((m, i) => (
                <div
                  key={i}
                  className="absolute z-20 text-cinnabar dark:text-red-400 font-serif-tc font-bold select-none opacity-85"
                  style={{
                    writingMode: 'horizontal-tb',
                    ...getMarginaliaStyle(m.position)
                  }}
                  title={m.note}
                >
                  <div className={`
                            border-2 border-cinnabar dark:border-red-400 
                            flex items-center justify-center text-lg shadow-sm bg-[#fdfbf7] dark:bg-zinc-900 transform rotate-12
                            ${m.text.length > 1 ? 'px-3 py-1 rounded-2xl min-w-[36px]' : 'w-9 h-9 rounded-full'}
                        `}>
                    <span className="leading-none pb-0.5">{m.text}</span>
                  </div>
                </div>
              ))}

              {columns.map((col, index) => {
                // New schema uses 'elevation' (-1 is raised) and 'is_interlinear'
                const isRaised = col.elevation === -1;
                const isInterlinear = col.is_interlinear;
                const isActive = activeColumnId === col.id || mobileSelectedId === col.id;

                return (
                  <div
                    key={col.id}
                    onMouseEnter={() => !isMobile && onColumnHover(col.id)}
                    onMouseLeave={() => !isMobile && onColumnHover(null)}
                    onClick={() => handleColumnClick(col.id)}
                    className={`
                        relative group flex-shrink-0
                        px-2 md:px-3
                        transition-all duration-300 pointer-events-auto cursor-pointer z-10
                        border-l border-stone-300/30 dark:border-zinc-700/50 dashed
                        ${index === 0 ? 'border-r border-stone-300/30 dark:border-zinc-700/50' : ''}
                        ${isRaised ? 'pt-4 pb-12' : 'pt-24 pb-4'}
                        ${isActive ? 'bg-cinnabar/10 dark:bg-red-900/30' : ''}
                    `}
                  >
                    <div
                      className={`
                        font-serif-tc text-xl leading-[1.5] tracking-widest
                        transition-all duration-300 select-none whitespace-nowrap
                        ${isRaised ? 'font-bold' : 'font-normal'}
                        ${isInterlinear ? 'text-sm leading-relaxed opacity-80' : ''}
                        ${isActive
                          ? 'text-cinnabar dark:text-red-400 drop-shadow-sm font-semibold'
                          : 'text-stone-800 dark:text-zinc-400 opacity-90'}
                        `}
                    >
                      {col.text_zh}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={`
        lg:hidden fixed bottom-16 left-0 right-0 
        bg-white dark:bg-zinc-900 border-t border-cinnabar/20 dark:border-red-900/30 
        shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-50
        transition-transform duration-300 transform
        ${mobileSelectedId !== null ? 'translate-y-0' : 'translate-y-[110%]'}
      `}>
        {selectedColumn && (
          <div className="p-6 relative max-h-[60vh] overflow-y-auto">
            <button
              onClick={() => setMobileSelectedId(null)}
              className="absolute top-2 right-2 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300"
            >
              <X size={20} />
            </button>

            <div className="pr-8">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-cinnabar dark:text-red-400" />
                <span className="text-[10px] font-bold text-cinnabar dark:text-red-400 uppercase tracking-widest block">
                  English Translation
                </span>
              </div>
              <p className="font-body text-lg leading-relaxed text-ink dark:text-zinc-200">
                {selectedColumn.translation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default DigitalRecreation;