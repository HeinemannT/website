import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useStore } from '../../../store';
import { GlobalProperty } from '../../../types';
import { CarbonLabel, CarbonInput, CarbonSelect } from '../ui/Shared';

interface PropertyEditorProps {
    property: GlobalProperty;
    readOnly: boolean;
    onAddNewListSet: () => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
    property,
    readOnly,
    onAddNewListSet
}) => {
    // --- CONNECT TO STORE DIRECTLY ---
    const updateGlobalProperty = useStore(state => state.updateGlobalProperty);
    const renameGlobalProperty = useStore(state => state.renameGlobalProperty);
    const unlinkProperty = useStore(state => state.unlinkProperty);
    const selectedPropertyId = useStore(state => state.selectedPropertyId);
    const selectProperty = useStore(state => state.selectProperty);
    const selectedNodeId = useStore(state => state.selectedNodeId);
    const nodes = useStore(state => state.nodes);
    const listSets = useStore(state => state.listPropertySets);
    const openCodeEditor = useStore(state => state.openCodeEditor);

    const availableClasses = useMemo(() =>
        nodes.map(n => n.data.className).filter((c): c is string => !!c),
        [nodes]
    );

    const isExpanded = selectedPropertyId === property.id;
    const onToggle = () => selectProperty(isExpanded ? null : property.id);
    const onUpdate = (updates: Partial<GlobalProperty>) => updateGlobalProperty(property.id, updates);
    const onRename = (newId: string) => renameGlobalProperty(property.id, newId);
    const onUnlink = () => { if (selectedNodeId) unlinkProperty(selectedNodeId, property.id); };

    // Helper to determine if property supports historical mode
    const supportsHistory = [
        'NumberMethodConfig', 'HistoricalNumberMethodConfig',
        'TextMethodConfig', 'HistoricalTextMethodConfig',
        'DateMethodConfig', 'HistoricalDateMethodConfig',
        'ReferenceMethodConfig', 'HistoricalReferenceMethodConfig',
        'BooleanMethodConfig', 'HistoricalBooleanMethodConfig',
        'ListMethodConfig', 'HistoricalListMethodConfig'
    ].includes(property.type);

    const isHistorical = property.type.startsWith('Historical');

    const toggleHistorical = (checked: boolean) => {
        let newType = property.type;
        if (checked && !newType.startsWith('Historical')) {
            newType = `Historical${newType}` as any;
        } else if (!checked && newType.startsWith('Historical')) {
            newType = newType.replace('Historical', '') as any;
        }
        onUpdate({ type: newType });
    };

    const getPropLabel = (type: string) => {
        if (type.includes('Number')) return '123';
        if (type.includes('Reference')) return 'REF';
        if (type.includes('List')) return 'LST';
        if (type.includes('Boolean')) return 'TGL';
        if (type.includes('Date')) return 'DAT';
        if (type.includes('File')) return 'FIL';
        if (type.includes('Extended')) return 'EXT';
        return 'TXT';
    }

    return (
        <div className={clsx("border transition-all duration-100", isExpanded ? "border-[#0f62fe] bg-white ring-1 ring-[#0f62fe]" : "border-gray-200 bg-white hover:border-gray-300")}>
            <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50" onClick={onToggle}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-[9px] w-8 text-center py-0.5 font-mono font-bold tracking-tight bg-gray-100 text-gray-600 border border-gray-200">
                        {getPropLabel(property.type)}
                    </span>
                    <div className="flex flex-col truncate">
                        <span className="text-sm font-semibold text-[#161616] truncate">{property.name}</span>
                        {isExpanded && <span className="text-[10px] text-gray-400 font-mono mt-0.5">{property.id}</span>}
                    </div>
                </div>
                <div className="text-gray-400">
                    <svg className={clsx("w-3 h-3 transition-transform", isExpanded && "rotate-180")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
            </div>

            {isExpanded && !readOnly && (
                <div className="p-4 bg-white border-t border-gray-100 space-y-5 animate-fade-in">
                    {/* Standard Fields */}
                    <div className="space-y-4">
                        <div>
                            <CarbonLabel>Unique ID</CarbonLabel>
                            <CarbonInput
                                className="font-mono text-xs"
                                value={property.id}
                                onChange={(e) => onRename(e.target.value)}
                            />
                        </div>
                        <div>
                            <CarbonLabel>Display Name</CarbonLabel>
                            <CarbonInput
                                value={property.name}
                                onChange={(e) => onUpdate({ name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Historical Toggle */}
                    {supportsHistory && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200">
                            <input
                                type="checkbox"
                                id={`hist_${property.id}`}
                                checked={isHistorical}
                                onChange={(e) => toggleHistorical(e.target.checked)}
                                className="w-4 h-4 text-[#0f62fe] bg-white border-gray-300 focus:ring-[#0f62fe]"
                            />
                            <label htmlFor={`hist_${property.id}`} className="text-sm font-medium text-[#161616] cursor-pointer">Track Historical Data</label>
                        </div>
                    )}

                    {/* List Config */}
                    {(property.type === 'ListMethodConfig' || property.type === 'HistoricalListMethodConfig') && (
                        <div>
                            <CarbonLabel>List Source</CarbonLabel>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <CarbonSelect
                                        value={property.config.listId || ''}
                                        onChange={(e) => onUpdate({ config: { ...property.config, listId: e.target.value } })}
                                    >
                                        <option value="" disabled>Select List Set...</option>
                                        {listSets.map(l => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))}
                                    </CarbonSelect>
                                </div>
                                <button
                                    onClick={onAddNewListSet}
                                    className="px-3 bg-[#0f62fe] hover:bg-[#0353e9] text-white font-bold text-lg leading-none flex items-center justify-center transition-colors"
                                    title="Create New List Set"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Reference Target Class Selector */}
                    {(property.type.includes('Reference') || property.type.includes('Reverse')) && (
                        <div>
                            <CarbonLabel>Target Class</CarbonLabel>
                            <CarbonSelect
                                value={property.config.targetClass || ''}
                                onChange={(e) => onUpdate({ config: { ...property.config, targetClass: e.target.value } })}
                            >
                                <option value="" disabled>Select Target Class...</option>
                                <option value="user">User</option>
                                {availableClasses.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </CarbonSelect>

                            {/* Multi Select Option */}
                            {!property.type.includes('Reverse') && (
                                <div className="flex items-center gap-2 mt-3">
                                    <input
                                        type="checkbox"
                                        id={`multi_${property.id}`}
                                        checked={property.config.multiSelect || false}
                                        onChange={(e) => {
                                            onUpdate({ config: { ...property.config, multiSelect: e.target.checked } });
                                        }}
                                        className="w-4 h-4 text-[#0f62fe] bg-white border-gray-300 focus:ring-[#0f62fe]"
                                    />
                                    <label htmlFor={`multi_${property.id}`} className="text-sm text-[#161616] font-medium">Multi Select (1:N)</label>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Extended Config */}
                    {property.type === 'ExtendedMethodConfig' && (
                        <div>
                            <CarbonLabel>Logic Expression</CarbonLabel>
                            <button
                                onClick={() => openCodeEditor(property.id)}
                                className="w-full py-2 text-xs bg-[#161616] text-white font-mono flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                            >
                                <span>{property.config.expression ? 'Edit Script' : 'Add Script'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                            </button>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={(e) => { e.stopPropagation(); onUnlink(); }}
                            className="text-xs text-red-600 hover:bg-red-50 px-3 py-2 font-semibold uppercase transition-colors"
                        >
                            Unlink Property
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
