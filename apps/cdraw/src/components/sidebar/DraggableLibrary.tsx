import React from 'react';
import clsx from 'clsx';
import { UserIcon } from '../Icons';

export const DraggableItem = ({ label, icon, onDrag, compact }: { label: string, icon: React.ReactNode, onDrag: (e: React.DragEvent) => void, compact?: boolean }) => (
    <div
        className={clsx(
            "flex items-center gap-3 px-3 py-2 bg-white border border-gray-300 cursor-move hover:border-[#0f62fe] hover:shadow-sm transition-all",
        )}
        draggable
        onDragStart={onDrag}
    >
        {icon}
        <span className="text-[11px] font-semibold text-gray-800 uppercase tracking-tight truncate">{label}</span>
    </div>
);

export const DraggablePropertyBox = ({ type, label, symbol }: { type: string, label: string, symbol: React.ReactNode }) => {
    const onDragStart = (event: React.DragEvent) => {
        event.dataTransfer.setData('application/reactflow', 'property');
        event.dataTransfer.setData('application/payload', JSON.stringify({ type, label }));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="flex flex-col items-center justify-center p-1 bg-white border border-gray-300 cursor-move hover:bg-gray-50 hover:border-[#0f62fe] transition-all text-center shadow-sm h-11"
            draggable
            onDragStart={onDragStart}
        >
            <span className="font-mono text-[11px] font-bold text-gray-800">{symbol}</span>
            <span className="text-[9px] text-gray-500 uppercase tracking-wide font-semibold mt-0.5">{label}</span>
        </div>
    );
}

export const DraggableUserBox = ({ onDragStart }: { onDragStart: (e: React.DragEvent, type: string, payload: any) => void }) => (
    <div
        className="flex flex-col items-center justify-center p-1 bg-white border border-gray-300 cursor-move hover:bg-gray-50 hover:border-[#0f62fe] transition-all text-center shadow-sm h-10"
        draggable
        onDragStart={(e) => onDragStart(e, 'property', { type: 'ReferenceMethodConfig', label: 'User', config: { targetClass: 'user' } })}
    >
        <span className="font-mono text-[10px] font-bold text-gray-700"><UserIcon className="w-3 h-3" /></span>
        <span className="text-[8px] text-gray-500 uppercase tracking-wide font-semibold mt-0.5">User</span>
    </div>
);
