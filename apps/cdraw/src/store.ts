import { create } from 'zustand';
import { temporal } from 'zundo';
import { immer } from 'zustand/middleware/immer';

import { GraphSlice, createGraphSlice } from './store/graphSlice';
import { OntologySlice, createOntologySlice } from './store/ontologySlice';
import { UISlice, createUISlice } from './store/uiSlice';
import { ClipboardSlice, createClipboardSlice } from './store/clipboardSlice';

// Combine all slices + Temporal (Undo/Redo)
export type StoreState = GraphSlice & OntologySlice & UISlice & ClipboardSlice;

export const useStore = create<StoreState>()(
  temporal(
    immer((...a) => ({
      ...createGraphSlice(...a),
      ...createOntologySlice(...a),
      ...createUISlice(...a),
      ...createClipboardSlice(...a),
    })),
    {
      limit: 50, 
    }
  )
);