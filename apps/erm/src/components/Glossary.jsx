import React from 'react';
import { GLOSSARY, GLOSSARY_TERMS, TERM_RE, lookupTerm } from '../glossary.js';
import { navigate } from '../router.js';

/* A dotted-underlined term with a hover/focus tooltip. */
export function GlossaryTerm({ term, def }) {
  return (
    <span className="gloss" tabIndex={0}>
      {term}
      <span className="gloss-tip" role="tooltip">{def}</span>
    </span>
  );
}

/* Tags whose text we never touch (interactive / code / vector). */
const SKIP_TAGS = new Set(['a', 'button', 'code', 'pre', 'textarea', 'input', 'select', 'label', 'svg']);

function wrapString(str, ctr, seen) {
  TERM_RE.lastIndex = 0;
  const out = [];
  let last = 0, m;
  while ((m = TERM_RE.exec(str)) !== null) {
    const matched = m[0];
    const key = matched.toLowerCase();
    if (seen.has(key)) continue;          // only the first use in this scope gets linked
    const def = lookupTerm(matched);
    if (!def) continue;
    seen.add(key);
    if (m.index > last) out.push(str.slice(last, m.index));
    out.push(<GlossaryTerm key={'g' + (ctr.i++)} term={matched} def={def} />);
    last = m.index + matched.length;
  }
  if (out.length === 0) return str;
  if (last < str.length) out.push(str.slice(last));
  return out;
}

function walk(children, ctr, seen) {
  return React.Children.map(children, child => {
    if (typeof child === 'string') return wrapString(child, ctr, seen);
    if (!React.isValidElement(child)) return child;
    if (typeof child.type !== 'string') return child;       // a component → leave it alone
    if (SKIP_TAGS.has(child.type)) return child;
    const kids = child.props && child.props.children;
    if (kids == null) return child;
    return React.cloneElement(child, null, walk(kids, ctr, seen));
  });
}

/* Auto-link glossary terms in a subtree of prose. `seen` scopes "first use":
   pass a shared Set to link each term once across a whole lesson. */
export function glossify(children, seen) {
  return walk(children, { i: 0 }, seen || new Set());
}

/* The full glossary, as a page. */
export function GlossaryPage() {
  const entries = GLOSSARY_TERMS
    .map(t => ({ term: t, def: GLOSSARY[t] }))
    // collapse alias duplicates that share a definition's opening
    .filter((e, i, arr) => arr.findIndex(x => x.term.toLowerCase() === e.term.toLowerCase()) === i)
    .sort((a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()));
  return (
    <main>
      <div className="eyebrow">Reference</div>
      <h1>Glossary</h1>
      <p className="lead measure">Every term the course underlines on first use, in one place. In a lesson, hover or tab to any dotted term to see this definition without leaving the page.</p>
      <dl className="glossary-list">
        {entries.map(e => (
          <div key={e.term} className="glossary-entry">
            <dt>{e.term}</dt>
            <dd>{e.def}</dd>
          </div>
        ))}
      </dl>
      <div className="navbtns ui"><a onClick={() => navigate('#/')}>← Back to the course</a><span /></div>
    </main>
  );
}
