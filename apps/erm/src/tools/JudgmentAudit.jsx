import React from 'react';
import { useStore } from '../store.jsx';
import { useSaver } from '../components/useSaver.js';
import { SaveBar } from '../components/SaveBar.jsx';

const BIASES = [
  { k: 'overconf', t: 'Overconfidence', d: 'We treat our estimates as tighter than they are.' },
  { k: 'anchor', t: 'Anchoring', d: 'First numbers (last year’s, someone’s guess) drag everything toward them.' },
  { k: 'avail', t: 'Availability', d: 'We over-weight the vivid and recent, under-weight the unseen.' },
  { k: 'group', t: 'Groupthink', d: 'Dissent is uncomfortable, so the room converges too fast.' },
  { k: 'confirm', t: 'Confirmation', d: 'We look for data that fits the view we already hold.' },
];
const MSEED = [{ name: 'Pricing / forecasting model', assumption: '', challenger: '' }];

export function JudgmentAudit({ lessonId = '5d', artifactId = 'A15' }) {
  const { getData, setData } = useStore();
  const { save, saved, justSaved } = useSaver(lessonId, artifactId);
  const guarded = getData('biasGuards', {});
  const models = getData('modelAudit', MSEED);

  const toggle = (k) => setData('biasGuards', o => ({ ...(o || {}), [k]: !(o?.[k]) }));
  const setModel = (idx, field, val) => setData('modelAudit', list => { const b = (list || MSEED).map(m => ({ ...m })); b[idx][field] = val; return b; });
  const addModel = () => setData('modelAudit', list => [...(list || MSEED).map(m => ({ ...m })), { name: 'Another model', assumption: '', challenger: '' }]);

  const covered = BIASES.filter(b => guarded[b.k]).length;

  return (
    <div className="tool">
      <div className="bar ui"><span className="t">Judgment &amp; model-risk audit</span><span className="tag">Builds Artifact A15</span></div>
      <div className="body">
        <div className="readout"><div className="head">Biases — do you actively guard against each? ({covered}/{BIASES.length})</div></div>
        {BIASES.map(b => (
          <label key={b.k} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '8px 0', fontFamily: 'var(--sans)', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!guarded[b.k]} onChange={() => toggle(b.k)} style={{ marginTop: '3px' }} />
            <span><strong>{b.t}</strong> — <span style={{ color: 'var(--muted)' }}>{b.d}</span></span>
          </label>
        ))}

        <div className="readout" style={{ marginTop: '16px' }}><div className="head">Models you rely on — and who challenges them</div></div>
        <table>
          <thead><tr><th>Model / system</th><th>Key assumption that could break</th><th>Independent challenger</th></tr></thead>
          <tbody>
            {models.map((m, idx) => (
              <tr key={idx}>
                <td><input className="name" value={m.name} onChange={e => setModel(idx, 'name', e.target.value)} /></td>
                <td><input className="name" value={m.assumption} onChange={e => setModel(idx, 'assumption', e.target.value)} placeholder="e.g. correlations stay low" /></td>
                <td><input className="name" value={m.challenger} onChange={e => setModel(idx, 'challenger', e.target.value)} placeholder="who provides effective challenge" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="readout" style={{ marginTop: '12px' }}>
          <p style={{ margin: 0 }}>
            Every model in this course — Monte Carlo, VaR, the heat map itself — is a confident-looking output built on human
            judgement. The mature move isn’t to trust the numbers or to dismiss them, but to know exactly where each one’s
            assumptions stop holding, and to make sure someone independent is paid to say so. That humility, written down, is the
            last artifact before you assemble everything.
          </p>
        </div>
        <SaveBar onSave={() => save({ biasesCovered: covered, models: models.length })} saved={saved} justSaved={justSaved}>
          <button className="btn" onClick={addModel}>Add a model</button>
        </SaveBar>
      </div>
    </div>
  );
}
