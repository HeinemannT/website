import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { FrameworkSelector } from '../tools/FrameworkSelector.jsx';

const lesson = getLesson('1.3');

const readings = [
  { kind: 'FREE', title: 'COSO ERM 2017 — Executive Summary', note: 'The free official summary: five components, twenty principles, risk tied to strategy and performance.' },
  { kind: 'FREE', title: 'IRM guide to ISO 31000:2018', note: 'A free walk-through of the principles–framework–process structure.' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — the chapters comparing the major frameworks and standards.' },
];

const retrieval = [
  {
    q: 'ISO 31000 and COSO ERM are best understood as…',
    options: [
      { text: 'complementary — ISO gives a universal process and principles, COSO ties risk to strategy and performance.', correct: true },
      { text: 'competing standards, one of which you must reject.' },
      { text: 'two names for exactly the same document.' },
    ],
  },
  {
    q: 'A key thing to know about ISO 31000 is that it is…',
    options: [
      { text: 'a principles-based guidance standard you can’t be certified against — designed to be adapted, not audited.', correct: true },
      { text: 'a strict checklist you must pass to operate.' },
      { text: 'only for financial institutions.' },
    ],
  },
  {
    q: 'COSO ERM (2017) is distinctive because it frames risk around…',
    options: [
      { text: 'strategy and performance — risk in the service of creating and preserving value.', correct: true },
      { text: 'cybersecurity controls specifically.' },
      { text: 'insurance purchasing.' },
    ],
  },
];

export default function Lesson13() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Two big frameworks dominate the field, and newcomers waste a lot of energy asking which one is “right.” They’re asking the wrong question.</Lead>

      <p className="measure">ISO 31000 and COSO ERM aren’t rivals; they’re two views of the same work. ISO 31000 gives you a clean, universal <em>process</em> — establish the context, assess the risk, treat it, monitor, report — wrapped in a set of principles and a framework for embedding it. It’s deliberately generic: it fits a hospital, a startup, or a government department, and you can’t be certified against it, because it’s meant to be adapted rather than audited. COSO ERM takes a different angle. It frames risk around <em>strategy and performance</em> — risk in the service of creating and preserving value — in the language a board already speaks, which is why US-listed companies reach for it. Use ISO to run the machine and COSO to connect it to the boardroom, and you’ve lost nothing.</p>

      <Objectives items={[
        'Describe the structure of ISO 31000 (principles, framework, process) and COSO ERM (five components, twenty principles).',
        'Explain why the two are complementary rather than competing.',
        'Map the steps of one onto the other.',
        'Choose a sensible framework emphasis for your organization (part of Artifact A1).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="What a framework is for" />
      <p className="measure">A framework does something modest but vital: it stops risk management from being ad hoc. Without one, each manager improvises — different words, different scales, different ideas of who decides — and nothing adds up across the organization. A shared framework gives everyone the same process and the same vocabulary, so a risk raised in the warehouse and a risk raised in the boardroom can sit on the same page and be compared. That’s the real value. The specific standard matters far less than the fact of having one and actually using it. The most common failure isn’t picking the “wrong” framework; it’s adopting one as a binder on a shelf that no real decision ever touches.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Nothing here — and that's deliberate" />
      <p className="measure">Frameworks are about structure and language, not numbers, so there’s no maths in this lesson. That itself is worth noticing: the scaffolding of the whole discipline — how you govern risk, who owns it, how it’s assessed and reported — is qualitative. The quantitative tools you’ll meet in Part 4 hang <em>inside</em> this scaffolding, on the “assess the risk” step. Build the structure first; bolt the measurement on later, where it fits.</p>

      <Pull>Pick a framework, yes — but the win isn’t the choice. It’s that everyone, from the warehouse to the board, finally speaks one language about risk.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Choose your emphasis" />
      <p className="measure">Answer a few questions about your organization and the selector suggests which framework to lead with and which to borrow from — then shows how the two map onto each other, so you can see they’re describing the same work. Record the choice; it sets the vocabulary your charter and the rest of the course will use.</p>

      <FrameworkSelector lessonId="1.3" artifactId="A1-framework" />
    </LessonShell>
  );
}
