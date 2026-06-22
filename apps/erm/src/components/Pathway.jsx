import React from 'react';
import { useStore } from '../store.jsx';

/* An actionable, sequenced learning pathway — not a bibliography.
   Each step is typed (watch/read/take/skim/do), timed, tiered (warm up / core /
   apply / go deeper), and checkable (persisted), so it reads like a lesson plan. */

const ICON = { watch: '▶', read: '📄', course: '🎓', book: '📕', do: '✍️', listen: '🎧' };
const VERB = { watch: 'Watch', read: 'Read', course: 'Take', book: 'Skim', do: 'Do', listen: 'Listen' };
const TIER = { warmup: 'Warm up', core: 'Core', apply: 'Apply', deeper: 'Go deeper' };

export function Pathway({ lessonId, items }) {
  const { getData, setData } = useStore();
  const done = getData(`path:${lessonId}`, {});
  const toggle = (i) => setData(`path:${lessonId}`, o => ({ ...(o || {}), [i]: !(o?.[i]) }));

  return (
    <div className="pathway ui">
      <div className="lbl">Your pathway through this topic</div>
      {items.map((it, i) => (
        <div key={i} className={`pstep ${it.tier || 'core'} ${done[i] ? 'done' : ''}`}>
          <button className="pcheck" onClick={() => toggle(i)} aria-label="mark done">{done[i] ? '✓' : ''}</button>
          <div className="picon">{ICON[it.kind] || '•'}</div>
          <div className="pbody">
            <div className="pt">
              <span className="pverb">{VERB[it.kind] || ''}</span>{' '}
              {it.href
                ? <a href={it.href} target="_blank" rel="noopener noreferrer">{it.t}</a>
                : <span>{it.t}</span>}
              {it.min ? <span className="pmin"> · {it.min} min</span> : null}
              {it.tier ? <span className="ptier">{TIER[it.tier]}</span> : null}
            </div>
            {it.src && <div className="psrc">{it.src}</div>}
            {it.why && <div className="pwhy">{it.why}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Inline "do this now" cue, dropped mid-prose at the moment a resource is relevant. */
export function DoNow({ children }) {
  return <p className="donow ui">▶&nbsp; {children}</p>;
}
