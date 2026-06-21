import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { PortfolioAggregation } from '../tools/PortfolioAggregation.jsx';

const lesson = getLesson('3.1');
const readings = [
  { kind: 'FREE', title: 'Kaplan & Mikes — “Managing Risks: A New Framework” (HBR)', note: 'A free reprint; the classic argument for an enterprise, portfolio view of risk.' },
  { kind: 'FREE', title: 'NC State ERM Initiative — aggregating risk', note: 'Why siloed lists understate true exposure.' },
  { kind: 'BOOK', title: 'Enterprise Risk Management', note: 'James Lam — the portfolio view of enterprise risk.' },
];
const retrieval = [
  { q: 'Why is the true aggregate exposure usually less than the sum of each risk’s worst case?', options: [
    { text: 'The risks don’t all strike at once — diversification means the worst cases rarely coincide.', correct: true },
    { text: 'Because adding numbers is error-prone.' },
    { text: 'Because worst cases are always exaggerated.' }] },
  { q: 'The dangerous thing about diversification is that…', options: [
    { text: 'in a crisis, correlations rise toward 1 and the benefit you were counting on disappears.', correct: true },
    { text: 'it never works at all.' },
    { text: 'it makes risks larger in calm times.' }] },
  { q: 'Siloed risk lists tend to…', options: [
    { text: 'hide concentrations and common drivers that only appear at the portfolio level.', correct: true },
    { text: 'overstate every risk.' },
    { text: 'be more accurate than an aggregated view.' }] },
];

export default function Lesson31() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>The most expensive mistake in risk management is treating a portfolio of risks as a list. Risks talk to each other — and the conversation is where the real danger lives.</Lead>
      <p className="measure">Picture a bank in 2007. Its mortgage book, its trading desk, and its funding lines each looked manageable on their own register. What no one aggregated was that all three depended on one thing: house prices staying up. When that single driver turned, the “independent” risks fell together, and the diversification everyone assumed simply wasn’t there. That is the failure of silos — not that each risk was mis-measured, but that nobody added them up the way reality would.</p>
      <p className="measure">Aggregation is the spine of this whole part. Before you go deep on any one family of risk, you have to grasp that the enterprise total is not the sum of the parts — sometimes it’s less, because risks diversify, and sometimes, exactly when it matters most, it’s far more, because they don’t.</p>

      <Objectives items={[
        'Explain why siloed risk lists understate true exposure.',
        'Describe diversification and why aggregate ≠ sum.',
        'See how correlation governs the diversification benefit — and how crises destroy it.',
        'Build a portfolio view of your register (Artifact A9).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Why silos fail" />
      <p className="measure">Three things hide inside siloed lists. <em>Common drivers</em>: separate risks that share a single cause — one interest-rate move, one key supplier, one cloud provider — and so move together. <em>Hidden concentration</em>: small exposures in many places that add up to a dangerous bet on one thing. And <em>mis-stated diversification</em>: the comforting assumption that risks are independent, which holds in calm times and breaks in storms. None of these is visible one risk at a time. They only appear when you stand back and look at the portfolio as a whole — which is precisely what an enterprise risk function exists to do.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Aggregate is not sum" />
      <p className="measure">You don’t need the formula, only its shape. If you add up the standalone worst case of every risk, you get a big, scary number — but it assumes every disaster happens on the same afternoon, which they rarely do. The true aggregate accounts for the fact that risks partly cancel, and how much they cancel depends on one quantity: <em>correlation</em>. At low correlation, the aggregate sits well below the naïve sum — that gap is the diversification benefit. As correlation climbs toward 1, the gap closes and the aggregate rises back to the sum. The cruel twist is that correlations are low in calm markets and lurch toward 1 in a crisis, so the diversification you bank on is weakest exactly when you need it. The tool lets you feel this directly: drag the correlation, or hit “crisis,” and watch the real total move.</p>
      <Pull>Diversification is a loan from calm markets that a crisis calls back — usually at the worst possible moment.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="See your portfolio" />
      <p className="measure">Take your register and look at it as one portfolio. Compare the sum-of-silos against the diversified aggregate, then push the correlation up and watch the benefit evaporate. This is the view a board almost never sees and most needs. Saved as Artifact A9, it sits at the centre of your risk universe.</p>
      <PortfolioAggregation lessonId="3.1" artifactId="A9-portfolio" />
    </LessonShell>
  );
}
