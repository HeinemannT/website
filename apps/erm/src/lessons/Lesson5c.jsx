import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { BoardDashboard } from '../tools/BoardDashboard.jsx';

const lesson = getLesson('5c');
const readings = [
  { kind: 'FREE', title: 'COSO ERM 2017 — integrating risk with strategy & performance', note: 'The free executive summary; risk in service of creating and preserving value.' },
  { kind: 'FREE', title: 'NC State ERM Initiative — board risk reporting', note: 'What boards actually need from a risk report.' },
  { kind: 'BOOK', title: 'Enterprise Risk Management', note: 'James Lam — risk reporting and the risk-strategy connection.' },
];
const retrieval = [
  { q: 'A good board risk report is…', options: [
    { text: 'a decision aid: biggest exposures, what’s moving, capital behind it, key gaps — not a data dump.', correct: true },
    { text: 'every risk in the register, in full detail.' },
    { text: 'a list of controls.' }] },
  { q: 'Integrating risk with strategy means…', options: [
    { text: 'considering risk when strategy is set, not reviewing it afterwards.', correct: true },
    { text: 'keeping risk and strategy in separate meetings.' },
    { text: 'letting the risk team set the strategy.' }] },
];

export default function Lesson5c() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>All the analysis in the world is wasted if it never reaches the people who decide. This lesson is about the last mile — getting risk into the room where strategy is made.</Lead>
      <p className="measure">Two things separate a risk function that matters from one that doesn’t. First, it reports to the board in a way the board can actually use — not a hundred-page appendix, but a one-page answer to “what should keep us awake, and are we comfortable with that?” Second, and harder, it’s present when strategy is <em>set</em>, not wheeled in afterwards to rubber-stamp it. COSO ERM’s central argument is exactly this: risk belongs inside strategy and performance, because the biggest risk of all is picking the wrong strategy — and you can only influence that before the ink dries.</p>

      <Objectives items={[
        'Write a board risk report as a decision aid, not a data dump.',
        'Explain what it means to integrate risk with strategy.',
        'Assemble a board dashboard from your own work (Artifact A14).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="The one page that earns the seat" />
      <p className="measure">A board has minutes, not hours, for enterprise risk. The report that earns the risk function its seat at the table answers a few questions cleanly: where is our largest exposure, what is moving against us, how much capital stands behind it, where are we strong and where thin — and crucially, are we still inside the appetite the board itself set? Everything you’ve built feeds this: the register gives the exposures, the KRIs give the movement, Part 4 gives the capital, the maturity model gives the candour. Reporting isn’t a separate skill bolted on at the end; it’s the assembly of everything into the language of decisions.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Risk-adjusted, not risk-blind" />
      <p className="measure">Integrating risk with strategy has a quantitative edge worth naming: judging opportunities on a <em>risk-adjusted</em> basis. A strategy that promises high returns while consuming enormous capital or concentrating exposure may be worse than a steadier one — the same RAROC logic from Part 4, lifted to the strategic level. You don’t need new maths here; you need to bring the numbers you already have into the strategy conversation, so the board chooses with risk in view rather than as an afterthought.</p>
      <Pull>The risk report that gets read is the one that helps the board decide — not the one that proves the risk team was thorough.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Assemble the board view" />
      <p className="measure">The dashboard below pulls together what you’ve built — top exposures, indicators, capital, maturity — into the one-page view a board would actually see. Notice how little new work it takes: the value was created upstream; this just speaks it in the board’s language. Saved as Artifact A14.</p>
      <BoardDashboard lessonId="5c" artifactId="A14" />
    </LessonShell>
  );
}
