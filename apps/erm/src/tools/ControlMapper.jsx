import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { SEED_REGISTER, fmt } from './riskmath.js';

export function ControlMapper({ lessonId = '2e', artifactId = 'A6' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const risks = getData('risks', SEED_REGISTER);
  const controls = getData('controls', {});
  const tolerance = getData('controlsTolerance', 300000);

  const setEff = (name, v) => setData('controls', o => ({ ...(o || {}), [name]: Number(v) }));

  const rows = risks.map(r => {
    const inherent = (r.p / 100) * r.i;
    const eff = controls[r.name] ?? 40;
    const residual = inherent * (1 - eff / 100);
    return { name: r.name, inherent, eff, residual, over: residual > tolerance };
  });
  const maxEL = Math.max(...rows.map(r => r.inherent), 1);
  const overCount = rows.filter(r => r.over).length;

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Control-effectiveness mapper</span><span className="tag">Builds Artifact A6</span></div>
      <div className="body">
        <div className="ctrls ui" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
          <label>Residual tolerance line (€): <input value={tolerance} onChange={e => setData('controlsTolerance', parseFloat(e.target.value) || 0)} inputMode="numeric" style={{ width: '120px' }} /></label>
        </div>
        <table>
          <thead><tr>
            <th style={{ width: '24%' }}>Risk</th><th className="num">Inherent</th>
            <th style={{ width: '34%' }}>Control effectiveness</th>
            <th className="num">Residual</th><th>vs tolerance</th>
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.name} className={r.over ? 'flag' : ''}>
                <td>{r.name}</td>
                <td className="num">{fmt(r.inherent)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="range" min="0" max="95" value={r.eff} onChange={e => setEff(r.name, e.target.value)} style={{ flex: 1 }} />
                    <span style={{ width: '34px', textAlign: 'right' }}>{r.eff}%</span>
                  </div>
                </td>
                <td className="num">{fmt(r.residual)}</td>
                <td>{r.over ? <span className="flagtag">over</span> : <span className="consistent">within</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <svg viewBox={`0 0 720 ${rows.length * 30 + 16}`} style={{ marginTop: '14px' }} aria-label="Inherent vs residual">
          {rows.map((r, i) => {
            const y = i * 30 + 8;
            const wI = (r.inherent / maxEL) * 480, wR = (r.residual / maxEL) * 480;
            const tx = 200 + (tolerance / maxEL) * 480;
            return (
              <g key={r.name} transform={`translate(0,${y})`}>
                <text x="0" y="15" fontFamily="Inter,sans-serif" fontSize="10" fill="#534e44">{r.name.slice(0, 22)}</text>
                <rect x="200" y="4" width={Math.max(wI, 1)} height="7" rx="2" fill="#dd8a36" opacity="0.4" />
                <rect x="200" y="13" width={Math.max(wR, 1)} height="7" rx="2" fill={r.over ? '#bf3d30' : '#3a875b'} />
                {i === 0 && <line x1={tx} y1="0" x2={tx} y2={rows.length * 30} stroke="#7c2230" strokeDasharray="3 3" />}
              </g>
            );
          })}
        </svg>
        <div className="hint" style={{ textAlign: 'center' }}>Pale bar = inherent · solid = residual after controls · dashed line = your tolerance</div>

        <div className="readout" style={{ marginTop: '12px' }}>
          {overCount === 0
            ? <p style={{ margin: 0, color: 'var(--g1)' }}>Every residual risk now sits within tolerance. Note where you relied on optimistic control effectiveness — that’s where to test the controls hardest.</p>
            : <p style={{ margin: 0, color: 'var(--g5)' }}>{overCount} risk{overCount > 1 ? 's' : ''} remain above tolerance even after controls — these need treatment (next lesson), not just monitoring.</p>}
        </div>
        <SaveBar onSave={() => save({ overCount })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
