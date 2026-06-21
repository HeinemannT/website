import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { fmt } from './riskmath.js';

const FSEED = [
  { name: 'Revenue drop', shock: 10, sens: 900000 },
  { name: 'Cost inflation', shock: 5, sens: 700000 },
  { name: 'Credit losses', shock: 8, sens: 500000 },
  { name: 'Market / FX shock', shock: 12, sens: 300000 },
];

export function StressSandbox({ lessonId = '4.5', artifactId = 'A11-stress' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const fin = getData('financials', null);
  const base = getData('stressBase', fin?.assets && fin?.liabilities ? Math.max(fin.assets - fin.liabilities, 5000000) : 35000000);
  const factors = getData('stressFactors', FSEED);

  const setF = (idx, field, val) => setData('stressFactors', list => { const b = (list || FSEED).map(f => ({ ...f })); b[idx][field] = parseFloat(val) || 0; return b; });
  const totalHit = factors.reduce((s, f) => s + f.shock * f.sens, 0);
  const stressed = base - totalHit;
  const breakMult = totalHit > 0 ? base / totalHit : Infinity;
  const survives = stressed > 0;

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Stress-test sandbox &amp; reverse-stress solver</span><span className="tag">Builds Artifact A11</span></div>
      <div className="body">
        <div className="ctrls ui" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
          <label>Capital buffer (€): <input value={base} onChange={e => setData('stressBase', parseFloat(e.target.value) || 0)} style={{ width: '130px' }} /></label>
        </div>
        <table>
          <thead><tr><th>Stress factor</th><th>Shock (%)</th><th className="num">€ per 1% shock</th><th className="num">Hit</th></tr></thead>
          <tbody>
            {factors.map((f, idx) => (
              <tr key={idx}>
                <td>{f.name}</td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="range" min="0" max="40" value={f.shock} onChange={e => setF(idx, 'shock', e.target.value)} /><span style={{ width: '36px' }}>{f.shock}%</span></div></td>
                <td className="num"><input value={f.sens} onChange={e => setF(idx, 'sens', e.target.value)} style={{ width: '90px' }} /></td>
                <td className="num">{fmt(f.shock * f.sens)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '16px' }}>
          <div className="readout" style={{ flex: 1, minWidth: '240px' }}>
            <div className="head">Scenario result</div>
            <p style={{ margin: 0 }}>Capital after this scenario: <strong style={{ color: survives ? 'var(--g1)' : 'var(--g5)', fontSize: '17px' }}>{fmt(stressed)}</strong><br />
              <span className="hint">{survives ? 'You survive this scenario, with this much buffer left.' : 'This scenario wipes out your capital buffer.'}</span></p>
          </div>
          <div className="readout" style={{ flex: 1, minWidth: '240px' }}>
            <div className="head">Reverse stress — what breaks you</div>
            <p style={{ margin: 0 }}>
              {isFinite(breakMult)
                ? <>Scaling this whole scenario by <strong style={{ fontSize: '17px' }}>×{breakMult.toFixed(2)}</strong> brings capital to zero. {breakMult < 1.5 ? 'That’s uncomfortably close — a scenario only half again as bad as the one you drew would end you.' : 'Now ask: is a scenario that severe really implausible?'}</>
                : 'Add some shock to find your breaking point.'}
            </p>
          </div>
        </div>
        <div className="readout" style={{ marginTop: '12px' }}>
          <p style={{ margin: 0 }}>Ordinary stress testing asks “if this happens, do we survive?” <em>Reverse</em> stress testing flips it: “what would it take to break us?” — and then forces an honest conversation about whether that’s really beyond imagining.</p>
        </div>
        <SaveBar onSave={() => save({ stressed, breakMult: isFinite(breakMult) ? breakMult : null })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
