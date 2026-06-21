import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { PortfolioViz } from '../tools/PortfolioViz.jsx';

const lesson = getLesson('4.6');
const readings = [
  { kind: 'FREE', title: 'CFA Institute — “When Diversification Fails”', note: 'Why correlations rise in crises and diversification thins exactly when needed.' },
  { kind: 'BOOK', title: 'Risk Management and Financial Institutions', note: 'John Hull — correlation, copulas, and portfolio risk (the accessible parts).' },
];
const retrieval = [
  { q: 'Combining two imperfectly-correlated risks gives a portfolio whose risk is…', options: [
    { text: 'less than the weighted sum of the individual risks — the diversification benefit.', correct: true },
    { text: 'always equal to the larger of the two.' },
    { text: 'always the sum of the two.' }] },
  { q: 'The diversification benefit shrinks as…', options: [
    { text: 'correlation rises toward 1 — which is what happens in a crisis.', correct: true },
    { text: 'volatility falls.' },
    { text: 'you add more cash.' }] },
];

export default function Lesson46() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>Part 3 showed why aggregation matters in words. This lesson lets you watch it happen — and watch it betray you as a crisis pulls every risk into line.</Lead>
      <p className="measure">Hold two risks that don’t move in perfect lockstep and something almost magical happens: the ups of one partly cancel the downs of the other, so the combined risk is <em>less</em> than the two added up. That’s diversification — the only free lunch in finance, as the saying goes. But the size of the discount depends entirely on one number, the correlation between the risks, and that number is not fixed. In normal times it’s comfortably low; in a crisis it lurches toward one, the cancellation stops, and the free lunch is quietly taken away — at the precise moment you were relying on it.</p>

      <Objectives items={[
        'Explain how correlation drives the diversification benefit.',
        'See why aggregate risk is less than the sum — until it isn’t.',
        'Connect this to the portfolio aggregation idea from Part 3.',
        'Explore diversification for your organization (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="The only free lunch — on loan" />
      <p className="measure">Diversification is why you don’t bet the company on a single risk, a single customer, a single market. Spread the exposure across things that don’t all fail together and the portfolio is steadier than any piece of it. The catch, learned painfully in every crisis, is that “don’t all fail together” is an assumption about correlation, and correlations are treacherous: they’re estimated from calm data and they rise sharply under stress. So the diversification you count on is strongest when you least need it and weakest when you most do. That’s not a reason to abandon it — it’s a reason to stress-test it.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="One number governs the discount" />
      <p className="measure">The visualizer plots your portfolio’s risk against correlation. At low correlation the combined risk sits well below the dashed “just add them up” line — that gap is your diversification benefit. Slide correlation toward one, or hit “crisis,” and the curve rises to meet the line: the benefit melts. You don’t need the formula behind the curve; you need the picture in your head, so that the next time someone says “we’re diversified,” you ask the right question — <em>diversified under what correlation, and what happens to that number in a storm?</em></p>
      <Pull>Diversification is a discount the market offers in calm weather and revokes in a crisis. Never spend it as if it were guaranteed.</Pull>

      <Stage n={3} kicker="Build it on your organization" title="Explore your diversification" />
      <p className="measure">Set two risk sources, weight them, and move the correlation to feel the benefit appear and vanish. Then look back at your register: which of your risks share a driver, and would move together exactly when you hoped they wouldn’t? Saved into Artifact A11 — the quantification of your risk universe is complete.</p>
      <PortfolioViz lessonId="4.6" artifactId="A11-portfolio" />
    </LessonShell>
  );
}
