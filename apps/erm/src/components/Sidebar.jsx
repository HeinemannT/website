import React from 'react';
import { PARTS, FLAT } from '../curriculum.js';
import { navigate } from '../router.js';
import { useStore } from '../store.jsx';
import { hasLesson } from '../lessons/index.js';

export function Sidebar({ activeId }) {
  const { isComplete, org } = useStore();
  const done = FLAT.filter(l => isComplete(l.id)).length;
  const total = FLAT.length;
  const pct = Math.round((done / total) * 100);

  return (
    <aside className="side ui">
      <div className="brand" onClick={() => navigate('#/')}>
        Enterprise Risk Management
        <small>{org ? org.name : 'A self-paced course'}</small>
      </div>

      <div className="progresswrap">
        <div className="pbar"><i style={{ width: `${Math.max(pct, 2)}%` }} /></div>
        <div className="ptext"><span>Your operating model</span><span>{pct}% · {done}/{total}</span></div>
      </div>

      <ul className="toc">
        {PARTS.map(part => (
          <React.Fragment key={part.id}>
            <li className="part">{part.n} · {part.title}</li>
            {part.lessons.map(l => {
              const complete = isComplete(l.id);
              const built = hasLesson(l.id);
              const cls = ['lesson', complete ? 'done' : '', l.id === activeId ? 'active' : '', built ? '' : 'locked'].join(' ').trim();
              return (
                <li key={l.id} className={cls} onClick={() => navigate(`#/lesson/${l.id}`)}>
                  <span className="dot">{complete ? '✓' : ''}</span>
                  <span>{l.id} · {l.title}</span>
                </li>
              );
            })}
          </React.Fragment>
        ))}
      </ul>
    </aside>
  );
}
