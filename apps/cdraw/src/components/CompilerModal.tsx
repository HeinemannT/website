import React from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store';
import { toast } from 'react-hot-toast';
import { generateCorporaterScript } from '../utils/CodeGenerator';

export const CompilerModal = ({ onClose }: { onClose: () => void }) => {
  const nodes = useStore(state => state.nodes);
  const globalProperties = useStore(state => state.globalProperties);
  const listSets = useStore(state => state.listPropertySets);

  const script = generateCorporaterScript(nodes, globalProperties, listSets);

  const handleCopy = () => {
      navigator.clipboard.writeText(script);
      toast.success('Script copied to clipboard');
  };

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100]">
        <div className="bg-white shadow-2xl w-[900px] h-[700px] flex flex-col border border-slate-400 rounded-sm overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-slate-300 flex justify-between items-center bg-slate-50">
                <div>
                    <h2 className="font-semibold text-slate-800 uppercase tracking-wide text-sm">Extended Syntax Generator</h2>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Generates 'Visual Architect' compatible scripting code.</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div className="flex-1 p-0 overflow-hidden relative group bg-[#1e1e1e]">
                <textarea 
                    className="w-full h-full p-4 font-mono text-xs leading-relaxed text-gray-300 resize-none focus:outline-none bg-transparent"
                    readOnly
                    value={script}
                    spellCheck={false}
                />
            </div>
            <div className="p-4 border-t border-slate-300 bg-white flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Ready for deployment</span>
                <div className="flex gap-2">
                    <button onClick={onClose} className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-100 border border-slate-300 transition-colors rounded-sm">Close</button>
                    <button onClick={handleCopy} className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0f62fe] text-white hover:bg-[#0043ce] transition-colors shadow-sm rounded-sm">Copy Script</button>
                </div>
            </div>
        </div>
    </div>,
    document.body
  );
};