import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { IconClose } from '../icons';

interface SmartSelectProps {
    value: any; 
    onChange: (val: string | string[]) => void;
    options: string[];
    isMulti?: boolean;
    allowCustom?: boolean; 
    placeholder?: string;
    autoFocus?: boolean;
    className?: string;
    inputClassName?: string;
    onBlur?: () => void;
    immediate?: boolean;
}

export const SmartSelect: React.FC<SmartSelectProps> = ({ 
    value, onChange, options = [], isMulti = false, allowCustom = false, 
    placeholder, autoFocus, className, inputClassName, onBlur, immediate = false
}) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [dropdownStyle, setDropdownStyle] = useState({});
    
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Safety: Handle 0, false, null, undefined gracefully
    const safeValueString = (v: any) => {
        if (v === null || v === undefined) return '';
        return String(v);
    };

    const [inputValue, setInputValue] = useState(
        Array.isArray(value) ? '' : safeValueString(value)
    );
    const [multiSearch, setMultiSearch] = useState('');

    const selectedValues = useMemo(() => {
        if (Array.isArray(value)) return value.map(safeValueString);
        return (value !== null && value !== undefined) ? [safeValueString(value)] : [];
    }, [value]);

    useEffect(() => {
        if (!isMulti) {
            setInputValue(safeValueString(value));
        }
    }, [value, isMulti]);

    const filterText = isMulti ? multiSearch : (allowCustom ? inputValue : '');
    
    const filteredOptions = useMemo(() => {
        const text = (filterText || '').toLowerCase();
        const safeOptions = Array.isArray(options) ? options : [];
        
        // Check exact match for single select to avoid filtering everything out if it matches perfectly
        const isUnchanged = !isMulti && text === safeValueString(value).toLowerCase();
        
        if (isUnchanged || text === '') {
            return safeOptions;
        }

        return safeOptions.filter(opt => {
            if (!opt) return false;
            return opt.toLowerCase().includes(text) && 
            (isMulti ? !selectedValues.includes(opt) : true);
        });
    }, [options, filterText, isMulti, selectedValues, value]);

    const updatePosition = () => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            const itemHeight = 32; 
            const contentHeight = (filteredOptions.length || 0) * itemHeight + 40;
            const maxHeight = Math.min(contentHeight, 300);

            let placeTop = false;
            if (spaceBelow < Math.min(maxHeight, 150) && spaceAbove > spaceBelow) {
                placeTop = true;
            }

            let left = rect.left;
            const minW = Math.max(rect.width, 240);
            
            if (left + minW > viewportWidth - 10) {
                left = viewportWidth - minW - 10;
            }

            setDropdownStyle({
                top: placeTop ? 'auto' : rect.bottom + window.scrollY,
                bottom: placeTop ? (viewportHeight - rect.top + window.scrollY) : 'auto',
                left: left + window.scrollX,
                width: minW,
                maxHeight: 300
            });
        }
    };

    useLayoutEffect(() => {
        if(isOpen) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
            };
        }
    }, [isOpen, filteredOptions?.length]);

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const item = dropdownRef.current.children[highlightedIndex] as HTMLElement;
            if (item) {
                item.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightedIndex, isOpen]);

    useEffect(() => {
        setHighlightedIndex(0);
    }, [filterText]);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (containerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
            commitAndClose();
        };
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, inputValue]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsOpen(true);
        if (!isMulti && allowCustom) {
            e.target.select();
        }
    };

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            // Slight delay to ensure mount
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [autoFocus]);

    const commitAndClose = (specificValue?: string) => {
        setIsOpen(false);
        
        if (specificValue !== undefined) {
             onChange(specificValue);
        } 
        else if (allowCustom && !isMulti) {
             const currentStr = safeValueString(value);
             if (inputValue !== currentStr) onChange(inputValue);
        }
        else if (isMulti) {
            setMultiSearch('');
        }
        else {
            if(!isMulti) setInputValue(safeValueString(value));
        }
        
        if(onBlur) onBlur();
    };

    const addMultiValue = (val: string) => {
        onChange([...selectedValues, val]);
        setMultiSearch('');
        setIsOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
    };

    const removeMultiValue = (val: string) => {
        onChange(selectedValues.filter(v => v !== val));
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            if (!isMulti) setInputValue(safeValueString(value));
            if (onBlur) onBlur();
            inputRef.current?.blur();
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) setIsOpen(true);
            else setHighlightedIndex(prev => Math.min(prev + 1, (filteredOptions.length || 0) + (allowCustom ? 0 : -1)));
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!isOpen) setIsOpen(true);
            else setHighlightedIndex(prev => Math.max(prev - 1, 0));
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true); 
                return;
            }

            if (filteredOptions.length > 0 && highlightedIndex < filteredOptions.length) {
                const selected = filteredOptions[highlightedIndex];
                isMulti ? addMultiValue(selected) : commitAndClose(selected);
            } 
            else if (allowCustom && (isMulti ? multiSearch : inputValue)) {
                isMulti ? addMultiValue(multiSearch) : commitAndClose();
            }
        }
        
        if (e.key === 'Backspace' && isMulti && multiSearch === '' && selectedValues.length > 0) {
            removeMultiValue(selectedValues[selectedValues.length - 1]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if(isMulti) setMultiSearch(val);
        else {
            setInputValue(val);
            if(allowCustom && immediate) onChange(val);
        }
        setIsOpen(true);
    };

    const isMono = inputClassName?.includes('font-mono');

    const renderPortalContent = () => (
        <div 
            ref={dropdownRef}
            className={`fixed z-[9999] bg-[#161616] border border-gray-600 shadow-xl text-[13px] ${isMono ? 'font-mono' : ''} overflow-y-auto flex flex-col`}
            style={dropdownStyle}
            onMouseDown={(e) => e.preventDefault()}
        >
            {filteredOptions.length > 0 ? filteredOptions.map((opt, idx) => (
                <div 
                    key={opt} 
                    onClick={(e) => {
                        e.stopPropagation();
                        isMulti ? addMultiValue(opt) : commitAndClose(opt);
                    }}
                    className={`px-3 py-1.5 cursor-pointer border-b border-[#333] last:border-0 truncate flex items-center justify-between transition-colors
                        ${idx === highlightedIndex ? 'bg-[#353535] text-white' : 'text-gray-300 hover:bg-[#262626]'}
                    `}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                >
                    {opt}
                </div>
            )) : (
                <div className="px-3 py-1.5 text-gray-500 italic select-none">No matches</div>
            )}
            
            {allowCustom && (isMulti ? multiSearch : inputValue) && 
             !filteredOptions.includes(isMulti ? multiSearch : inputValue) && (
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        isMulti ? addMultiValue(multiSearch) : commitAndClose();
                    }}
                    className={`px-3 py-1.5 cursor-pointer border-t border-[#333] italic 
                        ${highlightedIndex === filteredOptions.length ? 'bg-[#353535] text-white' : 'text-blue-300 hover:bg-[#262626]'}
                    `}
                    onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
                >
                    Use "{isMulti ? multiSearch : inputValue}"
                </div>
            )}
        </div>
    );

    // Multi-Select Wrapper
    if (isMulti) {
        return (
            <>
                <div 
                    ref={containerRef}
                    className={`flex flex-wrap items-center gap-1.5 p-1 min-h-[32px] cursor-text focus-within:ring-1 focus-within:ring-blue-600 bg-white border border-transparent transition-all h-auto w-full content-start ${className || ''}`}
                    onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
                >
                    {selectedValues.map(val => (
                        <span key={val} className="bg-[#e0e0e0] text-[#161616] text-[12px] px-2 h-[20px] rounded-sm flex items-center select-none border border-transparent">
                            <span className="max-w-[200px] truncate font-medium">{val}</span>
                            <button 
                                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); removeMultiValue(val); }} 
                                className="ml-1 text-gray-500 hover:text-black flex items-center justify-center w-4 h-4"
                            >
                                <IconClose />
                            </button>
                        </span>
                    ))}
                    <div className="flex-1 min-w-[60px] relative h-[20px]">
                        <input
                            ref={inputRef}
                            className={`absolute inset-0 w-full bg-transparent outline-none m-0 p-0 border-0 text-sm ${inputClassName || ''}`}
                            value={multiSearch}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                            onBlur={() => { if(!isOpen) return; setIsOpen(false); if(onBlur) onBlur(); }}
                            placeholder={selectedValues.length === 0 ? placeholder : ''}
                            autoComplete="off"
                        />
                    </div>
                </div>
                {isOpen && createPortal(renderPortalContent(), document.body)}
            </>
        );
    }

    // Single Select Wrapper
    return (
        <>
            <div ref={containerRef} className={`relative grid h-full items-center ${className || ''}`}>
                <span className={`col-start-1 row-start-1 opacity-0 whitespace-pre pointer-events-none select-none overflow-hidden ${inputClassName || ''}`}>
                    {inputValue || placeholder}
                </span>
                <input
                    ref={inputRef}
                    className={`col-start-1 row-start-1 w-full h-full bg-transparent border-0 outline-none p-0 m-0 ${inputClassName || ''} ${!allowCustom ? 'cursor-pointer select-none' : ''}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    onClick={() => setIsOpen(true)}
                    onFocus={handleFocus}
                    onBlur={() => {
                         setIsOpen(false);
                         if(onBlur) onBlur();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    readOnly={!allowCustom} 
                    autoComplete="off"
                />
            </div>
            {isOpen && createPortal(renderPortalContent(), document.body)}
        </>
    );
};