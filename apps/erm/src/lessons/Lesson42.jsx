import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { MonteCarlo } from '../tools/MonteCarlo.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';
import { lognormal } from '../tools/statlib.js';
import { fmt } from '../tools/riskmath.js';

const lesson = getLesson('4.2');
const readings = [
  { kind: 'FREE', title: 'MIT OCW 6.041 — Probabilistic Systems Analysis', note: 'Free, excellent grounding in probability and simulation.' },
  { kind: 'FREE', title: 'Khan Academy — random variables & distributions', note: 'Intuition for the distributions Monte Carlo samples from.' },
  { kind: 'BOOK', title: 'How to Measure Anything', note: 'Hubbard — Monte Carlo for ordinary decisions, with free companion spreadsheets.' },
];
const retrieval = [
  { q: 'Monte Carlo simulation works by…', options: [
    { text: 'sampling many random scenarios and building up the distribution of outcomes.', correct: true },
    { text: 'solving an exact equation for the answer.' },
    { text: 'taking the average of the inputs.' }] },
  { q: 'A Monte Carlo result is only as good as…', options: [
    { text: 'the input distributions and assumptions you feed it.', correct: true },
    { text: 'the number of decimal places shown.' },
    { text: 'the speed of the computer.' }] },
];

export default function Lesson42() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Most real risks are too tangled to solve with a formula — but you can always <em>simulate</em> them. Monte Carlo is the workhorse that powers almost everything left in this part.</Lead>
      <p className="measure">The idea is almost embarrassingly simple. You can’t compute the exact distribution of next year’s total losses by hand — too many risks, each uncertain, interacting. So you don’t. Instead you play out one random year: for each risk, roll the dice on whether it happens and how big it is, and add up the damage. Then you do that ten thousand times. The pile of simulated years <em>is</em> your loss distribution — and from it you can read the average year, the bad year, the catastrophic year, straight off. No calculus required, just a fast machine and honest inputs.</p>

      <Objectives items={[
        'Explain how Monte Carlo turns uncertain inputs into a distribution of outcomes.',
        'Read a simulated distribution: average, tail, worst case.',
        'See why the inputs, not the simulation, are where the truth lives.',
        'Simulate your own register’s annual loss (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Play the year ten thousand times" />
      <p className="measure">What makes simulation so useful for risk is that it handles the things formulas choke on: rare events, lopsided distributions, risks that interact. And it produces not a single number but a whole shape — which is the honest form of a risk answer. “Expected loss is €1.2m” tells a board very little; “the average year is €1.2m, but one year in twenty tops €6m, and the worst we simulated was €14m” tells them what they actually need to plan for. The shape is the message.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="The engine — and its blind spot" />
      <p className="measure">The simulation below takes your register, treats each risk as a coin-flip on occurrence and a spread on severity, and builds your annual loss distribution. Watch the mean land close to the simple sum of expected losses — reassuring — and then watch the tail stretch far beyond it. That tail is the entire reason to simulate. But hold the warning close: Monte Carlo is a magnificent amplifier of your assumptions, no more. Feed it guessed probabilities and a made-up spread and it returns beautifully rendered fiction. The honesty is in the inputs; the simulation just makes their consequences visible.</p>
      <Pull>Monte Carlo doesn’t create knowledge. It reveals the full consequences of what you already assumed — flattering and damning in equal measure.</Pull>

      <MathBlock>
        <p>Monte Carlo rests on the <em>law of large numbers</em>: the average of independent samples converges to the true expectation. Its error shrinks like <span className="eq">σ / √N</span> — so to <em>halve</em> the error you need <em>four times</em> the runs. That square-root is why a few thousand iterations are cheap but extreme precision is dear.</p>
        <p>To sample, you turn uniform randoms into the shape you want. <em>Box–Muller</em> makes a standard normal from two uniforms <span className="eq">U₁, U₂</span>:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">Z = √(−2 ln U₁) · cos(2π U₂)</span></p>
        <p>A <em>lognormal</em> severity is then <span className="eq">median · e^(σ·Z)</span>. Its median is <span className="eq">median</span>, but its <em>mean</em> is <span className="eq">median · e^(σ²/2)</span> — higher, because the distribution is right-skewed. That gap is why your simulated average lands above the naïve “probability × median” sum, and it’s a feature of the tail, not a bug in your code.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Build the simulation engine" />
      <p className="measure">This is the centrepiece of the whole quantitative part: the loop that plays one random year. Write it yourself. For each risk, decide whether it happens, and if it does, draw a random severity. The tool below is just this function, run ten thousand times — so once you’ve built it, you’ve built the engine the next three lessons run on.</p>

      <CodeExercise
        id="4.2-mc"
        title="Write one simulated year"
        prompt="For each risk, it occurs with probability p%. When it occurs, add a random severity drawn from lognormal(i, 0.5). Return the year’s total loss."
        entry="simulateYear"
        helpers={{ lognormal }}
        starter={`// risks: array of { p, i }   (p percent chance; i euro impact)
// helper available:  lognormal(median, sigma)  ->  a random severity
function simulateYear(risks) {
  let total = 0;
  // TODO: for each risk, with probability p% it occurs;
  //       if it does, add lognormal(i, 0.5) to total
  return total;
}`}
        solution={`function simulateYear(risks) {
  let total = 0;
  for (const r of risks) {
    if (Math.random() < r.p / 100) {
      total += lognormal(r.i, 0.5);
    }
  }
  return total;
}`}
        fmtX={fmt}
        test={(fn) => {
          const sample = [{ p: 10, i: 5000000 }, { p: 70, i: 400000 }, { p: 35, i: 600000 }];
          const N = 8000, vals = new Array(N);
          for (let n = 0; n < N; n++) vals[n] = fn(sample);
          const mean = vals.reduce((s, x) => s + x, 0) / N;
          const elMean = 990000 * Math.exp(0.125);
          const ok = mean > elMean * 0.8 && mean < elMean * 1.25 && Math.max(...vals) > mean * 1.5 && vals.some(v => v === 0);
          return ok
            ? { pass: true, summary: `Looks right — average simulated year ${fmt(mean)}, with zero-loss years and a long right tail (worst ${fmt(Math.max(...vals))}).`, values: vals }
            : { pass: false, summary: `Average came out ${fmt(mean)}. Each risk should fire with chance p% (Math.random() < r.p/100); when it fires add lognormal(r.i, 0.5).`, values: vals };
        }}
      />

      <p className="measure">Now run the production version on your own register, change the severity spread, and watch the tail breathe. This engine returns in the next three lessons. Saved into Artifact A11.</p>
      <MonteCarlo lessonId="4.2" artifactId="A11-montecarlo" />

      <ProblemSet items={[
        { q: 'Your Monte Carlo error is too large. Why does quadrupling the number of iterations only roughly halve it?', solution: 'The Monte Carlo standard error scales as σ/√N. Halving it requires √N to double, i.e. N to quadruple. Precision is expensive — diminishing returns set in fast.' },
        { q: 'Your simulated average comes out about 13% above the sum of probability × impact. Bug or feature?', solution: 'Feature. Severities are lognormal(median = i, σ = 0.5), whose mean is i·e^(σ²/2) = i·e^0.125 ≈ 1.13·i — higher than the median i, because the lognormal is right-skewed. The extra 13% is the tail showing up in the average.' },
      ]} />
    </LessonShell>
  );
}
