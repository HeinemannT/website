import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { StressSandbox } from '../tools/StressSandbox.jsx';

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

      <Stage n={3} kicker="Build it on your organization" title="Find your breaking point" />
      <p className="measure">Set a capital buffer, dial in a severe-but-coherent scenario, and see if you survive — then read the reverse-stress multiple that takes you to zero. Ask the uncomfortable question honestly. Saved into Artifact A11.</p>
      <StressSandbox lessonId="4.5" artifactId="A11-stress" />
    </LessonShell>
  );
}
