import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';

const seed = () => ([
  { name: 'Overdue high-risk audit actions', trend: '5,7,9,11,12', amber: 10, red: 20 },
  { name: 'Phishing click-rate (%)', trend: '9,7,6,5,4', amber: 5, red: 12 },
  { name: 'Top-supplier concentration (%)', trend: '28,30,31,33,34', amber: 30, red: 45 },
  { name: 'Unplanned downtime (hrs/mo)', trend: '4,6,7,8,9', amber: 8, red: 16 },
]);

const parse = (s) => String(s).split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
const statusOf = (cur, amber, red) => cur >= red ? 'red' : cur >= amber ? 'amber' : 'green';
const COLOR = { red: '#bf3d30', amber: '#dd8a36', green: '#3a875b' };

function Spark({ vals, amber, red }) {
  if (!vals.length) return null;
  const W = 120, H = 34, max = Math.max(...vals, red), min = Math.min(...vals, 0);
  const x = i => (i / Math.max(vals.length - 1, 1)) * (W - 4) + 2;
  const y = v => H - 3 - ((v - min) / Math.max(max - min, 1)) * (H - 6);
  const d = vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }}>
      <line x1="2" y1={y(red)} x2={W - 2} y2={y(red)} stroke="#bf3d30" strokeWidth="0.7" strokeDasharray="2 2" />
      <line x1="2" y1={y(amber)} x2={W - 2} y2={y(amber)} stroke="#dd8a36" strokeWidth="0.7" strokeDasharray="2 2" />
      <path d={d} fill="none" stroke="#2c5750" strokeWidth="1.6" />
    </svg>
  );
}

export function KRIDashboard({ lessonId = '2g', artifactId = 'A8' }) {
  const { org, getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const kris = getData('kris', seed());
  const set = (idx, field, val) => setData('kris', list => { const b = (list || seed()).map(k => ({ ...k })); b[idx][field] = (field === 'amber' || field === 'red') ? (parseFloat(val) || 0) : val; return b; });
  const add = () => setData('kris', list => [...(list || seed()).map(k => ({ ...k })), { name: 'New indicator', trend: '0', amber: 5, red: 10 }]);

  const rows = kris.map(k => { const v = parse(k.trend); const cur = v.length ? v[v.length - 1] : 0; return { ...k, vals: v, cur, status: statusOf(cur, k.amber, k.red) }; });
  const reds = rows.filter(r => r.status === 'red'), ambers = rows.filter(r => r.status === 'amber');

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">KRI dashboard &amp; board report</span><span className="tag">Builds Artifact A8</span></div>
      <div className="body">
        <table>
          <thead><tr><th>Indicator</th><th>Trend</th><th className="num">Now</th><th className="num">Amber</th><th className="num">Red</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td><input className="name" value={r.name} onChange={e => set(idx, 'name', e.target.value)} /></td>
                <td><Spark vals={r.vals} amber={r.amber} red={r.red} /><input className="name" value={r.trend} onChange={e => set(idx, 'trend', e.target.value)} style={{ fontSize: '11px', marginTop: '2px' }} /></td>
                <td className="num">{r.cur}</td>
                <td className="num"><input value={r.amber} onChange={e => set(idx, 'amber', e.target.value)} style={{ width: '54px' }} /></td>
                <td className="num"><input value={r.red} onChange={e => set(idx, 'red', e.target.value)} style={{ width: '54px' }} /></td>
                <td><span className="chip" style={{ background: COLOR[r.status] }}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="readout" style={{ marginTop: '16px' }}>
          <div className="head">Auto-drafted board summary</div>
          <p style={{ margin: 0 }}>
            {org ? org.name : 'The organization'} is tracking {rows.length} key risk indicators.{' '}
            {reds.length ? <><strong style={{ color: COLOR.red }}>{reds.length} breached its red threshold</strong> ({reds.map(r => r.name).join(', ')}) — these need the board’s attention now. </> : 'None have breached a red threshold. '}
            {ambers.length ? <><strong style={{ color: COLOR.amber }}>{ambers.length} sit in amber</strong> ({ambers.map(r => r.name).join(', ')}), trending toward their limits. </> : ''}
            A good indicator is <em>leading</em> — it moves before the loss does — and every threshold here should trace back to a tolerance you set in your appetite statement.
          </p>
        </div>
        <SaveBar onSave={() => save({ reds: reds.length, ambers: ambers.length })} saved={saved} justSaved={justSaved}>
          <button className="btn" onClick={add}>Add an indicator</button>
        </SaveBar>
      </div>
    </div>
  );
}
