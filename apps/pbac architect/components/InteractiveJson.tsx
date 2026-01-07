import React, { useState } from 'react';
import { SmartSelect } from './SmartSelect';
import { Vocabulary } from '../types';

interface InteractiveJsonProps {
    data: any;
    onUpdate: (newData: any) => void;
    vocab: Vocabulary;
}

export const InteractiveJson: React.FC<InteractiveJsonProps> = ({ data, onUpdate, vocab }) => {
    const [editPath, setEditPath] = useState<string | null>(null);

    const handleUpdate = (path: string, newValue: any) => {
        // NOTE: We do NOT call setEditPath(null) here anymore. 
        // We let the SmartSelect's onBlur handle the closing.

        if (newValue === undefined) return;

        const newData = JSON.parse(JSON.stringify(data));
        
        // Remove 'root.' prefix
        const cleanPath = path.startsWith('root.') ? path.slice(5) : path;
        if (!cleanPath) return;

        const keys = cleanPath.split('.');
        let current = newData;
        
        // Navigate to parent
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] === undefined) return;
            current = current[key];
        }
        
        // Parse Value
        let finalValue = newValue;
        
        // If the user typed a string
        if (typeof newValue === 'string') {
             const trimmed = newValue.trim();
             // Boolean
             if (trimmed === 'true') finalValue = true;
             else if (trimmed === 'false') finalValue = false;
             // Number
             else if (!isNaN(Number(trimmed)) && trimmed !== '') finalValue = Number(trimmed);
             // Array Literal (e.g. ["A", "B"])
             else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                 try {
                     // Replace single quotes with double quotes for JSON compatibility if needed
                     const jsonFriendly = trimmed.replace(/'/g, '"');
                     finalValue = JSON.parse(jsonFriendly);
                 } catch (e) {
                     // Fallback: simple split if JSON parse fails
                     finalValue = trimmed.slice(1, -1).split(',').map((s:string) => s.trim().replace(/['"]/g, ''));
                 }
             }
        }

        // Assign
        const lastKey = keys[keys.length - 1];
        if (current) {
            current[lastKey] = finalValue;
            onUpdate(newData);
        }
    };

    const getOptionsForPath = (path: string): string[] => {
        if (path.includes('Subject')) return vocab.roles;
        if (path.includes('Effect')) return ['Allow', 'Deny'];
        if (path.includes('Action')) return ['Read', 'Update', 'Create', 'Delete'];
        if (path.includes('Comparison')) return ['=', '!=', 'Contains', '!~', 'ContainsAny', 'NotContainsAny'];
        
        if (path.includes('Left') || path.includes('Reference')) return vocab.properties;
        
        if (path.includes('Right')) {
            return [
                ...vocab.types,
                ...vocab.properties,
                'true', 'false', '0', '1'
            ];
        }
        
        if (path.endsWith('type')) return vocab.types;
        
        return [];
    };

    const renderValue = (value: any, path: string) => {
        const isEditing = editPath === path;
        
        const isSubjectOrAction = path.includes('Subject') || path.includes('Action');
        // Treat 'Right' as multi-select if it is currently an array (e.g. Contains [A, B])
        const isRightArray = path.includes('Right') && Array.isArray(value);
        const isMulti = isSubjectOrAction || isRightArray;

        if (isEditing) {
            const options = getOptionsForPath(path);
            const isStrict = typeof value === 'boolean'; 

            return (
                <div className="inline-block align-top min-w-[120px]">
                   <SmartSelect 
                       value={value} 
                       onChange={(v) => handleUpdate(path, v)}
                       onBlur={() => setEditPath(null)}
                       options={options}
                       isMulti={isMulti}
                       allowCustom={!isStrict}
                       immediate={false} 
                       placeholder="Value..."
                       autoFocus={true}
                       // Stylistic overrides to match JSON view
                       className={isMulti ? "bg-[#252526] border border-[#404040] rounded-sm" : ""}
                       inputClassName="text-[#ce9178] bg-[#1e1e1e] font-mono text-[13px] leading-6" 
                   />
                </div>
            );
        }

        const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            setEditPath(path);
        };

        // Render Arrays (when not editing)
        if (Array.isArray(value)) {
             return (
                 <span onClick={handleClick} className="text-[#ce9178] cursor-pointer hover:underline decoration-dotted decoration-gray-600 underline-offset-2 break-all whitespace-pre-wrap">
                     [ {value.map((v, i) => (
                         <React.Fragment key={i}>
                             <span>"{v}"</span>
                             {i < value.length - 1 && <span className="text-[#d4d4d4]">, </span>}
                         </React.Fragment>
                     ))} ]
                 </span>
             );
        }

        // Render Primitives
        if (typeof value === 'string') return <span onClick={handleClick} className="text-[#ce9178] cursor-pointer hover:underline decoration-dotted decoration-gray-600 underline-offset-2 break-all whitespace-pre-wrap">"{value}"</span>;
        if (typeof value === 'number') return <span onClick={handleClick} className="text-[#b5cea8] cursor-pointer hover:underline decoration-dotted decoration-gray-600 underline-offset-2">{value}</span>;
        if (typeof value === 'boolean') return <span onClick={handleClick} className="text-[#569cd6] cursor-pointer hover:underline decoration-dotted decoration-gray-600 underline-offset-2">{String(value)}</span>;
        
        return <span className="text-[#d4d4d4]">{String(value)}</span>;
    };

    const isPrimitive = (v: any) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';

    const renderNode = (node: any, path: string, level: number, isLast: boolean): React.ReactNode => {
        const indent = level * 2;
        const style = { paddingLeft: `${indent}ch` };
        
        const keyName = path.split('.').pop();
        
        // ATOMIC ARRAYS:
        // These are rendered as a single Value block. 
        // IMPORTANT: The parent renders the Key Label ("Subject":), this function only renders the Value ([...]).
        const isAtomicArray = Array.isArray(node) && (
            keyName === 'Subject' || 
            keyName === 'Action' || 
            (keyName === 'Right' && node.every(isPrimitive))
        );

        if (isAtomicArray) {
             return (
                <div key={path} className="inline">
                     {renderValue(node, path)}
                     {!isLast && <span className="text-[#d4d4d4]">,</span>}
                </div>
             );
        }

        // 1. Generic Arrays (recurse)
        if (Array.isArray(node)) {
            const isPrimitiveArray = node.every(isPrimitive);
            
            if (node.length === 0) return <div key={path} style={style}><span className="text-[#ffd700]">[]</span>{!isLast && <span className="text-[#d4d4d4]">,</span>}</div>;

            if (isPrimitiveArray) {
                 return (
                    <div key={path} style={style} className="whitespace-pre-wrap break-all">
                        <span className="text-[#ffd700]">[</span>
                        {node.map((item, i) => (
                            <React.Fragment key={i}>
                                {renderValue(item, `${path}.${i}`)}
                                {i < node.length - 1 && <span className="text-[#d4d4d4]">, </span>}
                            </React.Fragment>
                        ))}
                        <span className="text-[#ffd700]">]</span>
                        {!isLast && <span className="text-[#d4d4d4]">,</span>}
                    </div>
                );
            }

            return (
                <div key={path}>
                    <div style={style} className="text-[#ffd700]">[</div>
                    {node.map((item, i) => renderNode(item, `${path}.${i}`, level + 1, i === node.length - 1))}
                    <div style={style}><span className="text-[#ffd700]">]</span>{!isLast && <span className="text-[#d4d4d4]">,</span>}</div>
                </div>
            );
        }

        // 2. Objects
        if (typeof node === 'object' && node !== null) {
            const keys = Object.keys(node);
            if (keys.length === 0) return <div key={path} style={style}><span className="text-[#ffd700]">{'{}'}</span>{!isLast && <span className="text-[#d4d4d4]">,</span>}</div>;

            // Compact render for simple objects
            const isSimple = keys.every(k => isPrimitive(node[k]) || (Array.isArray(node[k]) && node[k].every(isPrimitive)));
            const isSmall = keys.length <= 3; 

            if (isSimple && isSmall) {
                return (
                    <div key={path} style={style} className="whitespace-pre-wrap break-all">
                        <span className="text-[#ffd700]">{'{'}</span>
                        <span className="ml-1"></span>
                        {keys.map((key, i) => (
                            <React.Fragment key={key}>
                                <span className="text-[#9cdcfe]">"{key}"</span>
                                <span className="text-[#d4d4d4]">: </span>
                                {/* Note: We call renderValue for leaves here directly */}
                                {renderValue(node[key], `${path}.${key}`)}
                                {i < keys.length - 1 && <span className="text-[#d4d4d4]">, </span>}
                            </React.Fragment>
                        ))}
                        <span className="ml-1"></span>
                        <span className="text-[#ffd700]">{'}'}</span>
                        {!isLast && <span className="text-[#d4d4d4]">,</span>}
                    </div>
                );
            }

            return (
                <div key={path}>
                    <div style={style} className="text-[#ffd700]">{'{'}</div>
                    {keys.map((key, i) => {
                        // Check if child is atomic array to render it inline
                        const child = node[key];
                        const childKey = `${path}.${key}`;
                        const isChildAtomic = Array.isArray(child) && (key === 'Subject' || key === 'Action' || (key === 'Right' && child.every(isPrimitive)));

                        return (
                        <div key={childKey} className="flex flex-wrap">
                            <div style={{paddingLeft: `${(level + 1) * 2}ch`}} className="whitespace-pre">
                                <span className="text-[#9cdcfe]">"{key}"</span><span className="text-[#d4d4d4]">: </span>
                            </div>
                            <div className="flex-1">
                                {isChildAtomic 
                                    ? renderNode(child, childKey, 0, i === keys.length - 1)
                                    : (typeof child === 'object' && child !== null 
                                        ? renderNode(child, childKey, 0, i === keys.length - 1)
                                        : (
                                            <div className="flex items-center">
                                                {renderValue(child, childKey)}
                                                {i !== keys.length - 1 && <span className="text-[#d4d4d4]">,</span>}
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                    )})}
                    <div style={style}><span className="text-[#ffd700]">{'}'}</span>{!isLast && <span className="text-[#d4d4d4]">,</span>}</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="font-mono text-[13px] leading-6 text-[#d4d4d4] select-text p-2 bg-[#1e1e1e] flex min-h-0 h-full">
            <div className="text-[#858585] text-right pr-4 select-none opacity-50 border-r border-[#404040] mr-4 h-full shrink-0">
                {Array.from({length: 30}).map((_, i) => <div key={i}>{i+1}</div>)}
            </div>
            <div className="flex-1 overflow-auto">
                {renderNode(data, 'root', 0, true)}
            </div>
        </div>
    );
};