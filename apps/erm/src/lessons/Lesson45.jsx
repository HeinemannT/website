import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { StressSandbox } from '../tools/StressSandbox.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';

const lesson = getLesson('4.5');
const readings = [
  { kind: 'FREE', title: 'Federal Reserve — supervisory stress test scenarios & DFAST', note: 'Real, current stress scenarios used on the largest banks.' },
  { kind: 'FREE', title: 'EBA guidelines on institutions’ stress testing (reverse stress)', note: 'The supervisory take on stress and reverse-stress testing.' },
  { kind: 'BOOK', title: 'Risk Management and Financial Institutions', note: 'John Hull — scenario analysis and stress testing.' },
];
const retrieval = [
  { q: 'Stress testing differs from VaR/Monte Carlo because it…', options: [
    { text: 'asks “what if this specific severe scenario happens?” rather than relying on the distribution of the past.', correct: true },
    { text: 'is always more accurate.' },
    { text: 'needs no assumptions.' }] },
  { q: 'Reverse stress testing starts from…', options: [
    { text: 'the failure, and works backward to what scenario would cause it.', correct: true },
    { text: 'a mild scenario and works up.' },
    { text: 'the expected loss.' }] },
];

export default function Lesson45() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Every model so far leans on the past. Stress testing is how you prepare for the futures the past never showed you — and reverse stress testing is how you find your own breaking point before the world does.</Lead>
      <p className="measure">Monte Carlo and VaR learn from history: they sample from distributions calibrated on what has happened. But the losses that kill organizations are often the ones with no precedent — the scenario the data never contained. Stress testing fills that gap by abandoning probability for a while and asking a direct question: “suppose <em>this</em> happens — revenue down a fifth, a key market frozen, a major customer gone — do we survive?” You don’t ask how likely. You ask how it would feel, and whether you’d still be standing.</p>

      <Objectives items={[
        'Explain why stress testing complements distribution-based methods.',
        'Run a multi-factor stress scenario against a capital buffer.',
        'Use reverse stress testing to find the scenario that breaks you.',
        'Stress-test your organization and find its breaking point (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Imagining the unprecedented" />
      <p className="measure">Regulators lean hard on stress testing precisely because they distrust models calibrated on calm times. A good stress scenario is severe but coherent — a story the board can picture, with several things going wrong together the way they actually do in a crisis. The point isn’t to predict; it’s to find the soft spots while there’s still time to reinforce them. And the most powerful version turns the question around. Instead of “if this scenario, what loss?”, <em>reverse</em> stress testing asks “what scenario would wipe us out?” — and then makes you stare at how plausible that scenario really is.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="From scenario to breaking point" />
      <p className="measure">The sandbox below is deliberately simple arithmetic: each stress factor knocks a chunk off your capital, and you watch whether the buffer holds. Then it solves the reverse problem — by how much would you have to scale the whole scenario to bring capital to zero? If the answer is “only a bit worse than what I just drew,” that’s a finding no average could give you. The maths here is trivial on purpose; the value is entirely in the conversation it forces about whether the breaking scenario is really beyond imagining. Stress testing’s limit is the same as its strength: it only tests the scenarios you’re wise or worried enough to imagine.</p>
      <Pull>A model tells you what the past implies. A stress test tells you what you’re afraid of. You need both — and the things you forgot to fear are the ones that get you.</Pull>

      <MathBlock>
        <p>A stress test is <em>conditional</em>: it asks for the loss <span className="eq">given</span> a specified scenario, <span className="eq">E[L | scenario]</span>, rather than drawing from a historical distribution. That’s its strength — it needs no probability for the scenario — and its weakness — it tells you nothing about how <em>likely</em> the scenario is.</p>
        <p>Reverse stress testing inverts the question. Fix the outcome at failure (capital = 0) and solve for the scenario. In the simple linear case where each factor’s loss is <span className="eq">shockᵢ · sensᵢ</span> and you scale the whole scenario by a multiple <span className="eq">m</span>, failure occurs when <span className="eq">base = m · Σ(shockᵢ · sensᵢ)</span>, giving the <em>breaking multiple</em> <span className="eq">m* = base / Σ(shockᵢ · sensᵢ)</span>. A small <span className="eq">m*</span> means a scenario barely worse than the one you drew would ruin you.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Build the reverse-stress solver" />
      <p className="measure">The sandbox below solves for your breaking point. Build that solver: given a capital buffer and a set of stress factors, return the multiple of the whole scenario that drives capital to zero.</p>

      <CodeExercise
        id="4.5-rev"
        title="Write the reverse-stress solver"
        prompt="Each factor’s hit is shock × sens. Return the multiple of the whole scenario that brings capital to zero: base ÷ (total hit). If there’s no hit, the multiple is Infinity."
        entry="breakingMultiple"
        starter={`// base: capital buffer (€)
// factors: array of { shock, sens }   — each factor's loss is shock * sens
function breakingMultiple(base, factors) {
  // TODO: total = sum of shock*sens; return base / total (or Infinity if total is 0)
  return 0;
}`}
        solution={`function breakingMultiple(base, factors) {
  const total = factors.reduce((s, f) => s + f.shock * f.sens, 0);
  return total > 0 ? base / total : Infinity;
}`}
        test={(fn) => {
          const m = fn(1000000, [{ shock: 10, sens: 50000 }, { shock: 5, sens: 20000 }]);
          const inf = fn(1000000, [{ shock: 0, sens: 0 }]);
          return (Math.abs(m - 1000000 / 600000) < 1e-6 && inf === Infinity)
            ? { pass: true, summary: `Correct — this scenario (€600k hit) breaks €1m of capital at ×${m.toFixed(2)}; a zero scenario returns Infinity.` }
            : { pass: false, summary: `Got ${m && m.toFixed ? m.toFixed(3) : m} (expected ${(1000000 / 600000).toFixed(3)}). Sum shock·sens, then divide base by it; guard the zero case with Infinity.` };
        }}
      />

      <p className="measure">Now use the sandbox: set a buffer, dial in a severe-but-coherent scenario, and read the reverse-stress multiple that takes you to zero. Then ask, honestly, whether a scenario that severe is really beyond imagining. Saved into Artifact A11.</p>
      <StressSandbox lessonId="4.5" artifactId="A11-stress" />

      <ProblemSet items={[
        { q: 'A bank passes its stress test, but its reverse-stress breaking multiple is 1.2×. Should it be reassured?', solution: 'No. A scenario only 20% worse than the one tested would wipe out its capital — that’s fragile, and there’s rarely any guarantee the tested scenario is the worst plausible one. A small breaking multiple is a warning, not a clean pass.' },
        { q: 'Why can’t stress testing replace probabilistic models like Monte Carlo?', solution: 'Stress tests don’t assign likelihoods and only cover scenarios you imagined. Probabilistic models give a distribution over many outcomes but lean on historical calibration. Each covers the other’s blind spot, so a mature function runs both.' },
      ]} />
    </LessonShell>
  );
}
