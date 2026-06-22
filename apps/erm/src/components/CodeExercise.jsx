import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { Histogram } from '../tools/Histogram.jsx';

/* Live "build the model" exercise. The learner edits JS, we compile it, inject
   any helper functions, extract the named entry function, and run a test harness
   that returns a pass flag, a summary, and (optionally) values to plot.
   Editor uses local state; we persist to the store on blur and on run, so typing
   never re-renders the whole lesson. */
export function CodeExercise({ id, title = 'Build it in JavaScript', prompt, entry, helpers = {}, starter, solution, test, fmtX }) {
  const { getData, setData } = useStore();
  const [code, setCode] = useState(() => getData(`code:${id}`, starter));
  const [result, setResult] = useState(null);
  const [showSol, setShowSol] = useState(false);

  const persist = (v) => setData(`code:${id}`, v);

  const run = () => {
    persist(code);
    try {
      const inject = Object.keys(helpers).length ? `const { ${Object.keys(helpers).join(', ')} } = __helpers;\n` : '';
      const factory = new Function('__helpers', `${inject}${code}\n; return typeof ${entry} === 'function' ? ${entry} : undefined;`);
      const fn = factory(helpers);
      if (typeof fn !== 'function') { setResult({ pass: false, summary: `Define a function called ${entry}(…).` }); return; }
      setResult(test(fn));
    } catch (e) {
      setResult({ pass: false, summary: 'Error: ' + e.message });
    }
  };

  return (
    <div className="code-ex">
      <div className="bar ui"><span className="t">⌨ {title}</span><span className="tag build">build it yourself</span></div>
      <div className="body">
        {prompt && <p style={{ marginTop: 0 }}>{prompt}</p>}
        <textarea
          className="code" value={code} spellCheck={false} rows={14}
          onChange={e => setCode(e.target.value)}
          onBlur={() => persist(code)}
        />
        <div className="toolfoot ui">
          <button className="btn primary" onClick={run}>▶ Run</button>
          <button className="btn" onClick={() => { setCode(starter); persist(starter); setResult(null); }}>Reset</button>
          <button className="btn" onClick={() => setShowSol(s => !s)}>{showSol ? 'Hide' : 'Show'} solution</button>
        </div>
        {result && (
          <div className={`coderesult ${result.pass ? 'pass' : 'fail'}`}>
            {result.pass ? '✓ ' : '✗ '}{result.summary}
          </div>
        )}
        {result?.values && <div style={{ marginTop: '10px' }}><Histogram values={result.values} fmtX={fmtX} /></div>}
        {showSol && <pre className="code solution">{solution}</pre>}
      </div>
    </div>
  );
}
