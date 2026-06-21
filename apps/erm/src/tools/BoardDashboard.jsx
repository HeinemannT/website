import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { SEED_REGISTER, fmt } from './riskmath.js';

const COLOR = { red: '#bf3d30', amber: '#dd8a36', green: '#3a875b' };
const parse = (s) => String(s).split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));

export function BoardDashboard({ lessonId = '5c', artifactId = 'A14' }) {
  const { org, getData, artifacts } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const risks = getData('risks', SEED_REGISTER);
  const kris = getData('kris', []);

  const ranked = [...risks].map(r => ({ ...r, el: (r.p / 100) * r.i })).sort((a, b) => b.el - a.el);
  const top = ranked.slice(0, 5);
  const totalEL = ranked.reduce((s, r) => s + r.el, 0);
  const kriStatus = kris.map(k => { const v = parse(k.trend); const cur = v.length ? v[v.length - 1] : 0; return { name: k.name, cur, status: cur >= k.red ? 'red' : cur >= k.amber ? 'amber' : 'green' }; });
  const reds = kriStatus.filter(k => k.status === 'red');
  const capital = artifacts['A11-loss']?.capital || artifacts['A11-montecarlo']?.p99 || null;
  const maturity = artifacts['A13']?.level || null;

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Board risk dashboard{org ? ` — ${org.name}` : ''}</span><span className="tag">Builds Artifact A14</span></div>
      <div className="body">
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {[['Total expected loss', fmt(totalEL)], ['Capital estimate', capital ? fmt(capital) : '— (do 4.3)'], ['KRIs in red', String(reds.length)], ['Maturity', maturity || '— (do 5b)']].map(([l, v]) => (
            <div key={l} style={{ flex: 1, minWidth: '150px', background: '#fff', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 14px' }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>{l}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div className="readout"><div className="head">Top risks by expected loss</div></div>
            <table>
              <tbody>
                {top.map((r, i) => (
                  <tr key={i}><td>{r.name}</td><td style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--muted)' }}>{r.owner || 'unowned'}</td><td className="num">{fmt(r.el)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div className="readout"><div className="head">Indicators needing attention</div>
              {kriStatus.filter(k => k.status !== 'green').length
                ? kriStatus.filter(k => k.status !== 'green').map((k, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--sans)', fontSize: '13px', margin: '4px 0' }}><span>{k.name}</span><span className="chip" style={{ background: COLOR[k.status] }}>{k.status}</span></div>)
                : <p className="hint" style={{ margin: 0 }}>No amber/red indicators (or none defined yet — see 2g).</p>}
            </div>
          </div>
        </div>

        <div className="readout" style={{ marginTop: '14px' }}>
          <p style={{ margin: 0 }}>
            A board report isn’t a data dump — it’s a decision aid. It says, in a glance: here’s our biggest exposure, here’s
            what’s moving against us, here’s the capital standing behind it, and here’s where we’re mature or thin. Everything on
            this page was produced by the work you’ve already done — the dashboard just assembles it into the language a board
            actually uses. That assembly, scaled up, is the capstone.
          </p>
        </div>
        <SaveBar onSave={() => save({ totalEL, topRisk: top[0]?.name, reds: reds.length })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
