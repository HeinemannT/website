import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';

const ATTR = ['ERM adoption', 'Process management', 'Appetite management', 'Root-cause discipline', 'Uncovering risks', 'Performance management', 'Resilience & sustainability'];
const LEVELS = ['—', 'Ad hoc', 'Initial', 'Repeatable', 'Managed', 'Leadership'];
const seed = () => Object.fromEntries(ATTR.map(a => [a, 2]));

function Radar({ scores }) {
  const N = ATTR.length, cx = 160, cy = 150, R = 100;
  const pt = (i, r) => [cx + r * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / N), cy + r * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / N)];
  const rings = [1, 2, 3, 4, 5].map(v => ATTR.map((_, i) => pt(i, R * v / 5).join(',')).join(' '));
  const poly = ATTR.map((a, i) => pt(i, R * (scores[a] || 0) / 5).join(',')).join(' ');
  return (
    <svg viewBox="0 0 320 310" aria-label="Risk maturity radar">
      {rings.map((r, i) => <polygon key={i} points={r} fill="none" stroke="#e8e3d8" />)}
      {ATTR.map((a, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e8e3d8" />; })}
      <polygon points={poly} fill="rgba(154,115,39,0.18)" stroke="#9a7327" strokeWidth="2" />
      {ATTR.map((a, i) => { const [x, y] = pt(i, R + 14); return <text key={i} x={x} y={y} fontFamily="Inter,sans-serif" fontSize="8.5" fill="#534e44" textAnchor="middle">{a.split(' ')[0]}</text>; })}
    </svg>
  );
}

export function MaturityRadar({ lessonId = '5b', artifactId = 'A13' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const sc = getData('maturity', seed());
  const set = (a, v) => setData('maturity', o => ({ ...(o || seed()), [a]: Number(v) }));
  const avg = ATTR.reduce((s, a) => s + (sc[a] || 0), 0) / ATTR.length;
  const level = LEVELS[Math.max(1, Math.round(avg))];
  const weakest = [...ATTR].sort((a, b) => (sc[a] || 0) - (sc[b] || 0)).slice(0, 2);

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Risk-maturity self-assessment</span><span className="tag">Builds Artifact A13</span></div>
      <div className="body">
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '270px' }}>
            {ATTR.map(a => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0', fontFamily: 'var(--sans)', fontSize: '13px' }}>
                <span style={{ width: '170px' }}>{a}</span>
                <input type="range" min="1" max="5" value={sc[a] || 2} onChange={e => set(a, e.target.value)} />
                <strong>{sc[a] || 2}</strong>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: '270px' }}><Radar scores={sc} /></div>
        </div>
        <div className="readout" style={{ marginTop: '12px' }}>
          <p style={{ margin: 0 }}>
            Overall maturity: <strong>{avg.toFixed(1)} / 5 — “{level}”</strong>. Maturity isn’t about having more documents;
            it’s about ERM being embedded in how decisions actually get made. Your two thinnest attributes —
            <strong> {weakest.join(' and ')}</strong> — are the natural next steps on the roadmap: maturing the function means
            lifting the weakest links, not polishing the strongest.
          </p>
        </div>
        <SaveBar onSave={() => save({ avg, level, weakest })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
