import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.6');
const readings = [
  { kind: 'FREE', title: 'NIST Cybersecurity Framework 2.0', note: 'The free, standard structure for managing cyber risk: Govern, Identify, Protect, Detect, Respond, Recover.' },
  { kind: 'FREE', title: 'FAIR — Factor Analysis of Information Risk', note: 'A method for putting credible money ranges on cyber risk (the FAIR Institute, Open Group).' },
  { kind: 'FREE', title: 'IFRS S2 / ISSB & NGFS climate scenarios', note: 'Climate disclosure (TCFD was disbanded in 2023 and folded into IFRS S2) and the standard climate scenarios.' },
];
const retrieval = [
  { q: 'Cyber risk can be quantified credibly using…', options: [
    { text: 'methods like FAIR that express it as ranges (frequency × loss magnitude), fed into simulation.', correct: true },
    { text: 'a single exact dollar figure.' },
    { text: 'value-at-risk on the stock price.' }] },
  { q: 'Climate disclosure today runs mainly through…', options: [
    { text: 'IFRS S2 / the ISSB — the TCFD recommendations were folded into it after TCFD disbanded in 2023.', correct: true },
    { text: 'the TCFD, which is still the active standalone body.' },
    { text: 'no framework at all.' }] },
];

export default function Lesson36() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>The newest risk families are also among the fastest-moving. Cyber, technology, and climate share a trait: they’re deeply uncertain, increasingly material, and best handled through scenarios rather than single numbers.</Lead>
      <p className="measure">Technology and cyber risk run from the mundane (an ageing system nobody dares touch) to the existential (a ransomware attack that halts the business or a breach that empties customer trust). Climate risk comes in two flavours: <em>physical</em> (floods, heat, storms hitting your operations and supply chain) and <em>transition</em> (the cost of a shifting economy — carbon prices, technology change, stranded assets). What unites them is depth of uncertainty: the past is a poor guide, so you reason in scenarios about plausible futures rather than extrapolating history.</p>

      <Objectives items={[
        'Frame cyber risk with a standard like NIST CSF 2.0.',
        'Know that cyber can be quantified in ranges (FAIR), and climate through scenarios (IFRS S2, NGFS).',
        'Add technology, cyber, and climate risks to your register.',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Old systems, new threats, a changing planet" />
      <p className="measure">For cyber, the NIST Cybersecurity Framework 2.0 gives a clean spine — Govern, Identify, Protect, Detect, Respond, Recover — that turns a sprawling topic into something manageable, and its resilience emphasis echoes the last lesson: assume breach, plan to recover. For climate, the disclosure landscape has shifted: the TCFD, long the reference, was disbanded in 2023 and its recommendations folded into <em>IFRS S2</em> under the ISSB, now the global baseline, with the NGFS scenarios providing the standard futures to test against. Knowing the current names matters — advising a board on “TCFD reporting” in 2026 would mark you as out of date.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Ranges and scenarios, not point estimates" />
      <p className="measure">Cyber risk used to be declared “unquantifiable.” It isn’t — it’s just badly served by single numbers. Methods like <em>FAIR</em> break a cyber risk into how often a loss event happens and how large it is, each as a <em>range</em>, then run them through simulation to produce a loss distribution — exactly the Monte Carlo machinery of Part 4. Climate is handled through scenario analysis: you don’t forecast 2050, you stress your business against several plausible 2050s. In both, the output is a spread of outcomes, not a false point estimate — which is the honest way to quantify deep uncertainty.</p>
      <Pull>“Unquantifiable” usually means “badly served by a single number.” The fix isn’t a point estimate — it’s an honest range.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Add your tech, cyber & climate risks" />
      <p className="measure">Where is your organization exposed through its technology, its attack surface, and a changing climate? Add these to your register, owned by the CISO/CTO with the board across climate.</p>
      <FamilyLens lessonId="3.6" artifactId="A10-tech" family="Technology & cyber" ownerHint="CISO / CTO"
        sizing="Cyber → FAIR-style ranges (event frequency × loss magnitude) run through Monte Carlo. Climate → scenario analysis against NGFS-style futures, not a single forecast." />
    </LessonShell>
  );
}
