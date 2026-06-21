import React from 'react';

export function SaveBar({ onSave, saved, justSaved, disabled, label = 'Save & complete lesson', children }) {
  return (
    <div className="toolfoot ui">
      <button className="btn primary" onClick={onSave} disabled={disabled}>{label}</button>
      {children}
      {(justSaved || saved) && <span className="saved">{justSaved ? 'Saved to your operating model' : 'Saved'}</span>}
    </div>
  );
}
