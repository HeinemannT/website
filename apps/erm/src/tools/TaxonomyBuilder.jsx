import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { SEED_REGISTER } from './riskmath.js';

const DEFAULT_FAMILIES = ['Strategic', 'Financial', 'Operational', 'Compliance & conduct', 'Technology & cyber', 'Climate & ESG', 'Model risk', 'Reputational'];

export function TaxonomyBuilder({ lessonId = '3.0', artifactId = 'A9' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const families = getData('taxonomy', DEFAULT_FAMILIES);
  const risks = getData('risks', SEED_REGISTER);

  const count = (fam) => risks.filter(r => (r.category || 'Operational') === fam).length;
  const setFam = (idx, val) => setData('taxonomy', list => { const b = [...(list || DEFAULT_FAMILIES)]; b[idx] = val; return b; });
  const add = () => setData('taxonomy', list => [...(list || DEFAULT_FAMILIES), 'New family']);
  const remove = (idx) => setData('taxonomy', list => (list || DEFAULT_FAMILIES).filter((_, i) => i !== idx));

  const max = Math.max(1, ...families.map(count));
  const empty = families.filter(f => count(f) === 0);

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Enterprise risk taxonomy</span><span className="tag">Builds Artifact A9</span></div>
      <div className="body">
        <div className="readout"><div className="head">Your families, and how your register spreads across them</div></div>
        {families.map((f, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '7px 0' }}>
            <input className="name" value={f} onChange={e => setFam(idx, e.target.value)} style={{ width: '220px' }} />
            <div style={{ flex: 1, background: '#f0ece2', borderRadius: '6px', height: '20px', position: 'relative' }}>
              <div style={{ width: `${(count(f) / max) * 100}%`, background: count(f) ? 'var(--teal)' : '#e0d8c8', height: '100%', borderRadius: '6px' }} />
            </div>
            <span style={{ width: '70px', fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--soft)' }}>{count(f)} risk{count(f) !== 1 ? 's' : ''}</span>
            <button className="btn" style={{ padding: '4px 9px' }} onClick={() => remove(idx)}>✕</button>
          </div>
        ))}
        <div className="readout" style={{ marginTop: '12px' }}>
          {empty.length
            ? <p style={{ margin: 0, color: 'var(--g5)' }}>{empty.join(', ')} {empty.length > 1 ? 'have' : 'has'} no risks recorded. Sometimes that’s genuine — often it’s a blind spot. A taxonomy earns its keep by making the empty boxes visible.</p>
            : <p style={{ margin: 0, color: 'var(--g1)' }}>Every family has at least one risk. A shared taxonomy lets you compare and aggregate across the whole organization instead of arguing about words.</p>}
        </div>
        <SaveBar onSave={() => save({ families: families.length, empty: empty.length })} saved={saved} justSaved={justSaved}>
          <button className="btn" onClick={add}>Add a family</button>
        </SaveBar>
      </div>
    </div>
  );
}
