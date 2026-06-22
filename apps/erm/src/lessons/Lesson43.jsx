import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { LossDistribution } from '../tools/LossDistribution.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';
import { poisson, lognormal } from '../tools/statlib.js';
import { fmt } from '../tools/riskmath.js';

const lesson = getLesson('4.3');
const readings = [
  { kind: 'FREE', title: 'Basel Framework — operational risk capital (BIS)', note: 'How regulators turn loss distributions into capital requirements.' },
  { kind: 'BOOK', title: 'Risk Management and Financial Institutions', note: 'John Hull — economic capital, loss distributions, and RAROC.' },
];
const retrieval = [
  { q: 'Expected loss vs. unexpected loss:', options: [
    { text: 'expected loss is the average you provision for; unexpected loss is the surprise above it you hold capital against.', correct: true },
    { text: 'they are the same number.' },
    { text: 'unexpected loss is always smaller than expected loss.' }] },
  { q: 'Economic capital is, in essence…', options: [
    { text: 'enough of a buffer to survive losses up to a chosen high percentile.', correct: true },
    { text: 'the company’s share price.' },
    { text: 'the expected loss times two.' }] },
];

export default function Lesson43() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Once you have a loss distribution, two numbers fall out of it that run the financial side of risk: the loss you expect, and the loss you must survive.</Lead>
      <p className="measure">A loss distribution comes from combining how <em>often</em> losses happen (frequency) with how <em>big</em> they are (severity) — exactly what the simulator built last lesson. From its shape you read two distinct quantities. The <em>expected loss</em> is the average — the cost of doing business, which you provision for like any other expense. The <em>unexpected loss</em> is the distance from that average out to a bad-case percentile — the surprise you can’t provision for, only hold <em>capital</em> against. Confusing the two is how organizations end up adequately provisioned and still insolvent after one bad year.</p>

      <Objectives items={[
        'Build a loss distribution from frequency and severity.',
        'Separate expected loss (provision) from unexpected loss (capital).',
        'Explain economic capital and risk-adjusted return in plain terms.',
        'Estimate capital for a loss type in your organization (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Provision for the average, capitalise for the surprise" />
      <p className="measure">This split is the backbone of how serious institutions think about solvency. Provisions cover the expected; capital covers the unexpected; and beyond some extreme percentile you simply accept you can’t cover everything — no one holds capital for the meteor strike. Where you draw that line (99%? 99.9%?) is a risk-appetite decision dressed in statistics, which is why this lesson belongs <em>after</em> Part 2, not before it. The maths sizes the buffer; the appetite decides how big a buffer you want.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Capital, and the price of return" />
      <p className="measure">The tool simulates a loss type and marks the expected loss and the capital line at your chosen percentile; the gap between them is the unexpected loss. Push the severity spread and watch capital outrun expected loss — fat tails are expensive. This also underpins <em>risk-adjusted return</em> (RAROC): a business line earning good profit but consuming huge capital may be worse than a duller one that ties up little. Judging return per unit of risk, not return alone, is how capital gets allocated well — but the whole edifice rests on a distribution you simulated from assumptions, so treat the capital number as a considered estimate, not a measured fact.</p>
      <Pull>Provisions are for the losses you expect. Capital is for the ones you don’t. Mistake one for the other and a single bad year ends you.</Pull>

      <MathBlock>
        <p>An aggregate loss is a <em>compound</em> random variable: <span className="eq">S = X₁ + X₂ + … + X_N</span>, where the count <span className="eq">N</span> is itself random (often Poisson with rate <span className="eq">λ</span>) and each severity <span className="eq">Xᵢ</span> is drawn from the severity distribution.</p>
        <p>Its mean follows <em>Wald’s identity</em>: <span className="eq">E[S] = E[N] · E[X]</span>. Its variance carries both sources of uncertainty: <span className="eq">Var[S] = E[N]·Var[X] + Var[N]·E[X]²</span>.</p>
        <p>Expected loss is just <span className="eq">EL = E[S]</span>. Economic capital at confidence <span className="eq">α</span> is the quantile <span className="eq">qₐ(S)</span>, and unexpected loss is the gap <span className="eq">UL = qₐ(S) − EL</span>. There’s usually no closed form for the distribution of <span className="eq">S</span> — it’s a convolution — which is precisely why you simulate it rather than solve it.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Build the aggregate-loss model" />
      <p className="measure">Build one year of a compound loss yourself: draw how many events occur, then sum their severities. Run it enough times and you have the loss distribution the lab below reads capital off.</p>

      <CodeExercise
        id="4.3-agg"
        title="Write the aggregate-loss function"
        prompt="Draw the number of events k from poisson(lambda), then add k severities, each from lognormal(median, sigma). Return the year’s total."
        entry="aggregateLoss"
        helpers={{ poisson, lognormal }}
        starter={`// helpers available:  poisson(lambda),  lognormal(median, sigma)
function aggregateLoss(lambda, median, sigma) {
  let total = 0;
  // TODO: draw k = poisson(lambda) events,
  //       then add k severities, each lognormal(median, sigma)
  return total;
}`}
        solution={`function aggregateLoss(lambda, median, sigma) {
  let total = 0;
  const k = poisson(lambda);
  for (let n = 0; n < k; n++) {
    total += lognormal(median, sigma);
  }
  return total;
}`}
        fmtX={fmt}
        test={(fn) => {
          const N = 8000, vals = new Array(N);
          for (let n = 0; n < N; n++) vals[n] = fn(3, 200000, 0.7);
          const mean = vals.reduce((s, x) => s + x, 0) / N;
          const target = 3 * 200000 * Math.exp(0.245);
          const ok = mean > target * 0.8 && mean < target * 1.25 && Math.max(...vals) > mean * 1.6 && vals.some(v => v === 0);
          return ok
            ? { pass: true, summary: `Right shape — mean aggregate ${fmt(mean)} (≈ λ·E[X]), with some loss-free years and a heavy tail (worst ${fmt(Math.max(...vals))}).`, values: vals }
            : { pass: false, summary: `Mean came out ${fmt(mean)} (expected ≈ ${fmt(target)}). Draw k = poisson(lambda), then loop k times adding lognormal(median, sigma).`, values: vals };
        }}
      />

      <p className="measure">Now use the lab on a loss type your organization faces, and read off the expected loss and the capital at your chosen survival percentile. Saved into Artifact A11.</p>
      <LossDistribution lessonId="4.3" artifactId="A11-loss" />

      <ProblemSet items={[
        { q: 'A loss type has λ = 4 events/year, each with mean severity €250k. What is the expected aggregate loss — and why doesn’t the severity’s spread change it?', solution: 'E[S] = E[N]·E[X] = 4 · 250,000 = €1,000,000. By Wald’s identity the mean depends only on the means of N and X, not their spread. The spread doesn’t touch the expected loss — but it drives the tail, and therefore the capital.' },
        { q: 'You raise the capital percentile from 99% to 99.9%. Why can the required capital jump sharply?', solution: 'You move further into a heavy (lognormal) tail, where the quantile rises steeply. A small step in confidence selects a much larger loss, so capital can climb fast — the cost of insuring against ever-rarer years grows faster than the rarity.' },
      ]} />
    </LessonShell>
  );
}
