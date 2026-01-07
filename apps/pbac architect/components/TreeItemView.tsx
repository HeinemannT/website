import React from 'react';
import { FileSystemItem, Category } from '../types';
import { IconChevronRight, IconChevronDown, IconFolder, IconFile, IconAdd, IconTrash } from '../icons';

interface TreeItemViewProps {
    item: FileSystemItem;
    level: number;
    selectedId: string;
    onSelect: (id: string) => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onAdd: (parentId: string, type: 'Category' | 'Policy') => void;
}

export const TreeItemView: React.FC<TreeItemViewProps> = ({ item, level, selectedId, onSelect, onToggle, onDelete, onAdd }) => {
    
    const isSelected = item.id === selectedId;
    const isCategory = item.itemType === 'Category';
    const cat = item as Category;

    return (
        <div>
            <div 
                className={`flex items-center gap-1 py-1 px-2 cursor-pointer text-xs select-none group ${isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100 text-gray-700'}`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={() => onSelect(item.id)}
            >
                <div onClick={(e) => { e.stopPropagation(); if(isCategory) onToggle(item.id); }} className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600">
                    {isCategory && (cat.collapsed ? <IconChevronRight /> : <IconChevronDown />)}
                </div>
                <div className={`w-4 h-4 flex items-center justify-center ${isCategory ? 'text-yellow-500' : 'text-blue-400'}`}>
                    {isCategory ? <IconFolder /> : <IconFile />}
                </div>
                <span className="flex-1 truncate font-medium">{item.name}</span>
                
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-gray-400">
                    {isCategory && (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); onAdd(item.id, 'Policy'); }} title="Add Policy" className="hover:text-blue-600"><IconAdd /></button>
                            <button onClick={(e) => { e.stopPropagation(); onAdd(item.id, 'Category'); }} title="Add Folder" className="hover:text-yellow-600"><IconFolder /></button>
                        </>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} title="Delete" className="hover:text-red-600"><IconTrash /></button>
                </div>
            </div>
            {isCategory && !cat.collapsed && cat.children.map(child => (
                <TreeItemView key={child.id} item={child} level={level + 1} selectedId={selectedId} onSelect={onSelect} onToggle={onToggle} onDelete={onDelete} onAdd={onAdd} />
            ))}
        </div>
    )
};