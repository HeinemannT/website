import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { TaxonomyBuilder } from '../tools/TaxonomyBuilder.jsx';

const lesson = getLesson('3.0');
const readings = [
  { kind: 'FREE', title: 'NC State ERM Initiative — risk categories & taxonomies', note: 'Why a shared taxonomy matters and how to build one.' },
  { kind: 'FREE', title: 'Open Risk Manual — risk taxonomy', note: 'A free, structured reference taxonomy to borrow from.' },
  { kind: 'BOOK', title: 'Enterprise Risk Management', note: 'James Lam — on classifying and organising the risk universe.' },
];
const retrieval = [
  { q: 'The main payoff of a shared taxonomy is…', options: [
    { text: 'a common language that lets you compare and aggregate risk across the whole organization.', correct: true },
    { text: 'making the register longer.' },
    { text: 'satisfying auditors and nothing more.' }] },
  { q: 'An empty category in your taxonomy often signals…', options: [
    { text: 'a blind spot — risks of that kind that nobody has surfaced.', correct: true },
    { text: 'that the category should be deleted immediately.' },
    { text: 'a perfectly managed area.' }] },
];

export default function Lesson30() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>A risk taxonomy looks like bureaucratic tidying — until you notice the box that’s empty, and realise nobody has been looking there at all.</Lead>
      <p className="measure">Part 2 gave you a process for handling risks one at a time. Part 3 widens the lens to the whole universe of them — and the first move is to organise that universe into families. Not because filing is satisfying, but because you can’t compare or add up risks you describe in a dozen different private vocabularies. When operations calls something a “disruption,” finance calls it an “exposure,” and IT calls it an “incident,” the same risk hides in three places and adds up to nothing. A shared taxonomy is the common language that makes an enterprise view possible.</p>

      <Objectives items={[
        'Explain why a shared risk taxonomy is the precondition for an enterprise view.',
        'Use the standard families as a checklist against omission.',
        'Read the distribution of your register to find blind spots.',
        'Set a taxonomy for your organization (Artifact A9).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Families, and the empty boxes" />
      <p className="measure">Most taxonomies share a familiar top level: strategic, financial, operational, compliance and conduct, technology and cyber, reputational. The exact list matters less than having one everyone uses. Its quiet superpower is omission-spotting: a taxonomy is a set of boxes, and the empty ones ask an uncomfortable question. No strategic risks on a register usually doesn’t mean the strategy is safe — it means nobody senior enough was in the room. The families that follow in this part walk you through each box in turn, so none stays empty by accident.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Counting, as coverage" />
      <p className="measure">There’s no real maths here, just counting — but the counts tell a story. A register that’s 90% operational and 10% everything-else isn’t a portrait of the business; it’s a portrait of who filled it in. The distribution is a coverage check, not a calculation: it shows where attention has pooled and where it hasn’t reached.</p>
      <Pull>A taxonomy’s most valuable output isn’t the risks it lists. It’s the boxes it leaves visibly empty.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Set your taxonomy" />
      <p className="measure">See how your register spreads across the families, adjust the families to fit your organization, and note the empty boxes to fill as you work through the rest of Part 3. Saved as Artifact A9.</p>
      <TaxonomyBuilder lessonId="3.0" artifactId="A9-taxonomy" />
    </LessonShell>
  );
}
