import React, { useState } from 'react';
import { useStore } from '../../store';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';
import { toPng } from 'html-to-image';

export const MenuControls = ({ onOpenCompiler }: { onOpenCompiler: () => void }) => {
    const nodes = useStore(state => state.nodes);
    const edges = useStore(state => state.edges);
    const loadGraph = useStore(state => state.loadGraph);
    const clearCanvas = useStore(state => state.clearCanvas);
    const canvasBackground = useStore(state => state.canvasBackground);
    const [isOpen, setIsOpen] = useState(false);

    const handleSave = () => {
        const data = JSON.stringify({ nodes, edges }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `corporater-architect-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        toast.success('Project saved!');
        setIsOpen(false);
    };

    const handleLoad = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (re) => {
                try {
                    const json = JSON.parse(re.target?.result as string);
                    if (json.nodes && json.edges) {
                        loadGraph(json.nodes, json.edges);
                        toast.success('Project loaded successfully');
                    }
                } catch (err) {
                    toast.error('Invalid file format');
                }
            };
            reader.readAsText(file);
        };
        input.click();
        setIsOpen(false);
    };

    const handleClear = () => {
        if (confirm('Clear entire canvas?')) {
            clearCanvas();
            toast('Canvas cleared');
        }
        setIsOpen(false);
    };

    const handleDownloadImage = () => {
        const flowElement = document.querySelector('.react-flow') as HTMLElement;
        if (flowElement) {
            toPng(flowElement, {
                backgroundColor: canvasBackground === 'dark' ? '#262626' : '#f4f4f4',
                filter: (node) => {
                    if (node.classList && (
                        node.classList.contains('react-flow__controls') ||
                        node.classList.contains('react-flow__panel') ||
                        node.classList.contains('react-flow__minimap')
                    )) {
                        return false;
                    }
                    return true;
                }
            })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `corporater-architecture-${Date.now()}.png`;
                    link.href = dataUrl;
                    link.click();
                    toast.success('Image downloaded');
                })
                .catch((err) => {
                    console.error(err);
                    toast.error('Failed to export image');
                });
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "bg-[#161616] text-white hover:bg-gray-800 px-4 h-10 text-xs font-bold uppercase tracking-wide shadow-sm transition-all flex items-center gap-2",
                )}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                Menu
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-56 bg-[#161616] text-white border border-gray-700 shadow-2xl z-30 flex flex-col py-2">
                        <button onClick={handleSave} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide hover:bg-[#393939] flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /></svg> Save Project
                        </button>
                        <button onClick={handleLoad} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide hover:bg-[#393939] flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> Open Project
                        </button>
                        <button onClick={handleDownloadImage} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide hover:bg-[#393939] flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> Download Image
                        </button>
                        <div className="border-b border-gray-700 my-1" />
                        <button onClick={() => { onOpenCompiler(); setIsOpen(false); }} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide hover:bg-[#393939] flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> Export Script
                        </button>
                        <div className="border-b border-gray-700 my-1" />
                        <button onClick={handleClear} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-red-400 hover:bg-[#393939] flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> Clear Canvas
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
