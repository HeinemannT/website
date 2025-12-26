import React from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { AlertIcon } from '../../Icons';

// Accordion Component
export const AccordionItem = ({ title, children, isOpen, onToggle }: { title: string, children?: React.ReactNode, isOpen: boolean, onToggle: () => void }) => {
    return (
        <div className="border-b border-gray-200 flex flex-col bg-white shrink-0">
            <button
                onClick={onToggle}
                className="px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-100 transition-colors group"
            >
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-gray-900">{title}</span>
                <span className={clsx("text-gray-400 transition-transform transform", isOpen ? "rotate-180" : "")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </button>
            {isOpen && (
                <div className="flex flex-col animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

// Confirmation Modal Component
export const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="bg-white border border-gray-300 shadow-2xl w-[400px] animate-fade-in p-0">
                <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-800 flex items-center gap-2">
                        <AlertIcon className="w-4 h-4 text-amber-500" /> {title}
                    </h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-700">✕</button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{message}</p>
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
                    <button onClick={onCancel} className="px-4 py-2 text-xs font-semibold uppercase text-gray-600 hover:bg-white border border-gray-300 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 text-xs font-semibold uppercase text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors border border-transparent">Confirm</button>
                </div>
            </div>
        </div>,
        document.body
    );
};
