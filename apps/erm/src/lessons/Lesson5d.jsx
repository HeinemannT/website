import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { JudgmentAudit } from '../tools/JudgmentAudit.jsx';

const lesson = getLesson('5d');
const readings = [
  { kind: 'BOOK', title: 'Thinking, Fast and Slow', note: 'Daniel Kahneman — the definitive account of the biases that distort risk judgement.' },
  { kind: 'BOOK', title: 'The Black Swan', note: 'Nassim Taleb — on rare, high-impact events and the limits of prediction.' },
  { kind: 'FREE', title: 'Federal Reserve SR 11-7 — “effective challenge”', note: 'The discipline of independent scrutiny that keeps models honest.' },
];
const retrieval = [
  { q: 'A “black swan” is…', options: [
    { text: 'a rare, high-impact event that’s hard to predict and easy to rationalise afterwards.', correct: true },
    { text: 'a common, small loss.' },
    { text: 'a type of financial model.' }] },
  { q: 'The mature stance toward a model is to…', options: [
    { text: 'know exactly where its assumptions break and ensure someone independent challenges it.', correct: true },
    { text: 'trust its output completely.' },
    { text: 'ignore it entirely.' }] },
];

export default function Lesson5d() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>You’ve built powerful tools across this course. This lesson is about distrusting them in exactly the right amount — the humility that separates a wise risk function from a dangerous one.</Lead>
      <p className="measure">Every number you’ve produced rests on two fragile things: human judgement and a model. Human judgement is systematically biased — Kahneman showed we are overconfident, anchored, swayed by what’s vivid, and quick to converge in groups. Models are confident extrapolations from the past that fail exactly when the world changes. Put these together and you get the recurring tragedy of risk management: a precise, authoritative number that everyone trusts, right up until the moment it’s catastrophically wrong. Knowing this isn’t cynicism. It’s the final skill.</p>

      <Objectives items={[
        'Name the main cognitive biases that distort risk judgement.',
        'Explain black swans and the limits of prediction.',
        'Adopt the discipline of effective challenge for your models.',
        'Audit your judgement and model risk (Artifact A15).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Two kinds of blindness" />
      <p className="measure">The first blindness is cognitive. We are confident when we should be humble, anchored to the first number we hear, captured by the disaster we can picture and blind to the one we can’t, and uncomfortable enough with dissent that groups talk themselves into bad calls. The second is structural, and Taleb named it: the consequential events are often the ones outside all our data — the black swans — and after they happen we tell ourselves we should have seen them coming, which only deepens the trap. The defence against both is the same: deliberate, independent challenge. SR 11-7 made “effective challenge” a regulatory expectation precisely because models, left unchallenged, drift into comfortable wrongness.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Quantifying with humility" />
      <p className="measure">The deepest point of this whole part: the more confidently you quantify, the more you must distrust the result. A VaR to two decimal places invites false certainty; a Monte Carlo with a thousand neat runs hides that every run shared the same flawed assumption. The remedy isn’t less measurement — it’s measurement wrapped in challenge: state assumptions explicitly, name the conditions under which they break, run the stress tests that probe beyond the data, and pay someone independent to try to break the model. The number is a tool for thinking, never a substitute for it.</p>
      <Pull>The goal isn’t to trust the model or to dismiss it. It’s to know precisely where it stops being true — and to have someone whose job is to tell you.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Audit your judgement" />
      <p className="measure">Check which biases your organization actively guards against, and list the models you lean on, their fragile assumptions, and who provides independent challenge. This humility, written down, is the last artifact before you assemble everything. Saved as Artifact A15.</p>
      <JudgmentAudit lessonId="5d" artifactId="A15" />
    </LessonShell>
  );
}
