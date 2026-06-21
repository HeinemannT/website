import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { AppetiteBuilder } from '../tools/AppetiteBuilder.jsx';

const lesson = getLesson('2a');
const readings = [
  { kind: 'FREE', title: 'Risk Appetite and Tolerance — IRM guidance', note: 'The clearest account of appetite vs. tolerance vs. capacity and the cascade problem.' },
  { kind: 'FREE', title: 'The Orange Book (HM Treasury, 2023)', note: 'Sober, concrete guidance on setting appetite.' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — the risk appetite chapter.' },
];
const retrieval = [
  { q: 'Appetite vs. capacity — which must contain the other?', options: [
    { text: 'Appetite must sit inside capacity: never want more risk than you could survive.', correct: true },
    { text: 'Capacity must sit inside appetite.' },
    { text: 'They mean the same thing.' }] },
  { q: 'The test of a working appetite statement is…', options: [
    { text: 'whether it would ever make someone make a different decision.', correct: true },
    { text: 'whether it uses the word “low”.' },
    { text: 'whether the board has seen it.' }] },
  { q: 'A risk tolerance is best expressed as…', options: [
    { text: 'a specific boundary — a number or threshold — on a particular objective.', correct: true },
    { text: 'a general feeling about risk.' },
    { text: 'the list of all risks faced.' }] },
];

export default function Lesson2a() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>A bank decides that no single borrower will ever exceed 5% of its loan book. That one sentence is a risk appetite — and it tells every lending officer exactly when to say no.</Lead>
      <p className="measure">Without that line, “no” is just an argument waiting to be lost. With it, the board has answered a question that sounds simple and runs deep: how much risk should we take? Not how much we face — that’s the register — but how much we should knowingly accept to get what we’re after. A team that can’t answer can’t tell a smart risk from a reckless one, because recklessness isn’t a property of a risk by itself. The same open currency position is prudent treasury management in one company and a firing offence in another. Appetite is what tells them apart.</p>
      <p className="measure">And appetite is not the language of caution. It’s the language of deliberate risk-taking. A bank lends, an insurer underwrites, a manufacturer bets on a product. Take no risk and you create no value. Appetite is how the board says, out loud and in advance, which risks it wants taken and how far — so the people close to the action can move fast without walking every decision upstairs.</p>

      <Objectives items={[
        'Separate risk appetite, tolerance, and capacity, and order them correctly.',
        'Recognise the difference between a working appetite statement and a decorative one.',
        'Express a tolerance as a checkable number where the risk is measurable.',
        'Draft an appetite statement for your organization (Artifact A2).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Appetite, tolerance, capacity" />
      <p className="measure">Pin the vocabulary down with a meal. Risk <em>appetite</em> is how hungry you are: the broad amount and type of risk you’ll pursue to hit your objectives. Risk <em>tolerance</em> is where you push the plate away: the specific variation you’ll accept around one objective before someone escalates. And <em>capacity</em> is the most you could absorb before survival is in question. One rule rises above the rest: appetite must sit inside capacity. An appetite bigger than your capacity isn’t ambition — it’s a plan to fail.</p>
      <p className="measure">A good appetite statement earns its keep three ways. It ties to real objectives, because an appetite that names nothing you’re trying to achieve is just a mood. It separates categories, because almost every organization is hungry for some risks and allergic to others — eager for a strategic bet, near-zero patience for a safety failure. And it cascades, because the board’s posture has to translate into limits the lending officer or plant manager can actually use. The usual failure is the appetite that’s really a wish: “we have a low appetite for risk” gives nobody a way to choose between two real options.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Tolerances as checkable lines" />
      <p className="measure">Appetite is mostly judgment, but it has a numerical spine. Where a risk is measurable, a tolerance is just a line drawn on a range of outcomes: at most this much expected loss in this category per year; no more than a one-in-twenty chance of breaching this capital level. Part 4 builds the machinery that draws those ranges. The skill for now is hearing an appetite as a probability rather than a slogan — press on “low appetite” and it should resolve into something like “at most an X% chance of losing more than Y this year.” The tolerances you set here become the alarm thresholds your indicators watch in lesson 2g. The loop closes.</p>
      <Pull>If a stated appetite would never change a single real decision, it isn’t an appetite. It’s wallpaper.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Draft your appetite" />
      <p className="measure">Go category by category. Choose a posture, set a tolerance where the risk is measurable, and — the part that matters most — name a real decision the appetite would change. The builder flags any line that fails that test. Saved as Artifact A2, this becomes the line every risk in your register is finally judged against.</p>
      <AppetiteBuilder lessonId="2a" artifactId="A2" />
    </LessonShell>
  );
}
