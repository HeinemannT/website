import React, { useState, useMemo } from 'react';
import { useStore } from '../../store';
import { ShieldIcon, ChartIcon, AlertIcon, UserIcon, CubeIcon, CheckIcon, RefIcon, RRefIcon, FolderIcon, SortAlphaIcon, SortTypeIcon, FilterIcon, CalendarIcon, GlobeIcon, MailIcon, ToggleIcon, ListIcon, LockIcon, BadgeIcon, FormulaIcon, TypeIcon, GroupIcon } from '../Icons';
import clsx from 'clsx';
import { toast } from 'react-hot-toast';
import { MethodConfigType } from '../../types';
import { ListManagerModal } from '../inspector/modals/ListManagerModal';
import { AccordionItem, ConfirmationModal } from './ui/Layout';
import { DraggableItem, DraggablePropertyBox, DraggableUserBox } from './DraggableLibrary';

export const Sidebar = () => {
    const [activeTab, setActiveTab] = useState<'dictionary' | 'lists'>('dictionary');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sortMode, setSortMode] = useState<'alpha' | 'type'>('alpha');
    const [typeFilter, setTypeFilter] = useState<MethodConfigType | 'ALL'>('ALL');

    const [accordions, setAccordions] = useState({
        cosmetics: true,
        templates: true,
        create: true,
        library: true
    });

    const [showListManager, setShowListManager] = useState(false);
    const [editingListId, setEditingListId] = useState<string | null>(null);

    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

    const globalProperties = useStore(state => state.globalProperties);
    const listSets = useStore(state => state.listPropertySets);
    const nodes = useStore(state => state.nodes);

    const deleteGlobalProperty = useStore(state => state.deleteGlobalProperty);
    const deleteListPropertySet = useStore(state => state.deleteListPropertySet);
    const addListPropertySet = useStore(state => state.addListPropertySet);

    const toggleAccordion = (key: keyof typeof accordions) => {
        setAccordions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const filteredProperties = useMemo(() => {
        let result = globalProperties.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (typeFilter !== 'ALL') {
            result = result.filter(p => p.type === typeFilter);
        }

        result.sort((a, b) => {
            if (sortMode === 'alpha') {
                return a.name.localeCompare(b.name);
            } else {
                const typeCompare = a.type.localeCompare(b.type);
                if (typeCompare !== 0) return typeCompare;
                return a.name.localeCompare(b.name);
            }
        });

        return result;
    }, [globalProperties, searchTerm, sortMode, typeFilter]);

    const onDragStart = (event: React.DragEvent, nodeType: string, payload: any) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/payload', JSON.stringify(payload));
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleDeleteProp = (e: React.MouseEvent | React.TouchEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        const isUsed = nodes.some(n => n.data.linkedProperties.includes(id));

        if (isUsed) {
            setConfirmState({
                isOpen: true,
                title: 'Delete Property?',
                message: `Property '${id}' is currently linked to one or more objects on the canvas.\n\nDeleting it will remove the property from all these objects effectively modifying their structure.`,
                onConfirm: () => {
                    deleteGlobalProperty(id);
                    toast.success('Property deleted');
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                }
            });
        } else {
            deleteGlobalProperty(id);
            toast.success('Property deleted');
        }
    };

    const handleDeleteList = (e: React.MouseEvent | React.TouchEvent, listId: string, listName: string) => {
        e.preventDefault();
        e.stopPropagation();

        const isUsed = globalProperties.some(p => p.config.listId === listId);

        if (isUsed) {
            setConfirmState({
                isOpen: true,
                title: 'Delete List Set?',
                message: `The list '${listName}' is actively used by properties in your library.\n\nDeleting it will detach the list configuration from those properties.`,
                onConfirm: () => {
                    deleteListPropertySet(listId);
                    toast.success('List deleted');
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                }
            });
        } else {
            deleteListPropertySet(listId);
            toast.success('List deleted');
        }
    };

    const handleAddNewList = () => {
        const id = `lps_new_list_${Date.now()}`;
        addListPropertySet({ id, name: 'New List Set', items: [{ id: 'item_1', name: 'Item 1' }] });
        setEditingListId(id);
        setShowListManager(true);
    };

    const getPropColorInfo = (type: string) => {
        if (type.includes('Number')) return { border: 'bg-emerald-500', icon: <span className="font-mono font-bold text-emerald-600 text-[10px]">123</span> };
        if (type.includes('String') || type.includes('Text')) return { border: 'bg-gray-400', icon: <span className="font-mono font-bold text-gray-500 text-[10px]">Aa</span> };
        if (type.includes('Boolean')) return { border: 'bg-orange-400', icon: <ToggleIcon className="w-3 h-3 text-orange-500" /> };
        if (type.includes('Date')) return { border: 'bg-violet-400', icon: <CalendarIcon className="w-3 h-3 text-violet-500" /> };
        if (type.includes('List')) return { border: 'bg-amber-400', icon: <ListIcon className="w-3 h-3 text-amber-600" /> };
        if (type.includes('Extended')) return { border: 'bg-red-600', icon: <FormulaIcon className="w-3 h-3 text-red-600" /> };
        if (type.includes('Reverse')) return { border: 'bg-sky-400', icon: <RRefIcon className="w-3 h-3 text-sky-500" /> };
        if (type.includes('Reference')) return { border: 'bg-blue-600', icon: <RefIcon className="w-3 h-3 text-blue-600" /> };
        return { border: 'bg-gray-300', icon: <span className="text-[10px]">?</span> };
    };

    const cycleFilter = () => {
        const types: (MethodConfigType | 'ALL')[] = [
            'ALL',
            'NumberMethodConfig',
            'StringMethodConfig',
            'ReferenceMethodConfig',
            'ListMethodConfig'
        ];
        const currentIndex = types.indexOf(typeFilter as any);
        const nextIndex = (currentIndex + 1) % types.length;
        setTypeFilter(types[nextIndex] as any);
    };

    const getFilterIcon = () => {
        if (typeFilter === 'ALL') return <FilterIcon className="w-3 h-3" />;
        if (typeFilter === 'NumberMethodConfig') return <span className="font-mono font-bold text-[10px]">123</span>;
        if (typeFilter === 'StringMethodConfig') return <span className="font-mono font-bold text-[10px]">Aa</span>;
        if (typeFilter === 'ReferenceMethodConfig') return <RefIcon className="w-3 h-3" />;
        if (typeFilter === 'ListMethodConfig') return <ListIcon className="w-3 h-3" />;
        return <FilterIcon className="w-3 h-3" />;
    };

    if (isCollapsed) {
        return (
            <div className="w-12 bg-white border-r border-gray-300 h-full flex flex-col items-center py-4 z-30">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-2 text-gray-500 hover:bg-gray-100 mb-4"
                    title="Expand Toolbox"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            </div>
        );
    }

    return (
        <div className="w-72 bg-white border-r border-gray-300 h-full flex flex-col z-30 transition-all duration-200 shadow-lg">

            {/* Clean White Header */}
            <div className="px-4 py-4 bg-white border-b border-gray-200 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Toolbox</h2>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">Visual Architect</p>
                </div>
                <button onClick={() => setIsCollapsed(true)} className="text-gray-400 hover:text-slate-800 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-white">

                {/* ACCORDION 0: COSMETICS */}
                <AccordionItem title="Annotations" isOpen={accordions.cosmetics} onToggle={() => toggleAccordion('cosmetics')}>
                    <div className="p-3 bg-white border-b border-gray-100 grid grid-cols-2 gap-2">
                        <DraggableItem
                            label="Group"
                            icon={<GroupIcon className="text-gray-700 w-4 h-4" />}
                            onDrag={(e) => onDragStart(e, 'group', { type: 'group', label: 'Group', isTransparent: true, color: 'transparent' })}
                        />
                        <DraggableItem
                            label="Label"
                            icon={<TypeIcon className="text-gray-700 w-4 h-4" />}
                            onDrag={(e) => onDragStart(e, 'annotation', { type: 'annotation', label: 'Label', color: 'transparent' })}
                        />
                    </div>
                </AccordionItem>

                {/* ACCORDION 1: OBJECT TEMPLATES */}
                <AccordionItem title="Object Templates" isOpen={accordions.templates} onToggle={() => toggleAccordion('templates')}>
                    <div className="p-3 bg-white max-h-[45vh] overflow-y-auto scrollbar-thin-dark">
                        <div className="grid grid-cols-2 gap-2">
                            <DraggableItem label="Object" icon={<FolderIcon className="text-gray-900 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'Object', label: 'Object', namespace: 't', icon: 'folder', color: '#475569' })} />
                            <DraggableItem label="Organisation" icon={<GlobeIcon className="text-blue-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'Organisation', label: 'Organisation', namespace: 'o', icon: 'globe', color: '#2563eb' })} />
                            <DraggableItem label="User" icon={<UserIcon className="text-gray-700 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'User', label: 'User', namespace: 'u', icon: 'user', color: '#334155' })} />
                            <DraggableItem label="Risk" icon={<ShieldIcon className="text-red-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeRiskAssessment', label: 'Risk', namespace: 'ceras', icon: 'shield', color: '#dc2626' })} />
                            <DraggableItem label="Control" icon={<CheckIcon className="text-emerald-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeControlMeasure', label: 'Control', namespace: 'cecme', icon: 'check', color: '#059669' })} />
                            <DraggableItem label="Incident" icon={<AlertIcon className="text-amber-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeIncident', label: 'Incident', namespace: 'ceinc', icon: 'alert', color: '#fbbf24' })} />
                            <DraggableItem label="Procedure" icon={<FolderIcon className="text-slate-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeProcedure', label: 'Procedure', namespace: 'cepro', icon: 'folder', color: '#475569' })} />
                            <DraggableItem label="Policy" icon={<ShieldIcon className="text-gray-700 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CePolicy', label: 'Policy', namespace: 'cepol', icon: 'shield', color: '#334155' })} />
                            <DraggableItem label="Task" icon={<CheckIcon className="text-blue-500 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeTask', label: 'Task', namespace: 'cetas', icon: 'check', color: '#3b82f6' })} />
                            <DraggableItem label="Vendor" icon={<CubeIcon className="text-indigo-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeVendor', label: 'Vendor', namespace: 'ceven', icon: 'cube', color: '#4f46e5' })} />
                            <DraggableItem label="Asset" icon={<CubeIcon className="text-cyan-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeAsset', label: 'Asset', namespace: 'ceass', icon: 'cube', color: '#0891b2' })} />
                            <DraggableItem label="Product" icon={<CubeIcon className="text-purple-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeProduct', label: 'Product', namespace: 'ceprd', icon: 'cube', color: '#7c3aed' })} />
                            <DraggableItem label="Objective" icon={<ChartIcon className="text-blue-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeObjective', label: 'Objective', namespace: 'ceobj', icon: 'chart', color: '#2563eb' })} />
                            <DraggableItem label="Indicator" icon={<ChartIcon className="text-green-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeIndicator', label: 'Indicator', namespace: 'ceind', icon: 'chart', color: '#16a34a' })} />
                            <DraggableItem label="Project" icon={<ChartIcon className="text-orange-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeProject', label: 'Project', namespace: 'ceprj', icon: 'chart', color: '#ea580c' })} />
                            <DraggableItem label="Regulation" icon={<ShieldIcon className="text-slate-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeRegulation', label: 'Regulation', namespace: 'cereg', icon: 'shield', color: '#475569' })} />
                            <DraggableItem label="Compliance Req" icon={<CheckIcon className="text-slate-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeComplianceRequirement', label: 'Compliance Req', namespace: 'cecor', icon: 'check', color: '#475569' })} />
                            <DraggableItem label="Contract" icon={<FolderIcon className="text-slate-600 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeContract', label: 'Contract', namespace: 'cecot', icon: 'folder', color: '#475569' })} />
                            <DraggableItem label="Comment" icon={<MailIcon className="text-slate-400 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeComment', label: 'Comment', namespace: 'cecom', icon: 'mail', color: '#94a3b8' })} />
                            <DraggableItem label="Attachment" icon={<FolderIcon className="text-slate-400 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'CeAttachment', label: 'Attachment', namespace: 'ceatt', icon: 'folder', color: '#94a3b8' })} />
                            <DraggableItem label="Role" icon={<BadgeIcon className="text-slate-500 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'Role', label: 'Role', namespace: 'role', icon: 'user', color: '#64748b' })} />
                            <DraggableItem label="Access Policy" icon={<LockIcon className="text-rose-500 w-4 h-4" />} onDrag={(e) => onDragStart(e, 'corporaterClass', { type: 'object', className: 'AccessPolicy', label: 'Access Policy', namespace: 'acpol', icon: 'shield', color: '#e11d48' })} />
                        </div>
                    </div>
                </AccordionItem>

                {/* ACCORDION 2: PROPERTIES */}
                <AccordionItem title="Properties" isOpen={accordions.create} onToggle={() => toggleAccordion('create')}>
                    <div className="p-3 grid grid-cols-4 gap-2 bg-white">
                        <DraggablePropertyBox type="NumberMethodConfig" label="Number" symbol="123" />
                        <DraggablePropertyBox type="TextMethodConfig" label="Text" symbol="Aa" />
                        <DraggablePropertyBox type="RichTextMethodConfig" label="Rich" symbol="¶" />
                        <DraggablePropertyBox type="DateMethodConfig" label="Date" symbol={<CalendarIcon className="w-3 h-3" />} />

                        <DraggablePropertyBox type="ListMethodConfig" label="List" symbol={<ListIcon className="w-3 h-3" />} />
                        <DraggablePropertyBox type="BooleanMethodConfig" label="Bool" symbol={<ToggleIcon className="w-3 h-3" />} />
                        <DraggablePropertyBox type="FileMethodConfig" label="File" symbol={<FolderIcon className="w-3 h-3" />} />
                        <DraggablePropertyBox type="ExtendedMethodConfig" label="Calc" symbol={<FormulaIcon className="w-3 h-3" />} />

                        <DraggablePropertyBox type="ReferenceMethodConfig" label="Ref" symbol={<RefIcon className="w-3 h-3" />} />
                        <DraggablePropertyBox type="ReverseReferenceMethodConfig" label="R-Ref" symbol={<RRefIcon className="w-3 h-3" />} />

                        <DraggableUserBox onDragStart={onDragStart} />
                    </div>
                </AccordionItem>

                {/* ACCORDION 3: LIBRARY */}
                <AccordionItem title="Library" isOpen={accordions.library} onToggle={() => toggleAccordion('library')}>
                    <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
                        <button
                            onClick={() => setActiveTab('dictionary')}
                            className={clsx(
                                "flex-1 py-2 text-[10px] font-bold uppercase tracking-wide transition-colors border-b-2",
                                activeTab === 'dictionary' ? "text-[#0f62fe] border-[#0f62fe]" : "text-gray-500 border-transparent hover:text-gray-800"
                            )}
                        >
                            Properties
                        </button>
                        <button
                            onClick={() => setActiveTab('lists')}
                            className={clsx(
                                "flex-1 py-2 text-[10px] font-bold uppercase tracking-wide transition-colors border-b-2",
                                activeTab === 'lists' ? "text-[#0f62fe] border-[#0f62fe]" : "text-gray-500 border-transparent hover:text-gray-800"
                            )}
                        >
                            Lists
                        </button>
                    </div>

                    <div className="bg-white flex flex-col min-h-[300px]">
                        {activeTab === 'dictionary' && (
                            <>
                                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex gap-2 shrink-0">
                                    <input
                                        type="search"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-1 bg-white border border-gray-300 px-2 py-1 text-xs focus:border-[#0f62fe] focus:outline-none placeholder-gray-400"
                                    />
                                    <button
                                        onClick={() => setSortMode(s => s === 'alpha' ? 'type' : 'alpha')}
                                        className={clsx(
                                            "w-7 h-7 flex items-center justify-center border transition-all",
                                            sortMode === 'type' ? "bg-gray-200 border-gray-300 text-[#0f62fe]" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                        )}
                                    >
                                        {sortMode === 'alpha' ? <SortAlphaIcon className="w-3.5 h-3.5" /> : <SortTypeIcon className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                        onClick={cycleFilter}
                                        className={clsx(
                                            "w-7 h-7 flex items-center justify-center border transition-all",
                                            typeFilter !== 'ALL' ? "bg-[#0f62fe] border-[#0f62fe] text-white" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                        )}
                                    >
                                        {getFilterIcon()}
                                    </button>
                                </div>

                                <div className="p-2 space-y-1">
                                    {filteredProperties.length === 0 && (
                                        <p className="text-[10px] text-gray-400 text-center py-4 font-mono">NO PROPERTIES</p>
                                    )}
                                    {filteredProperties.map(prop => {
                                        const style = getPropColorInfo(prop.type);
                                        return (
                                            <div
                                                key={prop.id}
                                                className="flex items-center gap-3 p-2 bg-white border border-transparent hover:border-[#0f62fe] hover:shadow-sm cursor-move group transition-all"
                                                draggable
                                                onDragStart={(e) => onDragStart(e, 'property', { type: 'existing_property', propertyId: prop.id, label: prop.name })}
                                            >
                                                <div className={clsx("w-1 self-stretch", style.border)}></div>
                                                <div className="w-5 flex justify-center shrink-0 text-gray-500">
                                                    {style.icon}
                                                </div>
                                                <div className="flex-1 flex flex-col min-w-0">
                                                    <span className="text-xs font-semibold text-gray-800 truncate">{prop.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-mono truncate">{prop.id}</span>
                                                </div>
                                                <button
                                                    onMouseDown={(e) => handleDeleteProp(e, prop.id)}
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                    className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {activeTab === 'lists' && (
                            <div className="flex flex-col bg-white">
                                <div className="p-4 border-b border-gray-200">
                                    <button
                                        onClick={handleAddNewList}
                                        className="w-full py-2 bg-slate-900 text-white text-xs font-semibold uppercase hover:bg-slate-700 transition-colors"
                                    >
                                        + Create New List
                                    </button>
                                </div>

                                <div className="p-2 space-y-2">
                                    {listSets.map(list => (
                                        <div
                                            key={list.id}
                                            className="bg-gray-50 border border-gray-200 p-3 hover:border-[#0f62fe] cursor-move group shadow-sm"
                                            draggable
                                            onDragStart={(e) => onDragStart(e, 'property', { type: 'list_set', listSetId: list.id, label: list.name })}
                                        >
                                            <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-1">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <ListIcon className="w-3 h-3 text-amber-600 shrink-0" />
                                                    <span className="text-xs font-bold text-gray-800 truncate" title={list.name}>{list.name}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => { setEditingListId(list.id); setShowListManager(true); }}
                                                        className="text-gray-400 hover:text-[#0f62fe] p-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>
                                                    </button>
                                                    <button
                                                        onMouseDown={(e) => handleDeleteList(e, list.id, list.name)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-gray-400 hover:text-red-500 p-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {list.items.slice(0, 3).map(i => (
                                                    <span key={i.id} className="text-[10px] text-gray-600 bg-white px-2 py-0.5 border border-gray-200 shadow-sm">
                                                        {i.name}
                                                    </span>
                                                ))}
                                                {list.items.length > 3 && (
                                                    <span className="text-[10px] text-gray-400 px-1 py-0.5">
                                                        +{list.items.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </AccordionItem>
            </div>

            <ConfirmationModal
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm}
                onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
            />

            {showListManager && (
                <ListManagerModal
                    onClose={() => { setShowListManager(false); setEditingListId(null); }}
                    initialSelectedId={editingListId}
                />
            )}
        </div>
    );
};
