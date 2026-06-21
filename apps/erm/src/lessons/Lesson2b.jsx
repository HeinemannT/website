import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { CultureRadar } from '../tools/CultureRadar.jsx';

const lesson = getLesson('2b');
const readings = [
  { kind: 'FREE', title: 'Risk Culture Aspects Model — IRM', note: 'The standard framework and a usable scorecard.' },
  { kind: 'FREE', title: 'NC State ERM Initiative — culture & tone at the top', note: 'Free, practical articles.' },
  { kind: 'BOOK', title: 'The Failure of Risk Management', note: 'Douglas Hubbard, 2nd ed. — overconfidence, calibration, and fixing human judgment.' },
];
const retrieval = [
  { q: 'Why is leadership tone the most important cultural aspect?', options: [
    { text: 'Culture is set mostly by what senior people reward, tolerate, and pay attention to — and the organization learns fast.', correct: true },
    { text: 'Because executives write the values statement.' },
    { text: 'Because tone is the only thing you can measure.' }] },
  { q: 'Calibration training improves…', options: [
    { text: 'how honestly people report the range of what they actually know — countering overconfidence.', correct: true },
    { text: 'how quickly people answer.' },
    { text: 'the accuracy of accounting figures.' }] },
  { q: '(Back to 2a) An appetite statement in a poor culture is…', options: [
    { text: 'a document nobody honours under pressure.', correct: true },
    { text: 'automatically enforced.' },
    { text: 'irrelevant to behaviour.' }] },
];

export default function Lesson2b() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Pick any large risk failure and read the post-mortem. Someone saw it coming. The information almost never went missing — the willingness to say it did.</Lead>
      <p className="measure">Before the banks fell in 2008, before Deepwater Horizon, before Enron — the warning was already in the building, in somebody’s inbox or somebody’s gut. What went missing was the willingness to speak, or the willingness of those above to hear. That is why culture is not a soft add-on to risk management. It is the medium the whole discipline runs on. You can have a flawless framework, a tidy register, and a board-approved appetite, and still be one bad culture away from disaster — because every one of those depends on people choosing to tell the truth about uncertainty.</p>
      <p className="measure">Avoid two traps: the cynic who calls culture unmeasurable hand-waving, and the optimist who thinks a poster of values changes anything. Culture is real, it leaves fingerprints, and it shifts — slowly, and mostly in response to what leaders do, not what they say.</p>

      <Objectives items={[
        'Read a culture from what it rewards and punishes, not its values statement.',
        'Name the main aspects of risk culture and why leadership tone leads.',
        'Explain calibration and why overconfidence corrupts risk estimates.',
        'Assess your organization’s culture and test your own calibration (Artifact A3).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Reading a culture" />
      <p className="measure">Want to read a culture? Don’t read the values statement. Watch what happens when it counts. Does raising an awkward risk help a career or quietly end one? When a control slows a profitable deal, which gives way? When bad news climbs the hierarchy, does it arrive intact or sanded smooth at every level? Those answers describe the culture, because they describe incentives — and incentives are what people follow when no one is watching. The IRM breaks culture into aspects — leadership tone, decision-making, accountability, competence — and tone leads, because a chief executive who meets a near-miss with curiosity teaches a very different lesson than one who meets it with irritation.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Surveys and calibration" />
      <p className="measure">Culture resists measurement but doesn’t defeat it. A culture survey turns the aspects into scored statements and gives you a profile to compare across teams and track over time — the score isn’t the point, the variation is. A unit far below the rest is where to look. The deeper idea is <em>calibration</em>: asked for a range they’re 90% sure contains an answer, most people are right far less than 90% of the time. That overconfidence poisons the register at its source, because identification and analysis run on human judgments of likelihood and impact. The good news is calibration is trainable. The tool below lets you feel your own overconfidence once — which tends to stick.</p>
      <Pull>The most valuable trait in risk estimation isn’t cleverness. It’s honesty about the width of what you don’t know.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Assess the culture, test yourself" />
      <p className="measure">Score your organization across the aspects to draw its culture profile, then take the short calibration exercise and see how often the truth actually fell inside your “90% sure” ranges. Saved as Artifact A3, this sits behind the whole operating model as the honest answer to one question: when this is all tested, will any of it hold?</p>
      <CultureRadar lessonId="2b" artifactId="A3" />
    </LessonShell>
  );
}
