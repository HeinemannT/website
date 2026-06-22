import React, { useState } from 'react';

/* Opt-in rigour. Default course stays at intuition level; this reveals the
   real definitions and derivations for learners who want university depth. */
export function MathBlock({ title = 'The math, properly', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`mathblock ui ${open ? 'open' : ''}`}>
      <button className="mathtoggle" onClick={() => setOpen(o => !o)}>
        <span className="tw">{open ? '▾' : '▸'}</span> {title}
        <span className="optional">optional rigour</span>
      </button>
      {open && <div className="mathbody">{children}</div>}
    </div>
  );
}

function Problem({ n, item }) {
  const [show, setShow] = useState(false);
  return (
    <div className="problem">
      <div className="q"><strong>{n}.</strong> {item.q}</div>
      <button className="btn" onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} solution</button>
      {show && <div className="sol">{item.solution}</div>}
    </div>
  );
}

export function ProblemSet({ items, title = 'Problem set' }) {
  return (
    <div className="problemset ui">
      <div className="lbl">{title}</div>
      {items.map((it, i) => <Problem key={i} n={i + 1} item={it} />)}
    </div>
  );
}
