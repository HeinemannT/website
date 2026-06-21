import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.7');
const readings = [
  { kind: 'FREE', title: 'Federal Reserve SR 11-7 — Guidance on Model Risk Management', note: 'The canonical text: development, validation, governance, and “effective challenge”.' },
  { kind: 'FREE', title: 'SR 26-2 (2026) — updated model risk guidance', note: 'Supersedes SR 11-7: more principles-based, a narrower definition of “model”, and generative/agentic AI explicitly out of scope.' },
  { kind: 'BOOK', title: 'Risk Management and Financial Institutions', note: 'John Hull — model risk in context.' },
];
const retrieval = [
  { q: 'Model risk is the risk that…', options: [
    { text: 'a model is wrong or is used wrongly, leading to bad decisions.', correct: true },
    { text: 'you don’t have enough models.' },
    { text: 'models are too slow to run.' }] },
  { q: '“Effective challenge” (from SR 11-7) means…', options: [
    { text: 'critical, independent review of a model by people with the skill and standing to question it.', correct: true },
    { text: 'running the model on a faster computer.' },
    { text: 'asking the model’s author to check their own work.' }] },
];

export default function Lesson37() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Every quantitative tool in Part 4 is a model — and every model can be confidently, expensively wrong. Model risk is the discipline’s built-in humility, turned into a risk family of its own.</Lead>
      <p className="measure">Model risk is the risk of loss from a model being incorrect or misused: a flawed assumption, bad data, a bug, or — most common — a sound model applied far outside the conditions it was built for. As organizations push more decisions through pricing models, credit scorecards, and now AI systems, this family has gone from a niche banking concern to something almost everyone carries. The cruel irony is that the more you quantify your other risks, the more model risk you create.</p>

      <Objectives items={[
        'Define model risk and where it comes from.',
        'Know the governing guidance — SR 11-7 and its 2026 successor SR 26-2.',
        'Add model risks to your register and plan their challenge.',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="When the map isn't the territory" />
      <p className="measure">The canonical guidance is the Federal Reserve’s <em>SR 11-7</em>, and its central idea is “effective challenge”: a model is only trustworthy if someone independent, skilled, and senior enough has genuinely tried to break it. Models need lifecycle governance — careful development, independent validation, ongoing monitoring, and clear ownership. The guidance has now moved on: <em>SR 26-2</em> (2026) supersedes SR 11-7, taking a more principles-based stance, narrowing what formally counts as a “model,” and — notably — placing generative and agentic AI explicitly out of its scope, leaving that to other guidance. The professional point is to know both: SR 11-7 as the foundational thinking everyone still references, and SR 26-2 as the current state.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Quantifying the error in your quants" />
      <p className="measure">You manage model risk with the model’s own medicine: validation, backtesting (does it predict what actually happens?), and benchmarking (does it agree with an independent model?). But the deepest defence isn’t a technique — it’s the habit of asking what the model assumes and when those assumptions stop holding. A value-at-risk model calibrated on calm markets will fail in a crash not because the maths is wrong but because the world stopped matching the inputs. That insight is the bridge into Part 4: you’re about to build powerful models, and this family is the standing reminder to distrust them in exactly the right amount.</p>
      <Pull>The most dangerous model isn’t the one that’s obviously broken. It’s the one that’s been right for years — right up until the world changes underneath it.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Add your model risks" />
      <p className="measure">Which decisions does your organization push through models — pricing, credit, forecasting, AI? Add the model risks, and note who provides the independent challenge. This family carries straight into Part 4, where you’ll build models worth being humble about.</p>
      <FamilyLens lessonId="3.7" artifactId="A10-model" family="Model risk" ownerHint="model owners / independent validation"
        sizing="Validation, backtesting, and benchmarking test whether a model works — but the real control is naming each model's assumptions and the conditions under which they break." />
    </LessonShell>
  );
}
