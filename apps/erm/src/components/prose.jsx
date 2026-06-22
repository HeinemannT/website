import React from 'react';
import { glossify } from './Glossary.jsx';

/* Quiet, textbook-style building blocks. One stage marker per lens; no header clutter. */

export function Lead({ children }) {
  return <p className="lead">{glossify(children)}</p>;
}

export function Objectives({ items, title = "What you'll be able to do" }) {
  return (
    <div className="objectives ui">
      <div className="h">{title}</div>
      <ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </div>
  );
}

export function Stage({ n, kicker, title }) {
  const cls = n === 1 ? 'one' : n === 2 ? 'two' : 'three';
  return (
    <div className={`stage ${cls} ui`}>
      <span className="num">{n}</span>
      <div><span className="kicker">{kicker}</span><h2>{title}</h2></div>
    </div>
  );
}

export function Pull({ children }) {
  return <p className="pull">{children}</p>;
}

export function Readings({ items }) {
  return (
    <div className="reads">
      <div className="lbl">Anchor readings</div>
      <ul>
        {items.map((r, i) => (
          <li key={i}>
            <span className="kind">{r.kind}</span>
            {r.href
              ? <a href={r.href} target="_blank" rel="noopener noreferrer"><cite>{r.title}</cite></a>
              : <cite>{r.title}</cite>}
            {r.note ? <> — {r.note}</> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
