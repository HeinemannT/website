import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { VaRES } from '../tools/VaRES.jsx';

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

      <Stage n={3} kicker="Build it on your organization" title="Read VaR and ES" />
      <p className="measure">Set a confidence level, flip between calm and fat-tailed worlds, and watch VaR and Expected Shortfall diverge. Carry the habit into any risk report you’re handed: ask not just for the VaR, but for the shortfall beyond it. Saved into Artifact A11.</p>
      <VaRES lessonId="4.4" artifactId="A11-var" />
    </LessonShell>
  );
}
