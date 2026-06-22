import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';

const lesson = getLesson('4.8');

const pathway = [
  { kind: 'watch', t: 'What is backtesting a risk model?', src: 'short practitioner explainer', min: 7, tier: 'warmup', why: 'Lock the “count the exceptions, compare to expected” idea before the detail.' },
  { kind: 'read', t: 'Supervisory framework for the use of backtesting', src: 'Basel Committee on Banking Supervision (1996)', href: 'https://www.bis.org/publ/bcbs22.htm', min: 18, tier: 'core', why: 'The source of the traffic-light test: green / yellow / red zones and the capital multiplier.' },
  { kind: 'read', t: 'SR 11-7 — the validation section', src: 'US Federal Reserve / OCC (2011)', href: 'https://www.federalreserve.gov/boarddocs/srletters/2011/sr1107.htm', min: 20, tier: 'core', why: 'Validation as a lifecycle: conceptual soundness, ongoing monitoring, outcomes analysis — the frame this lesson operationalises.' },
  { kind: 'do', t: 'Write a backtest that counts exceptions and classifies the Basel zone', src: 'the build in this lesson → Artifact A11', tier: 'apply', why: 'Turn the count into code and read a model’s zone off a year of losses.' },
  { kind: 'book', t: 'Risk Management and Financial Institutions — backtesting VaR', src: 'John C. Hull (6th ed.)', tier: 'deeper' },
];

const retrieval = [
  { q: 'Over 250 trading days, how many exceptions does a correct 99% one-day VaR model expect?', options: [
    { text: 'About 2.5 — because a 99% VaR should be breached on roughly 1% of days, and 1% of 250 is 2.5.', correct: true },
    { text: 'Zero — a good model is never breached.' },
    { text: 'About 25 — one breach every ten days.' }] },
  { q: 'In the Basel traffic-light test, ten or more exceptions in 250 days lands the model in…', options: [
    { text: 'the red zone — the model is rejected as understating risk.', correct: true },
    { text: 'the green zone — still within normal sampling noise.' },
    { text: 'the yellow zone — extra scrutiny but acceptable.' }] },
  { q: 'A model that backtested cleanly for years then fails suddenly is most likely suffering from…', options: [
    { text: 'a regime shift — the world changed, so a once-valid model is now calibrated on conditions that no longer hold.', correct: true },
    { text: 'a coding bug that only just appeared.' },
    { text: 'too few exceptions to judge.' }] },
];

export default function Lesson48() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>You have built a VaR model. It produces a confident number every morning. Here is the only question that matters next: how do you know it is right? Backtesting is the discipline that answers it — and it answers with a count, not an opinion.</Lead>

      <p className="measure">Lesson 3.7 named the problem: every model can be confidently, expensively wrong, and the most common failure is a sound model used outside the conditions it was built for. This lesson is the operational core of that family — the machinery that catches a wrong model in time. <strong>Model validation</strong> is the lifecycle discipline that does it, and SR 11-7 (US Federal Reserve / OCC, 2011) frames it as three jobs done by people <em>independent</em> of the developers: check <em>conceptual soundness</em> (is the model the right tool, built on defensible assumptions?), run <em>ongoing monitoring</em> (does it still hold as the world moves?), and perform <em>outcomes analysis</em> (do its predictions match reality?). That last job has a precise, countable form for any model that predicts a rate — and that is backtesting. The whole lesson lives in one sentence: a model that claims to be breached 1% of the time should be breached about 1% of the time, and if it isn’t, you can prove it with arithmetic a board can follow.</p>

      <p className="measure">Here is how to work through the topic — the video for the shape of the idea, then the Basel backtesting framework for the traffic-light test and the SR 11-7 validation section for the lifecycle frame, then the code build at the end.</p>

      <Pathway lessonId="4.8" items={pathway} />

      <Objectives items={[
        'Frame model validation as a lifecycle independent of development: conceptual soundness, ongoing monitoring, and outcomes analysis (SR 11-7).',
        'Backtest a VaR model by counting exceptions against the expected rate, and read the Basel green / yellow / red zones off the count.',
        'Explain the Kupiec proportion-of-failures intuition: is the observed exception rate bad luck, or evidence the model is wrong?',
        'Distinguish benchmarking and out-of-sample testing, and tell a model that was always wrong from one broken by a regime shift.',
        'Write a backtest that counts exceptions and classifies the Basel zone (Artifact A11).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="How do you know the model works?" />
      <p className="measure">Validation is not a one-time sign-off; it is a standing function, and SR 11-7’s deepest insistence is that it be <em>independent</em> of the people who built the model — the same effective-challenge principle from lesson 3.7, applied to testing rather than design. Independent validation does three things. <strong>Conceptual soundness</strong> asks whether the model is even the right instrument: are its assumptions defensible, its data fit for purpose, its limitations documented? <strong>Ongoing monitoring</strong> watches the model in production, because a model that was sound at launch can drift out of validity as the world moves. <strong>Outcomes analysis</strong> — the part this lesson makes concrete — compares what the model <em>predicted</em> against what actually <em>happened</em>. Backtesting is outcomes analysis for any model that makes a probabilistic claim, and a VaR model makes the cleanest claim of all: it names a loss threshold and a frequency. That frequency is exactly what you can check.</p>

      <p className="measure">The mechanics are almost embarrassingly simple, which is their strength — a board cannot follow a likelihood ratio but can follow counting. A 99% one-day VaR claims that on any given day, losses exceed the VaR line only 1% of the time. Each day you compare the realised loss to the VaR you predicted the day before; a day where the loss breaches the line is an <strong>exception</strong>. Over a year of roughly 250 trading days, a correct model should produce about <em>250 × 1% = 2.5</em> exceptions. So you count. Zero, one, two, three, four exceptions — entirely consistent with a working model and ordinary sampling noise. Eight exceptions — more than three times the expected rate — is a flashing light: the model is being breached far more often than it promised, which means it is <em>understating</em> risk. The beauty is that you never had to argue about whether the model “feels” right; the world ran the experiment and you tallied the result.</p>

      <p className="measure">The Basel Committee turned that tally into a formal supervisory test — the <strong>traffic-light</strong> framework (BCBS, <em>Supervisory framework for the use of backtesting</em>, 1996), calibrated for a 99% VaR over 250 days. The <strong>green zone</strong> is up to four exceptions: consistent with a sound model; sampling noise can produce a fourth exception even when the model is fine, so no action. The <strong>yellow (amber) zone</strong> is five to nine exceptions: increasingly hard to explain as bad luck, so the supervisor applies a <em>capital multiplier add-on</em> that scales up with the count — the model keeps running but you hold more capital against the doubt it has earned. The <strong>red zone</strong> is ten or more: so improbable under a correct model that the model is presumed broken and rejected outright. The zones are not arbitrary; they are the points where the binomial probability of seeing that many exceptions, if the model were truly correct, falls low enough to act. Green says “the count is what chance alone would give”; red says “chance alone would essentially never give this.”</p>

      <p className="measure">Backtesting is one of three validation moves, and you need all three. <strong>Backtesting</strong> tests a model against its <em>own</em> realised history — did reality match its predictions? <strong>Benchmarking</strong> tests it against <em>another model</em> — does an independent model, built on different assumptions, land near the same answer? When two honest models disagree sharply, at least one is wrong, and you have found the error before it costs you. <strong>Out-of-sample (and out-of-time) testing</strong> guards against the subtlest cheat of all: a model that was fitted on a stretch of data will of course fit that stretch, so you must test it on data it never saw — a different period, ideally one containing conditions the calibration set did not. A model that performs beautifully in-sample and poorly out-of-sample has merely memorised its past, not learned its risk.</p>

      <p className="measure">Now the distinction that separates a technician from a risk manager. A model can fail its backtest for two completely different reasons, and the count alone cannot tell them apart — the diagnosis is yours. Either the model was <em>always wrong</em> — mis-specified from the start, fitted badly, the wrong distribution assumed — in which case it never deserved trust and the fix is to redevelop. Or the model was <em>right, and the world changed</em> — a <strong>regime shift</strong>, where volatility jumped, correlations crept toward one, or the underlying process moved, so a model honestly calibrated on the old world now understates the new one. The tell is the timing: a model that was red from day one was always wrong; a model that backtested green for three years and then went red almost certainly met a regime change.</p>

      <p className="measure">The two diagnoses imply different actions. A mis-specified model must be <em>redeveloped</em>. A regime-shifted model must be <em>recalibrated</em> to the new conditions. And in both cases, while you do the work, you do not run naked: you add a <em>conservative buffer</em> — hold extra capital, tighten the limit — so the firm is protected during the very window when its risk measure is known to be unreliable. Doing nothing until the rebuild is finished is the failure mode that turns a model problem into a solvency problem.</p>

      <p className="measure">Watch it land on the case. <strong>Meridian Industries</strong> holds a €60m treasury reserve portfolio (≈60% bonds, 40% equities), and treasury runs a 99% one-day VaR on it. Over the last 250 trading days the desk recorded the daily reserve losses and compared each to the VaR predicted the day before. A correct model expects about 2.5 exceptions. The actual count was <strong>eight</strong> — squarely in the Basel <em>yellow</em> zone. Eight is more than three times expected, so this is not bad luck: the model is understating risk.</p>

      <p className="measure">The diagnosis comes from the timing. The model backtested green for two years and went yellow only in the last few months — the signature of a regime shift, not original sin. The likely culprit is exactly the fragile assumption lesson 3.7 told Meridian to write down: the VaR was calibrated on a calm period, and market volatility has since risen, so the model’s assumed volatility is now too low. The action follows: <em>recalibrate</em> the VaR to current volatility (not redevelop — the model was never structurally wrong), and meanwhile hold a conservative capital buffer on the reserve book until the recalibrated model has itself backtested clean. The same logic backtests Meridian’s R10 demand-forecast model: when realised demand falls outside its prediction intervals far more often than its own error band allows, the interval is too narrow, and the question is again recalibrate-or-redevelop.</p>

      <DoNow>Before the build, skim the Basel backtesting framework (pathway step 2, ~18 min) for exactly where the green / yellow / red boundaries fall and why a fourth exception is still “green” — then ask which of your organization’s models actually counts its exceptions, and which simply assumes it is still right.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="From a count to a verdict" />
      <p className="measure">The whole test is a counting problem dressed in one probability distribution. If a model with exception probability <span className="eq">p</span> is correct, then over <span className="eq">N</span> independent days the number of exceptions <span className="eq">x</span> is <em>Binomial(N, p)</em> — the same machinery as flipping a biased coin. The expected count is <span className="eq">N·p</span>; for a 99% VaR over 250 days that is 2.5. The question “is eight too many?” becomes “if the model were truly correct, how unlikely is it to see eight or more exceptions purely by chance?” That is the <strong>Kupiec proportion-of-failures</strong> test at intuition level: the observed exception <em>rate</em> (8/250 = 3.2%) is compared to the claimed rate (1%), and the binomial tells you whether the gap is the kind of thing chance produces or the kind it essentially never does. Eight or more, under a true 1% model, has a probability of only a few percent — improbable enough to doubt the model. Twelve is astronomically improbable; the model is rejected. The Basel zones are simply this calculation pre-computed: the boundaries sit where the cumulative binomial probability crosses the supervisor’s action thresholds.</p>

      <p className="measure">Two cautions keep the test honest. First, <em>too few</em> exceptions is also a finding — zero exceptions in 250 days, when you expected 2.5, suggests the model is <em>overstating</em> risk (a too-wide VaR), which wastes capital even though it never breaches; a good backtest is two-sided. Second, the test rewards more data: 250 days is the regulatory minimum, and the binomial’s noise is wide at that sample size, which is precisely why the green zone tolerates up to four exceptions. The count is evidence, not proof — but it is evidence the model itself generated, which is the strongest kind you can get about whether it works.</p>

      <MathBlock>
        <p>Backtesting turns “is the model right?” into a count. A VaR model at confidence <span className="eq">1 − p</span> claims its threshold is breached with probability <span className="eq">p</span> per day. Over <span className="eq">N</span> independent days the exception count is:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">x ~ Binomial(N, p)</span>, &nbsp; with &nbsp; <span className="eq">E[x] = N·p</span>.</p>
        <p>For a 99% VaR (<span className="eq">p = 0.01</span>) over <span className="eq">N = 250</span> days, <span className="eq">E[x] = 2.5</span>. The Kupiec idea: ask <span className="eq">P(X ≥ x)</span> under the true-model binomial — if seeing this many exceptions would be wildly unlucky for a correct model, the model is the more likely culprit. Basel pre-computes this into zones: <span className="eq">x ≤ 4</span> green (chance alone could do it), <span className="eq">5 ≤ x ≤ 9</span> yellow (a capital multiplier add-on, scaling with the count), <span className="eq">x ≥ 10</span> red (the model is rejected). Notice the recursion from lesson 3.7: you are using a model — the binomial — to judge a model. The chain stops only at an assumption named honestly enough to know when to stop trusting.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — write the model" title="Count the exceptions, classify the zone" />
      <p className="measure">Build the backtest itself. Given a year of realised daily losses and the VaR the model predicted, count how many days the loss exceeded the VaR — those are the exceptions — and classify the result into the Basel traffic-light zone. The whole validation discipline reduces, in the end, to this one tally: the world ran the experiment, and your function reads the verdict off it.</p>

      <CodeExercise
        id="4.8-backtest"
        title="Backtest a 99% VaR and classify its Basel zone"
        prompt="Count the exceptions (days where the loss exceeded the VaR), then map the count to a Basel zone: 0–4 → 'green', 5–9 → 'yellow', 10+ → 'red'. Return { exceptions, zone }."
        entry="backtest"
        starter={`// losses: array of realised daily losses (positive = a loss)
// varEstimate: the model's 99% VaR threshold (a single number)
function backtest(losses, varEstimate) {
  // TODO: count days where loss > varEstimate
  // TODO: zone = green (<=4) / yellow (5-9) / red (>=10)
  let exceptions = 0;
  let zone = 'green';
  return { exceptions, zone };
}`}
        solution={`function backtest(losses, varEstimate) {
  const exceptions = losses.filter(l => l > varEstimate).length;
  const zone = exceptions <= 4 ? 'green' : exceptions <= 9 ? 'yellow' : 'red';
  return { exceptions, zone };
}`}
        test={(fn) => {
          // 250 days. Build a series with exactly 8 losses above a VaR of 100.
          const varEstimate = 100;
          const losses = [];
          for (let i = 0; i < 250; i++) losses.push(i < 8 ? 150 : 50); // 8 exceptions
          const r = fn(losses, varEstimate) || {};
          // Second series: exactly 3 exceptions → green.
          const green = [];
          for (let i = 0; i < 250; i++) green.push(i < 3 ? 150 : 50);
          const g = fn(green, varEstimate) || {};
          const ok = r.exceptions === 8 && r.zone === 'yellow' && g.exceptions === 3 && g.zone === 'green';
          return ok
            ? { pass: true, summary: `Correct — 8 exceptions over 250 days lands in the ${r.zone} zone (expected ~2.5, so the model is understating risk), and 3 exceptions reads ${g.zone}. The count is the verdict.` }
            : { pass: false, summary: `Got ${r.exceptions} exceptions / zone "${r.zone}" (expected 8 / yellow) and ${g.exceptions} / "${g.zone}" (expected 3 / green). Count days where loss > varEstimate; zone is 0–4 green, 5–9 yellow, 10+ red.` };
        }}
      />

      <p className="measure">Run it and read the result the way a validator does. The count is the easy part; the verdict is the judgment. A yellow result does not say “rebuild” — it says “hold more capital and find out why.” The diagnosis, as Stage 1 insisted, turns on timing: a model born red was always wrong (redevelop); a model that drifted into yellow met a changing world (recalibrate). And note what the function does <em>not</em> do — it does not tell you the size of the breaches, only their count, which is exactly the silence VaR backtesting shares with VaR itself. Saved into Artifact A11. Hold any backtest to this standard:</p>

      <Rubric
        title="a trustworthy model backtest"
        criteria={[
          { c: 'Compares to the expected rate', good: 'states the exception count against what the model claimed (8 vs an expected 2.5), not a bare count' },
          { c: 'Classified, not just counted', good: 'maps the count to an action zone (green / yellow / red) so the result implies a decision' },
          { c: 'Diagnoses the cause', good: 'uses the timing to separate “always wrong” (redevelop) from a regime shift (recalibrate)' },
          { c: 'Two-sided', good: 'flags too-few exceptions as well as too-many — an over-wide model wastes capital even if it never breaches' },
          { c: 'Acts during the gap', good: 'adds a conservative buffer while the fix is built, rather than running an unreliable model unprotected' },
        ]}
        exemplar="Meridian reserve VaR: 8 exceptions in 250 days vs ~2.5 expected → yellow zone, understating risk. Green for two years then yellow → regime shift (volatility rose), so recalibrate (not redevelop), and hold extra buffer on the reserve book until the recalibrated model backtests clean."
      />

      <p className="measure">A worked verdict, because the common failure is to stop at the count. A validator reports: “The reserve VaR had eight exceptions last year.” True, but it controls nothing. Apply the discipline: <em>compare</em> (8 against an expected 2.5 — the model understates risk) → <em>classify</em> (Basel yellow; a capital add-on applies) → <em>diagnose</em> (green for two years, yellow only recently → a regime shift, not original mis-specification) → <em>act</em> (recalibrate the VaR to current volatility, and hold a conservative buffer until it backtests clean). Now the count has become a decision with an owner and a deadline. That move — from “the model was breached eight times” to “here is the zone, the cause, and the action” — is the entire craft of validation.</p>

      <ProblemSet items={[
        { q: 'A 99% one-day VaR model on Meridian’s reserve portfolio recorded zero exceptions over 250 trading days. The desk calls this excellent. Is it?', solution: 'Not necessarily — backtesting is two-sided. A correct 99% model expects about 2.5 exceptions, so zero is suspiciously few and suggests the model is *overstating* risk: the VaR line is set too far out. That is not free safety — an over-wide VaR forces the firm to hold more capital and accept tighter limits than the real risk warrants, wasting return (the exact mistake lesson 2a warned about: a profile far below appetite is also a failure). The fix is to investigate whether the model is too conservative and recalibrate it down, not to celebrate.' },
        { q: 'Meridian’s reserve VaR backtested green for three years, then produced eleven exceptions this year. The quant who built it says the model is fine and this was an unlucky year. Where is the flaw, and what should happen?', solution: 'Eleven exceptions is the Basel *red* zone — under a correct 99% model, seeing eleven in 250 days is astronomically improbable (E[x] = 2.5), so “unlucky year” is statistically untenable: the model is understating risk and should be rejected for capital and limits until investigated. But the three clean years matter for the diagnosis: a model that was sound for three years and failed suddenly was almost certainly broken by a *regime shift* (volatility rose, correlations crept up), not mis-specified from the start. So the action is recalibrate to current conditions rather than redevelop — and crucially, hold a conservative buffer on the reserve book *now*, during the rebuild, because running a known-unreliable model unprotected is how a model problem becomes a solvency problem. Note also the independence point from SR 11-7: the person who built the model should not be the one ruling its failure “bad luck” — that judgment belongs to independent validation.' },
      ]} />

      <p className="measure">Backtesting closes the loop the rest of Part 4 opened: you built the Monte Carlo engines, the loss distributions, the VaR and ES numbers — and this is the discipline that tells you, in a count a board can follow, whether any of them is still telling the truth. A model is never validated once; it is validated continuously, because the only thing you can be sure of is that the world it was fitted on will eventually stop existing. The humility lesson 3.7 promised is, in the end, a number you check every 250 days.</p>
    </LessonShell>
  );
}
