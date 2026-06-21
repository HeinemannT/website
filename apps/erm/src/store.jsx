import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/* The whole course persists here: the learner's case organization, the data
   behind every tool (e.g. the shared risk register), the saved artifacts, and
   per-lesson progress. One localStorage key; JSON export/import for portability. */

const KEY = 'erm.course.v1';

const EMPTY = { org: null, data: {}, artifacts: {}, progress: {} };

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw);
    return { ...EMPTY, ...parsed };
  } catch {
    return { ...EMPTY };
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota */ }
  }, [state]);

  const setOrg = useCallback((org) => setState(s => ({ ...s, org })), []);

  const setData = useCallback((key, value) => {
    setState(s => ({ ...s, data: { ...s.data, [key]: typeof value === 'function' ? value(s.data[key]) : value } }));
  }, []);

  const saveArtifact = useCallback((id, payload) => {
    setState(s => ({
      ...s,
      artifacts: { ...s.artifacts, [id]: { savedAt: new Date().toISOString(), ...payload } },
    }));
  }, []);

  const markComplete = useCallback((lessonId) => {
    setState(s => (s.progress[lessonId] === 'complete'
      ? s
      : { ...s, progress: { ...s.progress, [lessonId]: 'complete' } }));
  }, []);

  const reset = useCallback(() => setState({ ...EMPTY }), []);

  const importJSON = useCallback((obj) => {
    if (obj && typeof obj === 'object') setState({ ...EMPTY, ...obj });
  }, []);

  const value = {
    state,
    org: state.org,
    setOrg,
    data: state.data,
    getData: (k, fallback) => (k in state.data ? state.data[k] : fallback),
    setData,
    artifacts: state.artifacts,
    saveArtifact,
    hasArtifact: (id) => !!state.artifacts[id],
    progress: state.progress,
    isComplete: (id) => state.progress[id] === 'complete',
    markComplete,
    reset,
    importJSON,
    exportJSON: () => JSON.stringify(state, null, 2),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
