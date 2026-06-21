import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.4');
const readings = [
  { kind: 'FREE', title: 'Basel — operational risk & operational resilience (BIS)', note: 'The standard definitions and the resilience principles.' },
  { kind: 'FREE', title: 'NC State ERM Initiative — operational risk & resilience', note: 'Practical framing of the family and business continuity.' },
  { kind: 'BOOK', title: 'Risk Management and Financial Institutions', note: 'John Hull — the operational risk chapters.' },
];
const retrieval = [
  { q: 'Operational risk is best defined as loss from…', options: [
    { text: 'failed or inadequate people, processes, systems, or external events.', correct: true },
    { text: 'prices moving against you.' },
    { text: 'a flawed business strategy.' }] },
  { q: 'Operational resilience asks…', options: [
    { text: 'can we keep delivering critical services through disruption — not just prevent every incident?', correct: true },
    { text: 'what is our value-at-risk?' },
    { text: 'how much should we insure?' }] },
];

export default function Lesson34() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Operational risk is the family of a thousand cuts — and the occasional amputation. It’s everything that can go wrong in actually running the place.</Lead>
      <p className="measure">The standard definition is deliberately broad: the risk of loss from inadequate or failed people, processes, and systems, or from external events. A mis-keyed trade, a burned-out team, a failed overnight batch, a flood at the only warehouse, a supplier who goes dark — all operational. The family has a peculiar shape: a steady drizzle of small, frequent losses you can almost budget for, punctuated by rare, enormous ones that don’t show up in any average. Managing it means handling both the drizzle and the deluge.</p>

      <Objectives items={[
        'Define operational risk across people, process, systems, and external events.',
        'Distinguish operational resilience and business continuity from prevention.',
        'Add operational risks to your register.',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="From prevention to resilience" />
      <p className="measure">For years the goal was prevention — stop incidents happening. Regulators and hard experience have shifted the emphasis to <em>resilience</em>: assume disruption <em>will</em> happen, and ask whether you can keep your critical services running through it and recover fast. That reframe matters, because you cannot prevent every outage, pandemic, or cyberattack, but you can decide in advance how you’ll keep paying staff, serving customers, and shipping product when one lands. Business continuity and disaster recovery are the practical machinery of that promise. The question moves from “how do we stop this?” to “how do we take the hit and stay standing?”</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Loss data and the fat tail" />
      <p className="measure">Operational risk is sized mainly from loss data — a history of what’s gone wrong, how often, and how badly — modelled as frequency times severity. The catch is the tail: the rare catastrophic loss dominates the total but barely appears in the data, so any average badly understates the danger. That’s a job for the simulation methods in Part 4, where you can model the body and the tail separately. For now, hold the shape in mind: lots of small losses, a few ruinous ones, and an average that lies about both.</p>
      <Pull>For operational risk, the average is the least interesting number. The story is in the tail you’ve barely seen.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Add your operational risks" />
      <p className="measure">What in your day-to-day operations could fail — people, processes, systems, or the outside world — and what would keep critical services running if it did? Add them to your register.</p>
      <FamilyLens lessonId="3.4" artifactId="A10-operational" family="Operational" ownerHint="operations / COO"
        sizing="Frequency × severity from loss data — but watch the fat tail: rare events dominate the total and hide from the average. Pair with resilience: time-to-recover for critical services." />
    </LessonShell>
  );
}
