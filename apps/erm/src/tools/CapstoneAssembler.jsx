import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';
import { SEED_REGISTER, fmt } from './riskmath.js';

export function CapstoneAssembler({ lessonId = '5e', artifactId = 'CAP' }) {
  const { org, getData, artifacts, exportJSON } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const A = artifacts;
  const risks = getData('risks', SEED_REGISTER);
  const appetite = getData('appetite', {});
  const treatment = getData('treatment', {});

  const milestones = [
    ['Case organization', !!org],
    ['Risk charter (Part 1)', ['A1-statements', 'A1-value', 'A1-framework', 'A1-governance'].every(id => A[id])],
    ['Risk appetite (A2)', !!A['A2']],
    ['Risk culture (A3)', !!A['A3']],
    ['Risk register (A4)', !!A['A4']],
    ['Evaluation (A5)', !!A['A5']],
    ['Controls (A6)', !!A['A6']],
    ['Treatment plan (A7)', !!A['A7']],
    ['KRIs & reporting (A8)', !!A['A8']],
    ['Taxonomy & portfolio (A9)', !!A['A9-taxonomy'] || !!A['A9-portfolio']],
    ['Risk families (A10)', ['A10-strategic', 'A10-financial', 'A10-operational', 'A10-conduct', 'A10-tech', 'A10-model'].some(id => A[id])],
    ['Quantification (A11)', Object.keys(A).some(k => k.startsWith('A11'))],
    ['Data quality (A12)', !!A['A12']],
    ['Maturity (A13)', !!A['A13']],
    ['Board dashboard (A14)', !!A['A14']],
    ['Judgment & model risk (A15)', !!A['A15']],
  ];
  const done = milestones.filter(([, ok]) => ok).length;
  const pct = Math.round((done / milestones.length) * 100);

  const ranked = [...risks].map(r => ({ ...r, el: (r.p / 100) * r.i })).sort((a, b) => b.el - a.el);
  const top3 = ranked.slice(0, 3);
  const totalEL = ranked.reduce((s, r) => s + r.el, 0);
  const capital = A['A11-loss']?.capital || A['A11-montecarlo']?.p99 || null;

  // coherence checks — quality, not just presence
  const owned = risks.filter(r => (r.owner || '').trim()).length;
  const apptDecided = Object.values(appetite).filter(c => (c?.decision || '').trim()).length;
  const topTreated = top3.filter(r => treatment[r.name]?.t).length;
  const checks = [
    [`Risks with a named owner: ${owned}/${risks.length}`, owned === risks.length && risks.length > 0],
    [`Appetite categories with a real decision: ${apptDecided}/5`, apptDecided >= 4],
    [`Top-3 risks with a treatment chosen: ${topTreated}/3`, topTreated === 3],
    ['Judgment & model-risk audit done', !!A['A15']],
    ['Quantified at least one risk', Object.keys(A).some(k => k.startsWith('A11'))],
  ];
  const coherent = checks.filter(([, ok]) => ok).length;
  const score = Math.round(0.6 * pct + 0.4 * (coherent / checks.length) * 100);

  const download = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `${(org?.name || 'organization').replace(/\s+/g, '-').toLowerCase()}-risk-operating-model.json`;
    a.click();
  };

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Risk Operating Model — assembler{org ? ` for ${org.name}` : ''}</span><span className="tag">Capstone</span></div>
      <div className="body">
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div className="readout"><div className="head">Components assembled ({done}/{milestones.length})</div></div>
            {milestones.map(([label, ok]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--sans)', fontSize: '13px', margin: '3px 0', color: ok ? 'var(--ink)' : 'var(--muted)' }}>
                <span style={{ color: ok ? 'var(--g1)' : '#cdc6b6' }}>{ok ? '✓' : '○'}</span>{label}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div className="readout"><div className="head">Coherence checks</div></div>
            {checks.map(([label, ok]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--sans)', fontSize: '13px', margin: '3px 0' }}>
                <span style={{ color: ok ? 'var(--g1)' : 'var(--g5)' }}>{ok ? '✓' : '!'}</span><span style={{ color: ok ? 'var(--ink)' : 'var(--g5)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fbf8f1', border: '1px solid var(--line)', borderRadius: '12px', padding: '18px', margin: '18px 0' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--gold)', fontWeight: 700 }}>Board one-pager — {org?.name || 'your organization'}</div>
          <p style={{ margin: '8px 0 0' }}>
            {org ? <>{org.name} ({org.sector || 'sector n/a'}) faces a register of <strong>{risks.length} risks</strong> carrying
              <strong> {fmt(totalEL)}</strong> of total expected loss. </> : <>Set your organization in orientation to personalise this. </>}
            The largest exposures are {top3.map(r => r.name).join(', ') || '—'}.
            {capital ? <> Modelled capital to survive a severe year is <strong>{fmt(capital)}</strong>.</> : <> (Quantify a loss type in 4.3 to estimate capital.)</>}
            {A['A13']?.level ? <> The risk function rates as <strong>“{A['A13'].level}”</strong> on maturity.</> : ''}
            {' '}This operating model assembles {done} of {milestones.length} components into one coherent whole.
          </p>
        </div>

        <div className="readout">
          <p style={{ margin: 0 }}>
            Capstone score: <strong style={{ fontSize: '18px' }}>{score}/100</strong> <span className="hint">(60% completeness, 40% coherence)</span>.
            {score >= 80 ? ' A genuinely complete, coherent risk operating model — the thing this whole course was building toward.'
              : ' Fill the open components and fix the coherence flags above to raise it — that’s the assembly work itself.'}
          </p>
        </div>

        <SaveBar onSave={() => save({ score, completion: pct, coherent })} saved={saved} justSaved={justSaved} label="Save & complete the course">
          <button className="btn" onClick={download}>Download my risk operating model (JSON)</button>
        </SaveBar>
      </div>
    </div>
  );
}
