import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';

const PRINCIPLES = [
  { k: 'gov', t: 'Governance', d: 'Clear ownership and board oversight of risk data.' },
  { k: 'arch', t: 'Data architecture', d: 'Infrastructure that holds up in a crisis, not just in calm.' },
  { k: 'acc', t: 'Accuracy & integrity', d: 'The numbers are right and reconcilable to source.' },
  { k: 'comp', t: 'Completeness', d: 'All material risks are captured, across the whole group.' },
  { k: 'time', t: 'Timeliness', d: 'Data is available fast enough to act on — especially under stress.' },
  { k: 'adapt', t: 'Adaptability', d: 'You can answer a new question quickly, not in six weeks.' },
  { k: 'rep', t: 'Reporting clarity', d: 'Reports are accurate, clear, and useful to decision-makers.' },
];
const seed = () => Object.fromEntries(PRINCIPLES.map(p => [p.k, 2]));
const LABEL = { 1: 'absent', 2: 'developing', 3: 'largely there', 4: 'strong' };

export function DataQualityScorecard({ lessonId = '5a', artifactId = 'A12' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const sc = getData('dataQuality', seed());
  const set = (k, v) => setData('dataQuality', o => ({ ...(o || seed()), [k]: Number(v) }));
  const avg = PRINCIPLES.reduce((s, p) => s + (sc[p.k] || 0), 0) / PRINCIPLES.length;
  const gaps = PRINCIPLES.filter(p => (sc[p.k] || 0) <= 2);

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">BCBS 239 data-quality scorecard</span><span className="tag">Builds Artifact A12</span></div>
      <div className="body">
        {PRINCIPLES.map(p => (
          <div key={p.k} style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
            <div style={{ width: '160px' }}><div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '13px' }}>{p.t}</div><div className="hint" style={{ margin: 0 }}>{p.d}</div></div>
            <input type="range" min="1" max="4" value={sc[p.k] || 2} onChange={e => set(p.k, e.target.value)} style={{ flex: 1 }} />
            <span style={{ width: '110px', fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--soft)' }}>{LABEL[sc[p.k] || 2]}</span>
          </div>
        ))}
        <div className="readout" style={{ marginTop: '12px' }}>
          <p style={{ margin: 0 }}>
            Overall maturity: <strong>{avg.toFixed(1)} / 4</strong>. {gaps.length
              ? <>Weakest: <strong>{gaps.map(g => g.t).join(', ')}</strong>. BCBS 239 exists because, in 2008, banks couldn’t add up their own exposures fast enough to see the danger — the data wasn’t there when it mattered. Aggregation is only as trustworthy as the data underneath it.</>
              : <>Strong across the board — your aggregated numbers can probably be trusted under stress, which is exactly when it counts.</>}
          </p>
        </div>
        <SaveBar onSave={() => save({ avg, gaps: gaps.length })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
