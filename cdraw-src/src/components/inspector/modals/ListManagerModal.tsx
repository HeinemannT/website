import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { useStore } from '../../../store';
import { ListPropertySet } from '../../../types';
import { CarbonInput, CarbonLabel } from '../ui/Shared';

export const ListManagerModal = ({ onClose, initialSelectedId }: { onClose: () => void, initialSelectedId?: string | null }) => {
    const listSets = useStore(state => state.listPropertySets);
    const addList = useStore(state => state.addListPropertySet);
    const updateList = useStore(state => state.updateListPropertySet);
    const deleteList = useStore(state => state.deleteListPropertySet);

    const [selectedListId, setSelectedListId] = useState<string | null>(initialSelectedId || listSets[0]?.id || null);

    const selectedList = listSets.find(l => l.id === selectedListId);

    const handleAddList = () => {
        const id = `lps_new_${Date.now()}`;
        addList({ id, name: 'New List', items: [{ id: 'item_1', name: 'New Item' }] });
        setSelectedListId(id);
    };

    const handleNameChange = (newName: string) => {
        if (!selectedList) return;
        const updates: Partial<ListPropertySet> = { name: newName };
        updateList(selectedList.id, updates);
    };

    const updateItem = (index: number, field: 'id' | 'name', value: string) => {
        if (!selectedList) return;
        const newItems = [...selectedList.items];
        newItems[index] = { ...newItems[index], [field]: value };
        updateList(selectedList.id, { items: newItems });
    };

    const addItem = () => {
        if (!selectedList) return;
        const newItems = [...selectedList.items, { id: `item_${Date.now()}`, name: 'New Item' }];
        updateList(selectedList.id, { items: newItems });
    };

    const removeItem = (index: number) => {
        if (!selectedList) return;
        const newItems = selectedList.items.filter((_, i) => i !== index);
        updateList(selectedList.id, { items: newItems });
    };

    return createPortal(
        <div className="fixed inset-0 bg-[#161616]/50 backdrop-blur-sm z-[9999] flex items-center justify-center font-sans">
            <div className="bg-white w-[700px] h-[500px] shadow-2xl flex flex-col border border-gray-300">
                <div className="px-4 py-3 bg-[#161616] text-white flex justify-between items-center shrink-0">
                    <h3 className="text-sm font-semibold uppercase tracking-wide">List Property Sets</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
                </div>
                <div className="flex-1 flex min-h-0">
                    <div className="w-1/3 border-r border-gray-200 bg-[#f4f4f4] flex flex-col">
                        <div className="p-2 border-b border-gray-200">
                            <button onClick={handleAddList} className="w-full py-2 bg-[#0f62fe] text-white text-xs font-semibold uppercase hover:bg-[#0353e9] transition-colors">+ New List Set</button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-0">
                            {listSets.map(list => (
                                <div
                                    key={list.id}
                                    onClick={() => setSelectedListId(list.id)}
                                    className={clsx(
                                        "px-4 py-3 text-sm cursor-pointer border-l-4 border-transparent hover:bg-[#e0e0e0] border-b border-gray-200",
                                        selectedListId === list.id ? "border-l-[#0f62fe] bg-white font-medium" : "text-gray-600"
                                    )}
                                >
                                    <span className="block truncate">{list.name}</span>
                                    <span className="text-[10px] text-gray-400 font-mono">{list.items.length} items</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 bg-white p-6 flex flex-col">
                        {selectedList ? (
                            <div className="space-y-6 flex-1 flex flex-col h-full">
                                <div className="space-y-4">
                                    <div>
                                        <CarbonLabel>List Name</CarbonLabel>
                                        <CarbonInput
                                            value={selectedList.name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <CarbonLabel>Internal ID <span className="text-gray-400 font-normal normal-case">(Immutable)</span></CarbonLabel>
                                        <div className="px-3 py-2 bg-gray-100 border-b border-gray-300 text-sm font-mono text-gray-500">
                                            {selectedList.id}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col min-h-0 border border-gray-200 mt-2">
                                    <div className="bg-[#f4f4f4] border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                                        <span className="text-xs font-semibold uppercase text-gray-600">Items</span>
                                        <button onClick={addItem} className="text-xs font-bold text-[#0f62fe] hover:underline uppercase">+ Add Item</button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto bg-white">
                                        <table className="w-full text-left border-collapse table-fixed">
                                            <thead className="bg-white sticky top-0 z-10 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-2 w-1/3">ID</th>
                                                    <th className="px-4 py-2">Name</th>
                                                    <th className="px-2 py-2 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {selectedList.items.map((item, idx) => (
                                                    <tr key={idx} className="group hover:bg-[#f4f4f4]">
                                                        <td className="px-4 py-1 align-top">
                                                            <input
                                                                className="w-full bg-transparent text-xs font-mono py-1 focus:outline-none focus:text-[#0f62fe]"
                                                                value={item.id}
                                                                onChange={(e) => updateItem(idx, 'id', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-1 align-top">
                                                            <input
                                                                className="w-full bg-transparent text-sm py-1 focus:outline-none focus:text-[#0f62fe] font-medium"
                                                                value={item.name}
                                                                onChange={(e) => updateItem(idx, 'name', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="px-2 py-1 text-center align-middle">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                                                                className="text-gray-300 hover:text-red-600 p-1 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                ✕
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-2 border-t border-gray-200 bg-[#f4f4f4] flex justify-end">
                                        <button
                                            onClick={() => { if (confirm('Delete entire list?')) deleteList(selectedList.id); }}
                                            className="text-xs text-red-600 hover:bg-red-100 px-3 py-1 font-semibold uppercase"
                                        >
                                            Delete Set
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a list to edit</div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
