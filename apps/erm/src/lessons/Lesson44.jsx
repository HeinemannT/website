import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { VaRES } from '../tools/VaRES.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';

const lesson = getLesson('4.4');

const pathway = [
  { kind: 'watch', t: 'What Value-at-Risk really means', src: 'short practitioner explainer', min: 8, tier: 'warmup', why: 'Lock the “threshold, not worst case” idea before the formalism.' },
  { kind: 'read', t: 'Minimum capital requirements for market risk (FRTB), d457', src: 'Basel Committee, BIS', href: 'https://www.bis.org/bcbs/publ/d457.htm', min: 20, tier: 'core', why: 'The authoritative move from 99% VaR to 97.5% Expected Shortfall — read the short “in brief”.' },
  { kind: 'read', t: 'Value at Risk — the subadditivity / coherence critique', src: 'Wikipedia', href: 'https://en.wikipedia.org/wiki/Value_at_risk', min: 12, tier: 'core', why: 'Why VaR is not coherent and how diversification can perversely raise it.' },
  { kind: 'do', t: 'Read VaR and ES off your own simulated distribution', src: 'the lab in this lesson → Artifact A11', tier: 'apply', why: 'Switch normal → fat-tailed and watch ES pull away from VaR.' },
  { kind: 'book', t: 'Risk Management and Financial Institutions — VaR, ES, and credit measures', src: 'John C. Hull (6th ed.)', tier: 'deeper' },
];

const retrieval = [
  { q: 'Value-at-Risk tells you…', options: [
    { text: 'a loss threshold you won’t exceed at a given confidence — but nothing about how bad it gets beyond it.', correct: true },
    { text: 'the worst possible loss.' },
    { text: 'the average loss.' }] },
  { q: 'Expected Shortfall improves on VaR by…', options: [
    { text: 'averaging the losses beyond VaR — capturing the tail VaR ignores.', correct: true },
    { text: 'being a smaller, friendlier number.' },
    { text: 'ignoring probability.' }] },
  { q: 'VaR is most dangerous when…', options: [
    { text: 'tails are fat — the rare losses beyond VaR are far worse than VaR suggests.', correct: true },
    { text: 'markets are calm.' },
    { text: 'confidence is set low.' }] },
];

export default function Lesson44() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Value-at-Risk is the most famous number in risk management — and the most dangerous, because it sounds like it tells you the worst case, and it doesn’t.</Lead>

      <p className="measure">VaR answers a precise, limited question: “at the 99% level, over a one-day horizon, we won’t lose more than this.” Three ingredients are baked into that sentence — a <em>confidence level</em> (99%), a <em>horizon</em> (one day), and a <em>loss threshold</em> (the number). It is genuinely useful: it puts a single comparable figure on a desk, a book, or a whole firm, and it is the figure a treasurer, a regulator, and a board can all argue about. The trouble starts the moment someone reads it as “this is the most we can lose,” which is exactly what it isn’t. VaR is a line in the sand. It tells you where the water reaches one day in a hundred; it says nothing about how far the water rises on the hundredth day. In 2008, institutions with comfortable VaR numbers discovered the losses beyond the line were many times larger than the line itself. The fix has a name — <em>Expected Shortfall</em> — and it answers the exact question VaR refuses to: how bad is the hundredth day?</p>

      <p className="measure">Here is how to work through the topic — the video for the shape of the idea, then the Basel standard that made the VaR-to-ES switch official and a short read on why VaR is not a coherent measure, and the lab and code build at the end.</p>

      <Pathway lessonId="4.4" items={pathway} />

      <Objectives items={[
        'State exactly what VaR does and does not tell you — confidence, horizon, threshold, and the silence beyond the line.',
        'Define Expected Shortfall and explain why it captures tail risk and VaR doesn’t.',
        'Explain why VaR is not coherent (it can violate subadditivity) and why regulators switched to ES.',
        'Recap the credit analogue — expected loss = PD × LGD × EAD.',
        'Read VaR and ES off your own simulated distribution, and watch ES leap once tails fatten (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="A line in the sand vs. the flood beyond it" />
      <p className="measure">The trouble with VaR was never the arithmetic; it is the false comfort the number invites. A single threshold tempts everyone to manage <em>to</em> the threshold and to forget the territory past it — and risk lives in that territory. Say your one-day 99% VaR is €2m. That sentence makes two claims and stays silent on a third. It claims that on 99 days out of 100 you lose less than €2m, and it claims that on roughly one day in a hundred you lose €2m or more. It says <em>nothing whatsoever</em> about how much more. The loss on that hundredth day could be €2.1m or €25m; VaR cannot tell them apart, because by construction it stops at the edge of the tail and never looks in. Two portfolios can carry an identical VaR while one quietly hides a catastrophe just past the line. That silence is not a rounding error — it is the whole danger, and it is structural, not a flaw you can calibrate away by picking a better confidence level.</p>

      <p className="measure">There is a second, deeper defect, and it is the one that finally moved regulators. A risk measure ought to reward diversification: combining two imperfectly correlated books should never look <em>riskier</em> than holding them apart. The property that guarantees this is <em>subadditivity</em> — the risk of A and B together should not exceed the risk of A plus the risk of B. VaR can violate it. Take two bonds, each with a small independent chance of a large default loss that sits <em>just</em> beyond the 99% point; individually each has a modest VaR. Combine them and the chance that at least one defaults pushes a large loss <em>inside</em> the 99% window, so the combined VaR can exceed the sum of the standalones. Diversification, the one free lunch in finance, appears on the report to <em>add</em> risk. A measure that can do that is, in the technical sense, not <em>coherent</em> — and a non-coherent measure is a treacherous foundation for capital, because it can reward concentration and punish prudence.</p>

      <p className="measure">Expected Shortfall fixes both problems at once by asking the better question: “if we do breach the line, how bad on average?” It is the average of every loss in the tail — the mean of all outcomes at or beyond the VaR point — so it cannot be gamed by stacking risk just past the threshold, and it is provably coherent, including subadditive. Same family of idea as VaR, but one of them refuses to ignore the tail. This is precisely why the Basel market-risk framework — the Fundamental Review of the Trading Book (FRTB), set out by the Basel Committee on Banking Supervision in d457 — replaced 99% VaR with 97.5% Expected Shortfall as the basis for market-risk capital. The supervisors did not switch because ES is a friendlier number (often it isn’t); they switched because, after 2008, a measure that systematically under-reports the tail is exactly the wrong thing to set survival capital against.</p>

      <p className="measure">One more property makes VaR most misleading exactly when you can least afford it: <em>fat tails</em>. If you assume returns are normal — the comfortable bell curve — extreme losses are vanishingly rare, and VaR and ES sit close together. But real financial returns have <em>fat tails</em>: rare losses arrive far more often and far larger than the normal curve predicts. Under fat tails, VaR barely moves while the average loss beyond it explodes, so the gap between VaR and ES widens precisely in the heavy-tailed, crisis-prone conditions you most fear. VaR is least informative exactly when it matters most. The lesson is not “VaR is useless” — it’s a fine first glance and a regulatory lingua franca. The lesson is “VaR is a threshold, not a worst case, and you must always read the shortfall beside it.”</p>

      <p className="measure">The credit world quantifies the same idea of loss, just decomposed differently. For a loan or a counterparty, expected credit loss is <strong>PD × LGD × EAD</strong>: the <em>probability of default</em> (how likely the borrower fails this year), times <em>loss given default</em> (the fraction you actually lose if they do, after recoveries), times <em>exposure at default</em> (how much is on the line when they fail). It is the credit analogue of the market-risk machinery above — and it carries the same humility warning, because PD and LGD tend to worsen <em>together</em> in a downturn, just as market correlations spike. A single number, market or credit, is never a risk-management strategy.</p>

      <p className="measure">Watch this on the firm you’re carrying through the course. <strong>Meridian Industries</strong> holds a €60m treasury reserve portfolio — roughly 60% bonds (annual volatility ~6%) and 40% equities (~18%), with a bond–equity correlation around 0.3. Combine those and the portfolio’s annual volatility works out near €4.5m — well below the €6m you’d get by naïvely summing the two sleeves’ standalone risk, which is the diversification benefit doing its job. Under a <em>normal</em> assumption, a 99% one-year VaR is about 2.33 standard deviations into the loss tail, so roughly €10–11m, and the Expected Shortfall sits only modestly above it, near €12m: the normal curve says the worst 1% of years are not much worse than the line. Now switch the same portfolio to a <em>fat-tailed</em> assumption — the world of 2008 and 2020, where equities can gap and correlations creep toward one. The 99% VaR barely shifts, perhaps to €11–12m, because the line is anchored at the 1% point either way. But the Expected Shortfall pulls well above it — into the high teens, €17–19m — because the rare years past the line are now genuinely brutal. A board that capitalised Meridian’s reserve book to its VaR would be holding roughly a third too little buffer for the very scenarios that justify holding a buffer at all. (Those figures use a quick closed-form <em>normal</em> shortcut to get numbers on the page; the lab below instead reads VaR and ES off a <em>simulated</em> distribution — the method you built in 4.2 — which is how you’d do it for real once returns stop being normal.) The VaR-steady-while-ES-explodes divergence is the practical takeaway, and you’ll reproduce it yourself below.</p>

      <Stage n={2} kicker="Quantify — what the maths does" title="Watch the tail VaR hides" />
      <p className="measure">In the lab below, VaR and ES sit close together when outcomes are mild and normal. Then tick “fat tails” — the world of real crises — and watch ES leap above VaR while VaR barely flinches. That gap is precisely the danger VaR conceals: when losses are heavy-tailed, the rare disaster beyond the line dwarfs the line. The lesson isn’t “VaR is useless”; it’s “VaR is a threshold, not a worst case, and in the conditions you most fear it is least informative.” Read both numbers, and trust the one that looks at the tail.</p>

      <MathBlock>
        <p>VaR is just a <em>quantile</em> of the loss distribution — the same thing as a <em>percentile</em>, the idea you used in 4.3. The 99% VaR is the loss that only the worst 1% of outcomes exceed: line up every possible loss smallest to largest and read off the point 99% of the way along. No integral required — it is one point on the curve you already simulated.</p>
        <p>Expected Shortfall (also called CVaR) is the <em>average of the losses beyond that point</em> — take the worst 1% of outcomes and average them. Because it averages the whole tail instead of stopping at its edge, ES is mathematically <em>coherent</em>: combining two books can never make it report more risk than holding them apart (the subadditivity property VaR can violate). That coherence, plus its tail-sensitivity, is why the Basel framework sets market-risk capital on 97.5% ES rather than 99% VaR.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Compute VaR and ES yourself" />
      <p className="measure">The lab below marks VaR and ES on a distribution. Build the calculation first: from a list of losses and a confidence level, find the VaR quantile and average the tail beyond it. Watching ES emerge as “the mean of everything past the line” is the whole intuition in one function.</p>

      <CodeExercise
        id="4.4-var"
        title="Write VaR and Expected Shortfall"
        prompt="Sort the losses ascending. Take the value at index floor(conf · n) as VaR. Expected Shortfall is the mean of all losses from that index upward. Return { var, es }."
        entry="varAndES"
        starter={`// losses: array of loss amounts;  conf: e.g. 0.99
function varAndES(losses, conf) {
  const sorted = [...losses].sort((a, b) => a - b);
  // TODO: idx = floor(conf * sorted.length)
  //       VaR = sorted[idx];  ES = mean of sorted[idx .. end]
  return { var: 0, es: 0 };
}`}
        solution={`function varAndES(losses, conf) {
  const sorted = [...losses].sort((a, b) => a - b);
  const idx = Math.floor(conf * sorted.length);
  const v = sorted[idx];
  const tail = sorted.slice(idx);
  const es = tail.reduce((s, x) => s + x, 0) / tail.length;
  return { var: v, es };
}`}
        test={(fn) => {
          const losses = Array.from({ length: 100 }, (_, i) => i + 1);
          const r = fn(losses, 0.95) || {};
          return (Math.abs(r.var - 96) < 1e-9 && Math.abs(r.es - 98) < 1e-9)
            ? { pass: true, summary: `Correct — for losses 1…100 at 95%, VaR = ${r.var} and ES = ${r.es}. ES sits above VaR because it averages the whole tail.` }
            : { pass: false, summary: `Got VaR ${r.var}, ES ${r.es} (expected 96 and 98). Sort ascending, VaR = sorted[floor(0.95·100)], ES = mean from there up.` };
        }}
      />

      <p className="measure">(One honest caveat on the function you just wrote: there are several conventions for picking the empirical-VaR index — floor, nearest-rank, interpolation — and they differ by a single step right at the tail. We used <span style={{ fontFamily: 'monospace' }}>sorted[floor(conf·n)]</span> for simplicity; production systems usually interpolate. The number shifts slightly; the intuition does not.)</p>

      <p className="measure">Now flip between calm and fat-tailed worlds in the lab and watch VaR and ES diverge. Carry the habit into any risk report: ask not just for the VaR, but for the shortfall beyond it. Saved into Artifact A11.</p>
      <VaRES lessonId="4.4" artifactId="A11-var" />

      <p className="measure">Read your output back through the test that exposes a number being trusted too far: <em>does the report show what happens past the line, or only where the line sits?</em> If only the line, it’s VaR theatre. The standard to hold a market-risk readout to:</p>

      <Rubric
        title="a trustworthy VaR & ES readout"
        criteria={[
          { c: 'States all three ingredients', good: 'confidence level, horizon, and threshold are explicit — “99%, 1-day, €2m”, never a bare number' },
          { c: 'Reports ES beside VaR', good: 'the average loss in the tail is shown next to the threshold, not omitted' },
          { c: 'Tests the tail assumption', good: 'numbers are shown under both a normal and a fat-tailed assumption so the gap is visible' },
          { c: 'Coherence-aware', good: 'aggregates risk in a way that rewards diversification (uses ES, or flags VaR’s subadditivity risk)' },
          { c: 'Honest about limits', good: 'treats the figure as a range driven by the assumed distribution, not a measured fact' },
        ]}
        exemplar="Meridian reserve book: 99% 1-yr VaR ≈ €10–11m (normal) with ES ≈ €12m; switch to fat tails and VaR holds near €11–12m while ES jumps to €17–19m. The board capitalises to the ES, not the VaR — the gap is the buffer the line conceals."
      />

      <DoNow>Before the lab, skim the FRTB “in brief” (pathway step 2, ~20 min) for why supervisors moved market-risk capital from 99% VaR to 97.5% ES — then reproduce that gap yourself by toggling fat tails below.</DoNow>

      <ProblemSet items={[
        { q: 'Give an intuitive reason VaR can violate subadditivity.', solution: 'Take two bonds, each with a small, independent chance of a large default loss. Individually, the loss event sits just beyond the 99% point, so each has a modest VaR. Combined, the chance that at least one defaults pushes a large loss inside the 99% window, so VaR(A+B) can exceed VaR(A)+VaR(B) — diversification appears to raise risk, which a coherent measure (ES) never does.' },
        { q: 'Two portfolios have identical 99% VaR. How can one be far riskier?', solution: 'VaR says nothing beyond its threshold. One portfolio’s losses past the 99% point might be modestly larger; the other’s might be catastrophic. Expected Shortfall, by averaging the tail, separates them — VaR cannot.' },
      ]} />

      <p className="measure">VaR and ES read the tail of a loss distribution you have to <em>build</em> first — and that distribution is only as honest as its assumed correlations. The next lesson stresses those assumptions on purpose: stress testing asks not “how likely?” but “what if the world goes this particular, brutal way?” — and finds the shock that breaks you before it does.</p>
    </LessonShell>
  );
}
