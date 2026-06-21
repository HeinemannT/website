import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { fmt } from './riskmath.js';

const SEED = {
  alts: [
    { name: 'Launch now', outcomes: [{ label: 'hit', p: 40, value: 5000000 }, { label: 'flop', p: 60, value: -1500000 }] },
    { name: 'Test first, then decide', outcomes: [{ label: 'hit', p: 55, value: 3000000 }, { label: 'flop', p: 45, value: -400000 }] },
  ],
};

export function DecisionExplorer({ lessonId = '4.1', artifactId = 'A11-decision' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const d = getData('decision', SEED);

  const setOut = (ai, oi, field, val) => setData('decision', o => {
    const b = JSON.parse(JSON.stringify(o || SEED));
    b.alts[ai].outcomes[oi][field] = field === 'label' ? val : (parseFloat(val) || 0);
    return b;
  });

  const evOf = (alt) => alt.outcomes.reduce((s, o) => s + (o.p / 100) * o.value, 0);
  const spreadOf = (alt) => Math.max(...alt.outcomes.map(o => o.value)) - Math.min(...alt.outcomes.map(o => o.value));
  const evs = d.alts.map(evOf);
  const best = evs.indexOf(Math.max(...evs));

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Decision-under-uncertainty explorer</span><span className="tag">Builds Artifact A11</span></div>
      <div className="body">
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          {d.alts.map((alt, ai) => (
            <div key={ai} style={{ flex: 1, minWidth: '260px', border: ai === best ? '2px solid var(--teal)' : '1px solid var(--line)', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, marginBottom: '8px' }}>{alt.name}{ai === best && <span style={{ color: 'var(--teal)', fontSize: '12px' }}> · highest expected value</span>}</div>
              <table>
                <thead><tr><th>Outcome</th><th className="num">Prob %</th><th className="num">Value €</th></tr></thead>
                <tbody>
                  {alt.outcomes.map((o, oi) => (
                    <tr key={oi}>
                      <td><input className="name" value={o.label} onChange={e => setOut(ai, oi, 'label', e.target.value)} /></td>
                      <td className="num"><input value={o.p} onChange={e => setOut(ai, oi, 'p', e.target.value)} style={{ width: '54px' }} /></td>
                      <td className="num"><input value={o.value} onChange={e => setOut(ai, oi, 'value', e.target.value)} style={{ width: '90px' }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="readout" style={{ marginTop: '8px' }}>
                <p style={{ margin: 0 }}>Expected value: <strong>{fmt(evOf(alt))}</strong><br /><span className="hint">spread (best − worst): {fmt(spreadOf(alt))}</span></p>
              </div>
            </div>
          ))}
        </div>
        <div className="readout" style={{ marginTop: '14px' }}>
          <p style={{ margin: 0 }}>
            Expected value points to <strong>{d.alts[best].name}</strong>. But EV isn’t the whole story: a risk-averse
            decision-maker may prefer the option with the smaller spread even at a lower EV — that preference is
            <em> risk aversion</em>, and it’s rational, not timid. Notice the probabilities are inputs you chose; the
            calibration you practised in 2b is what makes them trustworthy.
          </p>
        </div>
        <SaveBar onSave={() => save({ chosen: d.alts[best].name, evs })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
