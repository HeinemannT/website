import React, { useState } from 'react';

/* Retrieval check. Never locks — the learner can keep trying. */

function Question({ item }) {
  const [picked, setPicked] = useState(null);
  return (
    <div>
      <div className="q">{item.q}</div>
      {item.options.map((o, i) => {
        const cls = picked === i ? (o.correct ? 'right' : 'wrong') : '';
        return (
          <button key={i} className={`opt ${cls}`} onClick={() => setPicked(i)}>
            {o.text}
          </button>
        );
      })}
      <div className="fb">
        {picked == null ? '' : (item.options[picked].correct ? 'Correct.' : 'Not quite — try another.')}
      </div>
    </div>
  );
}

export function Retrieval({ items }) {
  return (
    <div className="quiz">
      <div className="lbl">Quick retrieval</div>
      <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: '8px 0 0' }}>
        A couple from this lesson, sometimes one reaching back. These don't affect your progress — they affect what you remember.
      </p>
      {items.map((it, i) => <Question key={i} item={it} />)}
    </div>
  );
}
