import React from 'react';
import clsx from 'clsx';

// --- STYLED COMPONENTS ---

export const CarbonInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative group">
        <input
            {...props}
            className={clsx(
                "w-full bg-[#f4f4f4] border-b border-[#8d8d8d] px-3 py-2 text-sm text-[#161616] placeholder-gray-400 transition-all",
                "focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-[#0f62fe] focus:border-[#0f62fe]",
                "hover:bg-[#e0e0e0]",
                props.className
            )}
        />
    </div>
);

export const CarbonSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div className="relative group">
        <select
            {...props}
            className={clsx(
                "w-full bg-[#f4f4f4] border-b border-[#8d8d8d] px-3 py-2 text-sm text-[#161616] appearance-none transition-all rounded-none",
                "focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-[#0f62fe] focus:border-[#0f62fe]",
                "hover:bg-[#e0e0e0]",
                props.className
            )}
        />
        <div className="absolute right-3 top-3 pointer-events-none text-gray-600">
            <svg width="10" height="6" viewBox="0 0 10 6"><path d="M5 6L0 1L0.7 0.3L5 4.6L9.3 0.3L10 1L5 6Z" fill="currentColor" /></svg>
        </div>
    </div>
);

export const CarbonLabel = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
    <label className={clsx("block text-[11px] font-semibold uppercase tracking-wide text-[#525252] mb-1", className)}>
        {children}
    </label>
);

export const Section = ({ title, children, className }: { title: string, children?: React.ReactNode, className?: string }) => (
    <section className={clsx("mb-6", className)}>
        <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h3>
        <div className="px-4 space-y-4">
            {children}
        </div>
    </section>
);

export const Header = ({ title, subtitle, actions, onClose }: { title: string, subtitle: string, actions?: React.ReactNode, onClose: () => void }) => (
    <div className="px-4 py-4 bg-white border-b border-gray-200 shrink-0 flex justify-between items-start">
        <div className="flex-1 overflow-hidden pr-4">
            <h2 className="font-bold text-sm uppercase tracking-wide leading-tight text-slate-900">
                {title}
            </h2>
            <div className="text-[11px] text-gray-500 font-mono mt-1 truncate">{subtitle}</div>
        </div>
        <div className="flex gap-1 items-center">
            {actions}
            <div className="w-px h-4 bg-gray-300 mx-2"></div>
            <button onClick={onClose} className="text-gray-400 hover:text-slate-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
        </div>
    </div>
);

export const IconOption = ({ id, comp, current, onClick }: any) => (
    <button
        onClick={() => onClick(id)}
        className={clsx(
            "p-2 flex items-center justify-center transition-all border border-transparent",
            current === id ? "bg-[#e0e0e0] text-[#0f62fe] border-[#0f62fe]" : "text-gray-500 hover:bg-[#e0e0e0]"
        )}
        title={id}
    >
        {comp}
    </button>
);
