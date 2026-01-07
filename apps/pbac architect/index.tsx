import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Category, Policy, Vocabulary } from './types';
import { DEFAULT_VOCABULARY } from './constants';
import { createDefaultCategory, createDefaultPolicy, policyToJson, generateExtendedCodeFragment, jsonToPolicy } from './utils';
import { IconFolder, IconAdd } from './icons';
import { TreeItemView } from './components/TreeItemView';
import { VocabularyManager } from './components/VocabularyManager';
import { GlobalScriptView } from './components/GlobalScriptView';
import { ImportView } from './components/ImportView';
import { InteractiveJson } from './components/InteractiveJson';
import { PolicyEditor } from './components/PolicyEditor';
import { useFileSystem } from './hooks/useFileSystem';

// -- Main Application --

const App = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'vocabulary' | 'global' | 'import'>('editor');
  
  // Custom Hook for File System Logic
  const fs = useFileSystem([
      { ...createDefaultCategory("General Access"), children: [createDefaultPolicy()] }
  ]);

  const [selectedId, setSelectedId] = useState<string>((fs.items[0] as Category).children[0].id);
  const [vocab, setVocab] = useState<Vocabulary>(DEFAULT_VOCABULARY);
  const [rightPaneTab, setRightPaneTab] = useState<'json' | 'extended'>('json');
  const [targetId, setTargetId] = useState<string>('root');

  const selectedItem = fs.findItem(selectedId);

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this item?')) {
          fs.deleteItem(id);
          if(selectedId === id) setSelectedId(''); 
      }
  };

  const handleAdd = (parentId: string, type: 'Category' | 'Policy') => {
      const newItem = fs.addItem(parentId, type);
      if (type === 'Policy') setSelectedId(newItem.id);
  };

  const handleAddRoot = (type: 'Category' | 'Policy') => {
      const newItem = fs.addRootItem(type);
      if (type === 'Policy') setSelectedId(newItem.id);
  };

  const handleInteractiveUpdate = (newData: any) => {
      if (!selectedItem || selectedItem.itemType !== 'Policy') return;
      const jsonStr = JSON.stringify(newData);
      const newPol = jsonToPolicy(jsonStr, selectedItem.id, selectedItem.name);
      if (newPol) fs.updateItem(newPol);
  };

  return (
    <>
      <header className="h-10 bg-[#161616] text-white flex items-center px-4 justify-between shrink-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
            <span className="font-semibold tracking-wide flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500"></div>
                PBAC Architect
            </span>
            <nav className="flex h-10">
                {[{ id: 'editor', label: 'Editor' }, { id: 'vocabulary', label: 'Vocabulary' }, { id: 'global', label: 'Export' }, { id: 'import', label: 'Import' }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-3 h-full text-xs font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-500 text-white bg-[#262626]' : 'border-transparent text-gray-400 hover:text-white hover:bg-[#262626]'}`}>{tab.label}</button>
                ))}
            </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'editor' && (
            <aside className="w-64 bg-[#f3f3f3] border-r border-gray-300 flex flex-col shrink-0">
                <div className="p-2 border-b border-gray-300 bg-white flex gap-2">
                    <button onClick={() => handleAddRoot('Category')} className="carbon-btn carbon-btn-primary flex-1 h-7 text-xs px-2"><IconFolder /> <span className="ml-1">Folder</span></button>
                    <button onClick={() => handleAddRoot('Policy')} className="carbon-btn carbon-btn-ghost border border-blue-500 flex-1 h-7 text-xs px-2"><IconAdd /> <span className="ml-1">Policy</span></button>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                    {fs.items.map(item => (
                        <TreeItemView 
                            key={item.id} 
                            item={item} 
                            level={0} 
                            selectedId={selectedId} 
                            onSelect={setSelectedId} 
                            onToggle={fs.toggleCategory} 
                            onDelete={handleDelete} 
                            onAdd={handleAdd} 
                        />
                    ))}
                </div>
            </aside>
        )}

        <main className="flex-1 flex flex-col bg-white overflow-hidden relative min-w-0">
            {activeTab === 'vocabulary' ? (
                <VocabularyManager vocab={vocab} setVocab={setVocab} />
            ) : activeTab === 'global' ? (
                <GlobalScriptView items={fs.items} />
            ) : activeTab === 'import' ? (
                <ImportView onImport={(newItems) => { fs.setItems(newItems); setActiveTab('editor'); }} />
            ) : (
                selectedItem ? (
                    selectedItem.itemType === 'Category' ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                            <IconFolder />
                            <input 
                                className="mt-4 text-xl bg-transparent text-center border-b border-gray-300 outline-none focus:border-blue-500 text-gray-800"
                                value={selectedItem.name}
                                onChange={e => fs.updateItem({...selectedItem, name: e.target.value} as Category)}
                            />
                            <p className="text-xs mt-2">Folder / Spacer Category</p>
                        </div>
                    ) : (
                        <div className="flex h-full">
                            {/* Visual Editor (50%) */}
                            <div className="w-1/2 bg-gray-50 border-r border-gray-300 overflow-hidden">
                                <PolicyEditor 
                                    policy={selectedItem as Policy} 
                                    vocab={vocab} 
                                    onChange={(updated) => fs.updateItem(updated)} 
                                />
                            </div>

                            {/* Right Pane (50%) */}
                            <div className="w-1/2 bg-[#1e1e1e] flex flex-col shrink-0">
                                <div className="flex border-b border-gray-700 bg-[#252526] justify-between items-center pr-2">
                                    <div className="flex">
                                        <button onClick={() => setRightPaneTab('json')} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${rightPaneTab === 'json' ? 'text-blue-400 border-b-2 border-blue-400 bg-[#1e1e1e]' : 'text-gray-500 hover:text-gray-300'}`}>Interactive JSON</button>
                                        <button onClick={() => setRightPaneTab('extended')} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${rightPaneTab === 'extended' ? 'text-blue-400 border-b-2 border-blue-400 bg-[#1e1e1e]' : 'text-gray-500 hover:text-gray-300'}`}>Extended Code</button>
                                    </div>
                                    {rightPaneTab === 'extended' && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] text-gray-500 font-mono">t.</span>
                                            <input 
                                                className="bg-[#1e1e1e] border border-gray-600 text-gray-300 text-xs px-1 py-0.5 w-24 outline-none focus:border-blue-500" 
                                                value={targetId} 
                                                onChange={e => setTargetId(e.target.value)} 
                                                placeholder="Parent ID" 
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                                    {rightPaneTab === 'json' ? (
                                        <InteractiveJson 
                                            data={policyToJson(selectedItem as Policy)} 
                                            onUpdate={handleInteractiveUpdate}
                                            vocab={vocab}
                                        />
                                    ) : (
                                        <div className="font-mono text-xs text-gray-400 break-all whitespace-pre-wrap leading-5 selection:bg-blue-900">
                                            {generateExtendedCodeFragment(selectedItem as Policy, { type: 'target', value: targetId })}
                                        </div>
                                    )}
                                </div>
                                {rightPaneTab === 'json' && (
                                    <div className="p-2 bg-[#252526] text-[10px] text-gray-500 border-t border-gray-700 text-center">
                                        Tip: Click colored values to edit.
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <p>Select an item from the sidebar or create a new one.</p>
                    </div>
                )
            )}
        </main>
      </div>
    </>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(<App />);