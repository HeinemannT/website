import React, { useMemo, useState } from 'react';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { fmt } from './riskmath.js';
import { randn, studentT, percentile, mean } from './statlib.js';
import { Histogram } from './Histogram.jsx';

/* P&L distribution → VaR (a quantile) vs Expected Shortfall (mean beyond it).
   The fat-tail toggle shows why ES catches what VaR misses. */
export function VaRES({ lessonId = '4.4', artifactId = 'A11-var' }) {
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const [conf, setConf] = useState(99);
  const [fat, setFat] = useState(false);
  const [nonce, setNonce] = useState(1);
  const scale = 1000000; const ITER = 8000;

  const sim = useMemo(() => {
    const losses = new Array(ITER);
    for (let n = 0; n < ITER; n++) {
      const shock = fat ? studentT(3) * 0.6 : randn();
      losses[n] = -shock * scale; // loss = negative P&L
    }
    const sorted = [...losses].sort((a, b) => a - b);
    const varq = percentile(sorted, conf / 100);
    const tail = sorted.filter(x => x >= varq);
    const es = tail.length ? mean(tail) : varq;
    return { losses, varq, es };
  }, [conf, fat, nonce]);

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">VaR &amp; Expected Shortfall lab</span><span className="tag">Builds Artifact A11</span></div>
      <div className="body">
        <Histogram values={sim.losses} lines={[
          { value: sim.varq, label: `VaR ${conf}%`, color: '#dd8a36' },
          { value: sim.es, label: `ES ${conf}%`, color: '#bf3d30' },
        ]} />
        <div className="ctrls ui" style={{ justifyContent: 'flex-start' }}>
          <label>Confidence: {conf}% <input type="range" min="90" max="99.5" step="0.5" value={conf} onChange={e => setConf(+e.target.value)} /></label>
          <label><input type="checkbox" checked={fat} onChange={e => setFat(e.target.checked)} /> Fat tails (crises, not calm)</label>
          <button className="btn" onClick={() => setNonce(n => n + 1)}>Re-run</button>
        </div>
        <div className="readout" style={{ marginTop: '8px' }}>
          <p style={{ margin: 0 }}>
            <strong>Value-at-Risk</strong> answers “on a bad day at the {conf}% level, losses won’t exceed <em>{fmt(sim.varq)}</em>.”
            It’s a single threshold — and it says nothing about how bad things get <em>beyond</em> it.
            <strong> Expected Shortfall</strong> answers the better question: “if we do breach VaR, how bad on average?” — here
            <em> {fmt(sim.es)}</em>. Now tick fat tails and watch ES pull far above VaR while VaR barely moves. That gap is the tail
            risk VaR hides, and exactly why regulators shifted from VaR to Expected Shortfall.
          </p>
        </div>
        <SaveBar onSave={() => save({ var: sim.varq, es: sim.es, conf, fat })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
