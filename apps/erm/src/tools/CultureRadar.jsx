import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';

const ASPECTS = ['Tone from the top', 'Openness to bad news', 'Accountability', 'Constructive challenge', 'Competence', 'Response to incidents'];
const seed = () => Object.fromEntries(ASPECTS.map(a => [a, 3]));

const CAL = [
  { q: 'Height of Mount Everest (metres)', a: 8849 },
  { q: 'Year the first iPhone shipped', a: 2007 },
  { q: 'Bones in the adult human body', a: 206 },
  { q: 'Length of the river Nile (km)', a: 6650 },
];

function Radar({ scores }) {
  const N = ASPECTS.length, cx = 150, cy = 140, R = 95;
  const pt = (i, r) => [cx + r * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / N), cy + r * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / N)];
  const rings = [1, 2, 3, 4, 5].map(v => ASPECTS.map((_, i) => pt(i, R * v / 5).join(',')).join(' '));
  const poly = ASPECTS.map((a, i) => pt(i, R * (scores[a] || 0) / 5).join(',')).join(' ');
  return (
    <svg viewBox="0 0 300 290" aria-label="Risk-culture radar">
      {rings.map((r, i) => <polygon key={i} points={r} fill="none" stroke="#e8e3d8" strokeWidth="1" />)}
      {ASPECTS.map((a, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e8e3d8" />; })}
      <polygon points={poly} fill="rgba(44,87,80,0.18)" stroke="#2c5750" strokeWidth="2" />
      {ASPECTS.map((a, i) => { const [x, y] = pt(i, R + 16); return <text key={i} x={x} y={y} fontFamily="Inter,sans-serif" fontSize="9" fill="#534e44" textAnchor="middle">{a.split(' ')[0]}</text>; })}
    </svg>
  );
}

export function CultureRadar({ lessonId = '2b', artifactId = 'A3' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const scores = getData('culture', seed());
  const cal = getData('calibration', {});
  const setScore = (a, v) => setData('culture', o => ({ ...(o || seed()), [a]: Number(v) }));
  const setCal = (i, side, v) => setData('calibration', o => ({ ...(o || {}), [i]: { ...(o?.[i] || {}), [side]: v } }));

  const allAnswered = CAL.every((_, i) => cal[i]?.lo !== undefined && cal[i]?.lo !== '' && cal[i]?.hi !== undefined && cal[i]?.hi !== '');
  const hits = CAL.filter((c, i) => { const r = cal[i]; return r && Number(r.lo) <= c.a && c.a <= Number(r.hi); }).length;

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Culture self-assessment &amp; calibration</span><span className="tag">Builds Artifact A3</span></div>
      <div className="body">
        <div style={{ display: 'flex', gap: '26px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '270px' }}>
            <div className="readout"><div className="head">Score each aspect (1 = weak, 5 = strong)</div></div>
            {ASPECTS.map(a => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '7px 0', fontFamily: 'var(--sans)', fontSize: '13px' }}>
                <span style={{ width: '150px' }}>{a}</span>
                <input type="range" min="1" max="5" value={scores[a] || 3} onChange={e => setScore(a, e.target.value)} />
                <strong>{scores[a] || 3}</strong>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: '270px' }}><Radar scores={scores} /></div>
        </div>

        <div className="readout" style={{ marginTop: '20px' }}>
          <div className="head">Calibration: give a range you’re 90% sure contains the answer</div>
          <table>
            <thead><tr><th>Question</th><th style={{ width: '90px' }}>Low</th><th style={{ width: '90px' }}>High</th>{allAnswered && <th style={{ width: '70px' }}>Inside?</th>}</tr></thead>
            <tbody>
              {CAL.map((c, i) => {
                const r = cal[i] || {};
                const inside = allAnswered && Number(r.lo) <= c.a && c.a <= Number(r.hi);
                return (
                  <tr key={i}>
                    <td>{c.q}</td>
                    <td className="num"><input value={r.lo ?? ''} onChange={e => setCal(i, 'lo', e.target.value)} inputMode="numeric" /></td>
                    <td className="num"><input value={r.hi ?? ''} onChange={e => setCal(i, 'hi', e.target.value)} inputMode="numeric" /></td>
                    {allAnswered && <td>{inside ? <span style={{ color: 'var(--g1)' }}>✓ {c.a}</span> : <span className="flagtag">missed {c.a}</span>}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {allAnswered && (
            <p style={{ margin: '10px 0 0' }}>
              Your 90% ranges caught the answer <strong>{hits} of {CAL.length}</strong> times.
              {hits < 3 ? ' If a 90% range is honest, it should contain the truth about 9 times in 10 — most people are far more overconfident than they expect. That overconfidence is exactly what poisons likelihood and impact estimates.' : ' Well calibrated — that honesty about what you don’t know is the rarest and most valuable trait in risk estimation.'}
            </p>
          )}
        </div>
        <SaveBar onSave={() => save({ scores, calibrationHits: hits })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
