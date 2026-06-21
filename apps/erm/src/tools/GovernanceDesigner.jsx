import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';

const GSEED = { riskCommittee: true, cro: true, internalAudit: true, assign: {} };

const ACTIVITIES = [
  { id: 'ops', text: 'Run day-to-day controls on operations', line: 1 },
  { id: 'own', text: 'Own and accept the cyber risk', line: 1 },
  { id: 'policy', text: 'Set risk policy and monitor the framework', line: 2 },
  { id: 'challenge', text: 'Challenge the business’s risk assessments', line: 2 },
  { id: 'assure', text: 'Give the board independent assurance that it all works', line: 3 },
];

const LINE_NAME = { 1: 'First line (owns & manages)', 2: 'Second line (oversees & advises)', 3: 'Third line (independent assurance)' };

export function GovernanceDesigner({ lessonId = '1.4', artifactId = 'A1-governance' }) {
  const { org, getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const g = getData('governance', GSEED);
  const set = (k, v) => setData('governance', o => ({ ...(o || GSEED), [k]: v }));
  const assignTo = (id, line) => setData('governance', o => ({ ...(o || GSEED), assign: { ...(o?.assign || {}), [id]: line } }));

  const col = (n, title, sub, body) => (
    <div style={{ flex: 1, minWidth: '170px', background: '#fff', border: '1px solid var(--line)', borderRadius: '12px', padding: '14px' }}>
      <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: n === 1 ? 'var(--teal)' : n === 2 ? 'var(--gold)' : 'var(--wine)' }}>{title}</div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 600, margin: '4px 0 6px' }}>{sub}</div>
      <div className="hint" style={{ margin: 0 }}>{body}</div>
    </div>
  );

  const answered = Object.keys(g.assign || {}).length;

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Governance &amp; three-lines designer{org ? ` — ${org.name}` : ''}</span><span className="tag">Builds Artifact A1</span></div>
      <div className="body">
        {/* board bar */}
        <div style={{ background: '#23211d', color: '#f6f2e9', borderRadius: '12px', padding: '12px 16px', fontFamily: 'var(--sans)', fontSize: '13px', textAlign: 'center', fontWeight: 600 }}>
          Governing body — the Board{g.riskCommittee ? ', via its Risk Committee' : ''}
          <div style={{ fontWeight: 400, fontSize: '12px', opacity: .8 }}>sets risk appetite · holds management to account</div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '18px' }}>↑ accountable to ↑</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {col(1, 'First line', 'Operational management', 'Owns risks and runs the controls in the course of doing the work.')}
          {col(2, 'Second line', g.cro ? 'Risk & compliance (CRO)' : 'Risk & compliance functions', 'Sets policy, advises, and monitors — but does not own the risks.')}
          {col(3, 'Third line', g.internalAudit ? 'Internal audit' : '(no internal audit yet)', 'Independent assurance to the board that the first two lines work.')}
        </div>
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '12px', marginTop: '8px', fontFamily: 'var(--sans)' }}>
          outside the lines: external audit &amp; regulators
        </div>

        <div className="ctrls ui" style={{ justifyContent: 'flex-start', marginTop: '16px' }}>
          <label><input type="checkbox" checked={g.riskCommittee} onChange={e => set('riskCommittee', e.target.checked)} /> Board risk committee</label>
          <label><input type="checkbox" checked={g.cro} onChange={e => set('cro', e.target.checked)} /> Chief Risk Officer</label>
          <label><input type="checkbox" checked={g.internalAudit} onChange={e => set('internalAudit', e.target.checked)} /> Internal audit</label>
        </div>

        <div className="readout" style={{ marginTop: '18px' }}>
          <div className="head">Who should do what? Assign each to a line</div>
          <table>
            <tbody>
              {ACTIVITIES.map(a => {
                const picked = g.assign?.[a.id];
                const ok = picked && Number(picked) === a.line;
                return (
                  <tr key={a.id}>
                    <td>{a.text}</td>
                    <td style={{ width: '230px' }}>
                      <select value={picked || ''} onChange={e => assignTo(a.id, e.target.value)} style={{ width: '100%' }}>
                        <option value="">— choose a line —</option>
                        <option value="1">First line</option>
                        <option value="2">Second line</option>
                        <option value="3">Third line</option>
                      </select>
                    </td>
                    <td style={{ width: '120px' }}>
                      {picked ? (ok ? <span className="consistent" style={{ color: 'var(--g1)' }}>✓ fits the model</span> : <span className="flagtag">rethink</span>) : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!g.internalAudit && <p className="hint" style={{ color: 'var(--g5)' }}>With no third line, no one gives the board <em>independent</em> assurance — a real gap to note in your charter.</p>}
        </div>

        <SaveBar onSave={() => save({ riskCommittee: g.riskCommittee, cro: g.cro, internalAudit: g.internalAudit, assigned: answered })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
