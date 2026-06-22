import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';
import { PortfolioAggregation } from '../tools/PortfolioAggregation.jsx';

const lesson = getLesson('3.1');

const pathway = [
  { kind: 'read', t: '“Managing Risks: A New Framework”', src: 'Kaplan & Mikes, HBR (2012)', href: 'https://www.ferma.eu/app/uploads/2013/03/hbr-managing-risks-a-new-framework.pdf', min: 20, tier: 'core', why: 'The classic argument that risk must be managed as an enterprise portfolio, not a list of silos.' },
  { kind: 'read', t: 'Aggregating risk into an enterprise view', src: 'NC State ERM Initiative (erm.ncsu.edu)', href: 'https://erm.ncsu.edu', min: 12, tier: 'core', why: 'Why siloed lists structurally understate true exposure — the case for rolling risks up.' },
  { kind: 'read', t: '“Developments in Modelling Risk Aggregation”', src: 'BIS Joint Forum (2010)', href: 'https://www.bis.org/publ/joint25.htm', min: 25, tier: 'deeper', why: 'How firms aggregate — summation, variance-covariance, copulas — and where each gives false comfort.' },
  { kind: 'do', t: 'Build the portfolio view of your register', src: 'the builder in this lesson → Artifact A9', tier: 'apply', why: 'Turn your silo list into a diversified aggregate and watch the benefit move with correlation.' },
  { kind: 'book', t: 'Enterprise Risk Management — the portfolio chapter', src: 'James Lam (2nd ed., 2014)', tier: 'deeper' },
];

const retrieval = [
  { q: 'Why is the true aggregate exposure usually less than the sum of each risk’s standalone worst case?', options: [
    { text: 'The worst cases rarely coincide — when risks are less than perfectly correlated, the bad days don’t all land together, so they partly cancel.', correct: true },
    { text: 'Because adding the numbers up is error-prone.' },
    { text: 'Because every worst case is exaggerated by definition.' }] },
  { q: 'The governing quantity that decides how much an aggregate falls below the naïve sum is…', options: [
    { text: 'correlation — at ρ near 0 the diversification benefit is large; as ρ → 1 it shrinks to zero and the aggregate rises back to the sum.', correct: true },
    { text: 'the number of risks on the register.' },
    { text: 'the largest single impact.' }] },
  { q: 'The dangerous property of diversification, shown by 2008, is that…', options: [
    { text: 'correlations rise toward 1 in a crisis — so the benefit you banked on disappears exactly when you are relying on it.', correct: true },
    { text: 'it never reduces risk in the first place.' },
    { text: 'it makes risks larger during calm periods.' }] },
];

export default function Lesson31() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>In 2007 a bank’s mortgage book, its trading desk, and its funding lines each looked manageable on its own register. What no silo owned was the one fact that mattered: all three rode on house prices staying up. When that single driver turned, the “independent” exposures fell together — and the diversification everyone had quietly assumed was never there.</Lead>

      <p className="measure">That is the failure this lesson exists to fix, and it is the spine of all of Part 3. The error is not that any one risk was mis-measured; it is that nobody added them up the way reality adds them up. A register is a list — credit here, cyber there, commodities below — and a list invites you to read each row in isolation and sum the column. But enterprise risk does not behave like a sum. As Kaplan and Mikes argued in <em>Harvard Business Review</em> (2012), risk has to be managed as a connected portfolio, not a catalogue of independent line items, because the danger lives in how the items move <em>together</em>. The NC State ERM Initiative (erm.ncsu.edu) makes the same point operationally: siloed reporting structurally understates true exposure, because the things that bind risks together are nobody’s job to see.</p>

      <p className="measure">Work the topic in this order — the HBR piece for the portfolio idea, the NC State note for why silos under-state, then build the aggregation for your own register at the end.</p>

      <Pathway lessonId="3.1" items={pathway} />

      <Objectives items={[
        'Explain, via three named mechanisms, why siloed risk lists structurally understate true enterprise exposure.',
        'State the portfolio principle: enterprise risk is not the sum of standalone risks — less when they diversify, more when they correlate.',
        'Use correlation as the governing quantity: explain the diversification benefit and why it collapses toward zero as ρ → 1, including in a crisis.',
        'Build a portfolio view of your register that compares sum-of-silos against the diversified aggregate (Artifact A9).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Why siloed lists under-state exposure" />
      <p className="measure">Three distinct things hide inside a siloed list, and none is visible one row at a time. The first is <strong>common drivers</strong>: separate risks that trace back to a single cause and therefore move together. One interest-rate move, one key supplier, one cloud provider can light up four entries on a register that the taxonomy filed under four different families. Counted separately they look spread out; behind them is one bet. The second is <strong>hidden concentration</strong>: many small, individually-reasonable exposures that quietly add up to one large position — the same counterparty appearing in the loan book and the bond book, the same geography behind both your collateral and your demand, the same vendor under three “unrelated” services. Each line passes its own limit; the aggregate is a concentration no line ever sees. The third is <strong>mis-stated diversification</strong>: the comforting assumption that risks are independent, which is roughly true in calm conditions and false in stress — the error the 2007 bank made when it treated three house-price bets as three separate risks.</p>

      <p className="measure">The BIS Joint Forum’s <em>Developments in Modelling Risk Aggregation</em> (2010) frames the two failure directions precisely: adding risks as if they were independent <em>over</em>-states the diversification benefit, while ignoring common drivers <em>under</em>-states how much they will co-move in the tail — and both errors are dangerous. This is the whole reason an enterprise risk function exists. A business unit can manage its own silo well and still be structurally blind to all three mechanisms, because each one lives <em>between</em> units, in the interactions that no single chain of command owns. Seeing the portfolio is not a nicer version of what the units already do; it is a different job that only exists at the centre.</p>

      <p className="measure">Run it on Meridian. Its starter register lists fourteen risks across every family, and read as a list they look comfortingly varied. But two common-driver clusters bind them. The <strong>commodity-and-climate cluster</strong> — R5 (commodity-price spike, €12m), R7 (flood at the SE-Asia plant, €15m), R9 (FX move on USD-priced inputs, €7m), and R13 (carbon/packaging regulation, €6m) — all push on input cost and supply, and all trace partly to commodities, weather, and the energy transition. The <strong>demand-downturn cluster</strong> — R4 (top retailer drops the contract, €40m), R6 (distributor default, €4m), R11 (downturn breaches the leverage covenant, €25m), and R12 (private-label erosion, €10m) — all worsen together when the consumer pulls back. The case bible states the lesson outright: summed as silos they look spread out; they are not.</p>

      <DoNow>Before the maths, skim the NC State ERM note (pathway step 2, ~12 min) for the practitioner framing of why a stack of silo reports is not an aggregation — the gap this lesson closes.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Aggregate is not sum" />
      <p className="measure">You do not need to derive anything here, only to feel the shape. Sum every risk’s standalone worst case and you get a large, alarming number — but that number assumes every disaster strikes on the same afternoon, which is exactly the independence error from Stage 1 read backwards. The true aggregate accounts for the fact that, when risks are less than perfectly linked, their bad days do not all coincide, so they partly cancel. How much they cancel is governed by one quantity: <strong>correlation</strong>. At low correlation the aggregate sits well below the naïve sum, and that gap <em>is</em> the diversification benefit. As correlation climbs toward 1, the gap closes and the aggregate climbs back up to the sum — at perfect correlation the benefit is exactly zero, because now everything really does happen at once.</p>

      <p className="measure">The cruel twist, and the reason this is more than an accounting nicety, is that correlation is not a constant. It is low in calm markets and lurches toward 1 in a crisis — so the diversification you bank on is weakest at the precise moment you are relying on it. This is what the 2007 bank discovered: in normal times its mortgage, trading, and funding exposures looked weakly related, and the variance-covariance maths duly credited a large diversification benefit; when house prices turned, the shared driver asserted itself, the correlations snapped toward 1, and the benefit it had been holding as capital relief simply evaporated. Diversification, put plainly, is a loan from calm markets that a crisis calls back at the worst possible moment. The BIS Joint Forum (2010) flags exactly this as the central limitation of aggregation models: they can grant false comfort by extrapolating calm-time correlations into the tail. Meridian’s two clusters behave the same way — in an ordinary year R4, R6, R11, and R12 are loosely related, but the case’s “Recession 2027” scenario (volumes −15%, top retailer cuts orders 30%) is precisely the event that drives all four together, so the diversification banked on the silo view disappears just as the covenant tightens.</p>

      <MathBlock>
        <p>The risk of a sum is not the sum of the risks. For exposures with magnitudes <span className="eq">σᵢ</span> sharing a single correlation <span className="eq">ρ</span>, the aggregate scales like</p>
        <p style={{ textAlign: 'center' }}><span className="eq">σ_agg = √( Σ σᵢ² + 2ρ · Σ_(i&lt;j) σᵢσⱼ )</span></p>
        <p>The first term adds each risk on its own; the second — the cross term — is the interaction, and <span className="eq">ρ</span> is the dial on it. At <span className="eq">ρ = 0</span> the cross term vanishes and the risks partly cancel, so <span className="eq">σ_agg</span> falls well below the naïve sum <span className="eq">Σσᵢ</span>: that shortfall is the diversification benefit. At <span className="eq">ρ = 1</span> the bracket collapses to <span className="eq">(Σσᵢ)²</span>, so <span className="eq">σ_agg = Σσᵢ</span> exactly and the benefit is zero. A crisis is the world moving from the first regime to the second. This is the same covariance algebra you will apply to the reserve portfolio in lesson 4.6 — and the portfolio-level loss distribution it produces is the input to economic capital (Part 4), the amount of capital the enterprise must hold against its <em>aggregate</em> tail, not the sum of its silo tails.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="See your portfolio" />
      <p className="measure">First make the relationship concrete by writing it. Given each risk’s magnitude and one shared correlation, return the aggregate — the sum of squares, plus twice the correlation times every distinct pair product, all under a root. The test will confirm that two risks of size 3 and 4 aggregate to 5 when independent (below their sum of 7) and to exactly 7 when perfectly correlated; the gap between those two answers is the diversification benefit, written in code.</p>

      <CodeExercise
        id="3.1-agg"
        title="Write the aggregate-tail function"
        prompt="Return √( Σσᵢ² + 2ρ·Σ_(i<j) σᵢσⱼ ): the sum of squares, plus twice rho times every distinct pair product, all under a square root."
        entry="aggregateTail"
        starter={`// sigmas: array of magnitudes;  rho: correlation 0..1
function aggregateTail(sigmas, rho) {
  let sumSq = 0, cross = 0;
  // TODO: sumSq = sum of sigma^2
  //       cross = sum of sigma_i * sigma_j for every pair i < j
  //       return Math.sqrt(sumSq + 2 * rho * cross)
  return 0;
}`}
        solution={`function aggregateTail(sigmas, rho) {
  let sumSq = 0, cross = 0;
  for (let i = 0; i < sigmas.length; i++) {
    sumSq += sigmas[i] * sigmas[i];
    for (let j = i + 1; j < sigmas.length; j++) {
      cross += sigmas[i] * sigmas[j];
    }
  }
  return Math.sqrt(sumSq + 2 * rho * cross);
}`}
        test={(fn) => {
          const indep = fn([3, 4], 0), perfect = fn([3, 4], 1);
          return (Math.abs(indep - 5) < 1e-9 && Math.abs(perfect - 7) < 1e-9)
            ? { pass: true, summary: `Correct — [3,4] aggregate to 5 when independent (below the sum of 7), and to exactly 7 when perfectly correlated. The gap is the diversification benefit.` }
            : { pass: false, summary: `Got ${indep} at ρ=0 and ${perfect} at ρ=1 (expected 5 and 7). Sum the squares, add 2·ρ·(every pair product), take the root.` };
        }}
      />

      <p className="measure">Now turn the same logic on your own register. The builder takes your per-risk magnitudes, computes the sum-of-silos and the diversified aggregate side by side, and lets you push the correlation up — or hit “crisis” — to watch the diversification benefit shrink toward zero. This is the view a board almost never sees and most needs: the one number that says how big the enterprise bet actually is, and how much of your apparent safety is borrowed from the assumption that the bad days stay apart. Saved as Artifact A9, it sits at the centre of your risk universe and feeds every later part.</p>

      <PortfolioAggregation lessonId="3.1" artifactId="A9-portfolio" />

      <p className="measure">Read your dashboard back through the questions that matter. <em>Where is the gap between sum-of-silos and aggregate largest?</em> — that is where you are claiming the most diversification, and so where a hidden common driver would hurt most. <em>Which risks share a single cause?</em> — find your equivalent of Meridian’s commodity cluster and ask whether your model still treats them as independent. <em>What happens to the gap under “crisis”?</em> — if a stressed correlation wipes out most of the benefit, then the calm-time aggregate was capital relief you cannot count on. Hold the artifact to this standard:</p>

      <Rubric
        title="a strong portfolio aggregation view"
        criteria={[
          { c: 'Sized, not sorted', good: 'each risk carries a magnitude, so the view computes an aggregate — not a heat-map of silos with no total' },
          { c: 'Aggregate vs sum shown', good: 'the diversification benefit is explicit as the gap between sum-of-silos and the correlated aggregate' },
          { c: 'Common drivers named', good: 'risks sharing one cause are identified as a cluster, not scattered across families as if independent' },
          { c: 'Concentration surfaced', good: 'a shared vendor, counterparty, or geography appearing across families is flagged as one bet' },
          { c: 'Stress-tested correlation', good: 'the benefit is re-checked at crisis-level correlation, not only at calm-time correlation' },
        ]}
        exemplar="Meridian: R5/R7/R9/R13 grouped as the commodity-and-climate cluster, R4/R6/R11/R12 as the demand-downturn cluster; sum-of-silos €X vs diversified aggregate €Y in a normal year; under ‘Recession 2027’ the downturn cluster correlates and the gap nearly closes, tightening the covenant just as the benefit vanishes."
      />

      <p className="measure">A worked correction, because it is the most common mistake. A planner totals Meridian’s demand-downturn cluster as silos: R4 €40m + R6 €4m + R11 €25m + R12 €10m = €79m, then reassures the board that these are “different risks in different functions,” implicitly crediting a large diversification benefit and reporting an aggregate far below €79m. In a calm year that is roughly right — the four rarely strike together. But all four are driven by the same thing: consumer demand. The fix is to identify the common driver, group the cluster, and re-run the aggregate at the correlation that a recession actually produces. Under “Recession 2027” the retailer cuts orders, the distributor’s receivables sour, EBITDA falls toward the covenant, and private-label gains share — simultaneously. The correlation snaps toward 1, the aggregate climbs back toward the €79m sum, and the diversification the planner banked vanishes at the exact moment the covenant is under most pressure. Summing as silos over-stated the calm-time total; assuming the calm-time correlation would hold understated the crisis. Both errors, one cluster.</p>

      <ProblemSet items={[
        { q: 'Meridian’s risk owners report R5, R7, R9 and R13 to four different executives (Treasurer, COO, Treasurer, Sustainability Lead). Why does this reporting structure itself create risk, and what is the fix?', solution: 'Each owner can manage their row well and still miss that all four push on input cost and supply, and all four trace partly to commodities, weather, and the energy transition — a single common-driver cluster. Because no single owner sees the cluster, the firm under-prices the chance that input costs blow out on several fronts at once. The fix is the enterprise (portfolio) layer: group R5/R7/R9/R13 as one commodity-and-climate exposure, aggregate them with a correlation that reflects their shared driver rather than treating them as independent, and give the CRO ownership of the interaction that no single executive owns.' },
        { q: 'A colleague argues that since Meridian’s calm-time aggregate sits well below the sum-of-silos, the firm is carrying plenty of spare capacity and could take on more risk. Where is the error?', solution: 'The gap below the sum is the diversification benefit, and it is real only at calm-time correlations. It is, in effect, a loan from calm markets. The “Recession 2027” stress is precisely the event that drives the demand-downturn cluster (R4/R6/R11/R12) together — correlations rise toward 1, the aggregate climbs back toward the sum, and most of that apparent spare capacity disappears just as the covenant tightens. Spare capacity must be judged at stressed correlation, not calm correlation; reading the calm-time gap as headroom is the same mistake that left the 2008 banks under-capitalised when their “independent” house-price exposures fell together.' },
      ]} />

      <p className="measure">You now hold the enterprise total — the one quantity the rest of Part 3 keeps decomposing. Every family lesson that follows (strategic, financial, operational, conduct, technology, climate, model) writes its rows back into this view, and the aggregation you built here is what turns those rows from a list into a portfolio. The next lessons go deep on each family in turn; keep asking, of every new risk, which cluster it belongs to and whose calm-time independence it is quietly borrowing.</p>
    </LessonShell>
  );
}
