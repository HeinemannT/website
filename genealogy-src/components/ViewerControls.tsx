import React from 'react';
import { Image as ImageIcon, FileText, ChevronLeft, ChevronRight, Map } from 'lucide-react';

interface ViewerControlsProps {
  viewMode: 'image' | 'digital' | 'map';
  setViewMode: (mode: 'image' | 'digital' | 'map') => void;
  pageIndex: number;
  totalPageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const ViewerControls: React.FC<ViewerControlsProps> = ({
  viewMode,
  setViewMode,
  pageIndex,
  totalPageCount,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="absolute top-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-stone-200 dark:border-slate-700 rounded-full shadow-lg p-2 pointer-events-auto transition-colors duration-300">
        
        {/* Toggle */}
        <div className="flex bg-stone-100 dark:bg-slate-800 rounded-full p-1 mr-6">
          <button
            onClick={() => setViewMode('image')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === 'image'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-stone-500 dark:text-slate-500 hover:text-stone-800 dark:hover:text-slate-300'
            }`}
          >
            <ImageIcon size={16} />
            <span className="hidden md:inline">Original</span>
          </button>
          <button
            onClick={() => setViewMode('digital')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === 'digital'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-stone-500 dark:text-slate-500 hover:text-stone-800 dark:hover:text-slate-300'
            }`}
          >
            <FileText size={16} />
            <span className="hidden md:inline">Digital</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              viewMode === 'map'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-stone-500 dark:text-slate-500 hover:text-stone-800 dark:hover:text-slate-300'
            }`}
          >
            <Map size={16} />
            <span className="hidden md:inline">Map</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-stone-300 dark:bg-slate-700 mr-6"></div>

        {/* Pagination - Increased Sizes */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevPage}
            disabled={pageIndex === 0}
            className="p-3 rounded-full hover:bg-stone-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-slate-700 dark:text-slate-200 bg-stone-50 dark:bg-slate-800/50"
            aria-label="Previous Page"
          >
            <ChevronLeft size={28} />
          </button>
          
          <span className="font-mono text-xl font-bold text-stone-700 dark:text-slate-200 w-24 text-center select-none">
            {pageIndex + 1} / {totalPageCount}
          </span>
          
          <button
            onClick={onNextPage}
            disabled={pageIndex === totalPageCount - 1}
            className="p-3 rounded-full hover:bg-stone-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-slate-700 dark:text-slate-200 bg-stone-50 dark:bg-slate-800/50"
            aria-label="Next Page"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewerControls;