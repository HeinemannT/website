import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.2');
const readings = [
  { kind: 'FREE', title: 'NC State ERM Initiative — strategic risk', note: 'Why the biggest risks are usually strategic, and hardest to quantify.' },
  { kind: 'BOOK', title: 'Strategic Risk Taking', note: 'Aswath Damodaran — risk as something to be taken well, not just avoided.' },
];
const retrieval = [
  { q: 'Strategic risks are distinctive because they…', options: [
    { text: 'threaten the whole business model and resist neat quantification — yet are often the largest of all.', correct: true },
    { text: 'are small, frequent, and easy to measure.' },
    { text: 'are owned by the IT department.' }] },
  { q: 'The right tool for most strategic risk is…', options: [
    { text: 'scenario thinking and judgement, not a single probability-times-impact number.', correct: true },
    { text: 'value-at-risk.' },
    { text: 'an insurance policy.' }] },
];

export default function Lesson32() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Kodak invented the digital camera and was killed by it. Blockbuster turned down the chance to buy Netflix. These weren’t operational slip-ups — they were strategic risks, the kind that end companies.</Lead>
      <p className="measure">Strategic risk is the risk attached to the big bets: the business model, the markets you choose, the disruptions you don’t see coming, the strategy you execute well or badly. It’s the most consequential family and the most neglected, precisely because it doesn’t fit a tidy register. You can’t put a clean probability on “a competitor reinvents our industry.” But the fact that it’s hard to score is no reason to leave the box empty — that’s how the largest risks go unmanaged.</p>

      <Objectives items={[
        'Recognise strategic risk and why it’s often the largest family.',
        'See why scenarios, not single numbers, are the right lens.',
        'Add strategic risks to your register, owned where they belong — the top.',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="The risks that end companies" />
      <p className="measure">Operational failures hurt; strategic failures kill. This family includes disruption (a new technology or competitor reshaping the market), business-model risk (the way you make money stops working), and execution risk (a sound strategy delivered badly). It’s owned at the very top — the board and CEO — because only they can change strategy, and it’s where risk management most needs to be a contributor to strategy rather than a reviewer of it. A risk function that only audits operations and never challenges the strategy is guarding the windows while the roof comes off.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Scenarios, not point estimates" />
      <p className="measure">Most strategic risk resists the probability-times-impact treatment, and forcing a number on it does more harm than good — it manufactures false confidence. The honest tools are qualitative: scenario analysis (“what worlds could we be living in, and are we robust to each?”), war-gaming, and thinking in terms of options — small, reversible bets that keep the future open. You’ll meet scenario methods properly in Part 4. Here the point is humility: name the strategic risks, think hard in scenarios, and resist the urge to launder a guess into a statistic.</p>
      <Pull>The risks most worth managing are often the ones least willing to be measured. Don’t mistake “hard to quantify” for “safe to ignore.”</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Add your strategic risks" />
      <p className="measure">What big bets is your organization making, and what could render its model obsolete? Add the strategic risks to your register, owned at board level. Rough numbers are fine — the value is in naming them at all.</p>
      <FamilyLens lessonId="3.2" artifactId="A10-strategic" family="Strategic" ownerHint="the board / CEO"
        sizing="Mostly judgement and scenarios, not arithmetic. Ask 'what world would have to be true for this to happen, and would we survive it?' rather than reaching for a single probability." />
    </LessonShell>
  );
}
