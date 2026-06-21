import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { SEED_REGISTER, fmt } from './riskmath.js';

/* Aggregation at intuition level. Each risk contributes a "tail" magnitude (we use
   its impact as a proxy). Summed independently the tails partly cancel; as correlation
   rises toward 1 the diversification benefit disappears and aggregate -> simple sum. */
export function PortfolioAggregation({ lessonId = '3.1', artifactId = 'A9' }) {
  const { getData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const risks = getData('risks', SEED_REGISTER);
  const [rho, setRho] = useState(0.2);

  const sigmas = risks.map(r => r.i); // impact as tail proxy
  const sumOfSilos = sigmas.reduce((s, x) => s + x, 0);
  // aggregate tail = sqrt( Σσ² + 2ρ Σ_{i<j} σiσj )
  let cross = 0;
  for (let i = 0; i < sigmas.length; i++) for (let j = i + 1; j < sigmas.length; j++) cross += sigmas[i] * sigmas[j];
  const variance = sigmas.reduce((s, x) => s + x * x, 0) + 2 * rho * cross;
  const aggregate = Math.sqrt(variance);
  const benefit = sumOfSilos > 0 ? 1 - aggregate / sumOfSilos : 0;

  // bar viz
  const max = Math.max(sumOfSilos, 1);
  const W = 640;

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Portfolio aggregation — sum of silos vs. the real total</span><span className="tag">Builds Artifact A9</span></div>
      <div className="body">
        <div className="ctrls ui" style={{ justifyContent: 'flex-start' }}>
          <label style={{ flex: 1, minWidth: '260px' }}>
            Correlation between risks (ρ = {rho.toFixed(2)})
            <input type="range" min="0" max="1" step="0.05" value={rho} onChange={e => setRho(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </label>
          <button className="btn" onClick={() => setRho(0.05)}>Calm: near-independent</button>
          <button className="btn" onClick={() => setRho(0.9)}>Crisis: everything moves together</button>
        </div>

        <svg viewBox={`0 0 ${W} 130`} style={{ marginTop: '12px' }} aria-label="Sum of silos vs aggregate">
          <g transform="translate(0,10)">
            <text x="0" y="14" fontFamily="Inter,sans-serif" fontSize="11" fill="#534e44">Sum of silos (just add them up)</text>
            <rect x="0" y="22" width={W} height="20" rx="3" fill="#dd8a36" opacity="0.5" />
            <text x={W - 4} y="37" fontFamily="Inter,sans-serif" fontSize="12" fill="#211f1a" textAnchor="end" fontWeight="600">{fmt(sumOfSilos)}</text>
          </g>
          <g transform="translate(0,66)">
            <text x="0" y="14" fontFamily="Inter,sans-serif" fontSize="11" fill="#534e44">Aggregate at ρ = {rho.toFixed(2)} (the real, diversified total)</text>
            <rect x="0" y="22" width={(aggregate / max) * W} height="20" rx="3" fill="#2c5750" />
            <text x={(aggregate / max) * W + 6} y="37" fontFamily="Inter,sans-serif" fontSize="12" fill="#211f1a" fontWeight="600">{fmt(aggregate)}</text>
          </g>
        </svg>

        <div className="readout" style={{ marginTop: '8px' }}>
          <p style={{ margin: 0 }}>
            Add every risk’s worst case and you get <strong>{fmt(sumOfSilos)}</strong>. But the risks don’t all strike at once,
            so the real aggregate exposure is <strong>{fmt(aggregate)}</strong> — a diversification benefit of{' '}
            <strong style={{ color: 'var(--teal)' }}>{(benefit * 100).toFixed(0)}%</strong>. Now drag ρ toward 1, or hit
            “crisis”: as risks start moving together, the benefit collapses and the aggregate climbs back toward the naïve sum.
            That’s the lesson — <em>diversification is real until a crisis correlates everything</em>, which is exactly when you’re counting on it.
          </p>
        </div>
        <SaveBar onSave={() => save({ rho, sumOfSilos, aggregate, benefit })} saved={saved} justSaved={justSaved} label="Save aggregation view & complete lesson" />
      </div>
    </div>
  );
}
