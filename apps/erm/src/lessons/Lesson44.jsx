import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { VaRES } from '../tools/VaRES.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';

const lesson = getLesson('4.4');
const readings = [
  { kind: 'FREE', title: 'Basel — minimum capital for market risk (FRTB), BIS d457', note: 'The authoritative move from VaR to Expected Shortfall; read the short “in brief”.' },
  { kind: 'BOOK', title: 'Risk Management and Financial Institutions', note: 'John Hull — VaR, Expected Shortfall, and credit measures, explained clearly.' },
];
const retrieval = [
  { q: 'Value-at-Risk tells you…', options: [
    { text: 'a loss threshold you won’t exceed at a given confidence — but nothing about how bad it gets beyond it.', correct: true },
    { text: 'the worst possible loss.' },
    { text: 'the average loss.' }] },
  { q: 'Expected Shortfall improves on VaR by…', options: [
    { text: 'averaging the losses beyond VaR — capturing the tail VaR ignores.', correct: true },
    { text: 'being a smaller, friendlier number.' },
    { text: 'ignoring probability.' }] },
  { q: 'VaR is most dangerous when…', options: [
    { text: 'tails are fat — the rare losses beyond VaR are far worse than VaR suggests.', correct: true },
    { text: 'markets are calm.' },
    { text: 'confidence is set low.' }] },
];

export default function Lesson44() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Value-at-Risk is the most famous number in risk management — and the most dangerous, because it sounds like it tells you the worst case, and it doesn’t.</Lead>
      <p className="measure">VaR answers a precise, limited question: “at the 99% level, we won’t lose more than this on a given day.” Useful — until you read it as “this is the most we can lose,” which is exactly what it isn’t. VaR is a line in the sand; it says nothing about how far the water rises once you’re past it. In 2008, institutions with comfortable VaR numbers discovered the losses beyond the line were many times larger than the line itself. The fix has a name — <em>Expected Shortfall</em> — and learning the difference is one of the most valuable hours in this course.</p>

      <Objectives items={[
        'State exactly what VaR does and does not tell you.',
        'Define Expected Shortfall and why it captures tail risk.',
        'See why fat tails make VaR treacherous — and why regulators switched to ES.',
        'Read VaR and ES off your own simulated distribution (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="A line in the sand vs. the flood beyond it" />
      <p className="measure">The trouble with VaR isn’t the maths; it’s the false comfort. A single threshold invites everyone to manage <em>to</em> the threshold and forget the territory past it — and risk lives in that territory. Expected Shortfall asks the better question: “if we do breach the line, how bad on average?” It’s the average of all the losses in the tail, so it can’t be gamed by stacking risk just beyond the VaR point. That’s why the Basel framework shifted market-risk capital from VaR to Expected Shortfall: same family of idea, but one of them refuses to ignore the tail.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Watch the tail VaR hides" />
      <p className="measure">In the lab below, VaR and ES sit close together when outcomes are mild and normal. Then tick “fat tails” — the world of real crises — and watch ES leap above VaR while VaR barely flinches. That gap is precisely the danger VaR conceals: when losses are heavy-tailed, the rare disaster beyond the line dwarfs the line. The lesson isn’t “VaR is useless”; it’s “VaR is a threshold, not a worst case, and in the conditions you most fear it is least informative.” Read both numbers, and trust the one that looks at the tail.</p>
      <Pull>VaR tells you where the floor is. Expected Shortfall tells you how far you fall through it. In a crisis, only the second number matters.</Pull>

      <MathBlock>
        <p>Value-at-Risk is a <em>quantile</em> of the loss distribution: <span className="eq">VaRₐ(L) = inf&#123; l : P(L ≤ l) ≥ α &#125;</span> — the loss you won’t exceed with probability α. Its flaw is formal: VaR is <em>not subadditive</em>, so <span className="eq">VaR(A+B)</span> can exceed <span className="eq">VaR(A) + VaR(B)</span>, making diversification look like it <em>adds</em> risk. A coherent risk measure shouldn’t do that.</p>
        <p>Expected Shortfall (a.k.a. CVaR) is the average loss <em>given</em> you’re past VaR: <span className="eq">ESₐ(L) = E[ L | L ≥ VaRₐ ]</span> = <span className="eq">(1/(1−α)) ∫ from α to 1 of VaR_u du</span>. It is coherent — in particular subadditive — and it looks <em>into</em> the tail rather than stopping at its edge. That coherence, plus tail-sensitivity, is exactly why the Basel market-risk framework replaced VaR with ES.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Compute VaR and ES yourself" />
      <p className="measure">The lab below marks VaR and ES on a distribution. Build the calculation first: from a list of losses and a confidence level, find the VaR quantile and average the tail beyond it. Watching ES emerge as “the mean of everything past the line” is the whole intuition in one function.</p>

      <CodeExercise
        id="4.4-var"
        title="Write VaR and Expected Shortfall"
        prompt="Sort the losses ascending. Take the value at index floor(conf · n) as VaR. Expected Shortfall is the mean of all losses from that index upward. Return { var, es }."
        entry="varAndES"
        starter={`// losses: array of loss amounts;  conf: e.g. 0.99
function varAndES(losses, conf) {
  const sorted = [...losses].sort((a, b) => a - b);
  // TODO: idx = floor(conf * sorted.length)
  //       VaR = sorted[idx];  ES = mean of sorted[idx .. end]
  return { var: 0, es: 0 };
}`}
        solution={`function varAndES(losses, conf) {
  const sorted = [...losses].sort((a, b) => a - b);
  const idx = Math.floor(conf * sorted.length);
  const v = sorted[idx];
  const tail = sorted.slice(idx);
  const es = tail.reduce((s, x) => s + x, 0) / tail.length;
  return { var: v, es };
}`}
        test={(fn) => {
          const losses = Array.from({ length: 100 }, (_, i) => i + 1);
          const r = fn(losses, 0.95) || {};
          return (Math.abs(r.var - 96) < 1e-9 && Math.abs(r.es - 98) < 1e-9)
            ? { pass: true, summary: `Correct — for losses 1…100 at 95%, VaR = ${r.var} and ES = ${r.es}. ES sits above VaR because it averages the whole tail.` }
            : { pass: false, summary: `Got VaR ${r.var}, ES ${r.es} (expected 96 and 98). Sort ascending, VaR = sorted[floor(0.95·100)], ES = mean from there up.` };
        }}
      />

      <p className="measure">Now flip between calm and fat-tailed worlds in the lab and watch VaR and ES diverge. Carry the habit into any risk report: ask not just for the VaR, but for the shortfall beyond it. Saved into Artifact A11.</p>
      <VaRES lessonId="4.4" artifactId="A11-var" />

      <ProblemSet items={[
        { q: 'Give an intuitive reason VaR can violate subadditivity.', solution: 'Take two bonds, each with a small, independent chance of a large default loss. Individually, the loss event sits just beyond the 99% point, so each has a modest VaR. Combined, the chance that at least one defaults pushes a large loss inside the 99% window, so VaR(A+B) can exceed VaR(A)+VaR(B) — diversification appears to raise risk, which a coherent measure (ES) never does.' },
        { q: 'Two portfolios have identical 99% VaR. How can one be far riskier?', solution: 'VaR says nothing beyond its threshold. One portfolio’s losses past the 99% point might be modestly larger; the other’s might be catastrophic. Expected Shortfall, by averaging the tail, separates them — VaR cannot.' },
      ]} />
    </LessonShell>
  );
}
