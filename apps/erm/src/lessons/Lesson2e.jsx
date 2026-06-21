import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { ControlMapper } from '../tools/ControlMapper.jsx';

const lesson = getLesson('2e');
const readings = [
  { kind: 'FREE', title: 'COSO Internal Control 2013 — Executive Summary', note: 'Free official summary: five components, seventeen principles. Note: distinct from COSO ERM.' },
  { kind: 'FREE', title: 'NC State ERM Initiative — internal control & assurance', note: 'Practical articles on control design and effectiveness.' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — the controls and internal-control chapters.' },
];
const retrieval = [
  { q: 'Residual risk is…', options: [
    { text: 'what’s left after your controls act on the inherent risk.', correct: true },
    { text: 'the risk before any controls.' },
    { text: 'the same as inherent risk.' }] },
  { q: 'A common, dangerous mistake when assessing controls is…', options: [
    { text: 'overstating their effectiveness, so residual risk looks smaller than it really is.', correct: true },
    { text: 'writing them down.' },
    { text: 'having more than one control.' }] },
  { q: 'COSO Internal Control and COSO ERM are…', options: [
    { text: 'distinct frameworks that must not be conflated.', correct: true },
    { text: 'the same document.' },
    { text: 'both about insurance.' }] },
];

export default function Lesson2e() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Every control exists twice: once on paper, and once in reality. The gap between them is where losses live.</Lead>
      <p className="measure">A control is anything that changes a risk — a password policy, a second signature on payments, a smoke detector, a segregation of duties so no one person can both create and approve a supplier. The point of a control is to take an <em>inherent</em> risk, the exposure before you act, and shrink it to a <em>residual</em> risk you can live with. The work your controls do is exactly that gap. And if the gap is small, your controls aren’t earning their cost — because controls are never free. They take money, time, and friction, and a control that costs more than the risk it removes is its own kind of failure.</p>

      <Objectives items={[
        'Define inherent and residual risk and the role controls play between them.',
        'Recognise the main control types and what “control effectiveness” means.',
        'See why overstating effectiveness is a quiet, common, dangerous error.',
        'Map controls for your register and find where residual risk still exceeds tolerance (Artifact A6).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Internal control, honestly" />
      <p className="measure">The reference frame is COSO Internal Control — five components and seventeen principles — and it’s worth one caution: this is a different document from COSO ERM, and people conflate them constantly. Controls come in flavours: <em>preventive</em> (stop it happening), <em>detective</em> (catch it when it does), and <em>corrective</em> (limit the damage after). A healthy risk has more than one type, because any single control fails sometimes. The hard part isn’t listing controls; it’s judging honestly how well they actually work. Most organizations flatter themselves here, and an over-rated control is worse than a missing one, because it hides a risk you think you’ve handled.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Residual = inherent × (1 − effectiveness)" />
      <p className="measure">The arithmetic is deliberately simple. If a risk has an inherent expected loss and your controls are, say, 40% effective, the residual expected loss is roughly the inherent times 0.6. You don’t need precision — you need to <em>see the lever</em>, and to feel how sensitive the answer is to the effectiveness number you assumed. Slide that number from an honest 40% to a hopeful 80% and watch the residual risk melt away on screen. That melting is exactly the self-deception to guard against: the residual risk is only as real as the control effectiveness is honest.</p>
      <Pull>An overstated control doesn’t remove a risk. It removes your awareness of the risk — which is worse.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Map your controls" />
      <p className="measure">For each risk in your register, set how effective the controls really are and watch inherent shrink to residual against your tolerance line. The risks that stay above the line after honest controls are the ones that need <em>treatment</em>, not just monitoring — which is exactly the next lesson. Saved as Artifact A6.</p>
      <ControlMapper lessonId="2e" artifactId="A6" />
    </LessonShell>
  );
}
