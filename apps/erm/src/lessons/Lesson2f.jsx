import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { TreatmentPlanner } from '../tools/TreatmentPlanner.jsx';

const lesson = getLesson('2f');
const readings = [
  { kind: 'FREE', title: 'III & IRMI — risk financing glossaries', note: 'Plain-language references on retention, transfer, and insurance.' },
  { kind: 'FREE', title: 'The Orange Book (2023) — risk response', note: 'The official treatment of response options (note: the literal “4 Ts” come from the 2004 edition).' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — the risk treatment and risk financing chapters.' },
];
const retrieval = [
  { q: 'The “4 Ts” of risk response are…', options: [
    { text: 'Tolerate, Treat, Transfer, Terminate.', correct: true },
    { text: 'Track, Test, Trim, Total.' },
    { text: 'Time, Trust, Talent, Tools.' }] },
  { q: 'Buying insurance usually costs more than the expected loss because…', options: [
    { text: 'the insurer adds a loading — you’re paying for certainty, not a bargain on the average.', correct: true },
    { text: 'insurers always overcharge illegally.' },
    { text: 'expected loss is irrelevant to pricing.' }] },
  { q: '“Terminate” removes a risk by…', options: [
    { text: 'stopping the activity — which also removes its reward.', correct: true },
    { text: 'insuring it fully.' },
    { text: 'ignoring it.' }] },
];

export default function Lesson2f() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>You cannot treat every risk, and you shouldn’t try. Treatment costs money; the skill is spending it where it buys the most safety per euro.</Lead>
      <p className="measure">Once you know a risk’s residual size and how it sits against your appetite, you have four moves — the 4 Ts. <em>Tolerate</em> it: accept the exposure because it’s within appetite and the upside is worth it. <em>Treat</em> it: add or strengthen controls to shrink it. <em>Transfer</em> it: pay someone else — usually an insurer — to carry the financial blow. Or <em>terminate</em> it: stop the activity entirely. Each trades cost against certainty differently, and choosing well is most of what a risk function does day to day.</p>

      <Objectives items={[
        'Choose between the four responses for a given risk and justify it.',
        'Understand risk financing — retention versus transfer.',
        'See why insurance, priced fairly, still costs more than the expected loss.',
        'Build a treatment plan for your register (Artifact A7).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Four moves, one judgement" />
      <p className="measure">The four responses aren’t a menu to pick from at random; they follow from appetite. A risk already inside appetite is a candidate to <em>tolerate</em> — and tolerating is a real, deliberate choice, not neglect. A risk above appetite that you can shrink cheaply, you <em>treat</em>. A risk that’s rare but potentially ruinous — the warehouse fire, the liability claim — is the classic case to <em>transfer</em>, because what you fear isn’t the average, it’s the catastrophe. And a risk whose reward no longer justifies it, you <em>terminate</em>, accepting that you lose the upside too. Most registers end up a mix of all four.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Insure or retain?" />
      <p className="measure">Here’s the one piece of arithmetic worth feeling. The expected loss of a risk is its probability times its impact. An insurer knows that number too — and charges a premium <em>above</em> it, the “loading” that covers their costs and profit. So on average, transferring a risk costs you more than keeping it. Why do it anyway? Because the average isn’t the danger. A €5m loss with a 2% chance has an expected loss of €100k, but the €5m version, if it lands, could sink you. You pay the loading to convert a small chance of ruin into a known, survivable cost. That’s the trade: certainty, bought at a price. The tool lets you put a premium against each risk’s expected loss and see the deal for what it is.</p>
      <Pull>You don’t transfer a risk to save money on average. You transfer it to buy certainty against the version that ends you.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Plan the treatments" />
      <p className="measure">Assign one of the 4 Ts to each risk in your register, and for the ones you’d transfer, weigh the premium against the expected loss. Saved as Artifact A7, this is your treatment and financing plan — the part of the operating model that actually changes what the organization does.</p>
      <TreatmentPlanner lessonId="2f" artifactId="A7" />
    </LessonShell>
  );
}
