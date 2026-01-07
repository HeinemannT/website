import React, { useState } from 'react';
import { FileSystemItem } from '../types';
import { IconDownload } from '../icons';
import { parseImportScript } from '../utils';

interface ImportViewProps {
    onImport: (items: FileSystemItem[]) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({ onImport }) => {
    const [text, setText] = useState('');
    const handleImport = () => {
        const items = parseImportScript(text);
        if (items.length > 0) onImport(items);
        else alert("No items found. Ensure script format is compatible.");
    };
    return (
        <div className="h-full flex flex-col p-6 bg-white">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-light text-gray-800">Import Extended Script</h2>
                <button className="carbon-btn carbon-btn-primary" onClick={handleImport}><IconDownload /> <span className="ml-2">Process Import</span></button>
            </div>
            <textarea className="flex-1 border border-gray-300 bg-gray-50 p-4 font-mono text-xs resize-none focus:outline-none" placeholder="Paste script content here..." value={text} onChange={e => setText(e.target.value)}/>
        </div>
    );
};