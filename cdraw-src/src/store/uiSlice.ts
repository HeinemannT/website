import { StateCreator } from 'zustand';
import { ViewMode, CanvasBackground } from '../types';
import { StoreState } from '../store';

export interface UISlice {
  viewMode: ViewMode;
  canvasBackground: CanvasBackground;
  showPropertiesOnCanvas: boolean;
  codeEditorPropertyId: string | null;
  toggleViewMode: () => void;
  toggleShowProperties: () => void;
  cycleCanvasBackground: () => void;
  openCodeEditor: (id: string) => void;
  closeCodeEditor: () => void;
}

export const createUISlice: StateCreator<StoreState, [["zustand/immer", never]], [], UISlice> = (set) => ({
  viewMode: 'architect',
  canvasBackground: 'lines',
  showPropertiesOnCanvas: true,
  codeEditorPropertyId: null,
  toggleViewMode: () => set((state) => {
    state.viewMode = state.viewMode === 'simple' ? 'architect' : 'simple';
  }),
  toggleShowProperties: () => set(state => {
      state.showPropertiesOnCanvas = !state.showPropertiesOnCanvas;
  }),
  cycleCanvasBackground: () => set(state => {
      if (state.canvasBackground === 'lines') state.canvasBackground = 'white';
      else if (state.canvasBackground === 'white') state.canvasBackground = 'dark';
      else state.canvasBackground = 'lines';
  }),
  openCodeEditor: (id) => set(state => {
      state.codeEditorPropertyId = id;
  }),
  closeCodeEditor: () => set(state => {
      state.codeEditorPropertyId = null;
  })
});