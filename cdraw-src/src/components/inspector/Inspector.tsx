import React, { useMemo, useEffect, useState } from 'react';
import { useStore } from '../../store';
import { EdgeData } from '../../types';
import { ShieldIcon, ChartIcon, AlertIcon, FolderIcon, UserIcon, CubeIcon, CheckIcon, LockIcon, UnlockIcon, GlobeIcon, MailIcon, CalendarIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from '../Icons';
import clsx from 'clsx';
import { Header, Section, CarbonLabel, CarbonInput, CarbonSelect, IconOption } from './ui/Shared';
import { ListManagerModal } from './modals/ListManagerModal';
import { CodeEditorModal } from './modals/CodeEditorModal';
import { PropertyEditor } from './properties/PropertyEditor';

export const Inspector = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [iconMenuOpen, setIconMenuOpen] = useState(false);

    const [showListManager, setShowListManager] = useState(false);
    const [editingListId, setEditingListId] = useState<string | null>(null);
    const addListPropertySet = useStore(state => state.addListPropertySet);

    const selectedNodeId = useStore(state => state.selectedNodeId);
    const selectedEdgeId = useStore(state => state.selectedEdgeId);
    const selectedPropertyId = useStore(state => state.selectedPropertyId);

    const selectedNode = useStore(state => state.nodes.find(n => n.id === state.selectedNodeId));
    const selectedEdge = useStore(state => state.edges.find(e => e.id === state.selectedEdgeId));
    const nodes = useStore(state => state.nodes);
    const edges = useStore(state => state.edges);
    const globalProperties = useStore(state => state.globalProperties);
    const listSets = useStore(state => state.listPropertySets);
    const viewMode = useStore(state => state.viewMode);

    const codeEditorPropertyId = useStore(state => state.codeEditorPropertyId);
    const closeCodeEditor = useStore(state => state.closeCodeEditor);

    const projectName = useStore(state => state.projectName);
    const projectDescription = useStore(state => state.projectDescription);
    const updateProjectMetadata = useStore(state => state.updateProjectMetadata);

    const updateNodeMetadata = useStore(state => state.updateNodeMetadata);
    const updateNodeZIndex = useStore(state => state.updateNodeZIndex);
    const updateGlobalProperty = useStore(state => state.updateGlobalProperty);
    const deleteNode = useStore(state => state.deleteNode);
    const duplicateNode = useStore(state => state.duplicateNode);
    const updateEdgeData = useStore(state => state.updateEdgeData);
    const toggleLock = useStore(state => state.toggleLock);

    const orphanedNodes = useMemo(() => {
        const connectedIds = new Set();
        edges.forEach(e => { connectedIds.add(e.source); connectedIds.add(e.target); });
        return nodes.filter(n => n.type !== 'group' && n.type !== 'annotation' && !connectedIds.has(n.id)).length;
    }, [nodes, edges]);

    const missingDescriptions = useMemo(() => {
        return nodes.filter(n => n.type !== 'group' && n.type !== 'annotation' && !n.data.description).length;
    }, [nodes]);

    const totalObjects = useMemo(() => {
        return nodes.filter(n => n.type !== 'group' && n.type !== 'annotation').length;
    }, [nodes]);

    const availableClasses = useMemo(() =>
        nodes.map(n => n.data.className).filter((c): c is string => !!c),
        [nodes]
    );

    const handleAddNewList = () => {
        const id = `lps_new_list_${Date.now()}`;
        addListPropertySet({ id, name: 'New List Set', items: [{ id: 'item_1', name: 'New Item' }] });
        setEditingListId(id);
        setShowListManager(true);
    };

    useEffect(() => {
        if (selectedNodeId || selectedEdgeId || selectedPropertyId) setIsOpen(true);
    }, [selectedNodeId, selectedEdgeId, selectedPropertyId]);

    if (viewMode === 'simple') return null;

    if (!isOpen) {
        return (
            <div className="w-12 bg-white border-l border-gray-300 h-full flex flex-col items-center py-4 z-20">
                <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-100 text-gray-500" title="Open Inspector">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
            </div>
        );
    }

    // --- CASE 1: EDGE SELECTED ---
    if (selectedEdge && selectedEdgeId) {
        const data = (selectedEdge.data as EdgeData) || { type: 'association', label: '' };
        const linkedProp = globalProperties.find(p => p.id === data.linkedPropertyId);
        const isReverse = data.isReverse || false;
        const isMulti = data.cardinality === '1:N';

        return (
            <div className="w-[320px] bg-white border-l border-gray-300 h-full flex flex-col z-20 shadow-xl">
                <Header title="Relationship" subtitle={selectedEdge.id}
                    onClose={() => setIsOpen(false)}
                    actions={
                        <button onClick={() => deleteNode(selectedEdgeId)} className="text-gray-400 hover:text-red-400" title="Delete Edge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                    }
                />
                <div className="flex-1 overflow-y-auto py-6">
                    <Section title="Configuration">
                        <div className="flex items-center gap-3 p-3 bg-[#f4f4f4] border-l-4 border-[#0f62fe]">
                            <input
                                type="checkbox"
                                id="isReverseRef"
                                checked={isReverse}
                                onChange={(e) => updateEdgeData(selectedEdgeId, { isReverse: e.target.checked })}
                                className="w-4 h-4 text-[#0f62fe] bg-white border-gray-300 focus:ring-[#0f62fe]"
                            />
                            <label htmlFor="isReverseRef" className="text-sm text-[#161616] font-medium">Reverse Reference</label>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[#f4f4f4] border-l-4 border-transparent hover:border-gray-300 transition-colors">
                            <input
                                type="checkbox"
                                id="isMultiSelectRef"
                                checked={isMulti}
                                onChange={(e) => updateEdgeData(selectedEdgeId, { cardinality: e.target.checked ? '1:N' : '1:1' })}
                                className="w-4 h-4 text-[#0f62fe] bg-white border-gray-300 focus:ring-[#0f62fe]"
                            />
                            <label htmlFor="isMultiSelectRef" className="text-sm text-[#161616] font-medium">Multi Select (1:N)</label>
                        </div>

                        <div className="pt-2">
                            <CarbonLabel>Visual Label</CarbonLabel>
                            <CarbonInput
                                value={data.label || ''}
                                onChange={(e) => updateEdgeData(selectedEdgeId, { label: e.target.value })}
                                placeholder="e.g. influences"
                            />
                        </div>

                        {linkedProp && (
                            <div className="pt-4 border-t border-gray-100">
                                <CarbonLabel>Target Class</CarbonLabel>
                                <CarbonSelect
                                    value={linkedProp.config.targetClass || ''}
                                    onChange={(e) => updateGlobalProperty(linkedProp.id, { config: { ...linkedProp.config, targetClass: e.target.value } })}
                                >
                                    <option value="" disabled>Select Target Class...</option>
                                    <option value="user">User</option>
                                    {availableClasses.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </CarbonSelect>
                                <p className="text-[10px] text-gray-400 mt-2 leading-normal">
                                    Redirects the relationship to a new target entity type. Use with caution.
                                </p>
                            </div>
                        )}
                    </Section>
                </div>
            </div>
        );
    }

    // --- CASE 2: NODE SELECTED ---
    if (selectedNode) {
        const handleChange = (field: string, value: any) => {
            updateNodeMetadata(selectedNode.id, { [field]: value });
        };

        const isCosmetic = selectedNode.type === 'group' || selectedNode.type === 'annotation';

        const getResolvedProperties = () => {
            return selectedNode.data.linkedProperties
                .map(pid => globalProperties.find(gp => gp.id === pid))
                .filter((p): p is import('../../types').GlobalProperty => !!p);
        };

        const currentIcon = selectedNode.data.iconType;

        const iconList = [
            { id: 'shield', comp: <ShieldIcon className="w-4 h-4" /> },
            { id: 'chart', comp: <ChartIcon className="w-4 h-4" /> },
            { id: 'alert', comp: <AlertIcon className="w-4 h-4" /> },
            { id: 'folder', comp: <FolderIcon className="w-4 h-4" /> },
            { id: 'user', comp: <UserIcon className="w-4 h-4" /> },
            { id: 'cube', comp: <CubeIcon className="w-4 h-4" /> },
            { id: 'check', comp: <CheckIcon className="w-4 h-4" /> },
            { id: 'globe', comp: <GlobeIcon className="w-4 h-4" /> },
            { id: 'mail', comp: <MailIcon className="w-4 h-4" /> },
            { id: 'calendar', comp: <CalendarIcon className="w-4 h-4" /> }
        ];

        const CurrentIconComp = iconList.find(i => i.id === currentIcon)?.comp || <FolderIcon className="w-4 h-4" />;

        return (
            <div className="w-[320px] bg-white border-l border-gray-300 h-full flex flex-col overflow-hidden z-20 shadow-xl">
                <Header
                    title={isCosmetic ? "Annotation Config" : "Entity Config"}
                    subtitle={selectedNode.id}
                    onClose={() => setIsOpen(false)}
                    actions={
                        <>
                            <button onClick={() => toggleLock(selectedNode.id)} className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-700 rounded-sm" title={selectedNode.data.locked ? "Unlock" : "Lock"}>
                                {selectedNode.data.locked ? <LockIcon className="w-4 h-4" /> : <UnlockIcon className="w-4 h-4" />}
                            </button>
                            <button onClick={() => duplicateNode(selectedNode.id)} className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-700 rounded-sm" title="Duplicate">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="0" ry="0" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                            </button>
                            <button onClick={() => deleteNode(selectedNode.id)} className="p-1.5 text-gray-400 hover:bg-red-600 hover:text-white rounded-sm" title="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            </button>
                        </>
                    }
                />
                <div className="flex-1 overflow-y-auto py-6">

                    {/* COSMETIC CONFIGURATION */}
                    {isCosmetic && (
                        <Section title="Appearance">
                            <div>
                                <CarbonLabel>Label Content</CarbonLabel>
                                {selectedNode.type === 'annotation' ? (
                                    <textarea
                                        className="w-full bg-[#f4f4f4] border-b border-[#8d8d8d] px-3 py-2 text-sm text-[#161616] placeholder-gray-400 focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-[#0f62fe] hover:bg-[#e0e0e0] transition-colors resize-none"
                                        rows={3}
                                        value={selectedNode.data.label}
                                        onChange={(e) => handleChange('label', e.target.value)}
                                    />
                                ) : (
                                    <CarbonInput
                                        value={selectedNode.data.label}
                                        onChange={(e) => handleChange('label', e.target.value)}
                                    />
                                )}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <CarbonLabel>Font Size</CarbonLabel>
                                    <div className="flex items-center border-b border-[#8d8d8d] bg-[#f4f4f4]">
                                        <input
                                            type="number"
                                            className="w-full bg-transparent px-3 py-2 text-sm text-[#161616] focus:outline-none"
                                            value={selectedNode.data.fontSize || (selectedNode.type === 'annotation' ? 14 : 12)}
                                            onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                                        />
                                        <span className="text-xs text-gray-500 pr-2">px</span>
                                    </div>
                                </div>
                                <div className="flex items-center pt-5">
                                    <input
                                        type="checkbox"
                                        id="isBold"
                                        checked={selectedNode.data.isBold || false}
                                        onChange={(e) => handleChange('isBold', e.target.checked)}
                                        className="w-4 h-4 text-[#0f62fe] bg-white border-gray-300 focus:ring-[#0f62fe]"
                                    />
                                    <label htmlFor="isBold" className="ml-2 text-sm text-[#161616]">Bold</label>
                                </div>
                            </div>

                            <div>
                                <CarbonLabel>Text Alignment</CarbonLabel>
                                <div className="flex bg-[#f4f4f4] border border-gray-200">
                                    {[
                                        { id: 'left', icon: <AlignLeftIcon className="w-4 h-4" /> },
                                        { id: 'center', icon: <AlignCenterIcon className="w-4 h-4" /> },
                                        { id: 'right', icon: <AlignRightIcon className="w-4 h-4" /> }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleChange('textAlign', opt.id)}
                                            className={clsx(
                                                "flex-1 flex items-center justify-center py-2 hover:bg-gray-200",
                                                (selectedNode.data.textAlign || 'left') === opt.id ? "bg-gray-300 text-[#0f62fe]" : "text-gray-500"
                                            )}
                                        >
                                            {opt.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <CarbonLabel>Colors</CarbonLabel>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-500 w-16">Text</span>
                                        <div className="flex-1 h-6 border border-gray-300 rounded-sm relative overflow-hidden">
                                            <input
                                                type="color"
                                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                value={selectedNode.data.textColor || '#334155'}
                                                onChange={(e) => handleChange('textColor', e.target.value)}
                                            />
                                            <div className="w-full h-full pointer-events-none" style={{ backgroundColor: selectedNode.data.textColor || '#334155' }}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-500 w-16">Background</span>
                                        <div className="flex-1 flex gap-2">
                                            <div className="flex-1 h-6 border border-gray-300 rounded-sm relative overflow-hidden">
                                                <input
                                                    type="color"
                                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                    value={selectedNode.data.color || (selectedNode.type === 'annotation' ? '#ffffff' : '#f1f5f9')}
                                                    onChange={(e) => {
                                                        handleChange('color', e.target.value);
                                                        handleChange('isTransparent', false);
                                                    }}
                                                    disabled={selectedNode.data.isTransparent}
                                                />
                                                <div className="w-full h-full pointer-events-none" style={{ backgroundColor: selectedNode.data.color || (selectedNode.type === 'annotation' ? '#ffffff' : '#f1f5f9') }}></div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="checkbox"
                                                    id="isTransparent"
                                                    checked={selectedNode.data.isTransparent || false}
                                                    onChange={(e) => handleChange('isTransparent', e.target.checked)}
                                                    className="w-3 h-3 text-[#0f62fe]"
                                                />
                                                <label htmlFor="isTransparent" className="text-[10px] text-gray-500">None</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-500 w-16">Border</span>
                                        <div className="flex-1 h-6 border border-gray-300 rounded-sm relative overflow-hidden">
                                            <input
                                                type="color"
                                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                value={selectedNode.data.borderColor || '#94a3b8'}
                                                onChange={(e) => handleChange('borderColor', e.target.value)}
                                            />
                                            <div className="w-full h-full pointer-events-none" style={{ backgroundColor: selectedNode.data.borderColor || '#94a3b8' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <CarbonLabel>Border Style</CarbonLabel>
                                    <CarbonSelect
                                        value={selectedNode.data.borderStyle || (selectedNode.type === 'group' ? 'dashed' : 'none')}
                                        onChange={(e) => handleChange('borderStyle', e.target.value)}
                                    >
                                        <option value="none">None</option>
                                        <option value="solid">Solid</option>
                                        <option value="dashed">Dashed</option>
                                        <option value="dotted">Dotted</option>
                                    </CarbonSelect>
                                </div>
                                <div>
                                    <CarbonLabel>Border Width</CarbonLabel>
                                    <div className="flex items-center border-b border-[#8d8d8d] bg-[#f4f4f4]">
                                        <input
                                            type="number"
                                            className="w-full bg-transparent px-3 py-2 text-sm text-[#161616] focus:outline-none"
                                            value={selectedNode.data.borderWidth || (selectedNode.type === 'group' ? 2 : 0)}
                                            onChange={(e) => handleChange('borderWidth', parseInt(e.target.value))}
                                        />
                                        <span className="text-xs text-gray-500 pr-2">px</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <CarbonLabel>Layering (Z-Index)</CarbonLabel>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateNodeZIndex(selectedNode.id, 10)}
                                        className="flex-1 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700"
                                    >
                                        Bring to Front
                                    </button>
                                    <button
                                        onClick={() => updateNodeZIndex(selectedNode.id, -10)}
                                        className="flex-1 py-1 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700"
                                    >
                                        Send to Back
                                    </button>
                                </div>
                            </div>
                        </Section>
                    )}

                    {/* ENTITY CONFIGURATION */}
                    {!isCosmetic && (
                        <Section title="Identity">
                            <div>
                                <CarbonLabel>Display Label</CarbonLabel>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <button
                                            onClick={() => { setIconMenuOpen(!iconMenuOpen); }}
                                            className="h-[38px] w-[38px] flex items-center justify-center bg-[#f4f4f4] border-b border-[#8d8d8d] hover:bg-[#e0e0e0] text-gray-700"
                                        >
                                            {CurrentIconComp}
                                        </button>
                                        {iconMenuOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIconMenuOpen(false)}></div>
                                                <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-xl border border-gray-200 p-2 grid grid-cols-4 gap-1 z-20">
                                                    {iconList.map(item => (
                                                        <IconOption
                                                            key={item.id}
                                                            id={item.id}
                                                            comp={item.comp}
                                                            current={currentIcon}
                                                            onClick={(id: any) => { handleChange('iconType', id); setIconMenuOpen(false); }}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <CarbonInput
                                            value={selectedNode.data.label}
                                            onChange={(e) => handleChange('label', e.target.value)}
                                        />
                                    </div>
                                    <label className="relative cursor-pointer group h-[38px] w-[38px]">
                                        <div className="w-full h-full border-b border-[#8d8d8d] group-hover:border-gray-500 transition-colors relative overflow-hidden" style={{ backgroundColor: selectedNode.data.color || '#475569' }}></div>
                                        <input type="color" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20" value={selectedNode.data.color || '#475569'} onChange={(e) => handleChange('color', e.target.value)} />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <CarbonLabel>Class Name</CarbonLabel>
                                    <CarbonInput
                                        className="font-mono text-xs"
                                        value={selectedNode.data.className}
                                        onChange={(e) => handleChange('className', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <CarbonLabel>Namespace</CarbonLabel>
                                    <CarbonInput
                                        className="font-mono text-xs"
                                        value={selectedNode.data.namespace}
                                        onChange={(e) => handleChange('namespace', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <CarbonLabel>Description</CarbonLabel>
                                <textarea
                                    className="w-full bg-[#f4f4f4] border-b border-[#8d8d8d] px-3 py-2 text-sm text-[#161616] placeholder-gray-400 focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-[#0f62fe] hover:bg-[#e0e0e0] transition-colors resize-none"
                                    rows={3}
                                    value={selectedNode.data.description || ''}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </div>
                        </Section>
                    )}

                    {!isCosmetic && (
                        <>
                            <div className="h-px bg-gray-200 mx-4 mb-6"></div>

                            <Section title={`Properties (${getResolvedProperties().length})`}>
                                <div className="space-y-3">
                                    {getResolvedProperties().length === 0 && (
                                        <div className="text-gray-400 text-xs italic p-4 text-center border border-dashed border-gray-300">
                                            Drag properties from the library here.
                                        </div>
                                    )}
                                    {getResolvedProperties().map(prop => (
                                        <PropertyEditor
                                            key={prop.id}
                                            property={prop}
                                            readOnly={false}
                                            onAddNewListSet={handleAddNewList}
                                        />
                                    ))}
                                </div>
                            </Section>
                        </>
                    )}
                </div>
                {codeEditorPropertyId && <CodeEditorModal propertyId={codeEditorPropertyId} onClose={closeCodeEditor} />}
                {showListManager && <ListManagerModal onClose={() => { setShowListManager(false); setEditingListId(null); }} initialSelectedId={editingListId} />}
            </div>
        );
    }

    // --- DEFAULT: PROJECT SETTINGS ---
    return (
        <div className="w-[320px] bg-white border-l border-gray-300 h-full flex flex-col pt-0 z-20 shadow-xl">
            <Header title="Project Settings" subtitle="Global Config" actions={<div />} onClose={() => setIsOpen(false)} />
            <div className="flex-1 overflow-y-auto py-6">
                <Section title="General Information">
                    <div>
                        <CarbonLabel>Project Name</CarbonLabel>
                        <CarbonInput
                            value={projectName}
                            onChange={(e) => updateProjectMetadata({ name: e.target.value })}
                            placeholder="Untitled Project"
                        />
                    </div>
                    <div>
                        <CarbonLabel>Description</CarbonLabel>
                        <textarea
                            className="w-full bg-[#f4f4f4] border-b border-[#8d8d8d] px-3 py-2 text-sm text-[#161616] placeholder-gray-400 focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-[#0f62fe] hover:bg-[#e0e0e0] transition-colors resize-none"
                            rows={4}
                            value={projectDescription}
                            onChange={(e) => updateProjectMetadata({ description: e.target.value })}
                            placeholder="Project purpose..."
                        />
                    </div>
                </Section>

                <div className="h-px bg-gray-200 mx-4 mb-6"></div>

                <Section title="Statistics">
                    <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200">
                        <div className="bg-white p-4">
                            <span className="block text-3xl font-light text-[#161616] leading-none">{totalObjects}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-500 mt-1 block">Objects</span>
                        </div>
                        <div className="bg-white p-4">
                            <span className="block text-3xl font-light text-[#161616] leading-none">{globalProperties.length}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-500 mt-1 block">Properties</span>
                        </div>
                        <div className="bg-white p-4">
                            <span className="block text-3xl font-light text-[#161616] leading-none">{listSets.length}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-500 mt-1 block">Lists</span>
                        </div>
                        <div className="bg-white p-4">
                            <span className={clsx("block text-3xl font-light leading-none", missingDescriptions > 0 ? "text-amber-600" : "text-[#161616]")}>{missingDescriptions}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-500 mt-1 block">Undocumented</span>
                        </div>
                        <div className="bg-white p-4 col-span-2">
                            <span className={clsx("block text-3xl font-light leading-none", orphanedNodes > 0 ? "text-red-600" : "text-[#161616]")}>{orphanedNodes}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-500 mt-1 block">Orphaned Nodes</span>
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
};
