import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { RiskStatementBuilder } from '../tools/RiskStatementBuilder.jsx';

const lesson = getLesson('1.1');

const readings = [
  { kind: 'FREE', title: 'ISO 31000:2018 — overview & key terms', note: 'Reputable summaries of the standard; note the definition of risk as the “effect of uncertainty on objectives”.' },
  { kind: 'FREE', title: 'IRM — “Standard Deviations” guide to ISO 31000', note: 'A free, readable practitioner walk-through of the concepts.' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — the opening chapters on what risk is and the types of risk.' },
];

const retrieval = [
  {
    q: 'ISO 31000 defines risk as…',
    options: [
      { text: 'the effect of uncertainty on objectives — which can be positive or negative.', correct: true },
      { text: 'the probability that something bad will happen.' },
      { text: 'any threat to the organisation’s assets.' },
    ],
  },
  {
    q: 'Why does the “effect on objectives” framing matter in practice?',
    options: [
      { text: 'It ties every risk to something the organisation is trying to achieve, so you can judge what actually matters.', correct: true },
      { text: 'It makes risks easier to insure.' },
      { text: 'It guarantees risks can be measured numerically.' },
    ],
  },
  {
    q: 'A risk’s cause, event, and consequence are…',
    options: [
      { text: 'three different things worth separating — the trigger, what happens, and the result.', correct: true },
      { text: 'three names for the same thing.' },
      { text: 'only relevant for financial risks.' },
    ],
  },
];

export default function Lesson11() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Ask ten managers what “risk” means and most will say some version of “bad things that might happen.” That answer quietly throws away half the subject — and points your attention in the wrong direction.</Lead>

      <p className="measure">Here is the definition the whole discipline runs on, from ISO 31000: risk is <em>the effect of uncertainty on objectives</em>. Read it slowly, because three words are doing real work. <em>Uncertainty</em> — not bad luck, just things you can’t be sure of. <em>Objectives</em> — the risk only exists in relation to something you’re trying to achieve. And <em>effect</em> — which can cut either way. A favourable exchange-rate move and an unfavourable one are the same risk, seen from both sides.</p>

      <p className="measure">That last point trips people up, so make it concrete. A food company depends on the price of wheat. If the price jumps, margins get crushed; if it falls, margins improve. Both are the effect of the same uncertainty on the same objective. Treat risk as only the downside and you’ll hedge away the wheat-price danger and never notice you also hedged away the upside — or that a competitor who understood both is now winning. Risk management is not the art of avoiding loss. It’s the art of taking the right uncertainties, on purpose, in pursuit of your objectives.</p>

      <Objectives items={[
        'State the ISO 31000 definition of risk and explain why “effect on objectives” matters.',
        'Tell apart a risk’s cause, its event, and its consequence — and upside from downside.',
        'Distinguish inherent risk from residual risk, and risk from genuine uncertainty.',
        'Write several well-formed risk statements for your own organization (the start of Artifact A1).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Naming a risk properly" />
      <p className="measure">A risk has anatomy. There is a <em>cause</em> (what sets it off), an <em>event</em> (the thing that happens), and a <em>consequence</em> (what it does to your objective). “Cyber” isn’t a risk — it’s a topic. “A phishing email lets attackers encrypt our order system, so we can’t ship for a week” is a risk, because now you can see where to act: train staff against phishing (the cause), back up systems (the event), line up a manual fallback (the consequence). Naming the three parts turns a worry into something you can manage.</p>

      <p className="measure">Two more distinctions you’ll use constantly. <em>Inherent</em> risk is the exposure before you do anything about it; <em>residual</em> risk is what’s left after your controls. The gap between them is the work your controls are doing — and if there’s no gap, your controls aren’t earning their keep. Finally, economists separate <em>risk</em> (you can put rough odds on it) from deep <em>uncertainty</em> (you genuinely can’t). Much of this course is about the measurable slice, but the best risk thinkers never forget how much sits in the second category — a humility we return to in Part 5.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Mostly not, and that's the point" />
      <p className="measure">There is almost no mathematics in this lesson, and saying so is itself a lesson. The instinct to jump straight to numbers — probabilities, scores, value-at-risk — is exactly what turns risk management into a narrow measurement exercise and misses the discipline. Quantities come later, in Part 4, and only for the risks that genuinely support them. Right now the skill is verbal and conceptual: can you state a risk so clearly that someone could act on it? Get that right and the numbers, when they arrive, will have something solid to attach to. Get it wrong and no amount of arithmetic will save you.</p>

      <Pull>The numbers are a tool for the measurable slice of risk. The discipline is everything that decides which slice that is — and what to do about the rest.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Your first risk statements" />
      <p className="measure">Take the objectives you set in orientation and, for each, name an uncertainty that could affect it and how it might play out — on the downside, the upside, or both. The builder turns each into a proper risk statement and flags any that are still just topics. These aren’t your full register yet (that comes in 2c); they’re the first entries in your charter, and proof that you can see risk the way the discipline does.</p>

      <RiskStatementBuilder lessonId="1.1" artifactId="A1-statements" />
    </LessonShell>
  );
}
