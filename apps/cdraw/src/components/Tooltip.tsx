import React, { useState } from 'react';

export const Tooltip = ({ children, content, side = 'bottom' }: { children?: React.ReactNode, content: string, side?: 'top' | 'bottom' | 'left' | 'right' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
        className="relative flex items-center" 
        onMouseEnter={() => setVisible(true)} 
        onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute z-50 px-2 py-1 text-[10px] font-bold text-white bg-slate-800 border border-slate-900 uppercase tracking-wider whitespace-nowrap shadow-xl pointer-events-none"
             style={{
                 top: side === 'bottom' ? '100%' : side === 'top' ? 'auto' : '50%',
                 bottom: side === 'top' ? '100%' : 'auto',
                 left: side === 'right' ? '100%' : side === 'left' ? 'auto' : '50%',
                 right: side === 'left' ? '100%' : 'auto',
                 transform: (side === 'top' || side === 'bottom') ? 'translateX(-50%) translateY(4px)' : 'translateY(-50%) translateX(4px)',
                 marginTop: side === 'bottom' ? '4px' : 0,
                 marginBottom: side === 'top' ? '4px' : 0,
                 marginLeft: side === 'right' ? '4px' : 0,
                 marginRight: side === 'left' ? '4px' : 0,
             }}
        >
          {content}
        </div>
      )}
    </div>
  );
};