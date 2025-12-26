import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../../store';

export const CodeEditorModal = ({ propertyId, onClose }: { propertyId: string, onClose: () => void }) => {
    const property = useStore(state => state.globalProperties.find(p => p.id === propertyId));
    const updateGlobalProperty = useStore(state => state.updateGlobalProperty);
    const [code, setCode] = useState(property?.config.expression || '');

    if (!property) return null;

    const handleSave = () => {
        updateGlobalProperty(property.id, { config: { ...property.config, expression: code } });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 bg-[#161616]/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-[#161616] w-[800px] h-[600px] shadow-2xl flex flex-col border border-gray-700">
                <div className="px-4 py-3 border-b border-gray-800 bg-[#161616] flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold uppercase tracking-wide">Logic Editor</span>
                        <span className="text-xs text-gray-500 font-mono px-2 py-0.5 bg-gray-800 rounded-sm">{property.id}</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <div className="flex-1 relative bg-[#1e1e1e]">
                    <textarea
                        className="w-full h-full bg-transparent text-[#e0e0e0] font-mono text-sm p-4 focus:outline-none resize-none leading-relaxed"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="// Enter extended logic expression..."
                        spellCheck={false}
                    />
                </div>
                <div className="p-4 bg-[#161616] border-t border-gray-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-xs text-white hover:bg-gray-800 font-semibold uppercase border border-white">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-xs bg-[#0f62fe] text-white hover:bg-[#0353e9] font-semibold uppercase border border-transparent">Save Changes</button>
                </div>
            </div>
        </div>,
        document.body
    );
};
