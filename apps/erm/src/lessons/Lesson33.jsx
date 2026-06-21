import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.3');
const readings = [
  { kind: 'FREE', title: 'Basel Framework — CRE (credit risk) & market risk standards (BIS)', note: 'The authoritative source on how banks define and size these risks (skim the overviews).' },
  { kind: 'BOOK', title: 'Risk Management and Financial Institutions', note: 'John Hull, 6th ed. — the standard reference on market, credit, and liquidity risk.' },
];
const retrieval = [
  { q: 'Credit risk’s expected loss is, in essence…', options: [
    { text: 'probability of default × loss given default × exposure at default.', correct: true },
    { text: 'revenue minus costs.' },
    { text: 'the value-at-risk of the trading book.' }] },
  { q: 'Liquidity risk is the danger that…', options: [
    { text: 'you can’t pay what’s due, or can’t sell an asset, when you need to — even while solvent on paper.', correct: true },
    { text: 'prices move against you.' },
    { text: 'a counterparty defaults.' }] },
];

export default function Lesson33() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Financial risk is the family people <em>think</em> the whole subject is about. It isn’t — but it’s the most measurable, and worth knowing precisely.</Lead>
      <p className="measure">It splits cleanly into three. <em>Market risk</em>: the prices you’re exposed to move against you — exchange rates, commodity prices, interest rates, asset values. <em>Credit risk</em>: someone who owes you money doesn’t pay — a customer, a borrower, a counterparty. <em>Liquidity risk</em>: you can’t meet a payment when it’s due, or can’t sell something without crashing its price — and this one kills even profitable firms, because solvency on paper means nothing if you run out of cash on Friday. Almost every organization has all three, even non-financial ones: a manufacturer importing materials has currency risk, sells on credit to distributors, and needs cash to make payroll.</p>

      <Objectives items={[
        'Define market, credit, and liquidity risk and tell them apart.',
        'Know, at intuition level, what sizes each one.',
        'Add your organization’s financial risks to the register, owned by treasury.',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Three ways money goes wrong" />
      <p className="measure">These risks are owned by the treasury function and the CFO, and they’re the home turf of the quantitative toolkit — which is exactly why people mistake them for the whole of risk management. Keep them in proportion: they’re one family of several, distinguished mainly by being unusually tractable to measurement. That tractability is a gift, not a licence to ignore the families that resist it.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="What sizes each one" />
      <p className="measure">Each has a signature measure, and you only need to know what it tells you. Market risk is summarised by <em>value-at-risk</em> and its better-behaved cousin <em>expected shortfall</em> — “how bad is a bad day?” — which you’ll build and critique in Part 4. Credit risk’s expected loss is, at heart, three numbers multiplied: the probability the counterparty defaults, the fraction you’d lose if they did, and how much you’re owed at that point (PD × LGD × EAD). Liquidity risk is watched through coverage and runway — how many days or months of obligations you can meet from ready cash. None of this needs deriving here; it needs recognising, so that when a treasurer quotes a VaR or a coverage ratio, you know what they’ve told you and, just as important, what they haven’t.</p>
      <Pull>Financial risk is the measurable slice — which makes it the easiest to manage and the easiest to over-trust. The number is a servant, not an oracle.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Add your financial risks" />
      <p className="measure">Where is your organization exposed to moving prices, to counterparties who might not pay, to a cash crunch? Add these to your register under treasury ownership.</p>
      <FamilyLens lessonId="3.3" artifactId="A10-financial" family="Financial" ownerHint="treasury / CFO"
        sizing="Market risk → value-at-risk / expected shortfall (Part 4). Credit risk → expected loss ≈ PD × LGD × EAD. Liquidity risk → coverage ratios and days of cash runway." />
    </LessonShell>
  );
}
