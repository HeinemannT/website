import React, { useState } from 'react';
import { getLesson, neighbours } from '../curriculum.js';
import { navigate } from '../router.js';
import { useStore } from '../store.jsx';

const lesson = getLesson('1.0');

const EXAMPLES = [
  { name: 'Meridian Foods', sector: 'Consumer goods / manufacturing', size: 'Mid-cap, ~4,000 staff, international', does: 'Makes and distributes packaged food across Europe; imports ingredients, sells to retailers on credit, runs a small treasury.' },
  { name: 'Northwind Health', sector: 'Healthcare', size: 'Regional, ~6 hospitals', does: 'Runs a regional hospital network; heavy on operational, safety, data-privacy and workforce risk.' },
  { name: 'Atlas Pay', sector: 'Financial technology', size: 'Scale-up, ~600 staff', does: 'Processes payments for online merchants; exposed to fraud, cyber, liquidity and regulatory risk.' },
];

export default function Orientation() {
  const { org, setOrg, markComplete, isComplete } = useStore();
  const [form, setForm] = useState(org || { name: '', sector: '', size: '', does: '', objectives: '' });
  const { next } = neighbours('1.0');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const useExample = (ex) => setForm(f => ({ ...f, ...ex }));
  const canSave = form.name.trim() && form.does.trim();
  const save = () => { setOrg(form); markComplete('1.0'); if (next) navigate(`#/lesson/${next.id}`); };

  return (
    <main>
      <div className="eyebrow">{lesson.partN} · Lesson {lesson.id}</div>
      <h1>Orientation: choose your organization</h1>
      {isComplete('1.0') && <div className="done-banner">✓ Your organization is set. You can edit it here anytime.</div>}

      <p className="lead">Before the first idea, pick the organization you’ll protect for the rest of the course.</p>
      <p className="measure">
        Everything you build — the register, the appetite statement, the quantified analyses, the board dashboard — is
        built for <em>this</em> organization, and it all accumulates into one operating model. Choose somewhere you know
        well: your employer, a past one, or a venture you’re planning. If you’d rather not use a real one, take one of the
        examples below and make it yours. You can change any of this later.
      </p>

      <div className="form">
        <label>Organization name</label>
        <input type="text" value={form.name} onChange={set('name')} placeholder="e.g. Meridian Foods" />

        <label>Sector / industry</label>
        <input type="text" value={form.sector} onChange={set('sector')} placeholder="e.g. Consumer goods, healthcare, fintech…" />

        <label>Size & footprint</label>
        <input type="text" value={form.size} onChange={set('size')} placeholder="e.g. Mid-cap, ~4,000 staff, operates in 6 countries" />

        <label>What it does, in a sentence or two</label>
        <textarea value={form.does} onChange={set('does')} placeholder="How does it create value? Who are its customers? What does it depend on?" />

        <label>Two or three things it’s trying to achieve (its objectives)</label>
        <textarea value={form.objectives} onChange={set('objectives')} placeholder="e.g. grow margin, expand into a new market, keep services running 24/7…" />
        <div className="hint">Risk is the effect of uncertainty on these objectives — so naming them now sets up everything that follows.</div>

        <div style={{ marginTop: '18px' }}>
          <div className="hint" style={{ marginBottom: '6px' }}>Or start from an example and edit it:</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {EXAMPLES.map(ex => (
              <button key={ex.name} className="btn" onClick={() => useExample(ex)}>{ex.name}</button>
            ))}
          </div>
        </div>

        <div className="toolfoot">
          <button className="btn primary" disabled={!canSave} onClick={save}>
            Save my organization &amp; begin
          </button>
          {!canSave && <span className="hint">Add at least a name and what it does.</span>}
        </div>
      </div>
    </main>
  );
}
