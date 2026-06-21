import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { MaturityRadar } from '../tools/MaturityRadar.jsx';

const lesson = getLesson('5b');
const readings = [
  { kind: 'FREE', title: 'RIMS Risk Maturity Model', note: 'The standard self-assessment: seven attributes, five levels from Ad hoc to Leadership.' },
  { kind: 'FREE', title: 'NC State ERM Initiative — embedding & maturing ERM', note: 'On what separates a real ERM programme from a paper one.' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — implementing and embedding risk management.' },
];
const retrieval = [
  { q: 'Higher risk maturity mainly means…', options: [
    { text: 'ERM is embedded in how decisions are actually made — not that there are more documents.', correct: true },
    { text: 'the risk team is larger.' },
    { text: 'more risks are recorded.' }] },
  { q: 'The natural focus for maturing a function is…', options: [
    { text: 'lifting the weakest attributes, not polishing the strongest.', correct: true },
    { text: 'buying more software.' },
    { text: 'writing a longer policy.' }] },
];

export default function Lesson5b() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>You can have every artifact this course produces and still have a risk function that changes nothing. Maturity is the difference between having risk management and <em>being</em> a risk-aware organization.</Lead>
      <p className="measure">A mature function isn’t the one with the thickest policy or the biggest team. It’s the one where risk thinking is woven into how real decisions get made — where a project gets reshaped because someone asked the right question early, where the board genuinely uses the risk report, where bad news travels fast because people know it’s wanted. Maturity models give you a mirror to see honestly where you are, and a roadmap for where to go next, so “improve risk management” stops being a vague aspiration and becomes a sequence of concrete moves.</p>

      <Objectives items={[
        'Describe what risk maturity means and why it’s about embedding, not paperwork.',
        'Use a maturity model to assess your function across its attributes.',
        'Turn the weakest attributes into a roadmap (Artifact A13).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="From ad hoc to leadership" />
      <p className="measure">The RIMS Risk Maturity Model scores seven attributes — from how well ERM is adopted, to whether you chase root causes, to business resilience — across five levels, from Ad hoc (it happens when someone remembers) to Leadership (it’s how the organization thinks). The value isn’t the badge; it’s the diagnosis. Maturing a function is a multi-year change-management effort, and the common failure is trying to improve everywhere at once. The model tells you where the leverage is.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Scoring as a mirror" />
      <p className="measure">The “maths” is just honest scoring, and its worth lies entirely in honesty — a self-assessment everyone games is a waste of an afternoon. Score each attribute as it really is, not as the policy claims, and the radar shows the shape of your function: strong here, hollow there. The lowest points aren’t failures to hide; they’re your roadmap, in priority order.</p>
      <Pull>Maturity isn’t measured by what you’ve written down. It’s measured by what would still happen if the risk team went on holiday.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Assess and plan" />
      <p className="measure">Rate your function across the attributes, read its overall level, and let the two weakest become the start of your improvement roadmap. Saved as Artifact A13.</p>
      <MaturityRadar lessonId="5b" artifactId="A13" />
    </LessonShell>
  );
}
