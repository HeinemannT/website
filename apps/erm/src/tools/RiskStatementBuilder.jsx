import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';

const SEED = [
  { objective: 'Grow operating margin', source: 'the price of a key ingredient', effect: 'margin falls sharply if it spikes — or improves if it drops', direction: 'both' },
  { objective: 'Keep service running for customers', source: 'a cyber intrusion', effect: 'order systems go down for several days', direction: 'down' },
];

export function RiskStatementBuilder({ lessonId = '1.1', artifactId = 'A1-statements' }) {
  const { org, getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const rows = getData('riskStatements', SEED);
  const objHints = (org?.objectives || '').split(/[\n,]+/).map(s => s.trim()).filter(Boolean);

  const update = (idx, field, val) => setData('riskStatements', list => {
    const b = (list || SEED).map(r => ({ ...r })); b[idx][field] = val; return b;
  });
  const add = () => setData('riskStatements', list => [...(list || SEED).map(r => ({ ...r })), { objective: '', source: '', effect: '', direction: 'down' }]);
  const remove = (idx) => setData('riskStatements', list => (list || SEED).filter((_, i) => i !== idx));

  const sentence = (r) => {
    if (!(r.objective && r.source && r.effect)) return null;
    const lead = r.direction === 'up' ? 'with the upside that' : r.direction === 'both' ? 'with effects either way:' : 'with the downside that';
    return `Uncertainty about ${r.source} could affect “${r.objective}”, ${lead} ${r.effect}.`;
  };

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Risk-statement builder</span><span className="tag">Builds Artifact A1</span></div>
      <div className="body">
        <datalist id="objhints">{objHints.map((o, i) => <option key={i} value={o} />)}</datalist>
        <table>
          <thead><tr>
            <th style={{ width: '26%' }}>Objective at stake</th>
            <th style={{ width: '24%' }}>Source of uncertainty</th>
            <th>Possible effect</th>
            <th style={{ width: '90px' }}>Direction</th>
            <th></th>
          </tr></thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td><input className="name" list="objhints" value={r.objective} onChange={e => update(idx, 'objective', e.target.value)} placeholder="an objective" /></td>
                <td><input className="name" value={r.source} onChange={e => update(idx, 'source', e.target.value)} placeholder="what's uncertain" /></td>
                <td><input className="name" value={r.effect} onChange={e => update(idx, 'effect', e.target.value)} placeholder="how it could play out" /></td>
                <td>
                  <select value={r.direction} onChange={e => update(idx, 'direction', e.target.value)} style={{ width: '100%' }}>
                    <option value="down">Downside</option>
                    <option value="up">Upside</option>
                    <option value="both">Both</option>
                  </select>
                </td>
                <td><button className="btn" style={{ padding: '4px 9px' }} onClick={() => remove(idx)}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="readout" style={{ marginTop: '18px' }}>
          <div className="head">Your risk statements</div>
          {rows.map((r, i) => {
            const s = sentence(r);
            return s
              ? <p key={i} style={{ margin: '0 0 8px' }}>{s}</p>
              : <p key={i} style={{ margin: '0 0 8px', color: 'var(--g5)' }}>Row {i + 1} is still a topic, not a risk — name the objective, the uncertainty, and the effect.</p>;
          })}
        </div>

        <SaveBar onSave={() => save({ count: rows.length })} saved={saved} justSaved={justSaved}>
          <button className="btn" onClick={add}>Add a statement</button>
        </SaveBar>
      </div>
    </div>
  );
}
