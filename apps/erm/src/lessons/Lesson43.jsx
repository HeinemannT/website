import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { LossDistribution } from '../tools/LossDistribution.jsx';

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

      <Stage n={3} kicker="Build it on your organization" title="Size a capital buffer" />
      <p className="measure">Pick a loss type your organization faces, set its frequency and severity, and read off the expected loss and the capital you’d hold at your chosen survival percentile. Saved into Artifact A11.</p>
      <LossDistribution lessonId="4.3" artifactId="A11-loss" />
    </LessonShell>
  );
}
