import { StateCreator } from 'zustand';
import { AppNode } from '../types';
import { validateNode } from '../utils/validation';
import { StoreState } from '../store';

export interface ClipboardSlice {
    clipboardNodes: AppNode[];
    copySelection: () => void;
    pasteSelection: () => void;
}

export const createClipboardSlice: StateCreator<StoreState, [["zustand/immer", never]], [], ClipboardSlice> = (set) => ({
    clipboardNodes: [],
    copySelection: () => set(state => {
        if (state.selectedNodeId) {
            const node = state.nodes.find(n => n.id === state.selectedNodeId);
            if (node) state.clipboardNodes = [node]; 
        }
    }),
    pasteSelection: () => set(state => {
        if (state.clipboardNodes.length > 0) {
            const source = state.clipboardNodes[0];
            const newNode: AppNode = {
                ...source,
                id: `${source.type}_copy_${Date.now()}`,
                position: { x: source.position.x + 30, y: source.position.y + 30 },
                data: { ...source.data, label: `${source.data.label} Copy` }
            };
            newNode.data.validationIssues = validateNode(newNode.data);
            state.nodes.push(newNode);
            state.selectedNodeId = newNode.id;
        }
    })
});