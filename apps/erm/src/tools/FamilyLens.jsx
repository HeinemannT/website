import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { SEED_REGISTER, fmt } from './riskmath.js';

/* Shared lens for the risk-family lessons (3.2–3.7). Filters the register to this
   family, lets the learner add family-specific risks, and captures how this family
   is owned and sized. Grows the same register, so the operating model stays whole. */
export function FamilyLens({ lessonId, artifactId, family, sizing, ownerHint }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const risks = getData('risks', SEED_REGISTER);
  const notes = getData('familyNotes', {});
  const mine = risks.map((r, idx) => ({ ...r, idx })).filter(r => (r.category || 'Operational') === family);

  const addRisk = () => setData('risks', list => [...(list || SEED_REGISTER), { name: `New ${family.toLowerCase()} risk`, cause: '', event: '', consequence: '', owner: ownerHint || '', category: family, p: 20, i: 200000 }]);
  const setRisk = (idx, field, val) => setData('risks', list => { const b = (list || SEED_REGISTER).map(r => ({ ...r })); b[idx][field] = (field === 'p' || field === 'i') ? (parseFloat(val) || 0) : val; return b; });
  const setNote = (val) => setData('familyNotes', o => ({ ...(o || {}), [family]: val }));

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">{family} — add to your register</span><span className="tag">Builds Artifact A10</span></div>
      <div className="body">
        <div className="readout"><div className="head">How this family is sized</div><p style={{ margin: 0 }}>{sizing}</p></div>

        <table style={{ marginTop: '14px' }}>
          <thead><tr><th>{family} risks in your register</th><th>Owner</th><th className="num">Prob %</th><th className="num">Impact €</th><th className="num">Exp. loss</th></tr></thead>
          <tbody>
            {mine.length ? mine.map(r => (
              <tr key={r.idx}>
                <td><input className="name" value={r.name} onChange={e => setRisk(r.idx, 'name', e.target.value)} /></td>
                <td><input className="name" value={r.owner || ''} onChange={e => setRisk(r.idx, 'owner', e.target.value)} placeholder={ownerHint} /></td>
                <td className="num"><input value={r.p} onChange={e => setRisk(r.idx, 'p', e.target.value)} style={{ width: '56px' }} /></td>
                <td className="num"><input value={r.i} onChange={e => setRisk(r.idx, 'i', e.target.value)} style={{ width: '90px' }} /></td>
                <td className="num">{fmt((r.p / 100) * r.i)}</td>
              </tr>
            )) : <tr><td colSpan="5" className="hint" style={{ padding: '10px' }}>No {family.toLowerCase()} risks yet — a likely blind spot. Add at least one.</td></tr>}
          </tbody>
        </table>

        <label className="ui" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--soft)', margin: '16px 0 6px' }}>How does your organization own and watch this family?</label>
        <textarea value={notes[family] || ''} onChange={e => setNote(e.target.value)} style={{ width: '100%', minHeight: '64px', fontFamily: 'var(--sans)', fontSize: '14px', padding: '10px', border: '1px solid var(--line)', borderRadius: '9px' }} placeholder={`e.g. owned by ${ownerHint || 'the relevant function'}; watched via…`} />

        <SaveBar onSave={() => save({ family, count: mine.length })} saved={saved} justSaved={justSaved}>
          <button className="btn" onClick={addRisk}>Add a {family.toLowerCase()} risk</button>
        </SaveBar>
      </div>
    </div>
  );
}
