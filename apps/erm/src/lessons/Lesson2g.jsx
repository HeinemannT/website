import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { KRIDashboard } from '../tools/KRIDashboard.jsx';

const lesson = getLesson('2g');
const readings = [
  { kind: 'FREE', title: 'COSO / NC State — Developing Key Risk Indicators', note: 'The standard free thought paper on KRIs and how they differ from KPIs.' },
  { kind: 'FREE', title: 'The Orange Book (2023) — monitoring & reporting', note: 'Official guidance on the monitoring loop.' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — monitoring, reporting, and KRIs.' },
];
const retrieval = [
  { q: 'A leading indicator is valuable because it…', options: [
    { text: 'moves before the loss does, giving you time to act.', correct: true },
    { text: 'reports the loss after it happens.' },
    { text: 'is easier to collect than other data.' }] },
  { q: 'KRI thresholds should be set from…', options: [
    { text: 'your risk tolerances — the loop back to the appetite you defined in 2a.', correct: true },
    { text: 'whatever number looks reasonable on the day.' },
    { text: 'the colour of the dashboard.' }] },
  { q: 'A KRI differs from a KPI in that it tracks…', options: [
    { text: 'exposure to a risk, not just business performance.', correct: true },
    { text: 'nothing — they’re identical.' },
    { text: 'only financial results.' }] },
];

export default function Lesson2g() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>A risk register written last year is a photograph of a world that has moved. Monitoring is the habit of looking again — and it’s the step teams quietly drop first.</Lead>
      <p className="measure">The supplier you trusted got acquired; the regulation you ignored grew teeth; the control you rated effective started failing quietly. None of that shows up unless something is watching. Monitoring closes the loop the rest of Part 2 opened: you set an appetite, found and evaluated risks, controlled and treated them — and now you keep an eye on whether reality is drifting toward the limits you drew. The instrument for that is the key risk indicator, and a board report that tells the truth.</p>

      <Objectives items={[
        'Distinguish leading from lagging indicators, and KRIs from KPIs.',
        'Set indicator thresholds that trace back to your risk tolerances.',
        'Read a dashboard as a story about where exposure is heading.',
        'Build a KRI dashboard and board summary for your organization (Artifact A8).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Indicators that look forward" />
      <p className="measure">A key risk indicator is a number that tracks your <em>exposure</em> to a risk, not just your performance — that’s the line between a KRI and a KPI. The best ones are <em>leading</em>: they move before the loss arrives. Rising staff turnover leads operational failures; a creeping phishing click-rate leads a breach; growing concentration in one customer leads a revenue shock. A lagging indicator — last quarter’s losses — tells you what already happened, which is useful but late. And every threshold on a good dashboard should trace back to a tolerance you set in your appetite statement, so an amber light means something specific: you’re approaching a line the board actually drew.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Thresholds and trends" />
      <p className="measure">The maths here is reading, not deriving. Each indicator gets an amber and a red threshold; cross amber and you’re warned, cross red and you act. But a single reading lies — what matters is the <em>trend</em>. A number well inside its limits but climbing steadily every month is often more alarming than a number sitting just over amber and falling. So you watch the direction, not just the dot. The dashboard below turns your indicators into colours and trend-lines and drafts the board summary for you — but the judgement of which indicators are truly leading is yours.</p>
      <Pull>Don’t ask only “are we over the line?” Ask “which way are we moving, and how fast?” The trend is the warning the threshold misses.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Build the dashboard — and close the loop" />
      <p className="measure">Define your indicators, set thresholds from your tolerances, and watch the dashboard draft a board summary that flags what’s red and what’s drifting. Saved as Artifact A8, this completes the operating process — appetite to monitoring — for your organization. From here, Part 3 widens the lens from individual risks to the whole universe of them.</p>
      <KRIDashboard lessonId="2g" artifactId="A8" />
    </LessonShell>
  );
}
