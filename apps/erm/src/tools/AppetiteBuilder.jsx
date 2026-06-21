import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';

const CATS = ['Strategic', 'Financial', 'Operational', 'Compliance & conduct', 'Reputational'];
const POSTURES = ['averse', 'cautious', 'open', 'hungry'];
const seed = () => Object.fromEntries(CATS.map(c => [c, { posture: 'cautious', tolerance: '', decision: '' }]));

export function AppetiteBuilder({ lessonId = '2a', artifactId = 'A2' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const a = getData('appetite', seed());
  const set = (cat, field, val) => setData('appetite', o => ({ ...(o || seed()), [cat]: { ...(o?.[cat] || {}), [field]: val } }));

  const wallpaper = CATS.filter(c => !(a[c]?.decision || '').trim()).length;

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Risk appetite statement builder</span><span className="tag">Builds Artifact A2</span></div>
      <div className="body">
        <table>
          <thead><tr>
            <th style={{ width: '20%' }}>Category</th>
            <th style={{ width: '110px' }}>Posture</th>
            <th>Tolerance (a number, where measurable)</th>
            <th>A real decision this would change</th>
          </tr></thead>
          <tbody>
            {CATS.map(c => {
              const row = a[c] || {};
              const bare = !(row.decision || '').trim();
              return (
                <tr key={c} className={bare ? 'flag' : ''}>
                  <td>{c}</td>
                  <td>
                    <select value={row.posture || 'cautious'} onChange={e => set(c, 'posture', e.target.value)} style={{ width: '100%' }}>
                      {POSTURES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                  <td><input className="name" value={row.tolerance || ''} onChange={e => set(c, 'tolerance', e.target.value)} placeholder="e.g. at most €2m loss/yr; <1-in-20 chance of a breach" /></td>
                  <td><input className="name" value={row.decision || ''} onChange={e => set(c, 'decision', e.target.value)} placeholder="e.g. we'd decline any deal that…" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="readout" style={{ marginTop: '16px' }}>
          {wallpaper === 0
            ? <p style={{ margin: 0, color: 'var(--g1)' }}>Every line names a decision it would change — this is a working appetite statement, not wallpaper.</p>
            : <p style={{ margin: 0, color: 'var(--g5)' }}>{wallpaper} categor{wallpaper > 1 ? 'ies' : 'y'} still fail the test: if a stated appetite wouldn’t change any real decision, it’s decoration. Name a decision for each.</p>}
        </div>
        <SaveBar onSave={() => save({ wallpaper })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
