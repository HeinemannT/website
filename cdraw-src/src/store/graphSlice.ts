import { StateCreator } from 'zustand';
import { 
  Connection, 
  Edge, 
  EdgeChange, 
  NodeChange, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  MarkerType
} from 'reactflow';
import { AppNode, NodeData, EdgeData, Alignment } from '../types';
import { validateNode } from '../utils/validation';
import { StoreState } from '../store';

export interface GraphSlice {
  nodes: AppNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  selectedPropertyId: string | null; // For direct navigation in Inspector
  
  // Project Metadata
  projectName: string;
  projectDescription: string;
  updateProjectMetadata: (meta: { name?: string, description?: string }) => void;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  selectProperty: (id: string | null) => void;
  
  // specialized actions
  addNode: (node: AppNode) => void;
  deleteSelection: () => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  reparentNode: (nodeId: string, newParentId: string | undefined) => void;
  updateNodeLabel: (id: string, label: string) => void;
  updateNodeMetadata: (id: string, meta: Partial<NodeData>) => void;
  updateNodeZIndex: (id: string, zIndex: number) => void;
  updateEdgeData: (id: string, data: Partial<EdgeData>) => void;
  clearCanvas: () => void;
  loadGraph: (nodes: AppNode[], edges: Edge[]) => void;
  
  // Draw.io features
  alignNodes: (alignment: Alignment) => void;
  distributeNodes: (direction: 'horizontal' | 'vertical') => void;
  toggleLock: (id: string) => void;
}

export const createGraphSlice: StateCreator<StoreState, [["zustand/immer", never]], [], GraphSlice> = (set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  selectedPropertyId: null,
  
  projectName: 'Untitled Project',
  projectDescription: '',

  updateProjectMetadata: (meta) => set((state) => {
      if (meta.name !== undefined) state.projectName = meta.name;
      if (meta.description !== undefined) state.projectDescription = meta.description;
  }),

  onNodesChange: (changes) => {
    set((state) => {
      state.nodes = applyNodeChanges(changes, state.nodes) as AppNode[];
    });
  },
  onEdgesChange: (changes) => {
    set((state) => {
      // Clean up linked properties when edges are removed via UI interactions
      changes.forEach(change => {
          if (change.type === 'remove') {
              const edge = state.edges.find(e => e.id === change.id);
              if (edge && edge.source && edge.data?.linkedPropertyId) {
                   const node = state.nodes.find(n => n.id === edge.source);
                   if (node) {
                       node.data.linkedProperties = node.data.linkedProperties.filter((p: string) => p !== edge.data.linkedPropertyId);
                   }
              }
          }
      });
      state.edges = applyEdgeChanges(changes, state.edges);
    });
  },
  onConnect: (connection) => {
    set((state) => {
      const targetNode = state.nodes.find(n => n.id === connection.target);
      const sourceNode = state.nodes.find(n => n.id === connection.source);
      let linkedPropId = '';

      if (targetNode && sourceNode) {
          const targetClass = targetNode.data.className;
          const propName = targetNode.data.label; 
          const propId = `ref${targetClass}`;
          linkedPropId = propId;

          let prop = state.globalProperties.find(p => p.id === propId);
          
          if (!prop) {
              prop = {
                  id: propId,
                  name: propName,
                  type: 'ReferenceMethodConfig',
                  config: { targetClass: targetClass, multiSelect: true }
              };
              state.globalProperties.push(prop);
          }

          if (!sourceNode.data.linkedProperties.includes(propId)) {
              sourceNode.data.linkedProperties.push(propId);
          }
      }

      const newEdgeId = `e_${connection.source}_${connection.target}_${Date.now()}`;
      
      const edge: Edge = { 
          ...connection, 
          id: newEdgeId,
          type: 'smart', 
          animated: false,
          label: '1:N',
          data: { 
            type: 'association', 
            label: '', 
            cardinality: '1:N',
            linkedPropertyId: linkedPropId 
          } as EdgeData,
          markerEnd: { type: MarkerType.Arrow, width: 20, height: 20, color: '#64748b' }
      };
      
      state.edges = addEdge(edge, state.edges);
      state.selectedEdgeId = newEdgeId;
      state.selectedNodeId = null;
      state.selectedPropertyId = null;
    });
  },
  selectNode: (id) => set((state) => { 
      state.selectedNodeId = id; 
      state.selectedEdgeId = null; 
      state.selectedPropertyId = null;
  }),
  selectEdge: (id) => set((state) => { 
      state.selectedEdgeId = id; 
      state.selectedNodeId = null; 
      state.selectedPropertyId = null;
  }),
  selectProperty: (id) => set(state => {
      state.selectedPropertyId = id;
      state.selectedEdgeId = null;
  }),

  addNode: (node) => set((state) => {
    node.data.validationIssues = validateNode(node.data);
    state.nodes.push(node);
    state.selectedNodeId = node.id; 
  }),

  // Centralized Deletion Logic (DRY)
  deleteNode: (id) => set((state) => {
      const nodeIndex = state.nodes.findIndex(n => n.id === id);
      
      if (nodeIndex !== -1) {
          // It is a Node
          // 1. Remove Connected Edges
          const edgesToRemove = state.edges.filter(e => e.source === id || e.target === id);
          
          // 2. Cleanup Linked Properties from Edge Sources
          edgesToRemove.forEach(edge => {
              if (edge.source !== id && edge.data?.linkedPropertyId) {
                  const sourceNode = state.nodes.find(n => n.id === edge.source);
                  if (sourceNode) {
                      sourceNode.data.linkedProperties = sourceNode.data.linkedProperties.filter(p => p !== edge.data?.linkedPropertyId);
                  }
              }
          });

          // 3. Update Edges State
          state.edges = state.edges.filter(e => e.source !== id && e.target !== id);

          // 4. Handle Children (Unparent them to prevent loss)
          state.nodes.forEach(n => {
              if (n.parentId === id) {
                  const parent = state.nodes[nodeIndex];
                  // Convert relative to absolute
                  n.position = {
                      x: n.position.x + parent.position.x,
                      y: n.position.y + parent.position.y
                  };
                  n.parentId = undefined;
              }
          });

          // 5. Remove Node
          state.nodes.splice(nodeIndex, 1);
          
          if (state.selectedNodeId === id) state.selectedNodeId = null;

      } else {
          // It is an Edge (or not found)
          const edgeIndex = state.edges.findIndex(e => e.id === id);
          if (edgeIndex !== -1) {
              const edge = state.edges[edgeIndex];
              // Cleanup Linked Properties
              if (edge.source && edge.data?.linkedPropertyId) {
                  const node = state.nodes.find(n => n.id === edge.source);
                  if (node) {
                      node.data.linkedProperties = node.data.linkedProperties.filter(p => p !== edge.data?.linkedPropertyId);
                  }
              }
              state.edges.splice(edgeIndex, 1);
              if (state.selectedEdgeId === id) state.selectedEdgeId = null;
          }
      }
  }),

  deleteSelection: () => {
      const state = get();
      if (state.selectedNodeId) state.deleteNode(state.selectedNodeId);
      if (state.selectedEdgeId) state.deleteNode(state.selectedEdgeId);
  },

  duplicateNode: (id) => set((state) => {
      const original = state.nodes.find(n => n.id === id);
      if (original) {
          const newNode: AppNode = {
              ...original,
              id: `${original.type}_${Date.now()}`,
              position: { x: original.position.x + 50, y: original.position.y + 50 },
              data: { ...original.data, label: `${original.data.label} (Copy)` },
              selected: true
          };
          newNode.data.validationIssues = validateNode(newNode.data);
          state.nodes.push(newNode);
          state.selectedNodeId = newNode.id;
      }
  }),

  // Logic to handle Sub-Flows
  reparentNode: (nodeId, newParentId) => set((state) => {
      const node = state.nodes.find(n => n.id === nodeId);
      if (!node || node.parentId === newParentId) return;

      if (newParentId) {
          // Moving INTO a group
          const parent = state.nodes.find(n => n.id === newParentId);
          if (parent) {
              // Convert Absolute position to Relative
              node.position = {
                  x: node.position.x - parent.position.x,
                  y: node.position.y - parent.position.y
              };
              node.parentId = newParentId;
              // Ensure z-index is higher than parent usually, but React Flow handles this via DOM order
          }
      } else {
          // Moving OUT of a group
          const oldParent = state.nodes.find(n => n.id === node.parentId);
          if (oldParent) {
              // Convert Relative position to Absolute
              node.position = {
                  x: node.position.x + oldParent.position.x,
                  y: node.position.y + oldParent.position.y
              };
          }
          node.parentId = undefined;
      }
  }),

  updateNodeLabel: (id, label) => set((state) => {
    const node = state.nodes.find(n => n.id === id);
    if (node) {
        node.data.label = label;
    }
  }),

  updateNodeMetadata: (id, meta) => set((state) => {
     const node = state.nodes.find(n => n.id === id);
     if (node) {
        Object.assign(node.data, meta);
        node.data.validationIssues = validateNode(node.data);
     }
  }),

  updateNodeZIndex: (id, zIndex) => set((state) => {
      const node = state.nodes.find(n => n.id === id);
      if (node) {
          node.zIndex = zIndex;
      }
  }),

  updateEdgeData: (id, data) => set((state) => {
      const edge = state.edges.find(e => e.id === id);
      if (edge) {
          if (!edge.data) edge.data = {};
          Object.assign(edge.data, data);
          
          if (data.cardinality) {
             edge.label = data.cardinality; 
             if (edge.data.linkedPropertyId) {
                 const prop = state.globalProperties.find(p => p.id === edge.data.linkedPropertyId);
                 if (prop && (prop.type === 'ReferenceMethodConfig' || prop.type === 'ReverseReferenceMethodConfig')) {
                     prop.config.multiSelect = (data.cardinality !== '1:1');
                 }
             }
          }
          
          if (data.isReverse !== undefined && edge.data.linkedPropertyId) {
              const prop = state.globalProperties.find(p => p.id === edge.data.linkedPropertyId);
              if (prop) {
                  prop.type = data.isReverse ? 'ReverseReferenceMethodConfig' : 'ReferenceMethodConfig';
                  edge.style = { 
                      ...edge.style, 
                      strokeDasharray: data.isReverse ? '5, 5' : undefined 
                  };
              }
          }
      }
  }),

  clearCanvas: () => set(state => {
      state.nodes = [];
      state.edges = [];
      state.selectedNodeId = null;
      state.selectedEdgeId = null;
      state.selectedPropertyId = null;
  }),

  loadGraph: (nodes, edges) => set(state => {
      state.nodes = nodes;
      state.edges = edges;
      state.selectedNodeId = null;
  }),

  alignNodes: (alignment) => set((state) => {
      const selectedId = state.selectedNodeId;
      if (!selectedId) return;
      
      const primary = state.nodes.find(n => n.id === selectedId);
      if (!primary) return;

      state.nodes.forEach(node => {
          if (node.id === selectedId || !node.selected || node.data.locked) return;
          
          // Note: Alignment needs to consider Parent/Child context in a real app, 
          // but for now we align strictly by position values.
          switch (alignment) {
              case 'left': node.position.x = primary.position.x; break;
              case 'center': node.position.x = primary.position.x + (primary.width || 0)/2 - (node.width || 0)/2; break; 
              case 'right': node.position.x = primary.position.x; break; 
              case 'top': node.position.y = primary.position.y; break;
              case 'middle': node.position.y = primary.position.y; break;
              case 'bottom': node.position.y = primary.position.y; break;
          }
      });
  }),
  
  distributeNodes: (direction) => set((state) => {
      const selectedNodes = state.nodes.filter(n => n.selected);
      if (selectedNodes.length < 3) return; 

      selectedNodes.sort((a, b) => direction === 'horizontal' ? a.position.x - b.position.x : a.position.y - b.position.y);

      const first = selectedNodes[0];
      const last = selectedNodes[selectedNodes.length - 1];
      
      const totalSpace = direction === 'horizontal' 
          ? last.position.x - first.position.x 
          : last.position.y - first.position.y;
      
      const step = totalSpace / (selectedNodes.length - 1);

      selectedNodes.forEach((node, i) => {
          if (node.data.locked) return;
          if (direction === 'horizontal') {
              node.position.x = first.position.x + (step * i);
          } else {
              node.position.y = first.position.y + (step * i);
          }
      });
  }),

  toggleLock: (id) => set((state) => {
      const node = state.nodes.find(n => n.id === id);
      if (node) {
          node.data.locked = !node.data.locked;
          node.draggable = !node.data.locked;
      }
  })
});