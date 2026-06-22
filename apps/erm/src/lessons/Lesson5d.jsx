import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { JudgmentAudit } from '../tools/JudgmentAudit.jsx';

const lesson = getLesson('5d');

const pathway = [
  { kind: 'read', t: 'Supervisory Guidance on Model Risk Management (SR 11-7)', src: 'US Federal Reserve & OCC (2011)', href: 'https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm', min: 25, tier: 'core', why: 'The source of “effective challenge” — the regulatory expectation that an independent, empowered party tries to break the model.' },
  { kind: 'book', t: 'Thinking, Fast and Slow', src: 'Daniel Kahneman (2011)', tier: 'core', why: 'System 1 vs System 2, and the catalogue of biases — overconfidence, anchoring, availability, framing — that distort risk judgment.' },
  { kind: 'book', t: 'The Black Swan', src: 'Nassim Nicholas Taleb (2007)', tier: 'core', why: 'Rare high-impact events outside all the data, fat tails, and why a model calibrated on the past fails when the world stops matching its inputs.' },
  { kind: 'do', t: 'Audit your judgment and your models', src: 'the builder in this lesson → Artifact A15', tier: 'apply', why: 'Name the biases you guard against and the assumption each model would die on.' },
];

const retrieval = [
  { q: 'Why does a VaR model calibrated on calm markets fail in a crash?', options: [
    { text: 'Not because the maths is wrong — because the world stopped matching the inputs the model was fitted to.', correct: true },
    { text: 'Because the arithmetic of variance is incorrect under stress.' },
    { text: 'Because crashes are uncomputable in principle.' }] },
  { q: '“Effective challenge” (SR 11-7, 2011) requires that…', options: [
    { text: 'a competent, independent, empowered party actively tries to break the model and its assumptions.', correct: true },
    { text: 'the model’s author re-checks their own work.' },
    { text: 'the model output is rounded to fewer decimals.' }] },
  { q: 'The deepest point of the quant arc is that…', options: [
    { text: 'the more confidently you quantify, the more you must distrust the number — it is an aid to judgment, not a replacement.', correct: true },
    { text: 'a precise enough number removes the need for judgment.' },
    { text: 'quantification should be abandoned once you find a bias.' }] },
];

export default function Lesson5d() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Every number you have built in this course rests on two things that fail in predictable ways: a human judgment and a model. This lesson is about distrusting your own tools in exactly the right amount — the skill that separates a wise risk function from a dangerous one.</Lead>

      <p className="measure">There are two kinds of blindness, and a mature risk function defends against both. The first is <strong>cognitive</strong>: the human mind producing the inputs is systematically, predictably biased. The second is <strong>structural</strong>: the model digesting those inputs is a confident extrapolation from the past that breaks when the world changes. Put them together and you get the recurring tragedy of risk management — a precise, authoritative number everyone trusts, right up to the moment it is catastrophically wrong. Knowing this is not cynicism; it is the final discipline of the course.</p>

      <p className="measure">Work the topic in three moves. Read SR 11-7 (US Fed and OCC, 2011) for where the defence comes from — it is the document that turned “effective challenge” from good practice into a regulatory expectation. Then Kahneman’s <cite>Thinking, Fast and Slow</cite> (2011) for the cognitive blindness and Taleb’s <cite>The Black Swan</cite> (2007) for the structural one. Then build the audit at the end.</p>

      <Pathway lessonId="5d" items={pathway} />

      <Objectives items={[
        'Name the cognitive biases that distort risk judgment, with the one-line mechanism by which each does its damage.',
        'Explain black swans, fat tails, and why a model calibrated on the past under-states extreme events.',
        'Apply effective challenge (SR 11-7): state assumptions, name where they break, stress beyond the data, pay someone to break the model.',
        'Audit your organization’s judgment and model risk (Artifact A15).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Two kinds of blindness" />
      <p className="measure">The first blindness is <strong>cognitive</strong>, and Kahneman’s <cite>Thinking, Fast and Slow</cite> (2011) is its anatomy. He splits the mind into <strong>System 1</strong> — fast, automatic, intuitive, the part that produces a risk estimate before you have noticed you were estimating — and <strong>System 2</strong> — slow, effortful, deliberate, the part that checks. Most of the discipline you have learned in this course is machinery for forcing System 2 onto judgments System 1 wants to make on a glance. The specific biases that corrupt risk judgment each have a single mechanism worth memorising. <strong>Overconfidence</strong>: we treat our estimates as tighter than they are, the calibration failure of lesson 2b made into a habit — the 90% interval that catches the truth half the time. <strong>Anchoring</strong>: the first number in the room (last year’s figure, someone’s opening guess) silently drags every later estimate toward it. <strong>Availability</strong>: we over-weight the vivid and the recent and under-weight the risk we have never seen, so the disaster we can picture crowds out the one we can’t. <strong>Framing</strong>: the same risk described as a 10% chance of loss versus a 90% chance of safety produces different decisions from the same people. <strong>Confirmation</strong>: once we hold a view we hunt for the data that fits it and explain away the data that doesn’t. And <strong>groupthink</strong>: dissent is uncomfortable, so a committee converges too fast and mistakes its own comfort for consensus. None of these is stupidity; they are the default settings of a competent mind under time pressure.</p>

      <p className="measure">The second blindness is <strong>structural</strong>, and Taleb’s <cite>The Black Swan</cite> (2007) names it. A black swan is an event that is (i) an outlier outside everything in your data, (ii) of extreme impact, and (iii) explained as obvious <em>only in hindsight</em> — the narrative we build afterward to convince ourselves we should have seen it coming, which deepens the trap by hiding how blind we actually were. The world has <strong>fat tails</strong>: extreme outcomes are far more frequent than the tidy bell curve fitted to normal times implies, so the model’s “once in a thousand years” loss arrives every few decades. This is the precise limit of every quantitative tool in Part 4. A VaR model calibrated on calm markets fails in a crash <em>not because the maths is wrong</em> — the arithmetic of variance is fine — but because the world stopped matching the inputs the model was fitted to. The relationships it assumed (volatilities, correlations) were estimated when markets were behaving, and a crisis is precisely the regime where they all break at once. Taleb’s response is a posture, not a forecast: stop trying to predict the tail and instead make the organization survive it. Favour the <strong>precautionary</strong> stance where the downside is ruin — non-ergodic, the kind you cannot recover from — and the merely <strong>proportionate</strong> cost-benefit calculus everywhere else. Pursue <strong>antifragility</strong> and <strong>optionality</strong>: positions with a capped downside and an open upside, so that volatility, when it comes, helps you more than it hurts.</p>

      <p className="measure">The defence against both blindnesses is the same, and it has a name: <strong>effective challenge</strong>. SR 11-7 (US Fed and OCC, 2011) made it a supervisory expectation precisely because models left alone do not stay honest — unchallenged, they drift into comfortable wrongness, each quarter trusted a little more because last quarter it was fine. The guidance defines model risk as the adverse consequences of decisions based on incorrect or misused models, and prescribes critical review by a party that is <em>competent</em> (able to understand the model), <em>independent</em> (not its author or owner), and <em>empowered</em> (able to force a change, not merely to comment). In practice effective challenge is four habits: state the model’s assumptions explicitly so they can be argued with; name the conditions under which each one breaks; run stress tests that deliberately push beyond the data the model was built on; and pay someone whose job is to try to break the model rather than to bless it. In Meridian’s Three-Lines design (case bible §5) this is exactly the role of the second-line risk and quality functions and the third-line internal audit — independence is the whole point of separating them from the first line that owns the risk.</p>

      <p className="measure"><strong>Meridian, worked.</strong> Read the €4m recall four years ago (case bible §9) as a bias case study, not a bad-luck story. The customer-complaint KRI had climbed for several quarters — 4, 4, 6, 7, 8 per 100k units against an amber threshold of 6 (case bible §7) — yet the rising trend was normalised: <strong>availability</strong> and optimism let a slow-moving signal feel like noise because no recall had ever happened, so none was vivid enough to fear. When the post-mortem was written, <strong>groupthink</strong> softened it — nobody in the room wanted to be the one naming a colleague’s line as the failure, so the report converged on a gentle “labelling process” conclusion and the sharper questions went unasked. The board’s appetite for safety hardened afterward only because the loss was finally vivid; the lesson is that the discipline must fire <em>before</em> the loss makes it obvious. Now take R10, the demand-forecast model (case bible §6, 35% annual chance of a forecast error, €3m impact). Audited for effective challenge, its fragile assumption is <strong>stationarity</strong>: it presumes next year’s demand behaves like the history it was trained on. A private-label shift (R12) or a sharp downturn (R11) is exactly the regime change that voids that assumption — a small black swan for Meridian. The right questions are therefore: who, independent of the Head of Planning who owns it, actually challenges this model, and have they stress-tested it against the “Recession 2027” scenario (case bible §7) rather than only against the calm years it was fitted to?</p>

      <DoNow>Pick one number you have produced in this course — a VaR figure, a heat-map score, a forecast. In one sentence each, name the bias most likely to have distorted its inputs and the single assumption that, if it failed, would make the number meaningless. You will need both for the audit at the end.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Quantifying with humility" />
      <p className="measure">The deepest point of the entire quantitative arc is a paradox: <em>the more confidently you quantify, the more you must distrust the number.</em> A VaR reported to two decimal places invites a false certainty the underlying estimate cannot support; a Monte Carlo with a thousand neat runs looks like a thousand independent opinions but is really one assumption repeated a thousand times — every run shared the same model of how the world works, so they agree precisely because they are all wrong together. Precision is not accuracy, and a tidier number is not a truer one. The remedy is not less measurement — that would throw away everything Parts 3 and 4 built — but measurement <em>wrapped in challenge</em>: the four SR 11-7 habits applied to your own outputs. State the assumptions, name where they break, stress beyond the data, and have someone independent try to break the model. The number then becomes what it always should have been — an aid to judgment, not a replacement for it.</p>

      <p className="measure">Here is the quantitative intuition that makes the humility concrete. Take the same loss data and fit two models: a thin-tailed (normal) one, which assumes extremes fade away fast, and a fat-tailed one, which assumes they don’t. On the everyday losses the two agree almost perfectly — which is exactly the trap, because the place they part company is the only place that can ruin you. Far out in the tail the fat-tailed model can assign an extreme loss a probability orders of magnitude higher than the normal curve does. Meridian’s own five-year loss history (case bible §7) shows the shape: a steady drizzle of €0.2–0.6m losses plus one €4m recall — a normal model fitted to the drizzle would have called that €4m event all but impossible, while it sits comfortably inside a fat-tailed view. Taleb’s “turkey problem” is the same maths in a sentence: the turkey’s confidence in the farmer rises every single day it is fed, peaking the afternoon before Thanksgiving — the longer the calm runs, the more dangerous the unchallenged model becomes, because every quiet day is read as evidence the model is right rather than as the silence before the regime changes.</p>

      <MathBlock>
        <p>Effective challenge formalises the gap between a model’s output and the truth. Write the realised outcome as</p>
        <p style={{ textAlign: 'center' }}><span className="eq">Outcome = Model(inputs) + model error</span>.</p>
        <p>The whole quantitative course estimates the first term. This lesson is about the second — which is largest exactly where it is hardest to see, in the tail. So the relevant question is never “what does the model say?” but <span className="eq">“under what conditions is the model error small, and are we inside them?”</span> A VaR estimate is conditional on a regime: <span className="eq">VaR | calm markets</span> is a different and far smaller number than <span className="eq">VaR | crisis</span>, and the model reports the first while the loss arrives in the second. Stating that conditioning out loud — naming the regime your number assumes — is the arithmetic of humility.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Audit your judgment and your models" />
      <p className="measure">Now turn the discipline on your own organization. The audit has two halves. First, the cognitive: for each bias, decide honestly whether you <em>actively</em> guard against it — not whether you have heard of it, but whether some concrete habit (a pre-mortem, an independent estimate before the meeting, a devil’s-advocate role) actually fires. Second, the structural: list the models you lean on for real decisions, write the single assumption each would die on, and — the column that matters most — name who provides independent challenge. A model whose challenger is its own author has no challenger.</p>

      <JudgmentAudit lessonId="5d" artifactId="A15" />

      <p className="measure">Read the result back through one question, the test that exposes a fake defence: <em>for each model, if its key assumption failed tomorrow, is there a named, independent person who would notice and is empowered to stop the decision?</em> If yes, you have effective challenge; if the answer is “the model owner would check their own work,” you have a comfortable fiction. The standard to hold the audit to:</p>

      <Rubric
        title="a credible judgment & model-risk audit"
        criteria={[
          { c: 'Biases honestly assessed', good: 'each bias is matched to a concrete guarding habit that actually fires, not a checkbox of awareness' },
          { c: 'Assumptions stated explicitly', good: 'every model names the single assumption it would die on, in plain language' },
          { c: 'Tail-sensitivity flagged', good: 'models whose error is largest in the tail (forecasts, VaR) are marked as needing fat-tailed scrutiny' },
          { c: 'Independent challenge named', good: 'each model has a challenger who is competent, independent of the owner, and empowered to force a change (SR 11-7)' },
          { c: 'Posture chosen on purpose', good: 'ruin-grade risks get a precautionary stance; ordinary risks get proportionate cost-benefit — and you can say which is which' },
        ]}
        exemplar="Meridian R10 (demand forecast): assumption = stationarity (next year resembles the trained-on past); tail-sensitive = yes (a downturn or private-label shift voids it); challenger = second-line risk, not the Head of Planning who owns it, stress-tested against ‘Recession 2027’; posture = proportionate (€3m, recoverable). Contrast R3 (contamination): precautionary, treated regardless of cost."
      />

      <p className="measure">A worked correction, because this is the most common failure. A planning team reports: “our demand model has been validated.” Validated by whom, against what? Apply effective challenge: the validator must be independent of the owner (not Planning checking Planning); the validation must name the assumption (stationarity) and the regime that voids it; and it must include a stress test beyond the fitted data (run R10 through “Recession 2027,” not just last year’s numbers). “Validated” without those three is the comfortable wrongness SR 11-7 was written to stop. The repair is always the same shape: name the assumption, name the regime where it breaks, name an independent and empowered person to watch it.</p>

      <ProblemSet items={[
        { q: 'A risk committee waves through a project after a confident, polished forecast presented by the project’s own sponsor. Name the two biases most likely at work and the one habit that would have countered both.', solution: 'Overconfidence (the sponsor’s estimates are tighter than the evidence warrants) and groupthink (the committee converges fast because dissent against a polished, senior pitch is uncomfortable) — with anchoring also likely, as the sponsor’s headline number drags the discussion toward it. The single countering habit is a structured independent challenge before the vote: a pre-mortem (“assume this failed in two years — why?”) or an assigned devil’s-advocate who is competent and empowered, which is effective challenge (SR 11-7) imported into the committee room.' },
        { q: 'Meridian’s VaR on the €60m reserve portfolio (case bible §7) was estimated on five calm years and reports a comfortable number. Why is that the moment to distrust it most, and what does the mature stance do instead?', solution: 'The calm calibration is exactly the danger — it is the turkey problem: every quiet year raises confidence in a model whose error lives entirely in the tail it has never seen, and the reported VaR is implicitly “VaR | calm markets,” not the VaR that matters in a crisis when correlations jump and the bond/equity diversification (case bible §7) stops working. The mature stance does not abandon the number; it wraps it in challenge — state the regime assumption explicitly, re-estimate under a fat-tailed view, stress beyond the data with the “Recession 2027” scenario, and treat ruin-grade outcomes precautionarily rather than trusting the point estimate.' },
      ]} />

      <p className="measure">This is the humility that completes the discipline: the number is an instrument, and like any instrument it has a range outside which its reading means nothing. Everything you have built — the appetite lines, the registers, the loss models, the dashboards — is real and worth building, but it only stays honest under challenge. With that in hand, the last lesson assembles all of it into a single operating model: the proof that you can run ERM as a discipline, limits and all, rather than recite it.</p>
    </LessonShell>
  );
}
