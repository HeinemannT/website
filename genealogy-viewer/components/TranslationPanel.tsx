import React, { useEffect, useRef, useState } from 'react';
import { ContentColumn, PageMetadata, MarginaliaItem } from '../types';
import { Info, Compass, Calendar, Book, ChevronDown, MapPin, Landmark, BookOpen, X } from 'lucide-react';

interface TranslationPanelProps {
  columns: ContentColumn[];
  activeColumnId: number | null;
  onColumnHover: (id: number | null) => void;
  summary: string;
  isMobile: boolean;
  pageMetadata?: PageMetadata;
  marginalia?: MarginaliaItem[];
  fontSize: 'sm' | 'md' | 'lg';
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({
  columns,
  activeColumnId,
  onColumnHover,
  summary,
  isMobile,
  pageMetadata,
  marginalia,
  fontSize
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  
  // State for tracking which notes are expanded.
  const [expandedNoteIds, setExpandedNoteIds] = useState<Set<number>>(new Set());
  const [selectedMobileId, setSelectedMobileId] = useState<number | null>(null);
  const [selectedMarginaliaIndex, setSelectedMarginaliaIndex] = useState<number | null>(null);

  useEffect(() => {
    // Only auto-scroll on desktop when hovering the script side
    if (!isMobile && activeColumnId !== null) {
      const el = itemRefs.current.get(activeColumnId);
      if (el && scrollRef.current) {
         const rect = el.getBoundingClientRect();
         const containerRect = scrollRef.current.getBoundingClientRect();
         if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
             el.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
      }
    }
  }, [activeColumnId, isMobile]);

  const toggleNote = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    setExpandedNoteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleParagraphClick = (id: number) => {
    if (isMobile) {
      setSelectedMobileId(id);
    }
    onColumnHover(id);
  };

  const selectedColumn = columns.find(c => c.id === selectedMobileId);

  const getTextSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-base';
      case 'lg': return 'text-xl';
      default: return 'text-lg'; // md
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      
      {/* Scrollable Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 md:px-12 py-10 space-y-6">
        
        {/* SUMMARY SECTION - Compact Design */}
        <div className="bg-stone-50 dark:bg-zinc-800/40 rounded-sm p-6 border border-stone-200 dark:border-zinc-800 shadow-sm mb-8 relative z-20">
          <div className="flex gap-4">
             {/* Icon Column */}
             <div className="shrink-0 mt-1.5">
                <Book size={20} className="text-cinnabar dark:text-red-400 opacity-90" />
             </div>
             
             {/* Content Column */}
             <div className="flex-1 space-y-3">
                 <p className="text-xl md:text-2xl font-heading leading-tight text-ink dark:text-zinc-100">
                    {summary}
                 </p>

                 {/* Metadata & Marginalia Row */}
                 <div className="flex flex-wrap items-center gap-3">
                     {/* Physical Page Meta */}
                     {pageMetadata && pageMetadata.archival_marks && (
                        <div className="flex flex-wrap gap-2">
                          {pageMetadata.archival_marks.map((mark, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 text-stone-500 dark:text-zinc-400 text-[10px] uppercase font-bold tracking-wider rounded-sm">
                              {mark}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Marginalia Display */}
                      {marginalia && marginalia.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3">
                           {marginalia.map((m, i) => {
                              const isSelected = selectedMarginaliaIndex === i;
                              const hasNote = !!m.note;

                              if (!hasNote) {
                                return (
                                  <div key={i} className="flex items-center gap-2 px-2 py-1 rounded-sm border border-cinnabar/30 bg-transparent text-cinnabar dark:text-red-400 opacity-80 cursor-default">
                                     <span className="font-serif-tc font-bold text-lg leading-none">{m.text}</span>
                                  </div>
                                );
                              }

                              return (
                                <div key={i} className="relative">
                                  <button 
                                     onClick={() => setSelectedMarginaliaIndex(isSelected ? null : i)}
                                     className={`
                                       flex items-center gap-2 px-2 py-1 rounded-sm border transition-all duration-200
                                       ${isSelected 
                                         ? 'bg-cinnabar text-white border-cinnabar' 
                                         : 'bg-transparent text-cinnabar dark:text-red-400 border-cinnabar/30 hover:bg-cinnabar/5'}
                                     `}
                                  >
                                     <span className="font-serif-tc font-bold text-lg leading-none">{m.text}</span>
                                     <Info size={12} className={isSelected ? 'text-white/80' : 'text-cinnabar/60'} />
                                  </button>
                                  
                                  {isSelected && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 p-3 rounded shadow-xl z-30 text-xs font-body animate-in fade-in slide-in-from-top-1 duration-200">
                                       <p className="text-stone-700 dark:text-zinc-300 italic">{m.note}</p>
                                    </div>
                                  )}
                                </div>
                              );
                           })}
                        </div>
                      )}
                 </div>
             </div>
          </div>
        </div>

        {columns.map((col) => {
          const isActive = activeColumnId === col.id;
          const isNoteExpanded = expandedNoteIds.has(col.id);
          
          const hasTranslatorNote = !!col.translator_note || (col.normalized_entities && col.normalized_entities.length > 0);
          const hasRecord = !!col.map_data;
          const hasAnyNote = hasTranslatorNote || hasRecord || !!col.geography_data;
          
          return (
            <div
              key={col.id}
              ref={(el) => {
                if (el) itemRefs.current.set(col.id, el);
                else itemRefs.current.delete(col.id);
              }}
              onMouseEnter={() => !isMobile && onColumnHover(col.id)}
              onMouseLeave={() => !isMobile && onColumnHover(null)}
              onClick={() => handleParagraphClick(col.id)}
              className="relative cursor-pointer group"
            >
                <div className={`
                    pl-6 border-l-4 transition-colors duration-300
                    ${isActive ? 'border-cinnabar dark:border-red-500' : 'border-transparent'}
                `}>
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <p className={`
                                font-body ${getTextSizeClass()} leading-[1.6]
                                transition-colors duration-300
                                ${isActive ? 'text-ink dark:text-zinc-100' : 'text-stone-600 dark:text-zinc-400'}
                            `}>
                            {col.translation}
                            </p>
                        </div>

                        {hasAnyNote && (
                            <button 
                              onClick={(e) => toggleNote(e, col.id)}
                              className="mt-1 flex flex-col items-center gap-1 group/btn"
                              aria-label="Toggle Note"
                            >
                              {hasTranslatorNote && (
                                <div className={`
                                  w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200
                                  ${isNoteExpanded 
                                    ? 'bg-stone-800 text-white border-stone-800 dark:bg-zinc-200 dark:text-zinc-900' 
                                    : 'bg-white dark:bg-zinc-900 border-stone-300 dark:border-zinc-700 text-stone-400 dark:text-zinc-500 group-hover/btn:text-cinnabar group-hover/btn:border-cinnabar'}
                                `}>
                                   {isNoteExpanded ? <ChevronDown size={14} /> : <span className="font-serif font-bold italic text-sm">i</span>}
                                </div>
                              )}
                              {hasRecord && (
                                <div className={`
                                  w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200
                                  ${isNoteExpanded && !hasTranslatorNote 
                                    ? 'bg-stone-800 text-white border-stone-800' 
                                    : 'bg-[#e8e6e1] dark:bg-zinc-800 border-stone-300 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 group-hover/btn:text-cinnabar group-hover/btn:border-cinnabar'}
                                `} title="Historical Record Available">
                                   <Landmark size={12} className="stroke-[2.5]" />
                                </div>
                              )}
                            </button>
                        )}
                    </div>

                    <div className={`
                        grid transition-[grid-template-rows] duration-300 ease-out
                        ${isNoteExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
                    `}>
                        <div className="overflow-hidden">
                            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-zinc-800/60 pb-2 space-y-4">
                                {col.translator_note && (
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-zinc-500 tracking-widest mb-1 block font-sans">
                                        Note
                                    </span>
                                    <p className="font-body italic text-base text-stone-700 dark:text-zinc-300 leading-relaxed pl-2 border-l-2 border-stone-300 dark:border-zinc-700">
                                        {col.translator_note}
                                    </p>
                                </div>
                                )}

                                {col.map_data && (
                                  <div className="bg-[#e8e6e1] dark:bg-zinc-800/40 p-4 rounded-sm border border-[#d6d3cb] dark:border-zinc-700 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-stone-300 dark:border-zinc-700 border-dashed">
                                      <Landmark size={14} className="text-stone-700 dark:text-zinc-400" />
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-800 dark:text-zinc-300">
                                        Historical Record
                                      </span>
                                    </div>
                                    <div className="flex flex-col gap-1.5 font-body">
                                       <div className="flex justify-between items-baseline">
                                          <span className="text-xs font-bold text-stone-900 dark:text-zinc-200 uppercase tracking-wider">{col.map_data.event_type}</span>
                                          <span className="text-sm font-semibold text-stone-800 dark:text-zinc-300">{col.map_data.event_date}</span>
                                       </div>
                                       <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-400 text-xs">
                                          <MapPin size={12} />
                                          <span>{col.map_data.location_name}</span>
                                       </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          );
        })}
        <div className="h-32"></div>
      </div>
      
      <div className={`
        lg:hidden fixed bottom-16 left-0 right-0 
        bg-white dark:bg-zinc-900 border-t border-cinnabar/20 dark:border-red-900/30 
        shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-50
        transition-transform duration-300 transform
        ${selectedMobileId !== null ? 'translate-y-0' : 'translate-y-[110%]'}
      `}>
          {selectedColumn && (
            <div className="p-6 relative max-h-[60vh] overflow-y-auto">
               <button onClick={() => setSelectedMobileId(null)} className="absolute top-2 right-2 p-2 text-stone-400 hover:text-stone-600"><X size={20}/></button>
               <div className="pr-8">
                  <span className="text-[10px] font-bold text-cinnabar dark:text-red-400 uppercase tracking-widest mb-2 block">Original Text</span>
                  <p className="font-serif-tc text-3xl text-ink dark:text-zinc-200 leading-relaxed">{selectedColumn.text_zh}</p>
               </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default TranslationPanel;