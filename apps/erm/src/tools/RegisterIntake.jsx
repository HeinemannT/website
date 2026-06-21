import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { SEED_REGISTER } from './riskmath.js';

const CATEGORIES = ['Strategic', 'Financial', 'Operational', 'Compliance & conduct', 'Technology & cyber', 'Reputational'];

// Richer register shared with the 2d evaluator (which reads name, p, i).
const enrich = (r) => ({ cause: '', event: r.name, consequence: '', owner: '', category: 'Operational', ...r });
const seed = () => SEED_REGISTER.map(enrich);

export function RegisterIntake({ lessonId = '2c', artifactId = 'A4' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const risks = (getData('risks', seed())).map(enrich);

  const set = (idx, field, val) => setData('risks', list => {
    const b = (list || seed()).map(enrich);
    b[idx][field] = (field === 'p' || field === 'i') ? (parseFloat(val) || 0) : val;
    return b;
  });
  const add = () => setData('risks', list => [...(list || seed()).map(enrich), { name: 'New risk', cause: '', event: '', consequence: '', owner: '', category: 'Operational', p: 20, i: 200000 }]);
  const remove = (idx) => setData('risks', list => (list || seed()).filter((_, i) => i !== idx));

  const wellFormed = risks.filter(r => r.cause && r.event && r.consequence && r.owner).length;

  const field = (idx, key, ph, wide) => (
    <input className="name" value={risks[idx][key] || ''} onChange={e => set(idx, key, e.target.value)} placeholder={ph}
      style={{ width: '100%', marginBottom: '6px', ...(wide ? {} : {}) }} />
  );

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Risk register — structured intake</span><span className="tag">Builds Artifact A4</span></div>
      <div className="body">
        {risks.map((r, idx) => (
          <div key={idx} style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '14px', marginBottom: '12px', background: '#fff' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
              <input className="name" value={r.name} onChange={e => set(idx, 'name', e.target.value)} placeholder="short name" style={{ fontWeight: 600, flex: 1 }} />
              <select value={r.category} onChange={e => set(idx, 'category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <button className="btn" style={{ padding: '4px 9px' }} onClick={() => remove(idx)}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div><div className="hint" style={{ margin: '0 0 3px' }}>Cause (what triggers it)</div>{field(idx, 'cause', 'e.g. a phishing email')}</div>
              <div><div className="hint" style={{ margin: '0 0 3px' }}>Event (what happens)</div>{field(idx, 'event', 'e.g. ransomware encrypts systems')}</div>
              <div><div className="hint" style={{ margin: '0 0 3px' }}>Consequence (effect on objective)</div>{field(idx, 'consequence', 'e.g. fulfilment stops for days')}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginTop: '4px' }}>
              <div><div className="hint" style={{ margin: '0 0 3px' }}>Owner</div>{field(idx, 'owner', 'who owns this risk')}</div>
              <div><div className="hint" style={{ margin: '0 0 3px' }}>Probability %</div><input value={r.p} onChange={e => set(idx, 'p', e.target.value)} inputMode="decimal" style={{ width: '100%' }} /></div>
              <div><div className="hint" style={{ margin: '0 0 3px' }}>Impact €</div><input value={r.i} onChange={e => set(idx, 'i', e.target.value)} inputMode="numeric" style={{ width: '100%' }} /></div>
            </div>
          </div>
        ))}
        <div className="readout">
          <p style={{ margin: 0 }}>{wellFormed} of {risks.length} entries are fully formed (cause, event, consequence, and an owner). The rest are still topics. This register flows straight into the next lesson, where you’ll evaluate it.</p>
        </div>
        <SaveBar onSave={() => save({ count: risks.length, wellFormed })} saved={saved} justSaved={justSaved}>
          <button className="btn" onClick={add}>Add a risk</button>
        </SaveBar>
      </div>
    </div>
  );
}
