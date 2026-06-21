import React, { useMemo, useState } from 'react';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { fmt } from './riskmath.js';
import { poisson, lognormal, percentile, mean } from './statlib.js';
import { Histogram } from './Histogram.jsx';

/* Frequency × severity → aggregate loss. Shows expected loss, unexpected loss,
   and the economic-capital intuition (hold capital to a chosen percentile). */
export function LossDistribution({ lessonId = '4.3', artifactId = 'A11-loss' }) {
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const [lambda, setLambda] = useState(3);      // events per year
  const [median, setMedian] = useState(200000); // typical severity
  const [sigma, setSigma] = useState(0.7);      // severity spread
  const [conf, setConf] = useState(99.5);
  const [nonce, setNonce] = useState(1);
  const ITER = 8000;

  const sim = useMemo(() => {
    const totals = new Array(ITER);
    for (let n = 0; n < ITER; n++) {
      const k = poisson(lambda); let t = 0;
      for (let i = 0; i < k; i++) t += lognormal(median, sigma);
      totals[n] = t;
    }
    const sorted = [...totals].sort((a, b) => a - b);
    const el = mean(totals);
    const cap = percentile(sorted, conf / 100);
    return { totals, el, cap, ul: cap - el };
  }, [lambda, median, sigma, conf, nonce]);

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Loss-distribution lab — expected vs. unexpected loss</span><span className="tag">Builds Artifact A11</span></div>
      <div className="body">
        <Histogram values={sim.totals} lines={[
          { value: sim.el, label: 'Expected loss', color: '#2c5750' },
          { value: sim.cap, label: `Capital (${conf}%)`, color: '#bf3d30' },
        ]} />
        <div className="ctrls ui" style={{ justifyContent: 'flex-start' }}>
          <label>Events/yr (λ): {lambda} <input type="range" min="0.5" max="12" step="0.5" value={lambda} onChange={e => setLambda(+e.target.value)} /></label>
          <label>Typical severity: {fmt(median)} <input type="range" min="50000" max="1000000" step="50000" value={median} onChange={e => setMedian(+e.target.value)} /></label>
          <label>Spread: {sigma.toFixed(2)} <input type="range" min="0.2" max="1.4" step="0.1" value={sigma} onChange={e => setSigma(+e.target.value)} /></label>
          <label>Capital level %: {conf} <input type="range" min="95" max="99.9" step="0.1" value={conf} onChange={e => setConf(+e.target.value)} /></label>
          <button className="btn" onClick={() => setNonce(n => n + 1)}>Re-run</button>
        </div>
        <div className="readout" style={{ marginTop: '8px' }}>
          <p style={{ margin: 0 }}>
            <strong>Expected loss {fmt(sim.el)}</strong> is what you provision for — the cost of doing business, on average.
            <strong> Unexpected loss {fmt(sim.ul)}</strong> is the distance from that average out to the {conf}% point: the
            surprise you must hold <em>capital</em> against so a bad year doesn’t end you. Economic capital, in one sentence, is
            “enough to survive up to a chosen percentile.” Push the spread up and watch how fast the required capital outruns the
            expected loss — that gap is the price of uncertainty.
          </p>
        </div>
        <SaveBar onSave={() => save({ el: sim.el, capital: sim.cap, ul: sim.ul, conf })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
