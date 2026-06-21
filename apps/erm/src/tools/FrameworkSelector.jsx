import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';

const QSEED = { aim: 'flex', reg: 'intl', ic: 'no', size: 'mid' };

const MAPPING = [
  ['Principles (value, integration, best information)', 'Governance & Culture'],
  ['Framework — leadership & commitment', 'Governance & Culture'],
  ['Scope, context & criteria', 'Strategy & Objective-Setting'],
  ['Risk assessment: identify · analyse · evaluate', 'Performance: identifies & assesses risk'],
  ['Risk treatment', 'Performance: selects & implements responses'],
  ['Monitoring & review', 'Review & Revision'],
  ['Recording & reporting', 'Information, Communication & Reporting'],
];

export function FrameworkSelector({ lessonId = '1.3', artifactId = 'A1-framework' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const q = getData('frameworkQ', QSEED);
  const set = (k, v) => setData('frameworkQ', o => ({ ...(o || QSEED), [k]: v }));

  // lightweight scoring: which standard to lead with (they're complementary)
  let coso = 0, iso = 0;
  if (q.aim === 'strategy') coso += 2; else iso += 2;
  if (q.reg === 'us') coso += 2; else iso += 1;
  if (q.ic === 'yes') coso += 1;
  if (q.size === 'large') coso += 1; else iso += 1;
  const lead = coso > iso ? 'COSO ERM (2017)' : 'ISO 31000 (2018)';
  const second = coso > iso ? 'ISO 31000 for the working process' : 'COSO ERM for board-level strategy integration';

  const Choice = ({ k, opts }) => (
    <select value={q[k]} onChange={e => set(k, e.target.value)} style={{ width: '100%' }}>
      {opts.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
    </select>
  );

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Framework-fit selector</span><span className="tag">Builds Artifact A1</span></div>
      <div className="body">
        <div className="form" style={{ maxWidth: '100%' }}>
          <label>What do you most want from a framework?</label>
          <Choice k="aim" opts={[['flex', 'A flexible, principles-based system that fits any decision'], ['strategy', 'Tight integration of risk with strategy and performance for the board']]} />
          <label>Regulatory context</label>
          <Choice k="reg" opts={[['intl', 'International / public sector / general'], ['us', 'US-listed, SOX / SEC exposure']]} />
          <label>Do you already use COSO Internal Control for financial reporting?</label>
          <Choice k="ic" opts={[['no', 'No / not sure'], ['yes', 'Yes']]} />
          <label>Size & complexity</label>
          <Choice k="size" opts={[['mid', 'Small to mid-sized'], ['large', 'Large and complex']]} />
        </div>

        <div className="readout" style={{ marginTop: '18px' }}>
          <div className="head">Suggested emphasis</div>
          <p style={{ margin: 0 }}>
            Lead with <strong>{lead}</strong>, and lean on {second}. The two are not rivals — ISO 31000 gives you a clean,
            universal <em>process</em> and set of principles; COSO ERM connects risk to <em>strategy and performance</em> in
            the language boards expect. Most mature functions quietly use both.
          </p>
        </div>

        <div className="readout" style={{ marginTop: '18px' }}>
          <div className="head">ISO 31000 ↔ COSO ERM — the same work, two vocabularies</div>
          <table>
            <thead><tr><th>ISO 31000 (2018)</th><th>COSO ERM (2017)</th></tr></thead>
            <tbody>{MAPPING.map(([a, b], i) => <tr key={i}><td>{a}</td><td>{b}</td></tr>)}</tbody>
          </table>
        </div>

        <SaveBar onSave={() => save({ lead })} saved={saved} justSaved={justSaved} />
      </div>
    </div>
  );
}
