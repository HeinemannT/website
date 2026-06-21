import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { MonteCarlo } from '../tools/MonteCarlo.jsx';

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

      <Stage n={3} kicker="Build it on your organization" title="Simulate your year" />
      <p className="measure">Run thousands of simulated years for your register and read the distribution. Change the severity spread and watch the tail breathe. This engine returns in the next three lessons. Saved into Artifact A11.</p>
      <MonteCarlo lessonId="4.2" artifactId="A11-montecarlo" />
    </LessonShell>
  );
}
