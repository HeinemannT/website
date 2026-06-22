import React from 'react';
import { useStore } from '../store.jsx';

/* Lightweight completion for prose/primer lessons that don't produce an artifact. */
export function MarkComplete({ lessonId, label = 'Mark this lesson complete' }) {
  const { markComplete, isComplete } = useStore();
  const done = isComplete(lessonId);
  return (
    <div className="toolfoot ui" style={{ marginTop: '28px' }}>
      <button className="btn primary" onClick={() => markComplete(lessonId)} disabled={done}>
        {done ? '✓ Completed' : label}
      </button>
    </div>
  );
}
