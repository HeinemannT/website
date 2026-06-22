import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { PortfolioViz } from '../tools/PortfolioViz.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';
import { Rubric } from '../components/Rubric.jsx';

const lesson = getLesson('4.6');

const pathway = [
  { kind: 'watch', t: 'Diversification, in one picture', src: 'short practitioner explainer', min: 6, tier: 'warmup', why: 'Get the “two jagged lines add up smoother” idea before the algebra.' },
  { kind: 'read', t: '“When Diversification Fails”', src: 'Financial Analysts Journal / CFA Institute', href: 'https://www.cfainstitute.org/', min: 20, tier: 'core', why: 'The definitive accessible treatment of why crisis correlations break the benefit you counted on.' },
  { kind: 'do', t: 'Visualize your portfolio and stress its correlation', src: 'the tool in this lesson → Artifact A11', tier: 'apply', why: 'Slide ρ toward 1 and watch the free lunch evaporate.' },
  { kind: 'book', t: 'Risk Management and Financial Institutions — correlation & portfolio risk', src: 'John Hull (the accessible parts)', tier: 'deeper' },
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
  { q: 'Why is diversification called a benefit the market “revokes when you most need it”?', options: [
    { text: 'Correlations are estimated in calm data but spike toward 1 under stress, so the offset that smooths your book disappears exactly when losses cluster.', correct: true },
    { text: 'Because regulators force you to sell diversified assets in a crisis.' },
    { text: 'Because volatility always falls in a crisis, removing the gap.' }] },
];

export default function Lesson46() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Part 3 showed why aggregation matters in words. This lesson lets you watch it happen — and watch it betray you as a crisis pulls every risk into line.</Lead>

      <p className="measure">Hold two risks that don’t move in perfect lockstep and something almost magical happens: the ups of one partly cancel the downs of the other, so the combined risk is <em>less</em> than the two added up. That’s diversification — “the only free lunch in finance,” as the saying goes, because it lowers risk without lowering expected return. But the size of the discount depends entirely on one number, the correlation between the risks, and that number is not fixed. In normal times it’s comfortably low; in a crisis it lurches toward one, the cancellation stops, and the free lunch is quietly taken away — at the precise moment you were relying on it.</p>

      <p className="measure">Here is how to work through the topic — the picture first, then the one reading that matters most (how the benefit breaks in a crisis), then build the formula behind the visualizer and stress it on your own book.</p>

      <Pathway lessonId="4.6" items={pathway} />

      <Objectives items={[
        'Explain how correlation drives the diversification benefit — and why it is the single dial that governs its size.',
        'See why aggregate risk is less than the sum — until correlations rise and it isn’t.',
        'Connect this to the portfolio aggregation idea from lesson 3.1 — it is the same algebra on a real portfolio.',
        'Explore diversification for your organization (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="The only free lunch — on loan" />
      <p className="measure">Diversification is why you don’t bet the company on a single risk, a single customer, a single market. Spread the exposure across things that don’t all fail together and the portfolio is steadier than any piece of it. The reason this is special — and why it earns the “only free lunch” label — is that almost every other way to cut risk costs you something: hold cash and you give up return, buy insurance and you pay a premium, hedge and you pay a spread. Diversification asks for none of that. Combine two assets with the same expected return but imperfectly correlated movements and you keep the full expected return while the volatility falls. The return is the weighted average; the risk is <em>less</em> than the weighted average. That gap, free of charge, is the whole prize.</p>

      <p className="measure">The mechanism is just cancellation. Picture two jagged loss lines through time. If they peak and trough at the same moments — they move together — then adding them yields a line just as jagged, twice as tall: no smoothing. But if one tends to dip while the other rises, the sum is flatter than either alone, because the bad days of one land on the good days of the other. How much they offset is governed by exactly one quantity: the <strong>correlation</strong> ρ, which runs from −1 to +1. At ρ = +1 the two move in perfect lockstep and there is <em>no</em> benefit — portfolio risk is simply the weighted average of the standalone risks. As ρ falls below 1 the offset kicks in and portfolio risk drops below that average. At ρ = 0 (independent risks) the benefit is substantial. And at ρ = −1 the cancellation is total: in principle you can blend the two into a portfolio with <em>zero</em> risk. Correlation is the single dial, and the entire size of the discount turns on where it sits.</p>

      <p className="measure">This is the same move you met in lesson 3.1, now made literal. There, the lesson was that you cannot add risks up as silos — a register’s “total” risk is not the sum of the rows, because some rows rise and fall together while others don’t. Meridian’s register made the point concretely: R5, R7, R9 and R13 all trace partly to a single driver (commodities and climate), and R4, R6, R11 and R12 all worsen together in a demand downturn. Risks inside such a <em>correlated cluster</em> behave like assets at high ρ — they offer little diversification against each other and they hit at once. Risks across unrelated clusters behave like assets at low ρ and genuinely offset. The portfolio mathematics in this lesson is precisely the engine that 3.1 was describing in words: aggregation is correlation-weighted, not additive.</p>

      <p className="measure">The catch, learned painfully in every crisis, is that “don’t all fail together” is an assumption about correlation, and correlations are treacherous: they’re estimated from calm data and they rise sharply under stress. In normal equity markets average pairwise correlation might sit near 0.3; in 2008 and again in March 2020 it spiked toward 0.8 and beyond as investors sold everything at once and previously unrelated assets began moving in unison. So the diversification you count on is strongest in calm weather and weakest in a storm — a discount the market offers when you don’t need it and revokes the moment you do. This is <em>tail dependence</em>, and it is invisible to a single correlation number computed in quiet times. That’s not a reason to abandon diversification — it’s a reason never to spend it as if it were guaranteed, and instead to stress-test the correlation upward and see how much of the benefit survives.</p>

      <p className="measure"><strong>Meridian, worked.</strong> Treasury runs a €60m reserve portfolio: roughly 60% in bonds (volatility about 6%) and 40% in equities (volatility about 18%), with a calm-time correlation around 0.3. Add the two as if they were independent silos and you’d expect the “just add them up” instinct to point at the weighted-average volatility: 0.6 × 6% + 0.4 × 18% = 10.8%. That weighted average is what you’d suffer if the two moved in perfect lockstep — it is the ρ = 1 answer, no benefit. But at ρ = 0.3 the covariance term shrinks, and the actual portfolio volatility works out to about 9.0% (you’ll build the exact calculation in Stage 3). The difference — nearly 2 percentage points of volatility on €60m, on the order of €1m of risk that simply isn’t there — is the diversification benefit, claimed for free. Now imagine a 2008-style crisis. Push ρ toward 1 and the portfolio volatility climbs back toward 10.8%: the benefit evaporates and the reserve that looked comfortably steady starts moving like a single concentrated bet, exactly when Meridian — facing a demand downturn that is already squeezing EBITDA toward its covenant — can least afford a hit to its reserves. The free lunch was real in calm weather and gone in the storm.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="One number governs the discount" />
      <p className="measure">The visualizer plots your portfolio’s risk against correlation. At low correlation the combined risk sits well below the dashed “just add them up” line — that gap is your diversification benefit. Slide correlation toward one, or hit “crisis,” and the curve rises to meet the line: the benefit melts. You don’t need to derive the formula behind the curve; you need the picture in your head, so that the next time someone says “we’re diversified,” you ask the right question — <em>diversified under what correlation, and what happens to that number in a storm?</em> The honest reflex is to treat the calm-time correlation as the optimistic case and the answer at ρ near 1 as the case you must survive.</p>

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

      <p className="measure">Run your function on Meridian’s reserve portfolio — <code>portfolioVol(6, 18, 0.6, 0.3)</code> — and you’ll get about 9.0%, against the 10.8% weighted average it would suffer at ρ = 1. Then move the correlation in the visualizer and feel the benefit appear and vanish. Then look back at your register: which risks share a driver, and would move together exactly when you hoped they wouldn’t? Saved into Artifact A11 — your quantification of the risk universe is complete.</p>
      <PortfolioViz lessonId="4.6" artifactId="A11-portfolio" />

      <Rubric
        title="a credible portfolio-diversification analysis"
        criteria={[
          { c: 'Names the standalone risks and weights', good: 'each asset or risk has a volatility and a weight, not just a label' },
          { c: 'States the correlation explicitly', good: 'the calm-time ρ is written down and sourced, not assumed to be zero' },
          { c: 'Quantifies the benefit', good: 'shows portfolio risk vs. the weighted-average (ρ=1) line — the gap is the benefit' },
          { c: 'Stresses the correlation upward', good: 'reports what happens at ρ→1, i.e. how much benefit survives a crisis' },
          { c: 'Connects to the register clusters', good: 'identifies which risks share a driver and so behave like high-ρ assets' },
        ]}
        exemplar="Meridian reserve: bonds σ=6% (60%) + equities σ=18% (40%), ρ=0.3 → portfolio vol ≈ 9.0% vs 10.8% weighted average — a ~1.8pt benefit (~€1m on €60m). Stress ρ→1 and it returns to 10.8%: the benefit is gone exactly in the downturn that threatens the covenant."
      />

      <DoNow>Before you trust any “we’re diversified” claim on your own book, read “When Diversification Fails” (pathway step 2, ~20 min) for how the calm-time correlation you relied on behaves in 2008/2020 — the number the visualizer’s “crisis” button is dramatizing.</DoNow>

      <ProblemSet items={[
        { q: 'Two risks each have 20% volatility, held 50/50. What is the portfolio volatility at ρ = 0? At ρ = 1?', solution: 'ρ=0: √(0.25·400 + 0.25·400) = √200 ≈ 14.1%. ρ=1: √(0.25·400 + 0.25·400 + 2·0.25·1·400) = √400 = 20% (the weighted average). Independence buys ~6 points of risk reduction; perfect correlation buys nothing.' },
        { q: 'Why is assuming a single fixed correlation dangerous in risk management?', solution: 'Correlations rise under stress. A book that looks well-diversified at ρ=0.2 can behave like ρ=0.9 precisely when losses cluster, so the diversification benefit evaporates exactly when it’s needed. Stress the correlation, don’t trust the calm-time estimate.' },
      ]} />
    </LessonShell>
  );
}
