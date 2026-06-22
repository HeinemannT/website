import React from 'react';

/* What a strong artifact looks like — the criteria the learner self-checks against,
   anchored to the Meridian exemplar so "good" is concrete, not vague. */
export function Rubric({ title = 'How a strong version is judged', criteria, exemplar }) {
  return (
    <div className="rubric ui">
      <div className="lbl">Rubric · {title}</div>
      <ul>
        {criteria.map((c, i) => (
          <li key={i}><strong>{c.c}</strong>{c.good ? <> — {c.good}</> : null}</li>
        ))}
      </ul>
      {exemplar && <div className="exemplar"><strong>Meridian exemplar:</strong> {exemplar}</div>}
    </div>
  );
}
