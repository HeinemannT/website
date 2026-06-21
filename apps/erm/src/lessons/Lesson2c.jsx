import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { RegisterIntake } from '../tools/RegisterIntake.jsx';

const lesson = getLesson('2c');
const readings = [
  { kind: 'FREE', title: 'NC State ERM Initiative — risk identification & workshops', note: 'Practical, and honest about how the conversations actually go.' },
  { kind: 'FREE', title: 'The Orange Book (2023) — identification', note: 'For the cause–event–consequence discipline.' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — risk identification and risk description.' },
];
const retrieval = [
  { q: 'Identification is described as a social task because…', options: [
    { text: 'the knowledge you need lives in people’s heads, and getting it out depends on trust and conversation.', correct: true },
    { text: 'it is done in large rooms.' },
    { text: 'it requires no analysis at all, ever.' }] },
  { q: 'A well-formed risk separates…', options: [
    { text: 'cause, event, and consequence — the trigger, what happens, and the effect on an objective.', correct: true },
    { text: 'probability and impact only.' },
    { text: 'cost and benefit.' }] },
  { q: '(Back to 2b) A register where every entry traces to the same few people suggests…', options: [
    { text: 'incomplete coverage — and possibly a culture where others don’t feel safe to speak.', correct: true },
    { text: 'an excellent, complete register.' },
    { text: 'that the maths is wrong.' }] },
];

export default function Lesson2c() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Risk identification looks like the easy step. Surely you just list what could go wrong? That’s exactly why teams rush it — and why it quietly decides whether the rest of the work matters at all.</Lead>
      <p className="measure">You cannot manage a risk you never named. And the risks that do the most damage are almost always the ones nobody wrote down: the supplier everyone assumed was solid, the regulation no one read closely. Invisible on the register, and so invisible to every step that follows. Analysis, evaluation, treatment, monitoring each work only on the risks that made the list. Identification is the gate — whatever doesn’t pass through it isn’t managed badly; it isn’t managed at all.</p>
      <p className="measure">There’s a second surprise: identifying risk isn’t an analytical job, it’s a social one. The information lives in people’s heads — the engineer who knows the workaround everyone relies on, the salesperson who’s heard what a customer is privately planning. None of it is written down. Getting it out is a matter of conversation and trust, which is why culture came first. In a team where naming a risk gets you punished, the workshop produces a tidy list of the safe risks and nothing else.</p>

      <Objectives items={[
        'Run identification as a deliberate, multi-source activity, not a one-off list.',
        'Write risks as cause → event → consequence so they’re actually assessable.',
        'Spot the symptoms of an incomplete register.',
        'Build the risk register for your organization (Artifact A4) — the spine of the rest of the course.',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Sources, language, and blind spots" />
      <p className="measure">Three habits make the conversation honest and complete. Vary where you look: workshops surface shared risks, private interviews surface what people won’t say in front of the boss, loss logs surface what has already bitten, and peers’ failures surface what you’ve only been lucky to avoid. Discipline the language: a risk has a cause, an event, and a consequence — “cyber” is a topic, but “a phishing email lets ransomware encrypt the order system, so fulfilment stops for days” is a risk you can own and treat. And fight the pull toward last year’s risks: structured prompts and a deliberate look at the risk of doing nothing pull attention into the corners of the room.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Coverage, not calculation" />
      <p className="measure">This is the least quantitative step, and pretending otherwise does harm. The one number worth watching is coverage. You can’t prove a register is complete — completeness is unknowable — but you can read the symptoms of an incomplete one: every risk operational and none strategic, every entry tracing to the same three people, the same count two years running. You’re reading warning lights, not computing a total, and keeping identification a living habit. Even at its best, identification narrows but never closes the gap that Part 5 calls the limits of models.</p>
      <Pull>Some risks always sit outside the register. A mature team knows it — and says so out loud.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Build the register" />
      <p className="measure">The intake won’t let you log a bare topic — it asks for cause, event, consequence, an owner, and a category, so each entry comes out assessable. Build out your register here; it’s the same object you’ll evaluate in 2d, control in 2e, treat in 2f, and monitor in 2g. Saved as Artifact A4, it is the backbone of your whole operating model.</p>
      <RegisterIntake lessonId="2c" artifactId="A4" />
    </LessonShell>
  );
}
