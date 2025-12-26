import React from 'react';
import { useStore } from '../../store';
import { ContextMenuData } from '../../types';

export const ContextMenu = ({ data, onClose }: { data: ContextMenuData, onClose: () => void }) => {
    const deleteNode = useStore(state => state.deleteSelection);
    const duplicateNode = useStore(state => state.duplicateNode);
    const toggleLock = useStore(state => state.toggleLock);

    return (
        <div
            className="fixed z-50 bg-[#161616] border border-gray-700 shadow-2xl py-1 w-48 animate-fade-in rounded-none text-white"
            style={{ top: data.top, left: data.left }}
        >
            {data.type === 'node' && (
                <>
                    <button
                        onClick={() => { toggleLock(data.id); onClose(); }}
                        className="w-full text-left px-4 py-3 text-xs hover:bg-[#393939] font-bold uppercase tracking-wide flex items-center justify-between"
                    >
                        Toggle Lock
                    </button>
                    <button
                        onClick={() => { duplicateNode(data.id); onClose(); }}
                        className="w-full text-left px-4 py-3 text-xs hover:bg-[#393939] font-bold uppercase tracking-wide"
                    >
                        Duplicate
                    </button>
                    <div className="border-b border-gray-700 my-1" />
                    <button
                        onClick={() => { deleteNode(); onClose(); }}
                        className="w-full text-left px-4 py-3 text-xs hover:bg-red-900 text-red-400 font-bold uppercase tracking-wide"
                    >
                        Delete
                    </button>
                </>
            )}
            {data.type === 'edge' && (
                <button
                    onClick={() => { deleteNode(); onClose(); }}
                    className="w-full text-left px-4 py-3 text-xs hover:bg-red-900 text-red-400 font-bold uppercase tracking-wide"
                >
                    Delete Relationship
                </button>
            )}
        </div>
    );
};
