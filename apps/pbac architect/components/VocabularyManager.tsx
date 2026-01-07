import React, { useState } from 'react';
import { Vocabulary } from '../types';
import { IconAdd, IconTrash, IconSortAsc, IconSortDesc, IconSortNone } from '../icons';

interface VocabularyManagerProps {
    vocab: Vocabulary;
    setVocab: (v: Vocabulary) => void;
}

type SortOrder = 'asc' | 'desc' | 'none';

export const VocabularyManager: React.FC<VocabularyManagerProps> = ({ vocab, setVocab }) => {
  const [inputs, setInputs] = useState({ roles: '', types: '', properties: '' });
  const [sorts, setSorts] = useState<Record<keyof Vocabulary, SortOrder>>({ roles: 'none', types: 'none', properties: 'none' });

  const addItem = (category: keyof Vocabulary) => {
    const val = inputs[category].trim();
    if (!val) return;
    setVocab({ ...vocab, [category]: [...vocab[category], val] }); // No auto-sort on add
    setInputs(prev => ({ ...prev, [category]: '' }));
  };

  const removeItem = (category: keyof Vocabulary, val: string) => {
    setVocab({ ...vocab, [category]: vocab[category].filter(i => i !== val) });
  };

  const toggleSort = (category: keyof Vocabulary) => {
      const modes: SortOrder[] = ['none', 'asc', 'desc'];
      const next = modes[(modes.indexOf(sorts[category]) + 1) % modes.length];
      setSorts(prev => ({ ...prev, [category]: next }));
  }

  const renderSection = (title: string, category: keyof Vocabulary, placeholder: string) => {
    const sort = sorts[category];
    let items = [...vocab[category]];
    if (sort === 'asc') items.sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    if (sort === 'desc') items.sort((a,b) => b.toLowerCase().localeCompare(a.toLowerCase()));

    return (
        <div className="flex-1 flex flex-col min-w-[300px] bg-white border border-gray-200 shadow-sm h-full">
            <div className="p-4 border-b border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{title} <span className="text-gray-400 font-normal normal-case">({items.length})</span></h3>
                    <button onClick={() => toggleSort(category)} className="text-gray-500 hover:text-blue-600 p-1 bg-gray-100 rounded-sm" title="Sort">
                        {sort === 'none' && <IconSortNone />}
                        {sort === 'asc' && <IconSortAsc />}
                        {sort === 'desc' && <IconSortDesc />}
                    </button>
                </div>
                <div className="flex gap-2">
                    <input 
                        className="carbon-input flex-1 p-2 text-sm" 
                        value={inputs[category]} 
                        onChange={e => setInputs(prev => ({ ...prev, [category]: e.target.value }))} 
                        onKeyDown={e => e.key === 'Enter' && addItem(category)} 
                        placeholder={placeholder}
                    />
                    <button className="carbon-btn carbon-btn-primary h-9 w-9 px-0" onClick={() => addItem(category)}><IconAdd /></button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {items.map((item, i) => (
                    <div key={`${item}-${i}`} className="flex justify-between items-center text-sm p-2 bg-gray-50 hover:bg-blue-50 border-l-2 border-transparent hover:border-blue-500 group transition-colors">
                        <span className="font-mono text-gray-700 truncate" title={item}>{item}</span>
                        <button onClick={() => removeItem(category, item)} className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                            <IconTrash />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 h-full overflow-hidden flex flex-col">
      <h2 className="text-2xl font-light mb-6 text-gray-800 shrink-0">Vocabulary Manager</h2>
      <div className="flex gap-6 flex-1 min-h-0 overflow-x-auto pb-2">
        {renderSection('Roles', 'roles', 'e.g. role:auditor')}
        {renderSection('Types', 'types', 'e.g. CeDepartment')}
        {renderSection('Properties', 'properties', 'e.g. resource.department')}
      </div>
    </div>
  );
};