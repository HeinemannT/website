import React from 'react';
import { PARTS, FLAT } from '../curriculum.js';
import { navigate } from '../router.js';
import { useStore } from '../store.jsx';
import { hasLesson } from '../lessons/index.js';

export function Home() {
  const { org, isComplete } = useStore();
  const firstUnfinished = FLAT.find(l => hasLesson(l.id) && !isComplete(l.id)) || FLAT.find(l => hasLesson(l.id));

  return (
    <main>
      <div className="hero">
        <div className="eyebrow">A self-paced course</div>
        <h1>Enterprise Risk Management</h1>
        <p className="lead">
          Risk management as a discipline — organized judgment under uncertainty. You’ll learn to govern risk,
          run the process that finds and treats it, map the whole universe of risks an organization faces, and
          reason about uncertainty with the right amount of humility. The maths shows up only where it earns its place.
        </p>
        <p className="measure">
          You work the whole way through on <strong>one organization of your choice</strong>. Every lesson produces a
          real artifact for it — a charter, a register, an appetite statement, quantified analyses, a board dashboard —
          and they accumulate into a complete risk operating model. The final lesson simply assembles it.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontFamily: 'var(--sans)' }}>
          <button className="btn primary" onClick={() => navigate(`#/lesson/${org ? (firstUnfinished?.id || '1.0') : '1.0'}`)}>
            {org ? 'Continue' : 'Start with orientation'}
          </button>
        </div>
      </div>

      <div className="cardgrid">
        {PARTS.map(part => (
          <div key={part.id} className="pcard" onClick={() => navigate(`#/lesson/${part.lessons[0].id}`)}>
            <div className="pn">{part.n}</div>
            <div className="pt">{part.title}</div>
            <div className="pd">{part.blurb}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
