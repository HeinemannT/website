import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { GovernanceDesigner } from '../tools/GovernanceDesigner.jsx';

const lesson = getLesson('1.4');

const readings = [
  { kind: 'FREE', title: 'The IIA Three Lines Model (2020)', note: 'The free official paper — the updated take on who owns, oversees, and assures risk.' },
  { kind: 'FREE', title: 'NC State ERM Initiative — the role of the CRO and the board', note: 'Free articles on how risk governance works in practice.' },
  { kind: 'BOOK', title: 'Enterprise Risk Management', note: 'James Lam — the definitive treatment of the CRO role and the risk function.' },
];

const retrieval = [
  {
    q: 'In the three lines model, who owns and manages risk?',
    options: [
      { text: 'The first line — operational management, in the course of doing the work.', correct: true },
      { text: 'The third line — internal audit.' },
      { text: 'The board’s risk committee.' },
    ],
  },
  {
    q: 'What makes the third line valuable?',
    options: [
      { text: 'Its independence — it assures the board precisely because it doesn’t own or run the controls.', correct: true },
      { text: 'It does the most detailed operational work.' },
      { text: 'It sets the risk appetite.' },
    ],
  },
  {
    q: 'A common governance failure is…',
    options: [
      { text: 'the second line being asked to “own” risks, blurring the line between advising and managing.', correct: true },
      { text: 'having a board at all.' },
      { text: 'writing down who is responsible for what.' },
    ],
  },
];

export default function Lesson14() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>“Who owns this risk?” is the question that exposes a weak risk function fastest. If the answer is “the risk team,” something has already gone wrong.</Lead>

      <p className="measure">Risk isn’t owned by the people who write about risk. It’s owned by the people who run the business and make the decisions that create it. The head of operations owns operational risk; the treasurer owns liquidity risk; the board owns the appetite for all of it. The risk function’s job is to help them see and manage it well — not to take it off their hands. The moment a risk register becomes “the risk team’s problem,” the business stops feeling responsible for the risks it’s actually taking, and the whole exercise turns into theatre.</p>

      <Objectives items={[
        'Explain the three lines model and what each line is for.',
        'Say why the third line’s independence is the source of its value.',
        'Describe the roles of the board, a risk committee, and a Chief Risk Officer.',
        'Design a governance structure for your organization (completing Artifact A1, your charter).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Three lines, one accountability" />
      <p className="measure">The cleanest way to think about who does what is the IIA’s three lines model. The <em>first line</em> is the business itself — the managers who own the risks and run the controls as part of getting the work done. The <em>second line</em> is the risk and compliance functions: they set policy, advise, and monitor, and crucially they challenge the first line — but they don’t own the risks. The <em>third line</em> is internal audit, which gives the board independent assurance that the first two lines are actually working. The power of the model is that single word, <em>independent</em>: the third line is worth listening to precisely because it has no stake in making the controls look good. Blur these — let the second line quietly “own” risks, or let the third line help design the controls it later audits — and you lose the independence that made the structure worth having.</p>

      <p className="measure">Above all three sits the board, which owns the organization’s risk appetite and holds management to account, often through a dedicated risk committee. In larger organizations a Chief Risk Officer leads the second line and gives risk a senior, independent voice — someone whose job is to say the uncomfortable thing in the room where decisions are made. None of this needs to be elaborate. A small company can run the whole model with a handful of people wearing clear hats. What matters is that the hats are clear.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Governance is structure, not arithmetic" />
      <p className="measure">There’s nothing to compute here, and that’s the through-line of Part 1: the foundations of risk management — what risk is, how the business works, which framework you use, who owns what — are entirely qualitative. They’re also where most real-world failures begin. The spectacular blow-ups rarely come from a miscalculated number; they come from unclear ownership, a silenced second line, a board that didn’t want to hear it. The maths in Part 4 is powerful, but it sits on top of this governance. Weak foundations, and the cleverest model in the world won’t save you.</p>

      <Pull>The hardest risk question isn’t “how big is it?” It’s “whose job is it?” — and a clear answer is worth more than a clever estimate.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Design your governance — and finish the charter" />
      <p className="measure">Lay out the three lines for your organization: decide whether it has a risk committee, a CRO, an internal audit function, and assign a few real activities to the right line. Watch the tool flag the assignments that break the model — especially any gap in independent assurance. With this saved, the four pieces you’ve built across Part 1 — your risk statements, value map, framework choice, and governance — together form your <strong>risk management charter</strong>, the first complete artifact in your operating model.</p>

      <GovernanceDesigner lessonId="1.4" artifactId="A1-governance" />
    </LessonShell>
  );
}
