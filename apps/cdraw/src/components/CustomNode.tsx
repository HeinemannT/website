import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useStore } from '../store';
import { ShieldIcon, ChartIcon, FolderIcon, AlertIcon, UserIcon, CheckIcon, CubeIcon, GlobeIcon, MailIcon, CalendarIcon, LockIcon } from './Icons';
import { NodeData } from '../types';
import clsx from 'clsx';
import { colord } from 'colord';

const CorporaterNode = ({ id, data, selected }: NodeProps<NodeData>) => {
    const viewMode = useStore((state) => state.viewMode);
    const showPropertiesOnCanvas = useStore((state) => state.showPropertiesOnCanvas);
    const globalProperties = useStore((state) => state.globalProperties);
    const edges = useStore((state) => state.edges);
    const selectProperty = useStore((state) => state.selectProperty);
    const selectEdge = useStore((state) => state.selectEdge);
    const selectNode = useStore((state) => state.selectNode);
    const updateNodeMetadata = useStore(state => state.updateNodeMetadata);

    const resolvedProperties = data.linkedProperties.map(pId =>
        globalProperties.find(gp => gp.id === pId)
    ).filter(Boolean);

    const getIcon = () => {
        switch (data.iconType) {
            case 'shield': return <ShieldIcon className="w-5 h-5" />;
            case 'chart': return <ChartIcon className="w-5 h-5" />;
            case 'alert': return <AlertIcon className="w-5 h-5" />;
            case 'user': return <UserIcon className="w-5 h-5" />;
            case 'check': return <CheckIcon className="w-5 h-5" />;
            case 'cube': return <CubeIcon className="w-5 h-5" />;
            case 'globe': return <GlobeIcon className="w-5 h-5" />;
            case 'mail': return <MailIcon className="w-5 h-5" />;
            case 'calendar': return <CalendarIcon className="w-5 h-5" />;
            default: return <FolderIcon className="w-5 h-5" />;
        }
    };

    const hasErrors = data.validationIssues?.some(i => i.type === 'error');
    const hasWarnings = data.validationIssues?.some(i => i.type === 'warning');
    const nodeColor = data.color || '#475569';

    const isLight = colord(nodeColor).isLight();

    const onPropertyClick = (e: React.MouseEvent, prop: any) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if (prop.type === 'ReferenceMethodConfig' || prop.type === 'ReverseReferenceMethodConfig') {
            const edge = edges.find(edge =>
                edge.source === id &&
                edge.data?.linkedPropertyId === prop.id
            );

            if (edge) {
                selectEdge(edge.id);
                return;
            }
        }

        selectNode(id);
        selectProperty(prop.id);
    };

    const handleClasses = clsx(
        "transition-opacity duration-200 !w-2 !h-2 !bg-[#0f62fe] !border-none !rounded-none",
        viewMode === 'simple' ? "opacity-0 hover:opacity-100" : "opacity-100"
    );

    const handles = (
        <>
            <Handle type="source" position={Position.Top} id="t" className={clsx("!-top-[5px]", handleClasses)} />
            <Handle type="source" position={Position.Right} id="r" className={clsx("!-right-[5px]", handleClasses)} />
            <Handle type="source" position={Position.Bottom} id="b" className={clsx("!-bottom-[5px]", handleClasses)} />
            <Handle type="source" position={Position.Left} id="l" className={clsx("!-left-[5px]", handleClasses)} />
        </>
    );

    const StatusBorder = () => {
        if (hasErrors) return <div className="absolute inset-0 border-2 border-red-600 pointer-events-none z-10"></div>;
        if (hasWarnings) return <div className="absolute inset-0 border-2 border-amber-500 pointer-events-none z-10"></div>;
        return null;
    };

    const handleInput = (key: keyof NodeData, value: string) => {
        updateNodeMetadata(id, { [key]: value });
    };

    // Carbon Style Inputs: Subtle gray background to indicate interactivity
    const inputBaseStyles = "bg-[#f4f4f4]/80 border-b border-transparent hover:border-gray-400 focus:bg-white focus:text-[#161616] focus:border-[#0f62fe] focus:outline-none transition-all px-1.5 py-0.5 -ml-1.5 nodrag cursor-text w-full";

    if (viewMode === 'simple') {
        return (
            <div className={clsx(
                "bg-white border transition-all duration-100 w-[260px] overflow-hidden group relative shadow-md",
                selected ? "outline outline-2 outline-[#0f62fe] border-transparent" : "border-gray-300 hover:shadow-lg"
            )}>
                {handles}

                <div
                    className={clsx("p-4 flex items-center gap-3 relative border-b border-black/10", isLight ? "text-gray-900" : "text-white")}
                    style={{ backgroundColor: nodeColor }}
                >
                    <div className={clsx("p-2 backdrop-blur-sm shrink-0 pointer-events-none", isLight ? "bg-transparent" : "bg-transparent")}>
                        {getIcon()}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1 relative z-10">
                        <input
                            className={clsx(
                                "font-bold text-base leading-tight tracking-tight mb-1 bg-transparent hover:bg-transparent focus:bg-white focus:text-black border border-transparent focus:border-[#0f62fe] rounded px-1 -ml-1 transition-colors",
                                isLight ? "text-gray-900 placeholder:text-gray-500" : "text-white placeholder:text-white/70"
                            )}
                            value={data.label}
                            onChange={(e) => handleInput('label', e.target.value)}
                            placeholder="Object Name"
                        />
                        <input
                            className={clsx(
                                inputBaseStyles,
                                "text-[10px] uppercase tracking-wider font-semibold bg-transparent hover:bg-transparent border-none",
                                isLight ? "text-gray-600 placeholder:text-gray-400 focus:bg-white" : "text-white/90 placeholder:text-white/60 focus:text-gray-900 focus:bg-white"
                            )}
                            value={data.description || ''}
                            onChange={(e) => handleInput('description', e.target.value)}
                            placeholder="NO DESCRIPTION"
                        />
                    </div>
                </div>

                {showPropertiesOnCanvas && (
                    <div className="bg-white py-2 flex flex-col">
                        {resolvedProperties.length === 0 ? (
                            <div className="px-4 py-3 text-xs text-gray-400 italic text-center">Drag properties here</div>
                        ) : (
                            <>
                                {resolvedProperties.slice(0, 5).map((prop, idx) => (
                                    <div
                                        key={idx}
                                        onClick={(e) => onPropertyClick(e, prop)}
                                        className="flex justify-between items-center px-4 py-1.5 hover:bg-blue-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-[#0f62fe] group/prop"
                                    >
                                        <span className={clsx(
                                            "text-sm font-medium transition-colors text-gray-700 group-hover/prop:text-[#0f62fe]"
                                        )}>
                                            {prop?.name}
                                        </span>
                                        <span className="text-[9px] text-gray-500 uppercase font-mono bg-gray-100 px-1.5 py-0.5 border border-gray-200">
                                            {prop?.type.includes('Number') ? '123' :
                                                prop?.type.includes('Reference') ? 'REF' :
                                                    prop?.type.includes('List') ? 'LST' :
                                                        prop?.type.includes('Date') ? 'DAT' :
                                                            prop?.type.includes('Boolean') ? 'BOOL' : 'TXT'}
                                        </span>
                                    </div>
                                ))}
                                {resolvedProperties.length > 5 && (
                                    <div className="px-4 py-2 text-[10px] text-center text-gray-400 font-bold uppercase tracking-wider">
                                        +{resolvedProperties.length - 5} More
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    } else {
        // === ARCHITECT MODE ===
        return (
            <div className={clsx(
                "bg-white border transition-all duration-100 min-w-[220px] font-mono text-xs relative shadow-sm",
                selected ? "border-[#0f62fe] outline outline-1 outline-[#0f62fe]" : "border-gray-400",
                data.locked && "opacity-90 bg-gray-50"
            )}>
                {handles}
                <StatusBorder />

                <div className="bg-gray-100 p-2 border-b border-gray-300 flex flex-col items-center justify-center relative group/header min-h-[50px] cursor-move">
                    <div className="w-full flex justify-center mb-1 pointer-events-none">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-white border border-gray-200 px-1.5 py-0.5 font-bold">
                            {data.namespace || 'NS'}
                        </span>
                    </div>

                    <div className="w-full flex justify-center pointer-events-none">
                        <span className="font-bold text-[#161616] text-sm text-center">
                            {data.className || 'ClassName'}
                        </span>
                    </div>

                    <div className="absolute top-2 right-2 text-gray-400 scale-75 pointer-events-none">{getIcon()}</div>

                    {data.locked && (
                        <div className="absolute top-2 left-2 text-gray-400 pointer-events-none">
                            <LockIcon className="w-3 h-3" />
                        </div>
                    )}
                </div>

                <div className={clsx("py-3 px-3 bg-white leading-relaxed text-gray-700 space-y-2", (showPropertiesOnCanvas && resolvedProperties.length > 0) && "border-b border-gray-300")}>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 shrink-0 border border-gray-300" style={{ backgroundColor: nodeColor }}></div>
                        <input
                            className={clsx(inputBaseStyles, "font-bold text-xs uppercase")}
                            value={data.label}
                            onChange={(e) => handleInput('label', e.target.value)}
                            placeholder="LABEL"
                        />
                    </div>
                    <textarea
                        className={clsx(inputBaseStyles, "text-[10px] text-gray-500 italic resize-none h-auto min-h-[24px]")}
                        value={data.description || ''}
                        onChange={(e) => handleInput('description', e.target.value)}
                        placeholder="Description..."
                        rows={2}
                    />
                </div>

                {showPropertiesOnCanvas && (
                    <div className="bg-white min-h-[20px] py-1">
                        {resolvedProperties.length === 0 ? (
                            <div className="text-gray-300 text-[9px] text-center py-2 uppercase tracking-wide">-- Empty --</div>
                        ) : (
                            resolvedProperties.map((prop) => (
                                <div
                                    key={prop?.id}
                                    onClick={(e) => onPropertyClick(e, prop)}
                                    className="px-3 py-1 flex items-center justify-between hover:bg-blue-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-[#0f62fe] group/prop"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className={clsx(
                                            "w-1.5 h-1.5 shrink-0",
                                            prop?.type === 'ExtendedMethodConfig' ? "bg-red-600" :
                                                prop?.type === 'ReferenceMethodConfig' ? "bg-blue-600" :
                                                    prop?.type === 'ReverseReferenceMethodConfig' ? "bg-sky-400" :
                                                        "bg-gray-400"
                                        )} />
                                        <span className="text-[10px] font-medium text-gray-700 truncate max-w-[150px] group-hover/prop:text-[#0f62fe]" title={prop?.name}>{prop?.id}</span>
                                    </div>
                                    <span className="text-[9px] text-gray-500 font-normal uppercase">
                                        {prop?.type.includes('Number') ? '123' :
                                            prop?.type.includes('Reference') ? 'REF' :
                                                prop?.type.includes('List') ? 'LST' :
                                                    prop?.type.includes('Date') ? 'DAT' :
                                                        prop?.type.includes('Boolean') ? 'BOL' : 'TXT'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    }
};

export default memo(CorporaterNode);