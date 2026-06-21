import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { DecisionExplorer } from '../tools/DecisionExplorer.jsx';

const lesson = getLesson('4.1');
const readings = [
  { kind: 'FREE', title: 'MIT OpenCourseWare — decision analysis & probability', note: 'Free lectures on expected value, decision trees, and value of information.' },
  { kind: 'BOOK', title: 'How to Measure Anything', note: 'Douglas Hubbard — decisions, the value of information, and why “immeasurable” is usually wrong.' },
];
const retrieval = [
  { q: 'Expected value of an option is…', options: [
    { text: 'the probability-weighted average of its outcomes.', correct: true },
    { text: 'its best possible outcome.' },
    { text: 'its worst possible outcome.' }] },
  { q: 'Choosing a lower-EV, lower-spread option can be rational because of…', options: [
    { text: 'risk aversion — paying a little expected value to avoid a painful downside.', correct: true },
    { text: 'a calculation error.' },
    { text: 'ignoring probability.' }] },
];

export default function Lesson41() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Now the maths begins — and it begins late, on purpose. Everything in Parts 1–3 was about deciding <em>which</em> risks matter. This part is about putting numbers on the ones that will hold them.</Lead>
      <p className="measure">Start with the simplest quantitative idea in all of risk: the expected value of a decision. You face a choice, each option leads to uncertain outcomes, and each outcome has a probability and a payoff. Multiply and add, and you get the expected value — the average result if you could make this decision many times. It’s the foundation everything else builds on, and it already teaches the core move of quantitative risk: stop arguing about whether a bad thing <em>could</em> happen, and start weighing how likely against how much.</p>

      <Objectives items={[
        'Compute and compare expected values across decisions.',
        'Explain why expected value isn’t the whole story — and where risk aversion fits.',
        'See how the quality of a decision depends on the quality of the probabilities.',
        'Work a real decision for your organization (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Weighing likelihood against consequence" />
      <p className="measure">A decision tree is just this idea drawn out: branches for your choices, branches for what chance does next, probabilities and payoffs at the tips. Folding it back to a single expected value per choice turns a fog of “what ifs” into a comparison you can actually make. But expected value answers only one question — “which choice pays best on average?” — and average isn’t everything. A choice with a slightly higher EV but a catastrophic downside may be the wrong one for an organization that can’t survive the bad branch. That’s not irrational; it’s <em>risk aversion</em>, and recognising when it should override raw EV is a mark of judgement, not weakness.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Garbage in, confident garbage out" />
      <p className="measure">Here’s the catch that haunts this entire part: the expected value is only as good as the probabilities you feed it, and those usually come from human heads — the same overconfident heads you met in 2b. A precise EV computed from guessed probabilities is precision theatre. The fix isn’t to abandon the method; it’s to calibrate the inputs, state them as honest ranges, and remember that the number is an aid to judgement, not a replacement for it. Notice the explorer below recomputes instantly when you change a probability — which is exactly why a sloppy probability is dangerous: it flows straight into a confident-looking answer.</p>
      <Pull>A sharp number built on a soft probability isn’t knowledge. It’s a guess wearing a lab coat.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Work a real decision" />
      <p className="measure">Take a genuine decision your organization faces, lay out the alternatives and their outcomes, and compare expected values — then ask whether the spread changes which one you’d actually choose. Saved into Artifact A11, your quantified analyses.</p>
      <DecisionExplorer lessonId="4.1" artifactId="A11-decision" />
    </LessonShell>
  );
}
