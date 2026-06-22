import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { DecisionExplorer } from '../tools/DecisionExplorer.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { fmt } from '../tools/riskmath.js';

const lesson = getLesson('4.1');

const pathway = [
  { kind: 'watch', t: 'Expected value, decision trees & the value of information', src: 'short decision-analysis explainer', min: 10, tier: 'warmup', why: 'See a tree fold back to one number before you read the detail.' },
  { kind: 'read', t: 'Expected value of perfect information — definition + worked example', src: 'reference explainer', min: 12, tier: 'core', why: 'The one idea most people skip: what removing uncertainty is actually worth.' },
  { kind: 'course', t: '1.151 Probability & Statistics in Engineering — decision analysis', src: 'MIT OpenCourseWare (ocw.mit.edu)', href: 'https://ocw.mit.edu/courses/1-151-probability-and-statistics-in-engineering-spring-2005/', min: 40, tier: 'core', why: 'Decision trees and risk-based decisions from a free, rigorous source.' },
  { kind: 'do', t: 'Work a real decision your organization faces', src: 'the DecisionExplorer in this lesson → Artifact A11', tier: 'apply', why: 'Compute EVs, then test whether the spread changes your choice.' },
  { kind: 'book', t: 'How to Measure Anything — value of information & calibration', src: 'Douglas Hubbard', tier: 'deeper', why: 'Why “immeasurable” is usually wrong, and how to price a study.' },
];

const retrieval = [
  { q: 'Expected value of an option is…', options: [
    { text: 'the probability-weighted average of its outcomes.', correct: true },
    { text: 'its best possible outcome.' },
    { text: 'its worst possible outcome.' }] },
  { q: 'Choosing a lower-EV, lower-spread option can be rational because of…', options: [
    { text: 'risk aversion — paying a little expected value to avoid a painful downside.', correct: true },
    { text: 'a calculation error.' },
    { text: 'ignoring probability.' }] },
  { q: 'EVPI (expected value of perfect information) is…', options: [
    { text: 'the most you’d rationally pay to remove the uncertainty before deciding.', correct: true },
    { text: 'the expected value of the best option.' },
    { text: 'always equal to the cost of a consultant.' }] },
];

export default function Lesson41() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Now the maths begins — and it begins late, on purpose. Everything in Parts 1–3 was about deciding <em>which</em> risks matter. This part is about putting numbers on the ones that will hold them, starting with the simplest quantitative idea in all of risk: the expected value of a decision.</Lead>

      <p className="measure">You face a choice; each option leads to uncertain outcomes; each outcome has a probability and a payoff. Multiply each payoff by its probability, add them up, and you have the expected value — the average result if you could make this decision over and over. That one operation already teaches the core move of quantitative risk: stop arguing about whether a bad thing <em>could</em> happen, and start weighing how likely against how much. Here is how to work through it — the video for the shape of the idea, the EVPI reading for the part people skip, the MIT course for rigour, then the build at the end.</p>

      <Pathway lessonId="4.1" items={pathway} />

      <Objectives items={[
        'Compute and compare expected values across decisions, and fold a decision tree back to one number per choice.',
        'Read EVPI as the ceiling on what removing uncertainty is worth.',
        'Explain why a risk-averse firm rationally rejects a higher-EV, higher-variance option.',
        'See how the quality of a decision depends on the quality of the probabilities — and work a real decision for your organization (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Weighing likelihood against consequence" />
      <p className="measure">A <strong>decision tree</strong> is this idea drawn out, and its discipline is in keeping two kinds of fork apart. <strong>Decision nodes</strong> (drawn as squares) are the forks <em>you</em> control — which option you pick. <strong>Chance nodes</strong> (drawn as circles) are the forks the world controls — how demand turns out, whether a market opens up. At the tips sit payoffs. You evaluate the tree by <em>folding back</em>, right to left: at each chance node you take the probability-weighted average of its branches (an expected value), and at each decision node you take the <em>maximum</em> — you assume you’ll pick the best available branch. Fold the whole tree and a fog of “what ifs” collapses into one comparable number per choice. The drawing is not decoration; it forces you to name every outcome and every probability before you average, which is exactly where loose thinking gets caught.</p>

      <p className="measure">But expected value answers only one question — “which choice pays best on average?” — and average is not everything. The phrase hides an assumption that often fails: that this is a bet you play <em>many times</em>, so the average is what you’ll actually experience. Most real decisions are played once, and ruin is permanent. A positive-EV bet that has a real chance of bankrupting you is still a bad bet, because there is no “next round” to revert to the mean. So a choice with a slightly higher EV but a catastrophic downside can be the wrong one for an organization that cannot survive the bad branch. That is not irrational — it is <strong>risk aversion</strong>, and recognising when it should override raw EV is a mark of judgement, not weakness.</p>

      <p className="measure">The way to make risk aversion precise is <strong>utility</strong>. Instead of valuing money linearly, a risk-averse decider runs payoffs through a <em>concave</em> utility curve — one that rises but flattens, so the second million is worth less than the first, and a loss hurts more than the equal gain helps. The consequence is the <strong>certainty equivalent</strong>: the sure amount that feels as good as the gamble. For a concave curve it sits <em>below</em> the gamble’s mean (this is Jensen’s inequality, met in the maths panel), and the gap is the risk premium — what the firm would pay to convert an uncertain outcome into a certain one. A risk-averse firm maximises <em>expected utility</em>, not expected value, which is precisely why a lower-EV, lower-spread option can win when the spread reaches into territory the firm cannot afford.</p>

      <p className="measure">One more tool before the case, because it changes which conversations are worth having: the <strong>expected value of perfect information</strong> (EVPI). It answers “how much should I pay to remove the uncertainty before I decide?” Compute the EV of your best action under today’s uncertainty; then compute the EV you’d get if a perfect oracle told you the outcome <em>in advance</em> and you chose optimally each time. The difference is EVPI — a hard ceiling on what any study, pilot, consultant, or data purchase can be worth, because nothing buys more than perfect knowledge. The counter-intuitive lesson is that a dramatic-feeling uncertainty can have a tiny EVPI: if both choices lead to similar payoffs whatever happens, knowing the answer changes nothing, so paying to learn it is waste.</p>

      <p className="measure">Watch all of this land on a live Meridian decision. The board is choosing how to chase its growth objectives, and two options are on the table for the year’s strategic capital. <strong>Option A — expand into a new emerging market:</strong> big and bimodal. If the entry lands (probability ~45%) it adds about <strong>+€40m</strong> to value over the horizon and accelerates the “double emerging-market sales” goal; if it stalls (~55%) the sunk build-out and stranded local costs run to about <strong>−€15m</strong>. That gives Option A an EV of <span className="eq">0.45·40 + 0.55·(−15) = 18 − 8.25 = +€9.75m</span>. <strong>Option B — premiumise the core:</strong> steadier, aimed at the 10%→13% margin goal. Reformulation and brand investment return about <strong>+€16m</strong> if it takes (~60%) and about <strong>−€3m</strong> if private-label pressure blunts it (~40%), for an EV of <span className="eq">0.60·16 + 0.40·(−3) = 9.6 − 1.2 = +€8.4m</span>. On raw EV, A wins by ~€1.35m.</p>

      <p className="measure">Now bring in the covenant. Meridian’s appetite (lesson 2a) is “cautious — no more than a 1-in-20 chance of breaching the leverage covenant in any year,” net debt / EBITDA under 3.0×, today at 1.75× off EBITDA ≈ €160m. Option A’s −€15m downside is not just a smaller number — it lands in a year where the emerging-market push is also draining cash, and a 55% chance of a €15m hit, stacked on a soft year, is exactly the kind of swing that eats covenant headroom. The board does not value that −€15m branch linearly; it values it through a concave utility where outcomes that threaten the covenant are punished hard. Run both options through that utility and Option B’s tighter spread (worst case −€3m, comfortably inside headroom) gives it the higher <em>expected utility</em> even though A has the higher <em>expected value</em>. The covenant-constrained board rationally takes the lower-EV, lower-variance option — risk aversion made concrete, and traceable straight back to the 1-in-20 appetite line. Note too what would change the call: if treasury secured standby funding that neutralised the −€15m branch’s covenant threat, A’s extra €1.35m of EV would come back into play — which is exactly an EVPI-style question about what removing that downside is worth.</p>

      <DoNow>Before the build, read the EVPI explainer in the pathway (step 2, ~12 min) and hold one question in mind: for a decision your organization faces, would a perfect forecast actually change which option you’d pick? If not, its EVPI is near zero — and so is the value of studying it.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Garbage in, confident garbage out" />
      <p className="measure">Here is the catch that haunts this entire part: the expected value is only as good as the probabilities you feed it, and those usually come from human heads — the same overconfident heads you met in 2b. Meridian’s “45% the entry lands” is not measured; it is a judgement, and the entire €1.35m EV gap between the options would vanish if that number were really 38%. A precise EV computed from guessed probabilities is precision theatre: a sharp number built on a soft probability is not knowledge, it is a guess wearing a lab coat. The fix is not to abandon the method but to <em>calibrate</em> the inputs (2b), state them as honest ranges, and treat the output as an aid to judgement, not a replacement for it. Notice the explorer below recomputes instantly when you nudge a probability — which is exactly why a sloppy probability is dangerous: it flows straight into a confident-looking answer with nothing to slow it down.</p>

      <MathBlock>
        <p>Expected value is the first moment of a random variable. For a discrete outcome <span className="eq">X</span> taking values <span className="eq">xᵢ</span> with probabilities <span className="eq">pᵢ</span>:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">E[X] = Σ pᵢ · xᵢ</span></p>
        <p>The reason it composes so cleanly is the <em>linearity of expectation</em>: <span className="eq">E[aX + bY] = a·E[X] + b·E[Y]</span>, true even when X and Y are dependent. That’s why you can fold a decision tree branch by branch.</p>
        <p>It also frames the <em>expected value of perfect information</em> (EVPI) — the most you’d rationally pay to remove uncertainty: <span className="eq">EVPI = E[payoff with perfect info] − E[payoff of best action now]</span>.</p>
        <p>And it explains risk aversion precisely. Model preferences with a concave utility <span className="eq">u</span>. By Jensen’s inequality, <span className="eq">E[u(X)] ≤ u(E[X])</span>, so the <em>certainty equivalent</em> — the sure amount as good as the gamble — sits below the mean. A risk-averse decider maximises <span className="eq">E[u(X)]</span>, not <span className="eq">E[X]</span>, which is exactly why the lower-EV, lower-spread option can win.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Work a real decision, and build the engine" />
      <p className="measure">The explorer above runs on one tiny function — expected value. Before you use it, build it. Implement the probability-weighted average yourself; this is the first model in the course you write rather than read.</p>

      <CodeExercise
        id="4.1-ev"
        title="Write the expected-value function"
        prompt="Given a list of outcomes, each with a probability p (a percent) and a value, return the probability-weighted average."
        entry="expectedValue"
        starter={`// outcomes: array of { p, value }   (p is a percent, 0–100)
function expectedValue(outcomes) {
  // TODO: return the probability-weighted average value
  return 0;
}`}
        solution={`function expectedValue(outcomes) {
  return outcomes.reduce(
    (sum, o) => sum + (o.p / 100) * o.value,
    0
  );
}`}
        test={(fn) => {
          const a = fn([{ p: 40, value: 5000000 }, { p: 60, value: -1500000 }]);
          const b = fn([{ p: 50, value: 100 }, { p: 50, value: -100 }]);
          return (Math.abs(a - 1100000) < 1 && Math.abs(b) < 1e-6)
            ? { pass: true, summary: `Correct — the launch example has EV ${fmt(a)}, and a fair 50/50 gives 0.` }
            : { pass: false, summary: `Not yet — the launch example returned ${fmt(a)} (should be ${fmt(1100000)}). Weight each value by p/100 and sum.` };
        }}
      />

      <p className="measure">That function is the seed of everything in this part. Now use the full explorer on a real decision your organization faces — lay out the options as Meridian’s board did, enter your honest probabilities and payoffs, and then ask the question that matters more than the EV: does the <em>spread</em> change which option you’d actually choose? Saved into Artifact A11.</p>
      <DecisionExplorer lessonId="4.1" artifactId="A11-decision" />

      <Rubric
        title="a strong decision analysis"
        criteria={[
          { c: 'Real options, mutually exclusive', good: 'two or more choices the organization genuinely faces, not strawmen' },
          { c: 'Outcomes and payoffs named', good: 'each branch has a concrete payoff and a probability, with probabilities at each chance node summing to 1' },
          { c: 'Probabilities are honest', good: 'inputs are calibrated ranges or defensible estimates (2b), not round numbers chosen to make a point' },
          { c: 'EV computed and compared', good: 'each option folded back to one expected value, with the raw-EV winner identified' },
          { c: 'Risk and ruin considered', good: 'the spread and worst case are read against the firm’s appetite/capacity — and risk aversion can override EV when a downside threatens survival' },
          { c: 'Information valued', good: 'states whether reducing a key uncertainty (EVPI) would change the choice, and is therefore worth paying for' },
        ]}
        exemplar="Meridian: A (enter market) EV +€9.75m with a −€15m downside vs B (premiumise) EV +€8.4m, worst case −€3m. Raw EV favours A; under a concave utility tied to the 1-in-20 covenant appetite, B’s tighter spread wins. Securing standby funding would neutralise A’s downside — an EVPI-style question about what removing it is worth."
      />

      <ProblemSet items={[
        { q: 'An option pays €2m with probability 30%, €0 with 50%, and loses €1m with 20%. What is its expected value?', solution: 'E[X] = 0.30·2,000,000 + 0.50·0 + 0.20·(−1,000,000) = 600,000 − 200,000 = €400,000.' },
        { q: 'Two options share the same EV, but A risks a €5m loss (10% chance) while B’s worst case is −€200k. Which should a thinly-capitalised firm prefer, and what principle is that?', solution: 'B. With little capital, a 10% chance of €5m could be fatal regardless of EV — that is risk aversion. Formally, a concave utility makes A’s certainty equivalent lower than B’s, so E[u(B)] > E[u(A)] even though E[B] = E[A].' },
        { q: 'A consultant offers Meridian a €0.5m study that would tell the board for certain whether the emerging-market entry will land. When is that study worth buying?', solution: 'Only if its cost is below the EVPI for that decision — the EV with perfect foresight minus the EV of the best action under today’s uncertainty. If both options would still be acceptable whatever the study revealed (i.e. the board would not switch its choice), the EVPI is near zero and the €0.5m is wasted, however dramatic the uncertainty feels.' },
      ]} />
    </LessonShell>
  );
}
