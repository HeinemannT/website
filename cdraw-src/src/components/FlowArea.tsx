import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
    useReactFlow,
    Panel,
    Background,
    BackgroundVariant,
    ConnectionMode,
    MarkerType,
    NodeDragHandler
} from 'reactflow';
import { Toaster, toast } from 'react-hot-toast';
import { useStore } from '../store';
import CorporaterNode from './CustomNode';
import { GroupNode, AnnotationNode } from './CosmeticNodes';
import SmartEdge from './SmartEdge';
import { CompilerModal } from './CompilerModal';
import { AppNode, ContextMenuData, DragPayload } from '../types';
import { UserIcon } from './Icons';
import { Tooltip } from './Tooltip';
import clsx from 'clsx';
import { MenuControls } from './layout/Menu';
import { ToolbarButton, HistoryControls, DrawingControls, ZoomControls } from './layout/Controls';
import { ContextMenu } from './layout/ContextMenu';

const nodeTypes = {
    corporaterClass: CorporaterNode,
    group: GroupNode,
    annotation: AnnotationNode
};

const edgeTypes = {
    smart: SmartEdge,
};

export const FlowArea = () => {
    const reactFlowInstance = useReactFlow();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const onNodesChange = useStore((state) => state.onNodesChange);
    const onEdgesChange = useStore((state) => state.onEdgesChange);
    const onConnect = useStore((state) => state.onConnect);
    const addNode = useStore((state) => state.addNode);
    const selectNode = useStore((state) => state.selectNode);
    const selectEdge = useStore((state) => state.selectEdge);

    const createAndLinkProperty = useStore(state => state.createAndLinkProperty);
    const linkExistingProperty = useStore(state => state.linkExistingProperty);
    const copySelection = useStore(state => state.copySelection);
    const pasteSelection = useStore(state => state.pasteSelection);
    const deleteSelection = useStore(state => state.deleteSelection);
    const updateEdgeData = useStore(state => state.updateEdgeData);
    const reparentNode = useStore(state => state.reparentNode);

    const viewMode = useStore((state) => state.viewMode);
    const canvasBackground = useStore((state) => state.canvasBackground);
    const toggleViewMode = useStore((state) => state.toggleViewMode);
    const cycleCanvasBackground = useStore((state) => state.cycleCanvasBackground);
    const showPropertiesOnCanvas = useStore((state) => state.showPropertiesOnCanvas);
    const toggleShowProperties = useStore((state) => state.toggleShowProperties);

    const [showCompiler, setShowCompiler] = useState(false);
    const [contextMenu, setContextMenu] = useState<ContextMenuData | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && !e.repeat) {
                const activeTag = document.activeElement?.tagName.toLowerCase();
                if (activeTag !== 'input' && activeTag !== 'textarea') {
                    deleteSelection();
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                copySelection();
                toast('Copied', { duration: 1000, icon: '📋' });
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                pasteSelection();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [deleteSelection, copySelection, pasteSelection]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const payloadString = event.dataTransfer.getData('application/payload');

            if (!type || !payloadString) return;

            const payload = JSON.parse(payloadString) as DragPayload;

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const elementMouseIsOver = document.elementFromPoint(event.clientX, event.clientY);
            const nodeElement = elementMouseIsOver?.closest('.react-flow__node');

            if (type === 'property' && nodeElement) {
                const nodeId = nodeElement.getAttribute('data-id');
                const targetNode = nodes.find(n => n.id === nodeId);

                if (targetNode && (targetNode.type === 'group' || targetNode.type === 'annotation')) {
                    return;
                }

                if (nodeId) {
                    if (payload.type === 'existing_property' && payload.propertyId) {
                        linkExistingProperty(nodeId, payload.propertyId);
                        toast.success(`Linked '${payload.label}' to node`);
                    } else if (payload.type === 'list_set' && payload.listSetId) {
                        createAndLinkProperty(nodeId, {
                            type: 'ListMethodConfig',
                            label: payload.label,
                            listId: payload.listSetId
                        });
                        toast.success(`Created List Property using '${payload.label}'`);
                    } else {
                        createAndLinkProperty(nodeId, { type: payload.type as any, label: payload.label });
                        toast.success(`Created & Linked ${payload.label} to node`);
                    }
                }
                return;
            }

            if (type === 'corporaterClass' || type === 'group' || type === 'annotation') {
                // Native Sub-Flow Parenting Check on Drop
                let parentId: string | undefined = undefined;
                let finalPosition = position;

                // Check if we dropped ONTO a group node
                const intersectingNodes = reactFlowInstance.getIntersectingNodes({
                    x: position.x,
                    y: position.y,
                    width: 1,
                    height: 1
                });

                const groupNode = intersectingNodes.find(n => n.type === 'group');
                if (groupNode) {
                    parentId = groupNode.id;
                    // Adjust to relative position
                    finalPosition = {
                        x: position.x - groupNode.position.x,
                        y: position.y - groupNode.position.y
                    };
                }

                const newNode: AppNode = {
                    id: `node_${nodes.length + 1}_${Math.floor(Math.random() * 1000)}`,
                    type: type === 'corporaterClass' ? 'corporaterClass' : type,
                    position: finalPosition,
                    parentId: parentId,
                    extent: parentId ? 'parent' : undefined,
                    data: {
                        label: payload.label,
                        className: payload.className || 'NewClass',
                        namespace: payload.namespace || 'cexxx',
                        isEnterprise: type === 'corporaterClass',
                        linkedProperties: [],
                        iconType: (payload.icon as any) || 'folder',
                        color: (payload as any).color
                    },
                    width: type === 'group' ? 300 : (type === 'annotation' ? 200 : undefined),
                    height: type === 'group' ? 300 : (type === 'annotation' ? 100 : undefined),
                    zIndex: type === 'group' ? -1 : undefined,
                };
                addNode(newNode);
                toast.success(`Added ${payload.label}`);
            }
        },
        [reactFlowInstance, addNode, createAndLinkProperty, linkExistingProperty, nodes]
    );

    // Handler for Native Reparenting (Sub-Flows)
    const onNodeDragStop: NodeDragHandler = useCallback((event, node) => {
        // Find intersections to see if we dropped inside a group
        const intersectingNodes = reactFlowInstance.getIntersectingNodes(node);
        const groupNode = intersectingNodes.find(n => n.type === 'group' && n.id !== node.id);

        if (groupNode) {
            if (node.parentId !== groupNode.id) {
                reparentNode(node.id, groupNode.id);
            }
        } else {
            if (node.parentId) {
                reparentNode(node.id, undefined);
            }
        }
    }, [reactFlowInstance, reparentNode]);

    const handleAddDefaultNode = () => {
        const newNode: AppNode = {
            id: `node_start_${Date.now()}`,
            type: 'corporaterClass',
            position: { x: 250, y: 150 },
            data: {
                label: 'New Object',
                className: 'CeNewObject',
                namespace: 'ceobj',
                isEnterprise: true,
                linkedProperties: [],
                iconType: 'cube',
                color: '#4f46e5'
            },
        };
        addNode(newNode);
    };

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: AppNode) => {
            event.preventDefault();
            setContextMenu({
                id: node.id,
                top: event.clientY,
                left: event.clientX,
                type: 'node',
            });
        },
        []
    );

    const onEdgeContextMenu = useCallback(
        (event: React.MouseEvent, edge: any) => {
            event.preventDefault();
            setContextMenu({
                id: edge.id,
                top: event.clientY,
                left: event.clientX,
                type: 'edge',
            });
        },
        []
    );

    const onPaneClick = useCallback(() => {
        setContextMenu(null);
        selectNode(null);
        selectEdge(null);
    }, [selectNode, selectEdge]);

    const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: any) => {
        event.preventDefault();
        const currentLabel = edge.data?.label || '';
        const newLabel = prompt("Enter Relationship Label (e.g. 'influences'):", currentLabel);
        if (newLabel !== null) {
            updateEdgeData(edge.id, { label: newLabel });
        }
    }, [updateEdgeData]);

    const containerBg = canvasBackground === 'dark' ? '#262626' : '#f4f4f4';

    return (
        <div className="flex-1 h-full relative" style={{ backgroundColor: containerBg }} ref={wrapperRef} onClick={() => setContextMenu(null)}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(_, node) => selectNode(node.id)}
                onEdgeClick={(_, edge) => selectEdge(edge.id)}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeContextMenu={onEdgeContextMenu}
                onEdgeDoubleClick={onEdgeDoubleClick}
                onNodeDragStop={onNodeDragStop}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onInit={(instance) => {
                    instance.fitView();
                }}
                snapToGrid={true}
                snapGrid={[20, 20]}
                connectionRadius={50}
                proOptions={{ hideAttribution: true }}
                connectionMode={ConnectionMode.Loose}
                defaultEdgeOptions={{
                    type: 'smart',
                    animated: false,
                    style: { strokeWidth: 1.5, stroke: '#64748b' },
                    markerEnd: {
                        type: MarkerType.Arrow,
                        width: 12,
                        height: 12,
                        color: '#64748b'
                    }
                }}
                deleteKeyCode={['Backspace', 'Delete']}
                multiSelectionKeyCode="Shift"
            >
                <Background
                    gap={24}
                    color={canvasBackground === 'dark' ? '#393939' : '#e2e8f0'}
                    variant={BackgroundVariant.Lines}
                    size={1}
                    className={canvasBackground === 'white' ? "opacity-0" : "opacity-100"}
                />

                {nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="bg-white border border-gray-300 p-8 shadow-2xl flex flex-col items-center max-w-md text-center pointer-events-auto">
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-gray-500 mb-6 border border-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#161616] uppercase tracking-wide">Start Your Design</h3>
                            <p className="text-gray-500 text-sm mt-3 mb-8 font-mono leading-relaxed">
                                Drag <b className="text-[#161616]">Enterprise Objects</b> from the toolbox on the left to begin modeling your business ontology.
                            </p>
                            <div className="flex gap-4">
                                <button onClick={handleAddDefaultNode} className="px-6 py-3 bg-[#0f62fe] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#0353e9] transition-colors shadow-sm">
                                    Create First Object
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TOP LEFT PANEL */}
                <Panel position="top-left" className="flex gap-4 items-center p-4 pointer-events-none">
                    <div className="pointer-events-auto flex gap-4">
                        <MenuControls onOpenCompiler={() => setShowCompiler(true)} />
                        <div className="h-10 w-px bg-gray-300"></div>

                        <Tooltip content="Change Background">
                            <button
                                onClick={cycleCanvasBackground}
                                className="h-10 w-10 bg-white border border-gray-300 shadow-sm flex items-center justify-center hover:bg-gray-50"
                            >
                                {canvasBackground === 'lines' && <svg width="16" height="16" viewBox="0 0 16 16" className="text-gray-500"><path d="M0 8h16M8 0v16" stroke="currentColor" strokeWidth="1" /></svg>}
                                {canvasBackground === 'white' && <div className="w-4 h-4 border border-gray-300 bg-white"></div>}
                                {canvasBackground === 'dark' && <div className="w-4 h-4 bg-[#262626] border border-gray-500"></div>}
                            </button>
                        </Tooltip>

                        <ZoomControls />
                        <DrawingControls />
                        <HistoryControls />

                        <div className="h-10 w-px bg-gray-300"></div>

                        <div className="flex bg-white shadow-sm border border-gray-300 h-10">
                            <ToolbarButton
                                onClick={toggleViewMode}
                                active={viewMode === 'simple'}
                                tooltip="Simple Mode"
                            >
                                <UserIcon className="w-4 h-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={toggleViewMode}
                                active={viewMode === 'architect'}
                                tooltip="Architect Mode"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="0" ry="0" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                            </ToolbarButton>
                        </div>

                        <Tooltip content={showPropertiesOnCanvas ? "Hide Properties" : "Show Properties"}>
                            <button
                                onClick={toggleShowProperties}
                                className={clsx(
                                    "h-10 w-10 border shadow-sm flex items-center justify-center transition-all",
                                    showPropertiesOnCanvas ? "bg-white border-gray-300 text-[#0f62fe]" : "bg-gray-100 border-gray-300 text-gray-400"
                                )}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            </button>
                        </Tooltip>
                    </div>
                </Panel>
            </ReactFlow>

            {contextMenu && <ContextMenu data={contextMenu} onClose={() => setContextMenu(null)} />}
            {showCompiler && <CompilerModal onClose={() => setShowCompiler(false)} />}
            <Toaster position="bottom-right" toastOptions={{ style: { fontSize: '12px', background: '#161616', color: '#fff', borderRadius: '0px', fontFamily: 'monospace' } }} />
        </div>
    );
};
