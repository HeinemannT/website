import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { compute, bandFor, HEATCOLORS, fmt, SEED_REGISTER } from './riskmath.js';

const LOG = Math.log10;

/* ---------- Figure: expected-loss contours over the 5x5 grid ---------- */
export function IsoContourFigure() {
  const { getData } = useStore();
  const risks = getData('risks', SEED_REGISTER);
  const [showIso, setShowIso] = useState(true);
  const [showRev, setShowRev] = useState(true);
  const [combine, setCombine] = useState('prod');

  const W = 720, H = 430, m = { l: 62, b: 50, t: 22, r: 22 };
  const x0 = LOG(0.5), x1 = LOG(100), y0 = LOG(20000), y1 = LOG(10000000);
  const X = p => m.l + (LOG(p) - x0) / (x1 - x0) * (W - m.l - m.r);
  const Y = i => H - m.b - (LOG(i) - y0) / (y1 - y0) * (H - m.t - m.b);
  const pbounds = [0.5, 5, 25, 50, 80, 100], ibounds = [20000, 50000, 250000, 1000000, 3000000, 10000000];

  const els = [];
  els.push(<rect key="bg" x="0" y="0" width={W} height={H} fill="#fff" />);
  for (let pi = 0; pi < 5; pi++) for (let ii = 0; ii < 5; ii++) {
    const cellScore = combine === 'sum' ? (pi + 1) + (ii + 1) : (pi + 1) * (ii + 1);
    const band = bandFor(cellScore, combine);
    const xa = X(pbounds[pi]), xb = X(pbounds[pi + 1]), ya = Y(ibounds[ii]), yb = Y(ibounds[ii + 1]);
    els.push(<rect key={`c${pi}${ii}`} x={xa} y={yb} width={xb - xa} height={ya - yb} fill={HEATCOLORS[band]} opacity="0.15" stroke="#efe9dd" strokeWidth="1" />);
  }
  if (showIso) {
    [50000, 250000, 1000000, 3000000].forEach((EL, k) => {
      let d = '';
      for (let s = 0; s <= 60; s++) {
        const p = 0.5 * Math.pow(100 / 0.5, s / 60), i = EL / (p / 100);
        if (i < 20000 || i > 10000000) continue;
        d += (d ? 'L' : 'M') + X(p).toFixed(1) + ' ' + Y(i).toFixed(1) + ' ';
      }
      els.push(<path key={`iso${k}`} d={d} fill="none" stroke="#7c2230" strokeWidth="1.3" strokeDasharray="5 4" opacity="0.7" />);
      const pe = 80, ie = EL / (pe / 100);
      if (ie >= 20000 && ie <= 10000000) els.push(<text key={`isol${k}`} x={X(pe) + 5} y={Y(ie) - 3} fontFamily="Inter,sans-serif" fontSize="10" fill="#7c2230">{fmt(EL)}</text>);
    });
  }
  [1, 5, 10, 25, 50, 80, 100].forEach((p, k) => els.push(<text key={`xt${k}`} x={X(p)} y={H - m.b + 16} fontFamily="Inter,sans-serif" fontSize="9.5" fill="#857f72" textAnchor="middle">{p}%</text>));
  [20000, 100000, 500000, 2000000, 10000000].forEach((i, k) => els.push(<text key={`yt${k}`} x={m.l - 8} y={Y(i) + 3} fontFamily="Inter,sans-serif" fontSize="9.5" fill="#857f72" textAnchor="end">{fmt(i)}</text>));
  els.push(<text key="xl" x={m.l + (W - m.l - m.r) / 2} y={H - 8} fontFamily="Inter,sans-serif" fontSize="11" fill="#211f1a" textAnchor="middle" fontWeight="600">Likelihood (probability, log scale) →</text>);
  els.push(<text key="yl" transform={`translate(16,${m.t + (H - m.t - m.b) / 2}) rotate(-90)`} fontFamily="Inter,sans-serif" fontSize="11" fill="#211f1a" textAnchor="middle" fontWeight="600">Impact (€, log scale) →</text>);

  const rows = compute(risks, combine);
  let hi = null;
  rows.forEach(a => rows.forEach(b => { if (a.heat > b.heat && a.el < b.el) { const gap = b.el - a.el; if (!hi || gap > hi.gap) hi = { a, b, gap }; } }));
  rows.forEach((r, k) => {
    const highlight = showRev && hi && (r === hi.a || r === hi.b);
    const xx = X(Math.max(0.6, Math.min(99, r.p))), yy = Y(Math.max(21000, Math.min(9900000, r.i)));
    const color = highlight ? (r === hi.a ? '#bf3d30' : '#2c5750') : '#211f1a';
    els.push(<circle key={`d${k}`} cx={xx} cy={yy} r={highlight ? 8 : 5} fill={color} stroke="#fff" strokeWidth="1.5"><title>{`${r.name} — expected loss ${fmt(r.el)}, heat ${r.heat}`}</title></circle>);
    if (highlight) els.push(<text key={`dl${k}`} x={xx + 11} y={yy + 4} fontFamily="Inter,sans-serif" fontSize="11" fontWeight="600" fill={color}>{r.name}</text>);
  });
  if (showRev && hi) els.push(
    <text key="legend" x={m.l + 6} y={m.t + 13} fontFamily="Inter,sans-serif" fontSize="11" fill="#534e44">
      <tspan fill="#bf3d30" fontWeight="700">●</tspan> hotter on the map, yet lower expected loss than <tspan fill="#2c5750" fontWeight="700">●</tspan> — a reversal.
    </text>
  );

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Expected-loss contours over a 5 by 5 grid">{els}</svg>
      <div className="ctrls ui">
        <label>Expected-loss contours <input type="checkbox" checked={showIso} onChange={e => setShowIso(e.target.checked)} /></label>
        <label>Highlight the reversal <input type="checkbox" checked={showRev} onChange={e => setShowRev(e.target.checked)} /></label>
        <label>Score by{' '}
          <select value={combine} onChange={e => setCombine(e.target.value)}>
            <option value="prod">likelihood × impact</option>
            <option value="sum">likelihood + impact</option>
          </select>
        </label>
      </div>
      <figcaption>
        Probability runs along the bottom and impact up the side, both on logarithmic scales. The faint rectangles are
        the heat map; the dashed curves are lines of equal expected loss. One cell spans more than one curve — and the two
        highlighted risks sit in cells that order them opposite to their true expected loss.
      </figcaption>
    </figure>
  );
}

/* ---------- mini heat map inside the evaluator ---------- */
function MiniHeat({ rows }) {
  const W = 360, H = 320, m = { l: 48, b: 42, t: 14, r: 14 };
  const gx = (W - m.l - m.r) / 5, gy = (H - m.t - m.b) / 5;
  const els = [<rect key="bg" x="0" y="0" width={W} height={H} fill="#fff" />];
  for (let pi = 0; pi < 5; pi++) for (let ii = 0; ii < 5; ii++) {
    const band = bandFor((pi + 1) * (ii + 1), 'prod');
    els.push(<rect key={`c${pi}${ii}`} x={m.l + pi * gx} y={m.t + (4 - ii) * gy} width={gx} height={gy} fill={HEATCOLORS[band]} opacity="0.30" stroke="#fff" strokeWidth="2" />);
  }
  const plab = ['<5%', '5–25', '25–50', '50–80', '>80'], ilab = ['<50k', '50–250k', '250k–1M', '1–3M', '>3M'];
  for (let k = 0; k < 5; k++) {
    els.push(<text key={`px${k}`} x={m.l + k * gx + gx / 2} y={H - m.b + 15} fontFamily="Inter,sans-serif" fontSize="9" fill="#857f72" textAnchor="middle">{plab[k]}</text>);
    els.push(<text key={`iy${k}`} x={m.l - 6} y={m.t + (4 - k) * gy + gy / 2 + 3} fontFamily="Inter,sans-serif" fontSize="8.5" fill="#857f72" textAnchor="end">{ilab[k]}</text>);
  }
  els.push(<text key="xl" x={m.l + (W - m.l - m.r) / 2} y={H - 3} fontFamily="Inter,sans-serif" fontSize="10" fill="#211f1a" textAnchor="middle" fontWeight="600">Likelihood →</text>);
  els.push(<text key="yl" transform={`translate(11,${m.t + (H - m.t - m.b) / 2}) rotate(-90)`} fontFamily="Inter,sans-serif" fontSize="10" fill="#211f1a" textAnchor="middle" fontWeight="600">Impact →</text>);
  rows.forEach((r, k) => {
    const cx = m.l + (r.pb - 1) * gx + gx * 0.5 + ((r.idx % 3) - 1) * 8;
    const cy = m.t + (5 - r.ib) * gy + gy * 0.5 + (Math.floor(r.idx / 3) - 0.5) * 10;
    els.push(<circle key={`d${k}`} cx={cx} cy={cy} r={r.flag ? 7 : 5.5} fill={r.flag ? '#bf3d30' : '#211f1a'} stroke="#fff" strokeWidth="1.5"><title>{`${r.name} — expected loss ${fmt(r.el)}, heat ${r.heat}${r.flag ? ' (reversal)' : ''}`}</title></circle>);
  });
  return <svg viewBox={`0 0 ${W} ${H}`} aria-label="Live heat map">{els}</svg>;
}

/* ---------- the evaluator tool (builds Artifact A5) ---------- */
export function HeatMapEvaluator({ lessonId = '2d', artifactId = 'A5' }) {
  const { getData, setData, saveArtifact, markComplete, hasArtifact } = useStore();
  const risks = getData('risks', SEED_REGISTER);
  const [combine, setCombine] = useState('prod');
  const [savedMsg, setSavedMsg] = useState('');

  const rows = compute(risks, combine);
  const flags = rows.filter(r => r.flag);
  const totalEL = rows.reduce((s, r) => s + r.el, 0);
  const topEL = [...rows].sort((a, b) => b.el - a.el)[0];
  const topHeat = [...rows].sort((a, b) => b.heat - a.heat)[0];

  const update = (idx, field, value) => {
    setData('risks', list => {
      const base = (list || SEED_REGISTER).map(r => ({ ...r }));
      base[idx][field] = field === 'name' ? value : (parseFloat(value) || 0);
      return base;
    });
    setSavedMsg('');
  };
  const addRisk = () => setData('risks', list => [...(list || SEED_REGISTER).map(r => ({ ...r })), { name: 'New risk', p: 20, i: 200000 }]);
  const resetRisks = () => setData('risks', SEED_REGISTER.map(r => ({ ...r })));
  const save = () => {
    saveArtifact(artifactId, { kind: 'evaluation', rows: rows.map(r => ({ name: r.name, p: r.p, i: r.i, heat: r.heat, el: r.el, flag: r.flag })), reversals: flags.length });
    markComplete(lessonId);
    setSavedMsg('Saved to your operating model');
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ risks }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'erm-evaluation.json'; a.click();
  };

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Risk evaluation — heat map against expected loss</span><span className="tag">Builds Artifact {artifactId}</span></div>
      <div className="body">
        <table>
          <thead><tr>
            <th style={{ width: '28%' }}>Risk</th>
            <th className="num">Prob %</th><th className="num">Impact €</th>
            <th className="num">Heat</th><th className="num">Expected loss</th>
            <th className="num">Heat #</th><th className="num">Loss #</th><th>Verdict</th>
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.idx} className={r.flag ? 'flag' : ''}>
                <td><input className="name" value={r.name} onChange={e => update(r.idx, 'name', e.target.value)} /></td>
                <td className="num"><input value={r.p} onChange={e => update(r.idx, 'p', e.target.value)} inputMode="decimal" /></td>
                <td className="num"><input value={r.i} onChange={e => update(r.idx, 'i', e.target.value)} inputMode="numeric" /></td>
                <td className="num"><span className="chip" style={{ background: HEATCOLORS[r.band] }} title={`cells ${r.pb}×${r.ib}`}>{r.heat}</span></td>
                <td className="num">{fmt(r.el)}</td>
                <td className="num">#{r.heatRank}</td>
                <td className="num">#{r.elRank}</td>
                <td>{r.flag ? <span className="flagtag">reversal</span> : <span className="consistent">consistent</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: '26px', flexWrap: 'wrap', marginTop: '22px', alignItems: 'flex-start' }}>
          <figure style={{ flex: 1, minWidth: '300px', margin: 0, border: 'none', padding: 0, boxShadow: 'none' }}>
            <MiniHeat rows={rows} />
            <figcaption style={{ border: 'none', paddingTop: '8px' }}>Your register on the 5×5 map. Hover a dot for the risk and its expected loss; reversals are red.</figcaption>
          </figure>
          <div style={{ flex: 1, minWidth: '262px' }}>
            <div className="readout">
              <div className="head">What the evaluation shows</div>
              <p style={{ margin: 0 }}>
                The register carries <strong>{fmt(totalEL)}</strong> of expected loss in total. By that measure the largest
                exposure is <strong>{topEL?.name}</strong> at {fmt(topEL?.el || 0)}.{' '}
                {topHeat && topEL && topHeat.name !== topEL.name && <>The heat map, though, makes <strong>{topHeat.name}</strong> its hottest risk — a different one.{' '}</>}
                {flags.length
                  ? <><strong style={{ color: 'var(--g5)' }}>{flags.length} reversal{flags.length > 1 ? 's' : ''}</strong> flagged: the map ranks {flags.length > 1 ? 'them' : 'it'} above risks that carry more expected loss.</>
                  : <>Right now the two rankings agree — no reversals.</>}
              </p>
            </div>
            <div className="artifact">
              {hasArtifact(artifactId)
                ? `Saved. Artifact ${artifactId} records both rankings and ${flags.length} reversal${flags.length !== 1 ? 's' : ''}.`
                : `Artifact ${artifactId} (the evaluation) is not yet saved — use the button below.`}
            </div>
          </div>
        </div>

        <div className="toolfoot ui">
          <button className="btn primary" onClick={save}>Save evaluation &amp; complete lesson</button>
          <button className="btn" onClick={addRisk}>Add a risk</button>
          <button className="btn" onClick={exportJSON}>Export JSON</button>
          <button className="btn" onClick={resetRisks}>Reset</button>
          <label className="ui" style={{ fontSize: '13px', color: 'var(--soft)', marginLeft: 'auto' }}>
            Score by{' '}
            <select value={combine} onChange={e => setCombine(e.target.value)}>
              <option value="prod">likelihood × impact</option>
              <option value="sum">likelihood + impact</option>
            </select>
          </label>
          {savedMsg && <span className="saved">{savedMsg}</span>}
        </div>
      </div>
    </div>
  );
}
