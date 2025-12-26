import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { useStore } from '../../store';
import { Tooltip } from '../Tooltip';
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon, DistributeHorizontalIcon, DistributeVerticalIcon, UserIcon } from '../Icons';
import clsx from 'clsx';

export const ToolbarButton = ({ onClick, disabled, active, children, tooltip }: any) => (
    <Tooltip content={tooltip}>
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "w-10 h-10 flex items-center justify-center transition-all border-r border-gray-200 last:border-r-0",
                active ? "bg-[#161616] text-white" : "bg-white text-gray-700 hover:bg-gray-100",
                disabled && "opacity-50 cursor-not-allowed hover:bg-white text-gray-300"
            )}
        >
            {children}
        </button>
    </Tooltip>
);

export const HistoryControls = () => {
    const { undo, redo } = useStore.temporal.getState();
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    React.useEffect(() => {
        return useStore.temporal.subscribe((state) => {
            setCanUndo(state.pastStates.length > 0);
            setCanRedo(state.futureStates.length > 0);
        });
    }, []);

    return (
        <div className="flex bg-white border border-gray-300 shadow-sm h-10">
            <ToolbarButton onClick={() => undo()} disabled={!canUndo} tooltip="Undo (Ctrl+Z)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
            </ToolbarButton>
            <ToolbarButton onClick={() => redo()} disabled={!canRedo} tooltip="Redo (Ctrl+Y)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7" /></svg>
            </ToolbarButton>
        </div>
    );
};

export const DrawingControls = () => {
    const alignNodes = useStore(state => state.alignNodes);
    const distributeNodes = useStore(state => state.distributeNodes);
    const selectedNodeId = useStore(state => state.selectedNodeId);

    const hasSelection = !!selectedNodeId;

    return (
        <div className="flex bg-white border border-gray-300 shadow-sm h-10">
            <ToolbarButton onClick={() => alignNodes('left')} disabled={!hasSelection} tooltip="Align Left">
                <AlignLeftIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => alignNodes('center')} disabled={!hasSelection} tooltip="Align Center">
                <AlignCenterIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => alignNodes('right')} disabled={!hasSelection} tooltip="Align Right">
                <AlignRightIcon className="w-4 h-4" />
            </ToolbarButton>
            <div className="w-px bg-gray-300 h-full"></div>
            <ToolbarButton onClick={() => distributeNodes('horizontal')} tooltip="Distribute Horizontal">
                <DistributeHorizontalIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => distributeNodes('vertical')} tooltip="Distribute Vertical">
                <DistributeVerticalIcon className="w-4 h-4" />
            </ToolbarButton>
        </div>
    );
}

export const ZoomControls = () => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    return (
        <div className="flex bg-white border border-gray-300 shadow-sm h-10">
            <ToolbarButton onClick={() => zoomOut()} tooltip="Zoom Out">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            </ToolbarButton>
            <ToolbarButton onClick={() => zoomIn()} tooltip="Zoom In">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            </ToolbarButton>
            <ToolbarButton onClick={() => fitView()} tooltip="Fit View">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
            </ToolbarButton>
        </div>
    );
};
