import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { fmt } from './riskmath.js';

const VSEED = { inputs: '', activities: '', value: '', customers: '' };
const FSEED = { revenue: 120000000, costs: 104000000, assets: 90000000, liabilities: 55000000 };

function read(label, value, good) {
  return <li style={{ marginBottom: '6px' }}><strong>{label}:</strong> {value} <span style={{ color: 'var(--muted)' }}>— {good}</span></li>;
}

export function OrgValueSnapshot({ lessonId = '1.2', artifactId = 'A1-value' }) {
  const { org, getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const vm = getData('valuemap', VSEED);
  const fin = getData('financials', FSEED);

  const setVM = (k, v) => setData('valuemap', o => ({ ...(o || VSEED), [k]: v }));
  const setFin = (k, v) => setData('financials', o => ({ ...(o || FSEED), [k]: parseFloat(v) || 0 }));

  const profit = fin.revenue - fin.costs;
  const margin = fin.revenue ? profit / fin.revenue : 0;
  const equity = fin.assets - fin.liabilities;
  const d2e = equity > 0 ? fin.liabilities / equity : Infinity;

  // simple bar chart: revenue, costs, profit
  const maxV = Math.max(fin.revenue, fin.costs, 1);
  const bars = [['Revenue', fin.revenue, '#2c5750'], ['Costs', fin.costs, '#dd8a36'], ['Profit', Math.max(profit, 0), '#3a875b']];

  const steps = [['Inputs', 'inputs', 'what it depends on'], ['Activities', 'activities', 'what it does'], ['Value', 'value', 'why customers pay'], ['Customers', 'customers', 'who pays']];

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Value map &amp; financial snapshot{org ? ` — ${org.name}` : ''}</span><span className="tag">Builds Artifact A1</span></div>
      <div className="body">
        <div className="readout"><div className="head">How {org ? org.name : 'your organization'} creates value</div></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', alignItems: 'stretch', marginBottom: '8px' }}>
          {steps.map(([label, key, hint], i) => (
            <div key={key} style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
              <div className="hint" style={{ marginTop: 0, marginBottom: '4px' }}>{hint}</div>
              <textarea value={vm[key]} onChange={e => setVM(key, e.target.value)} style={{ width: '100%', minHeight: '70px', fontSize: '13px', padding: '8px', border: '1px solid var(--line)', borderRadius: '8px', fontFamily: 'var(--sans)', resize: 'vertical' }} />
              {i < 3 && <div style={{ position: 'absolute', right: '-7px', top: '40%', color: 'var(--muted)', fontWeight: 700 }}>→</div>}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '26px', flexWrap: 'wrap', marginTop: '22px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div className="readout"><div className="head">Financial snapshot (enter rough figures, €)</div></div>
            <table>
              <tbody>
                {[['Revenue', 'revenue'], ['Operating costs', 'costs'], ['Total assets', 'assets'], ['Total liabilities', 'liabilities']].map(([label, key]) => (
                  <tr key={key}><td>{label}</td><td className="num"><input value={fin[key]} onChange={e => setFin(key, e.target.value)} inputMode="numeric" style={{ width: '120px' }} /></td></tr>
                ))}
              </tbody>
            </table>
            <svg viewBox="0 0 320 120" style={{ marginTop: '12px' }} aria-label="Revenue, costs, profit">
              {bars.map(([label, v, color], i) => {
                const w = (v / maxV) * 230;
                return (
                  <g key={label} transform={`translate(0,${i * 38 + 8})`}>
                    <text x="0" y="16" fontFamily="Inter,sans-serif" fontSize="11" fill="#534e44">{label}</text>
                    <rect x="70" y="4" width={Math.max(w, 1)} height="18" rx="3" fill={color} />
                    <text x={70 + Math.max(w, 1) + 6} y="18" fontFamily="Inter,sans-serif" fontSize="11" fill="#211f1a">{fmt(v)}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div className="readout">
              <div className="head">What a risk manager reads from this</div>
              <ul style={{ paddingLeft: '18px', margin: 0 }}>
                {read('Operating margin', (margin * 100).toFixed(1) + '%', margin < 0.05 ? 'thin — small shocks can wipe out profit' : margin < 0.15 ? 'modest — some cushion, not much' : 'healthy buffer against shocks')}
                {read('Profit', fmt(profit), profit <= 0 ? 'currently loss-making — survival risk is live' : 'positive — the business funds itself')}
                {read('Equity (assets − liabilities)', fmt(equity), equity <= 0 ? 'negative — technically insolvent' : 'a buffer creditors and shocks eat into first')}
                {read('Debt-to-equity', isFinite(d2e) ? d2e.toFixed(2) : '∞', d2e > 2 ? 'highly leveraged — little room before covenants bite' : d2e > 1 ? 'moderate leverage' : 'conservatively financed')}
              </ul>
            </div>
          </div>
        </div>

        <SaveBar onSave={() => save({ margin, profit, d2e: isFinite(d2e) ? d2e : null })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
