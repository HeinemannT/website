import React, { useState, useEffect } from 'react';
import { X, Search, FileText, Code, Book, ChevronRight, Library, Save, AlertCircle, Info } from 'lucide-react';
import { GenealogyData } from '../types';
import { marked } from 'marked';
import jsyaml from 'js-yaml';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  data: GenealogyData | null;
  onNavigate: (pageIndex: number, columnId?: number) => void;
  yamlSource: string;
  onUpdateYaml: (newSource: string, newData: GenealogyData) => void;
  activeTab: 'toc' | 'search' | 'docs' | 'glossary' | 'source';
  onTabChange: (tab: 'toc' | 'search' | 'docs' | 'glossary' | 'source') => void;
}

type Tab = 'toc' | 'search' | 'docs' | 'glossary' | 'source';

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, data, onNavigate, yamlSource, onUpdateYaml, activeTab, onTabChange }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [docHtml, setDocHtml] = useState('');
  const [glossaryHtml, setGlossaryHtml] = useState('');

  const [localSource, setLocalSource] = useState(yamlSource);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    setLocalSource(yamlSource);
  }, [yamlSource]);

  useEffect(() => {
    if (activeTab === 'docs' && !docHtml) {
      fetch('./documentation.md')
        .then(res => res.text())
        .then(text => {
          setDocHtml(marked.parse(text) as string);
        });
    }
  }, [activeTab, docHtml]);

  useEffect(() => {
    if (activeTab === 'glossary' && !glossaryHtml) {
      fetch('./glossary.md')
        .then(res => res.text())
        .then(text => {
          setGlossaryHtml(marked.parse(text) as string);
        });
    }
  }, [activeTab, glossaryHtml]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setLocalSource(newVal);

    try {
      const parsed = jsyaml.load(newVal) as GenealogyData;
      if (parsed && parsed.pages && parsed.metadata) {
        setParseError(null);
        onUpdateYaml(newVal, parsed);
      } else {
        setParseError("Invalid structure: Missing 'pages' or 'metadata'.");
      }
    } catch (err: any) {
      setParseError(err.message || "Invalid YAML");
    }
  };

  const searchResults = React.useMemo(() => {
    if (!searchQuery || !data) return [];
    const query = searchQuery.toLowerCase();
    const results: Array<{ pageIndex: number; columnId: number; text: string; translation: string }> = [];

    data.pages.forEach((page, pIdx) => {
      page.columns.forEach(col => {
        if (col.text_zh.includes(query) || col.translation.toLowerCase().includes(query)) {
          results.push({
            pageIndex: pIdx,
            columnId: col.id,
            text: col.text_zh,
            translation: col.translation
          });
        }
      });
    });
    return results;
  }, [searchQuery, data]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-[1100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`
        fixed top-0 right-0 bottom-0 w-full md:w-[600px] 
        bg-white dark:bg-zinc-900 
        shadow-2xl z-[1200] 
        transition-transform duration-300 ease-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>

        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-zinc-800">
          <h2 className="text-lg font-serif-tc font-bold text-ink dark:text-zinc-100">Reference Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-full">
            <X size={20} className="text-stone-500 dark:text-zinc-400" />
          </button>
        </div>

        <div className="flex border-b border-stone-200 dark:border-zinc-800 overflow-x-auto">
          {[
            { id: 'docs', icon: Info, label: 'About' },
            { id: 'toc', icon: Book, label: 'Contents' },
            { id: 'search', icon: Search, label: 'Search' },
            { id: 'glossary', icon: Library, label: 'Glossary' },
            { id: 'source', icon: Code, label: 'Source' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as Tab)}
              className={`
                flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium uppercase tracking-wider
                transition-colors min-w-[70px]
                ${activeTab === tab.id
                  ? 'text-cinnabar dark:text-red-400 border-b-2 border-cinnabar dark:border-red-400 bg-cinnabar/5 dark:bg-red-900/10'
                  : 'text-stone-400 dark:text-zinc-500 hover:text-stone-600 dark:hover:text-zinc-300'}
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden relative bg-stone-50 dark:bg-zinc-950/50">

          <div className="absolute inset-0 overflow-y-auto">

            {activeTab === 'toc' && data && (
              <div className="flex flex-col min-h-full divide-y divide-stone-100 dark:divide-zinc-800/50">
                {data.pages.map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => { onNavigate(idx); onClose(); }}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-stone-50 dark:hover:bg-zinc-800/50 transition-colors group text-left"
                  >
                    <span className="font-mono text-xs font-bold text-stone-400 dark:text-zinc-500 w-16 group-hover:text-cinnabar dark:group-hover:text-red-400 transition-colors">
                      {page.page_id}
                    </span>
                    <span className="text-sm font-medium text-ink dark:text-zinc-300 line-clamp-1 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
                      {page.metadata.title}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'search' && (
              <div className="p-4 flex flex-col min-h-full">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search text or translation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-cinnabar dark:focus:border-red-500 transition-colors text-ink dark:text-zinc-200"
                    autoFocus
                  />
                  <Search size={18} className="absolute left-3 top-3.5 text-stone-400" />
                </div>

                {searchQuery && (
                  <div className="text-xs text-stone-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                    {searchResults.length} results found
                  </div>
                )}

                <div className="space-y-3 pb-8">
                  {searchResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => { onNavigate(result.pageIndex, result.columnId); onClose(); }}
                      className="w-full text-left p-3 bg-white dark:bg-zinc-900 border-l-2 border-stone-200 dark:border-zinc-700 hover:border-cinnabar dark:hover:border-red-500 shadow-sm transition-all"
                    >
                      <div className="text-xs text-stone-400 dark:text-zinc-500 mb-1 flex justify-between">
                        <span>Page {data?.pages[result.pageIndex].metadata.physical_page_number}</span>
                        <span className="font-mono text-[10px] opacity-70">Col {result.columnId}</span>
                      </div>
                      <div className="font-serif-tc text-lg text-ink dark:text-zinc-300 mb-1">{result.text}</div>
                      <div className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2 font-body italic">"{result.translation}"</div>
                    </button>
                  ))}
                  {searchQuery && searchResults.length === 0 && (
                    <div className="text-center py-12 text-stone-400 dark:text-zinc-600">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="p-6 md:p-8 prose dark:prose-invert max-w-none font-body">
                <div dangerouslySetInnerHTML={{ __html: docHtml }} />
              </div>
            )}

            {activeTab === 'glossary' && (
              <div className="p-6 md:p-8 prose dark:prose-invert max-w-none font-body">
                <div dangerouslySetInnerHTML={{ __html: glossaryHtml }} />
              </div>
            )}

            {activeTab === 'source' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 relative">
                  <textarea
                    value={localSource}
                    onChange={handleSourceChange}
                    className="w-full h-full p-4 text-xs font-mono text-stone-700 dark:text-zinc-300 bg-stone-100 dark:bg-zinc-950/50 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cinnabar/50 border-0"
                    spellCheck={false}
                  />
                </div>
                <div className={`p-3 text-xs font-medium flex items-center gap-2 border-t ${parseError ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' : 'bg-white dark:bg-zinc-900 text-green-600 dark:text-green-400 border-stone-200 dark:border-zinc-800'}`}>
                  {parseError && (
                    <>
                      <AlertCircle size={14} />
                      <span>Error: {parseError}</span>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;