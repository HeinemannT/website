import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.7');

const pathway = [
  { kind: 'read', t: 'SR 11-7 — Guidance on Model Risk Management', src: 'US Federal Reserve / OCC (2011)', href: 'https://www.federalreserve.gov/boarddocs/srletters/2011/sr1107.htm', min: 25, tier: 'core', why: 'The canonical text: model definition, validation, governance, and the idea of effective challenge.' },
  { kind: 'read', t: 'SR 26-2 — Revised Guidance on Model Risk Management', src: 'US Federal Reserve / OCC / FDIC (2026)', href: 'https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm', min: 20, tier: 'core', why: 'The live US standard: more principles-based, a narrower “model” definition, generative/agentic AI out of scope.' },
  { kind: 'watch', t: 'What is model risk?', src: 'short practitioner explainer', min: 8, tier: 'warmup', why: 'Get the “a sound model used in the wrong world” idea before the detail.' },
  { kind: 'do', t: 'Inventory your organization’s models and name their fragile assumption', src: 'the FamilyLens in this lesson → Artifact A10', tier: 'apply', why: 'Turn the concepts into register entries that name an owner and an independent challenger.' },
  { kind: 'book', t: 'Risk Management and Financial Institutions — the model-risk chapter', src: 'John C. Hull (6th ed., 2023)', tier: 'deeper' },
];

const retrieval = [
  { q: 'The single most common source of model risk is…', options: [
    { text: 'a sound model applied outside the conditions it was built for — the world stopped matching the inputs.', correct: true },
    { text: 'a coding bug in the implementation.' },
    { text: 'not owning enough models.' }] },
  { q: '“Effective challenge” (SR 11-7) means…', options: [
    { text: 'critical review by someone independent, skilled, and senior enough to genuinely try to break the model — and be heard if they do.', correct: true },
    { text: 'running the model on faster hardware to stress it.' },
    { text: 'asking the model’s author to re-check their own work.' }] },
  { q: 'Backtesting a model means…', options: [
    { text: 'comparing the model’s realised exceptions against the rate it predicted, to see whether the world behaved as it claimed.', correct: true },
    { text: 'rebuilding the model on older data.' },
    { text: 'confirming an independent model agrees — that is benchmarking.' }] },
];

export default function Lesson37() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Every quantitative tool in Part 4 is a model, and every model can be confidently, expensively wrong. Model risk is the discipline’s built-in humility turned into a risk family of its own — the standing reminder that the map is not the territory.</Lead>

      <p className="measure">Model risk is the risk of loss from a model being <em>wrong</em> or <em>used wrongly</em>. It comes from four places: bad assumptions, bad data, an implementation bug, or — by far the most common in practice — a sound model applied outside the conditions it was built for. That last source is the one to fix in your mind, because it is the one that feels safe right up until it isn’t: the model is correct, the code is clean, the data was good, and it still produces a ruinous number because the world it was calibrated on stopped existing. As organizations push ever more decisions through pricing models, credit scorecards, and now AI systems, this family has moved from a niche banking concern to something almost every organization carries. The uncomfortable structural fact is that the more diligently you quantify your other risks, the more model risk you manufacture in doing so.</p>

      <p className="measure">Here is how to work through the topic — the two regulatory readings first, because the discipline’s entire vocabulary comes from them, then the build at the end.</p>

      <Pathway lessonId="3.7" items={pathway} />

      <Objectives items={[
        'Define model risk and locate its four sources, recognising “sound model, wrong conditions” as the most common.',
        'Explain effective challenge and the model lifecycle from SR 11-7, and what SR 26-2 changes about the live standard.',
        'Distinguish validation, backtesting, and benchmarking, and read a backtest exception count against its expected rate.',
        'Add your organization’s model risks to the register, naming each model’s fragile assumption and its independent challenger (Artifact A10).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="When the map isn't the territory" />
      <p className="measure">The foundational text everyone still cites is the US Federal Reserve and OCC’s <strong>SR 11-7</strong> (2011), and its load-bearing idea is <strong>effective challenge</strong>: a model is only trustworthy if someone <em>independent</em> of the people who built it, <em>skilled</em> enough to understand it, and <em>senior</em> enough to be heard has genuinely tried to break it. Each word does work. Independence stops the author marking their own homework; skill stops the review being a rubber stamp by someone who can’t follow the maths; standing stops a valid objection being overruled by the desk that profits from the model. SR 11-7 wraps that idea in a <em>model lifecycle</em> — disciplined development, <em>independent</em> validation before use, ongoing monitoring once live, clear ownership for every model, and an enterprise <em>inventory</em> so no model runs unseen. The principle that holds the lifecycle together is that model risk is everyone’s problem, not just the quant team’s: a model is a decision waiting to happen, and the people who rely on its output own the risk as much as the people who wrote it.</p>

      <p className="measure">As of 2026, the live US standard has moved on. <strong>SR 26-2</strong> (US Federal Reserve / OCC / FDIC, 2026) supersedes SR 11-7 with a more principles-based, proportionate stance — less prescriptive checklist, more “show that your controls are commensurate with what the model can cost you.” It narrows the formal definition of a “model,” deliberately excluding simple spreadsheet arithmetic that the old wording arguably swept in, and — the change worth flagging as a live debate — it places <strong>generative and agentic AI explicitly out of scope</strong>, leaving those systems to other, evolving guidance rather than stretching model-risk rules to fit them. The professional move is to hold both at once: cite SR 11-7 for the conceptual canon that every textbook and validation function is still built on, and treat SR 26-2 as the current supervisory standard. The AI-scope gap is not a loophole to relax into — it is a reminder that your most consequential models may be the ones nobody’s guidance yet governs.</p>

      <p className="measure">Watch the family land on the case. <strong>Meridian Industries</strong> runs a <strong>demand-forecast model</strong> (risk R10, owned by the Head of Planning) that drives how much of each product line to make and stock. When it errs, the cost is concrete on both sides: forecast too high and you write off overstock; too low and you stock out and lose the sale to a retailer who will not wait. The register sizes it at a 35% annual chance of a material error costing about €3m — a high-frequency, moderate-severity risk, exactly the profile of a model used constantly in conditions that drift. Now name the fragile assumption explicitly, because that is the whole discipline: the model assumes <em>demand patterns stay broadly stationary</em> — that next quarter looks statistically like the quarters it was fitted on. That assumption is fine in a stable market and silently false the moment a private-label competitor reprices, a retailer changes its ordering rhythm, or a category shifts. The maths never breaks; the world simply stops matching the inputs. Independent challenge for R10 comes not from the planning team that runs it but from the second line — Meridian’s risk and finance functions — who validate it against actual demand and ask, pointedly, when the stationarity assumption last held.</p>

      <DoNow>Before the build, skim SR 26-2 (pathway step 2, ~20 min) for what it now excludes from the definition of a “model” — then ask which of your organization’s most consequential models would fall <em>outside</em> that definition, and who governs them if model-risk rules don’t.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Quantifying the error in your quants" />
      <p className="measure">You manage model risk with the model’s own medicine — and the irony is exact: you quantify the trustworthiness of a number-producing machine by producing more numbers about it. Three techniques do the work. <strong>Validation</strong> is the independent examination behind effective challenge: does the model’s logic, data, and implementation actually support the use it’s put to? <strong>Backtesting</strong> is the empirical test — does the model predict what actually happens? You compare the <em>realised</em> outcomes against what the model said to expect: a 99% Value-at-Risk model claims losses should exceed the VaR line on only 1 day in 100, so over 250 trading days you expect about 2.5 exceptions; observe twelve and the model is not merely unlucky, it is understating risk and you can say so with statistics rather than opinion. <strong>Benchmarking</strong> triangulates — does an independent model, built differently, land near the same answer? When two honest models disagree sharply, at least one is wrong, and you have found model risk before it found you.</p>

      <p className="measure">But the deepest control is not a technique at all. It is the unglamorous habit of writing down, for every model, the assumptions it rests on and the conditions under which each assumption breaks. A Value-at-Risk model calibrated on calm markets fails in a crash not because the maths is wrong but because the world stopped matching the inputs — its assumed volatility and correlations were fitted on a regime that no longer exists. No amount of backtesting catches this in advance, because the backtest data is drawn from the same calm world; the model passes every test right up to the day it matters. Naming the fragile assumption is the only control that operates <em>before</em> the regime change rather than after it. This is the bridge into Part 4: you are about to build Monte Carlo engines, VaR models, and loss distributions worth being humble about, and this family is the discipline that tells you exactly how much to trust each one — which is: never more than the assumption underneath it deserves.</p>

      <MathBlock>
        <p>Backtesting turns “is the model right?” into a counting problem. A model with confidence level <span className="eq">1 − p</span> claims its threshold (e.g. a 99% VaR, so <span className="eq">p = 0.01</span>) is exceeded only with probability <span className="eq">p</span> on any given day. Over <span className="eq">N</span> independent days the expected number of exceptions is:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">E[exceptions] = N · p</span>.</p>
        <p>If the model is correctly specified, the observed count <span className="eq">x</span> is Binomial(<span className="eq">N, p</span>). For a 99% VaR over <span className="eq">N = 250</span> days, <span className="eq">E = 2.5</span>; observing a handful is normal, but observing <span className="eq">x = 12</span> is wildly improbable under the model — strong evidence it understates risk. The judgment of how many exceptions is “too many” is itself a statistical test (this is what the Basel traffic-light backtest formalises), and notice the recursion: you are using a model — the binomial — to decide whether to trust a model. Model risk does not have a bottom; it has only assumptions named honestly enough to know when to stop trusting.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it on your organization" title="Add your model risks" />
      <p className="measure">Which decisions does your organization push through models — pricing, credit scorecards, demand forecasting, AI systems? Add each as a model risk, and for every one do the two things this lesson exists to drill: name the <em>fragile assumption</em> (the condition that, if it quietly stopped holding, would make a correct model produce a wrong answer), and name <em>who provides the independent challenge</em> — a person or function genuinely separate from whoever built and runs it. A model with no named challenger is an unvalidated bet; a model with no named assumption is one you cannot monitor, because you don’t know what to watch for.</p>

      <FamilyLens lessonId="3.7" artifactId="A10-model" family="Model risk" ownerHint="model owners / independent validation"
        sizing="Validation, backtesting, and benchmarking test whether a model works — but the real control is naming each model's assumptions and the conditions under which they break." />

      <p className="measure">Hold each entry to this standard before it earns a place in the register:</p>

      <Rubric
        title="a strong model-risk entry"
        criteria={[
          { c: 'Decision-anchored', good: 'names the real decision the model drives (what stock to make, whom to lend to), not just “a model exists”' },
          { c: 'Fragile assumption named', good: 'states the condition the model relies on and how you’d know it has stopped holding (e.g. demand stays stationary → watch forecast error vs actuals)' },
          { c: 'Independent challenger named', good: 'a person or function separate from the builder/owner, with the skill and standing to be heard — effective challenge, not self-review' },
          { c: 'Validated and monitored', good: 'has a validation status and date, plus an ongoing check (backtest or benchmark), not a one-time sign-off' },
          { c: 'Scope-aware', good: 'flags whether current guidance (SR 26-2, as of 2026) even covers it — AI/agentic models may sit outside formal model-risk rules' },
        ]}
        exemplar="Meridian R10 (demand forecast): drives make/stock decisions → write-offs or stockouts; fragile assumption = demand stays stationary, monitored by forecast-error-vs-actuals; challenged by the second-line risk/finance function, not the planning team; backtested quarterly against realised demand."
      />

      <p className="measure">A worked entry, because the common failure is to log the model and stop. A planner writes: “Demand-forecast model — risk of inaccurate forecasts.” That records the symptom and controls nothing. Repair it with the discipline: source (the model assumes demand patterns stay stationary) → test (backtest forecast against realised demand; an exception rate far above the model’s own error band is the warning) → challenge (the second line validates it independently and asks when stationarity last held) → scope check (it’s in scope as a classical statistical model; an AI replacement might not be, under SR 26-2). Now there is something to monitor, someone to monitor it, and a number that fires before the overstock does. That move — from “the model might be wrong” to “here is the assumption, here is who tests it, here is the trigger” — is the entire craft of this family.</p>

      <ProblemSet items={[
        { q: 'Meridian’s demand-forecast model has backtested cleanly for three years. The Head of Planning argues it therefore needs no further challenge. Where is the flaw?', solution: 'A clean backtest only proves the model fit the *conditions that occurred* — and those three years may all have been the same benign regime. Backtesting cannot detect a fragile assumption that has not yet been violated; the calm-market VaR model also backtests perfectly until the crash. The right response is not to relax challenge but to name the assumption (demand stationarity) and monitor the leading indicators of its breaking (a repricing private-label rival, a retailer changing ordering rhythm), so the failure is anticipated rather than discovered in the write-offs. “Validated once, safe forever” is the central model-risk fallacy.' },
        { q: 'A 99% daily VaR model on Meridian’s reserve portfolio produced 11 exceptions over the last 250 trading days. Is the model acceptable, and what should happen?', solution: 'At 99% confidence the expected exceptions are 250 × 0.01 = 2.5; eleven is far into the tail of the Binomial(250, 0.01) distribution and is strong statistical evidence the model materially understates risk (Basel’s backtest would put this deep in the “red” zone). The model should not be relied on for capital or limits until investigated. Likely culprit: a fragile assumption — volatility or correlations calibrated on a calmer period that no longer holds — which is a recalibration/re-validation trigger, not a rounding error. This is model risk caught by the model’s own medicine.' },
      ]} />

      <p className="measure">Model risk is where Part 3 hands you over to Part 4. Everything you build next — the simulations, the loss distributions, the VaR and stress numbers — is a model, and this family is the reason to build them with their assumptions written on the outside of the box. You are about to build models worth being humble about; the humility is the deliverable.</p>
    </LessonShell>
  );
}
