import React, { useMemo, useState } from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { SEED_REGISTER, fmt } from './riskmath.js';
import { lognormal, percentile, mean } from './statlib.js';
import { Histogram } from './Histogram.jsx';

/* Simulate one organisation-year many times: each register risk either happens
   (Bernoulli p) and, if it does, costs around its impact (lognormal spread). */
export function MonteCarlo({ lessonId = '4.2', artifactId = 'A11-montecarlo' }) {
  const { getData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const risks = getData('risks', SEED_REGISTER);
  const [iters, setIters] = useState(5000);
  const [spread, setSpread] = useState(0.5);
  const [nonce, setNonce] = useState(1);

  const sim = useMemo(() => {
    const totals = new Array(iters);
    for (let n = 0; n < iters; n++) {
      let t = 0;
      for (const r of risks) if (Math.random() < r.p / 100) t += lognormal(r.i, spread);
      totals[n] = t;
    }
    const sorted = [...totals].sort((a, b) => a - b);
    return { totals, avg: mean(totals), p50: percentile(sorted, 0.5), p95: percentile(sorted, 0.95), p99: percentile(sorted, 0.99), max: sorted[sorted.length - 1] };
  }, [risks, iters, spread, nonce]);

  const elSum = risks.reduce((s, r) => s + (r.p / 100) * r.i, 0);

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Monte Carlo — your annual loss distribution</span><span className="tag">Builds Artifact A11</span></div>
      <div className="body">
        <Histogram values={sim.totals} lines={[
          { value: sim.avg, label: 'mean', color: '#2c5750' },
          { value: sim.p95, label: 'P95', color: '#dd8a36' },
          { value: sim.p99, label: 'P99', color: '#bf3d30' },
        ]} />
        <div className="ctrls ui" style={{ justifyContent: 'flex-start' }}>
          <label>Iterations: {iters.toLocaleString()} <input type="range" min="1000" max="20000" step="1000" value={iters} onChange={e => setIters(+e.target.value)} /></label>
          <label>Severity spread: {spread.toFixed(2)} <input type="range" min="0.1" max="1.2" step="0.05" value={spread} onChange={e => setSpread(+e.target.value)} /></label>
          <button className="btn" onClick={() => setNonce(n => n + 1)}>Re-run</button>
        </div>
        <div className="readout" style={{ marginTop: '8px' }}>
          <table>
            <tbody>
              <tr><td>Average year (≈ sum of expected losses)</td><td className="num">{fmt(sim.avg)} <span className="hint">(sum of EL: {fmt(elSum)})</span></td></tr>
              <tr><td>Typical bad year (P95)</td><td className="num">{fmt(sim.p95)}</td></tr>
              <tr><td>Severe year (P99)</td><td className="num">{fmt(sim.p99)}</td></tr>
              <tr><td>Worst simulated year</td><td className="num">{fmt(sim.max)}</td></tr>
            </tbody>
          </table>
          <p style={{ margin: '8px 0 0' }}>
            One number — the average — hides the whole right-hand tail. The gap between the mean and P99 is the part that
            actually threatens you, and it’s invisible in any single expected-loss figure. This simulation is the engine behind
            the next three lessons. Its honesty depends entirely on its inputs: change the spread and watch the tail breathe.
          </p>
        </div>
        <SaveBar onSave={() => save({ avg: sim.avg, p95: sim.p95, p99: sim.p99 })} saved={saved} justSaved={justSaved} label="Save distribution & complete lesson" />
      </div>
    </div>
  );
}
