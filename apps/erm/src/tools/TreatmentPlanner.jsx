import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { SEED_REGISTER, fmt } from './riskmath.js';

const TS = ['Tolerate', 'Treat', 'Transfer', 'Terminate'];

export function TreatmentPlanner({ lessonId = '2f', artifactId = 'A7' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const risks = getData('risks', SEED_REGISTER);
  const plan = getData('treatment', {});
  const set = (name, field, val) => setData('treatment', o => ({ ...(o || {}), [name]: { ...(o?.[name] || {}), [field]: val } }));

  const decided = risks.filter(r => plan[r.name]?.t).length;

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Treatment &amp; financing planner — the 4 Ts</span><span className="tag">Builds Artifact A7</span></div>
      <div className="body">
        <table>
          <thead><tr>
            <th style={{ width: '24%' }}>Risk</th><th className="num">Expected loss</th>
            <th style={{ width: '130px' }}>Response</th><th>If Transfer: annual premium vs expected loss</th>
          </tr></thead>
          <tbody>
            {risks.map(r => {
              const el = (r.p / 100) * r.i;
              const p = plan[r.name] || {};
              const premium = parseFloat(p.premium) || 0;
              return (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td className="num">{fmt(el)}</td>
                  <td>
                    <select value={p.t || ''} onChange={e => set(r.name, 't', e.target.value)} style={{ width: '100%' }}>
                      <option value="">— choose —</option>
                      {TS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td>
                    {p.t === 'Transfer' ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--sans)', fontSize: '13px' }}>
                        €<input value={p.premium ?? ''} onChange={e => set(r.name, 'premium', e.target.value)} inputMode="numeric" style={{ width: '90px' }} />
                        {premium > 0 && (premium > el
                          ? <span style={{ color: 'var(--muted)' }}>costs {fmt(premium - el)} above expected loss — you’re buying away the volatility, not saving money.</span>
                          : <span style={{ color: 'var(--g1)' }}>below expected loss — cheap cover, check the policy’s exclusions.</span>)}
                      </span>
                    ) : <span className="hint" style={{ margin: 0 }}>{p.t === 'Tolerate' ? 'accept it, within appetite' : p.t === 'Treat' ? 'reduce it with controls' : p.t === 'Terminate' ? 'stop the activity' : ''}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="readout" style={{ marginTop: '14px' }}>
          <p style={{ margin: 0 }}>
            {decided}/{risks.length} risks have a chosen response. Remember the 4 Ts trade off cost against certainty:
            <em> tolerate</em> keeps the upside and the exposure; <em>treat</em> spends to shrink it; <em>transfer</em> pays a
            premium to smooth the volatility (insurers add a loading, so on average it costs more than the expected loss — that’s the price of certainty); <em>terminate</em> removes the risk and the reward with it.
          </p>
        </div>
        <SaveBar onSave={() => save({ decided })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
