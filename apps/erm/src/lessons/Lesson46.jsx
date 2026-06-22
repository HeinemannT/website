import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { PortfolioViz } from '../tools/PortfolioViz.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';

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

      <MathBlock>
        <p>For two risks with volatilities <span className="eq">σ₁, σ₂</span>, weights <span className="eq">w</span> and <span className="eq">1−w</span>, and correlation <span className="eq">ρ</span>, the portfolio variance is</p>
        <p style={{ textAlign: 'center' }}><span className="eq">σ_p² = w²σ₁² + (1−w)²σ₂² + 2·w(1−w)·ρ·σ₁σ₂</span></p>
        <p>The first two terms are the standalone risks; the third — the covariance term — is where diversification lives. At <span className="eq">ρ = 1</span> the expression is a perfect square and <span className="eq">σ_p</span> equals the weighted average of the two vols: no benefit. At <span className="eq">ρ &lt; 1</span>, <span className="eq">σ_p</span> falls below that average, and at <span className="eq">ρ = −1</span> risk can in principle be driven to zero. The general case is <span className="eq">σ_p = √(wᵀ Σ w)</span> for a covariance matrix Σ — the same idea, scaled to many assets.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Build the portfolio-risk formula" />
      <p className="measure">The visualizer draws the curve of portfolio risk against correlation. Build the formula behind it — combine two volatilities under a correlation — and you’ll feel exactly where the diversification benefit comes from and where it goes.</p>

      <CodeExercise
        id="4.6-port"
        title="Write the portfolio-volatility function"
        prompt="Given two volatilities, a weight w in the first, and a correlation rho, return the portfolio volatility (the square root of the variance above)."
        entry="portfolioVol"
        starter={`// s1, s2: volatilities (%)   w: weight in s1 (0–1)   rho: correlation (−1…1)
function portfolioVol(s1, s2, w, rho) {
  // TODO: return sqrt( w^2 s1^2 + (1-w)^2 s2^2 + 2 w (1-w) rho s1 s2 )
  return 0;
}`}
        solution={`function portfolioVol(s1, s2, w, rho) {
  const variance =
    w * w * s1 * s1 +
    (1 - w) * (1 - w) * s2 * s2 +
    2 * w * (1 - w) * rho * s1 * s2;
  return Math.sqrt(variance);
}`}
        test={(fn) => {
          const indep = fn(20, 15, 0.5, 0);
          const perfect = fn(20, 15, 0.5, 1);
          return (Math.abs(indep - 12.5) < 1e-6 && Math.abs(perfect - 17.5) < 1e-6)
            ? { pass: true, summary: `Correct — at ρ=0 the 50/50 mix has vol 12.5% (below either risk); at ρ=1 it’s 17.5%, exactly the weighted average. The gap is diversification.` }
            : { pass: false, summary: `Got ${indep && indep.toFixed ? indep.toFixed(2) : indep}% at ρ=0 and ${perfect && perfect.toFixed ? perfect.toFixed(2) : perfect}% at ρ=1 (expected 12.5% and 17.5%). Check the covariance term 2·w·(1−w)·ρ·s1·s2.` };
        }}
      />

      <p className="measure">Now move the correlation in the visualizer and feel the benefit appear and vanish. Then look back at your register: which risks share a driver, and would move together exactly when you hoped they wouldn’t? Saved into Artifact A11 — your quantification of the risk universe is complete.</p>
      <PortfolioViz lessonId="4.6" artifactId="A11-portfolio" />

      <ProblemSet items={[
        { q: 'Two risks each have 20% volatility, held 50/50. What is the portfolio volatility at ρ = 0? At ρ = 1?', solution: 'ρ=0: √(0.25·400 + 0.25·400) = √200 ≈ 14.1%. ρ=1: √(0.25·400 + 0.25·400 + 2·0.25·1·400) = √400 = 20% (the weighted average). Independence buys ~6 points of risk reduction; perfect correlation buys nothing.' },
        { q: 'Why is assuming a single fixed correlation dangerous in risk management?', solution: 'Correlations rise under stress. A book that looks well-diversified at ρ=0.2 can behave like ρ=0.9 precisely when losses cluster, so the diversification benefit evaporates exactly when it’s needed. Stress the correlation, don’t trust the calm-time estimate.' },
      ]} />
    </LessonShell>
  );
}
