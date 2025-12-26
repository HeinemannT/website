import React, { memo } from 'react';
import { NodeProps, NodeResizer } from 'reactflow';
import { useStore } from '../store';
import { NodeData } from '../types';
import clsx from 'clsx';
import { colord } from 'colord';

// --- GROUP NODE (Box) ---

export const GroupNode = memo(({ id, data, selected }: NodeProps<NodeData>) => {
  const updateNodeMetadata = useStore(state => state.updateNodeMetadata);
  const bgColor = data.color || '#f1f5f9'; 
  const isTransparent = data.isTransparent;
  
  // Styles
  const borderColor = data.borderColor || (isTransparent ? '#94a3b8' : colord(bgColor).darken(0.1).toHex());
  const borderStyle = data.borderStyle || (isTransparent ? 'dashed' : 'solid');
  const borderWidth = data.borderWidth || 2;
  const textAlign = data.textAlign || 'left';
  const textColor = data.textColor || (isTransparent ? '#334155' : (colord(bgColor).isLight() ? '#334155' : '#ffffff'));

  return (
    <div className={clsx(
        "relative group/box transition-all h-full w-full",
        selected ? "ring-2 ring-[#0f62fe] ring-offset-2" : ""
    )}
    style={{ 
        backgroundColor: isTransparent ? 'transparent' : bgColor,
        borderWidth: `${borderWidth}px`,
        borderStyle: borderStyle,
        borderColor: borderColor,
        // CRITICAL: Allow clicking THROUGH the box to select items inside, 
        // unless clicking the border itself (handled by the div layout usually, 
        // but pointer-events: none on content is safer).
        pointerEvents: 'none' 
    }}>
        {/* Enable resizing only when selected */}
        <NodeResizer 
            isVisible={selected} 
            minWidth={100} 
            minHeight={100} 
            color="#0f62fe"
            lineStyle={{ border: 'none' }}
            handleStyle={{ width: 10, height: 10, borderRadius: 2 }}
        />
        
        {/* Header/Label Area - Must be clickable/draggable */}
        {/* DESIGN ALIGNMENT: Match Architect Node Header Style when active or labeled */}
        <div 
            className={clsx(
                "absolute top-0 left-0 w-full pointer-events-auto transition-colors",
                !isTransparent ? "bg-black/5 border-b border-black/10" : "" 
            )}
            style={{ textAlign: textAlign }}
        >
             <input 
                className={clsx(
                    "bg-transparent border-none focus:ring-0 focus:outline-none w-full min-w-[50px] nodrag cursor-text px-2 py-1.5",
                    "text-[10px] uppercase tracking-widest font-bold font-mono"
                )}
                style={{ 
                    color: textColor,
                    fontSize: data.fontSize ? `${data.fontSize}px` : undefined,
                    textAlign: textAlign,
                }}
                value={data.label}
                onChange={(e) => updateNodeMetadata(id, { label: e.target.value })}
                placeholder="GROUP"
            />
        </div>
    </div>
  );
});

// --- ANNOTATION NODE (Label/Sticky Note) ---

export const AnnotationNode = memo(({ id, data, selected }: NodeProps<NodeData>) => {
  const updateNodeMetadata = useStore(state => state.updateNodeMetadata);
  const bgColor = data.color || 'transparent';
  const isTransparent = data.isTransparent ?? (bgColor === 'transparent');
  
  const textColor = data.textColor || (isTransparent ? '#0f172a' : (colord(bgColor).isLight() ? '#0f172a' : '#ffffff'));
  const textAlign = data.textAlign || 'left';
  const borderColor = data.borderColor || 'transparent';
  const borderStyle = data.borderStyle || 'none';
  const borderWidth = data.borderWidth || 0;

  return (
    <div className={clsx(
        "min-w-[150px] min-h-[60px] p-4 transition-all rounded-sm flex flex-col font-sans",
        selected ? "ring-2 ring-[#0f62fe] ring-offset-1" : "hover:ring-1 hover:ring-slate-300"
    )}
    style={{ 
        backgroundColor: isTransparent ? 'transparent' : bgColor,
        borderColor: borderColor,
        borderStyle: borderStyle,
        borderWidth: `${borderWidth}px`
    }}
    >
        <NodeResizer 
            isVisible={selected} 
            minWidth={100} 
            minHeight={40} 
            color="#0f62fe"
            lineStyle={{ border: 'none' }}
            handleStyle={{ width: 8, height: 8, borderRadius: 2 }}
        />
        <textarea 
            className="w-full h-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none overflow-hidden nodrag cursor-text leading-relaxed"
            style={{
                color: textColor,
                fontSize: data.fontSize ? `${data.fontSize}px` : '14px',
                fontWeight: data.isBold ? '600' : '400',
                textAlign: textAlign
            }}
            value={data.label}
            onChange={(e) => {
                 updateNodeMetadata(id, { label: e.target.value });
            }}
            placeholder="Type a note..."
        />
    </div>
  );
});