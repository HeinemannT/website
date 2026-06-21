import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.5');
const readings = [
  { kind: 'FREE', title: 'NC State ERM Initiative — conduct, compliance & reputation', note: 'How these intertwine and where reputational risk fits.' },
  { kind: 'FREE', title: 'Regulatory commentary on reputational risk (2025–26)', note: 'On the live US debate over removing reputational risk as a standalone supervisory category.' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — conduct, compliance, and reputation.' },
];
const retrieval = [
  { q: 'Reputational risk is increasingly argued to be…', options: [
    { text: 'an amplifier of other risks rather than a standalone category — a live debate among regulators.', correct: true },
    { text: 'the only risk that matters.' },
    { text: 'identical to credit risk.' }] },
  { q: 'Conduct risk is mainly about…', options: [
    { text: 'whether the organization treats its customers and markets fairly.', correct: true },
    { text: 'whether prices move against you.' },
    { text: 'IT system failures.' }] },
];

export default function Lesson35() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>You can do everything legal and still destroy the company’s trust. This family is where rules, behaviour, and reputation meet — and where the damage is often slow, then sudden.</Lead>
      <p className="measure">Four related strands sit here. <em>Compliance risk</em>: breaking laws or regulations. <em>Conduct risk</em>: treating customers or markets unfairly, even within the rules. <em>Legal risk</em>: contracts, disputes, and litigation. And <em>reputational risk</em>: the erosion of the trust that lets you operate at all. They’re bundled because they feed each other — a conduct failure becomes a compliance breach, becomes a lawsuit, becomes a reputational collapse — and because the reputational hit is usually far larger than the fine that triggered it.</p>

      <Objectives items={[
        'Distinguish compliance, conduct, legal, and reputational risk.',
        'Engage with the live debate over reputational risk as category vs. amplifier.',
        'Add conduct and compliance risks to your register.',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Rules, behaviour, and trust" />
      <p className="measure">There’s a genuine, current debate worth knowing. Through 2025 and into 2026, US regulators moved to stop treating <em>reputational risk</em> as a standalone supervisory category, with proposals to codify its removal — the argument being that reputation isn’t a separate risk you manage directly, but the <em>consequence</em> of other risks (conduct, compliance, operational) playing out in public. Whether you call it a category or an amplifier, the practical lesson is the same: you protect your reputation by managing the things that damage it, not by managing “reputation” as an abstraction. Conduct and compliance are where the real levers are.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Mostly unmeasurable, and honest about it" />
      <p className="measure">Fines and redress can be estimated; the reputational fallout mostly can’t. There’s no credible value-at-risk for lost trust, and pretending otherwise is its own risk. This family is handled largely through judgement, culture, and control — the qualitative discipline of Parts 1 and 2 — with measurement confined to the parts that genuinely support it, like historic fines or complaint volumes used as leading indicators.</p>
      <Pull>You don’t manage reputation directly. You manage the conduct, compliance, and operational failures that spend it — and the trust takes care of itself.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Add your conduct & compliance risks" />
      <p className="measure">Where could your organization break the rules, treat customers unfairly, or face litigation — and how would trust take the hit? Add these to your register.</p>
      <FamilyLens lessonId="3.5" artifactId="A10-conduct" family="Compliance & conduct" ownerHint="compliance / legal"
        sizing="Fines and redress can be estimated; reputational fallout largely can't. Lean on judgement and leading indicators (complaints, breaches) rather than a false point estimate." />
    </LessonShell>
  );
}
