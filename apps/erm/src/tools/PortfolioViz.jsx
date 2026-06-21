import React, { useState } from 'react';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';

/* Two risk sources, a weight, and a correlation. Portfolio volatility vs ρ shows
   diversification — and the "crisis" button shows it vanishing as ρ → 1. */
export function PortfolioViz({ lessonId = '4.6', artifactId = 'A11-portfolio' }) {
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const [s1, setS1] = useState(20);
  const [s2, setS2] = useState(15);
  const [w, setW] = useState(0.5);
  const [rho, setRho] = useState(0.2);

  const portVol = (r) => Math.sqrt(w * w * s1 * s1 + (1 - w) * (1 - w) * s2 * s2 + 2 * w * (1 - w) * r * s1 * s2);
  const weighted = w * s1 + (1 - w) * s2;
  const cur = portVol(rho);
  const benefit = weighted > 0 ? 1 - cur / weighted : 0;

  const W = 600, H = 240, m = { l: 44, r: 16, t: 16, b: 34 };
  const X = r => m.l + ((r + 1) / 2) * (W - m.l - m.r);
  const maxV = weighted * 1.05;
  const Y = v => H - m.b - (v / maxV) * (H - m.t - m.b);
  let path = '';
  for (let r = -1; r <= 1.0001; r += 0.05) path += (path ? 'L' : 'M') + X(r).toFixed(1) + ' ' + Y(portVol(r)).toFixed(1) + ' ';

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Portfolio diversification visualizer</span><span className="tag">Builds Artifact A11</span></div>
      <div className="body">
        <svg viewBox={`0 0 ${W} ${H}`} aria-label="Portfolio volatility vs correlation">
          <rect x="0" y="0" width={W} height={H} fill="#fff" />
          <line x1={m.l} y1={Y(weighted)} x2={W - m.r} y2={Y(weighted)} stroke="#dd8a36" strokeDasharray="4 3" />
          <text x={W - m.r} y={Y(weighted) - 4} fontFamily="Inter,sans-serif" fontSize="10" fill="#dd8a36" textAnchor="end">no-diversification (weighted average)</text>
          <path d={path} fill="none" stroke="#2c5750" strokeWidth="2" />
          <circle cx={X(rho)} cy={Y(cur)} r="6" fill="#bf3d30" />
          {[-1, -0.5, 0, 0.5, 1].map(r => <text key={r} x={X(r)} y={H - 12} fontFamily="Inter,sans-serif" fontSize="10" fill="#857f72" textAnchor="middle">ρ={r}</text>)}
          <text x={m.l} y={m.t + 4} fontFamily="Inter,sans-serif" fontSize="10" fill="#857f72">portfolio volatility</text>
        </svg>
        <div className="ctrls ui" style={{ justifyContent: 'flex-start' }}>
          <label>Risk A vol: {s1}% <input type="range" min="5" max="40" value={s1} onChange={e => setS1(+e.target.value)} /></label>
          <label>Risk B vol: {s2}% <input type="range" min="5" max="40" value={s2} onChange={e => setS2(+e.target.value)} /></label>
          <label>Weight in A: {(w * 100).toFixed(0)}% <input type="range" min="0" max="1" step="0.05" value={w} onChange={e => setW(+e.target.value)} /></label>
          <label>Correlation ρ: {rho.toFixed(2)} <input type="range" min="-1" max="1" step="0.05" value={rho} onChange={e => setRho(+e.target.value)} /></label>
          <button className="btn" onClick={() => setRho(0.95)}>Crisis: ρ → 1</button>
        </div>
        <div className="readout" style={{ marginTop: '8px' }}>
          <p style={{ margin: 0 }}>
            Combine the two risks and the portfolio’s volatility is <strong>{cur.toFixed(1)}%</strong> — versus
            <strong> {weighted.toFixed(1)}%</strong> if you’d just added them in proportion. That difference, a
            <strong style={{ color: 'var(--teal)' }}> {(benefit * 100).toFixed(0)}%</strong> diversification benefit, is the
            whole reason not to hold one risk. But drag ρ toward 1, or hit “crisis”: the curve climbs to meet the dashed line and
            the benefit disappears. Diversification is real — and it evaporates exactly when every risk moves together.
          </p>
        </div>
        <SaveBar onSave={() => save({ portVol: cur, weighted, benefit, rho })} saved={saved} justSaved={justSaved} label="Save & complete lesson" />
      </div>
    </div>
  );
}
