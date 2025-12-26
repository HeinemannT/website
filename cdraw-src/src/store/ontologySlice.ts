import { StateCreator } from 'zustand';
import { addEdge, Edge, MarkerType } from 'reactflow';
import { GlobalProperty, ListPropertySet, MethodConfigType, MethodConfigDetails, EdgeData } from '../types';
import { StoreState } from '../store';

export interface OntologySlice {
    globalProperties: GlobalProperty[];
    listPropertySets: ListPropertySet[];

    // Actions
    addGlobalProperty: (prop: GlobalProperty) => void;
    updateGlobalProperty: (id: string, updates: Partial<GlobalProperty>) => void;
    renameGlobalProperty: (oldId: string, newId: string) => void;
    deleteGlobalProperty: (id: string) => void;

    // List Actions
    addListPropertySet: (list: ListPropertySet) => void;
    updateListPropertySet: (id: string, list: Partial<ListPropertySet>) => void;
    deleteListPropertySet: (id: string) => void;

    // Complex Logic
    createAndLinkProperty: (nodeId: string, template: { type: MethodConfigType, label: string, listId?: string, config?: Partial<MethodConfigDetails> }) => void;
    linkExistingProperty: (nodeId: string, propertyId: string) => void;
    unlinkProperty: (nodeId: string, propertyId: string) => void;

    // Computed helpers (not state, but accessible via get())
    getAvailableClasses: () => string[];
}

const initialLists: ListPropertySet[] = [
    {
        id: 'lStatus',
        name: 'Status',
        items: [
            { id: 'lStatus_draft', name: 'Draft' },
            { id: 'lStatus_progress', name: 'In Progress' },
            { id: 'lStatus_closed', name: 'Closed' }
        ]
    },
    {
        id: 'lPriority',
        name: 'Priority',
        items: [
            { id: 'lPriority_high', name: 'High' },
            { id: 'lPriority_med', name: 'Medium' },
            { id: 'lPriority_low', name: 'Low' }
        ]
    },
    {
        id: 'lApproval',
        name: 'Approval Status',
        items: [
            { id: 'lps_approved', name: 'Approved' },
            { id: 'lps_rejected', name: 'Rejected' },
            { id: 'lps_pending', name: 'Pending Review' }
        ]
    }
];

const initialProperties: GlobalProperty[] = [
    {
        id: 'pImpact',
        name: 'Impact',
        type: 'HistoricalNumberMethodConfig',
        config: { decimalPlaces: 0, formatPostfix: ' USD', colorCode: '#ef4444' }
    },
    {
        id: 'pProbability',
        name: 'Probability',
        type: 'HistoricalNumberMethodConfig',
        config: { decimalPlaces: 2, formatPostfix: '%', colorCode: '#3b82f6' }
    },
    {
        id: 'refOwner',
        name: 'Owner',
        type: 'ReferenceMethodConfig',
        config: { targetClass: 'user', multiSelect: false }
    }
];

export const createOntologySlice: StateCreator<StoreState, [["zustand/immer", never]], [], OntologySlice> = (set, get) => ({
    globalProperties: initialProperties,
    listPropertySets: initialLists,

    addGlobalProperty: (prop) => set((state) => {
        if (!state.globalProperties.find(p => p.id === prop.id)) {
            state.globalProperties.push(prop);
        }
    }),

    updateGlobalProperty: (id, updates) => set((state) => {
        const prop = state.globalProperties.find(p => p.id === id);
        if (!prop) return;

        // Check if Target Class changed
        const oldTarget = prop.config.targetClass;

        // SYNC: Prop MultiSelect -> Edge Cardinality
        if (updates.config && typeof updates.config.multiSelect !== 'undefined') {
            const edges = state.edges.filter(e => e.data?.linkedPropertyId === id);
            edges.forEach(e => {
                const newCard = updates.config!.multiSelect ? '1:N' : '1:1';
                if (e.data) {
                    e.data.cardinality = newCard;
                }
                e.label = newCard;
            });
        }

        Object.assign(prop, updates);
        const newTarget = prop.config.targetClass;

        // AUTO-RELINK LOGIC
        if ((prop.type === 'ReferenceMethodConfig' || prop.type === 'ReverseReferenceMethodConfig') && oldTarget !== newTarget && newTarget) {

            // 1. Find all nodes that use this property
            const sourceNodes = state.nodes.filter(n => n.data.linkedProperties.includes(id));

            // 2. Remove all existing edges for this property
            state.edges = state.edges.filter(e => e.data?.linkedPropertyId !== id);

            // 3. Find new target nodes
            const targetNodes = state.nodes.filter(n => n.data.className === newTarget);

            // 4. Create new edges
            const isReverse = prop.type === 'ReverseReferenceMethodConfig';

            sourceNodes.forEach(sourceNode => {
                targetNodes.forEach(targetNode => {
                    const newEdge: Edge = {
                        id: `e_${sourceNode.id}_${targetNode.id}_${Date.now()}`,
                        source: sourceNode.id,
                        target: targetNode.id,
                        type: 'smart',
                        label: prop.config.multiSelect || isReverse ? '1:N' : '1:1',
                        data: {
                            type: 'association',
                            label: '',
                            cardinality: prop.config.multiSelect || isReverse ? '1:N' : '1:1',
                            linkedPropertyId: id,
                            isReverse: isReverse
                        } as EdgeData,
                        markerEnd: { type: MarkerType.Arrow, width: 20, height: 20, color: '#64748b' },
                        style: {
                            strokeWidth: 1.5,
                            stroke: '#64748b',
                            strokeDasharray: isReverse ? '5, 5' : undefined
                        }
                    };
                    state.edges = addEdge(newEdge, state.edges);
                });
            });
        }
    }),

    renameGlobalProperty: (oldId, newId) => set((state) => {
        if (state.globalProperties.find(p => p.id === newId)) return;
        const prop = state.globalProperties.find(p => p.id === oldId);
        if (prop) {
            prop.id = newId;
        }
        state.nodes.forEach(node => {
            const index = node.data.linkedProperties.indexOf(oldId);
            if (index !== -1) {
                node.data.linkedProperties[index] = newId;
            }
        });
        if (state.selectedPropertyId === oldId) {
            state.selectedPropertyId = newId;
        }
        state.edges.forEach(e => {
            if (e.data?.linkedPropertyId === oldId) {
                e.data.linkedPropertyId = newId;
            }
        });
    }),

    deleteGlobalProperty: (id) => set((state) => {
        state.globalProperties = state.globalProperties.filter(p => p.id !== id);
        // Remove from all nodes and edges
        state.nodes.forEach(node => {
            node.data.linkedProperties = node.data.linkedProperties.filter(pId => pId !== id);
        });
        state.edges = state.edges.filter(e => e.data?.linkedPropertyId !== id);
    }),

    addListPropertySet: (list) => set(state => {
        if (!state.listPropertySets.find(l => l.id === list.id)) {
            state.listPropertySets.push(list);
        }
    }),

    updateListPropertySet: (id, updates) => set(state => {
        const list = state.listPropertySets.find(l => l.id === id);
        if (list) Object.assign(list, updates);
    }),

    deleteListPropertySet: (id) => set(state => {
        state.listPropertySets = state.listPropertySets.filter(l => l.id !== id);

        // Find properties using this list
        const propsToDelete = state.globalProperties.filter(p => p.config.listId === id).map(p => p.id);

        // Delete those properties using the same logic as deleteGlobalProperty
        // (We can't call internal actions easily in immer, so we duplicate the removal logic)
        state.globalProperties = state.globalProperties.filter(p => !propsToDelete.includes(p.id));

        state.nodes.forEach(node => {
            node.data.linkedProperties = node.data.linkedProperties.filter(pId => !propsToDelete.includes(pId));
        });
        state.edges = state.edges.filter(e => !e.data?.linkedPropertyId || !propsToDelete.includes(e.data.linkedPropertyId));
    }),

    createAndLinkProperty: (nodeId, template) => set((state) => {
        const cleanLabel = template.label.replace(/[^a-zA-Z0-9]/g, '');
        const propId = `p${cleanLabel}_${Math.floor(Math.random() * 1000)}`;

        const newProp: GlobalProperty = {
            id: propId,
            name: template.label,
            type: template.type,
            config: template.config || {}
        };

        if (template.type === 'HistoricalNumberMethodConfig') {
            newProp.config.decimalPlaces = 2;
        }

        if (template.listId) {
            newProp.config.listId = template.listId;
        }

        state.globalProperties.push(newProp);

        const node = state.nodes.find(n => n.id === nodeId);
        if (node) {
            node.data.linkedProperties.push(propId);
        }
    }),

    linkExistingProperty: (nodeId, propertyId) => set((state) => {
        const node = state.nodes.find(n => n.id === nodeId);
        if (!node) return;

        // 1. Add property to node data if not already present
        if (!node.data.linkedProperties.includes(propertyId)) {
            node.data.linkedProperties.push(propertyId);
        }

        // 2. Check property type
        const prop = state.globalProperties.find(p => p.id === propertyId);

        if (prop && prop.config.targetClass && (prop.type === 'ReferenceMethodConfig' || prop.type === 'ReverseReferenceMethodConfig')) {
            const targetClass = prop.config.targetClass;
            const isReverse = prop.type === 'ReverseReferenceMethodConfig';

            // 3. Find target nodes on canvas
            const targetNodes = state.nodes.filter(n => n.data.className === targetClass);

            // 4. Create Smart Edges
            targetNodes.forEach(targetNode => {

                const edgeExists = state.edges.some(e =>
                    e.source === nodeId &&
                    e.target === targetNode.id &&
                    e.data?.linkedPropertyId === propertyId
                );

                if (!edgeExists) {
                    const newEdge: Edge = {
                        id: `e_${nodeId}_${targetNode.id}_${Date.now()}`,
                        source: nodeId,
                        target: targetNode.id,
                        type: 'smart',
                        label: prop.config.multiSelect || isReverse ? '1:N' : '1:1',
                        data: {
                            type: 'association',
                            label: '',
                            cardinality: prop.config.multiSelect || isReverse ? '1:N' : '1:1',
                            linkedPropertyId: propertyId,
                            isReverse: isReverse
                        } as EdgeData,
                        markerEnd: { type: MarkerType.Arrow, width: 20, height: 20, color: '#64748b' },
                        style: {
                            strokeWidth: 1.5,
                            stroke: '#64748b',
                            strokeDasharray: isReverse ? '5, 5' : undefined
                        }
                    };
                    state.edges = addEdge(newEdge, state.edges);
                }
            });
        }
    }),

    unlinkProperty: (nodeId, propertyId) => set((state) => {
        const node = state.nodes.find(n => n.id === nodeId);
        if (node) {
            node.data.linkedProperties = node.data.linkedProperties.filter((id: string) => id !== propertyId);
            state.edges = state.edges.filter(e => !(e.source === nodeId && e.data?.linkedPropertyId === propertyId));
        }
    }),

    getAvailableClasses: () => {
        return [];
    }
});