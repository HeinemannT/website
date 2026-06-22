import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { DataQualityScorecard } from '../tools/DataQualityScorecard.jsx';

const lesson = getLesson('5a');

const pathway = [
  { kind: 'watch', t: 'Why banks couldn’t add up their own risk in 2008', src: 'short practitioner explainer on aggregation failure', min: 6, tier: 'warmup', why: 'Feel the problem before the principles: a sound idea that was impossible in practice.' },
  { kind: 'read', t: 'Principles for effective risk data aggregation and risk reporting (BCBS 239)', src: 'Basel Committee on Banking Supervision (2013), bis.org', href: 'https://www.bis.org/publ/bcbs239.pdf', min: 25, tier: 'core', why: 'The standard itself — 14 principles, 11 binding on banks, born directly from the crisis.' },
  { kind: 'read', t: 'Progress in adopting the Principles (2023 progress report)', src: 'BCBS, bis.org', href: 'https://www.bis.org/bcbs/publ/d559.pdf', min: 15, tier: 'core', why: 'The blunt track record: a decade on, only 2 of 31 G-SIBs fully compliant.' },
  { kind: 'do', t: 'Score your organization’s risk data against the BCBS 239 dimensions', src: 'the scorecard in this lesson → Artifact A12', tier: 'apply', why: 'Find the weakest dimension — the one quietly poisoning your Part 4 numbers.' },
  { kind: 'book', t: 'Enterprise Risk Management — “Data and Technology Management”', src: 'James Lam (Wiley, 2014)', tier: 'deeper' },
];

const retrieval = [
  { q: 'BCBS 239 (BCBS, 2013) exists because, in the 2008 crisis, major banks…', options: [
    { text: 'could not aggregate their exposures to a counterparty fast or accurately enough to see the danger — the data sat in incompatible systems.', correct: true },
    { text: 'held too much capital against their trading books.' },
    { text: 'used models that were too conservative.' }] },
  { q: 'Of the four BCBS 239 data-aggregation dimensions, the one that asks “can you answer a question you did not prepare for?” is…', options: [
    { text: 'adaptability.', correct: true },
    { text: 'completeness.' },
    { text: 'accuracy & integrity.' }] },
  { q: 'A Monte Carlo or VaR model from Part 4 fed incomplete data will…', options: [
    { text: 'produce a confident, precise-looking, wrong answer — the flaw is invisible in the output and only visible in the inputs.', correct: true },
    { text: 'refuse to run until the data is fixed.' },
    { text: 'automatically widen its confidence intervals to flag the problem.' }] },
];

export default function Lesson5a() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Every number in Part 4 — every simulated loss, every Value-at-Risk, every economic-capital figure — was built on the assumption that you could pull the underlying data together, accurately and on time. For most real organizations that assumption is the single weakest link, and nobody sees it until it snaps.</Lead>

      <p className="measure">In the 2008 crisis, several of the world’s largest banks discovered they could not answer a simple question — “what is our total exposure to this counterparty?” — for <em>days</em>, because the relevant positions lived in dozens of incompatible systems that had never been built to be added together. The aggregation was sound in theory and impossible in practice, and by the time the answer arrived the decision it was needed for had already been forced. The lesson the Basel Committee drew was uncomfortable: an enterprise risk view is only as good as the plumbing beneath it, and the plumbing is almost always worse than anyone admits. Risk-data infrastructure is not a support function for risk management — it <em>is</em> a risk, and a first-order one.</p>

      <p className="measure">Here is how to work the topic — the explainer to feel the failure, then the standard that came out of it (BCBS 239) and its sobering progress report, then the build where you score your own organization.</p>

      <Pathway lessonId="5a" items={pathway} />

      <Objectives items={[
        'Explain why risk-data infrastructure is itself a risk, using the 2008 aggregation failure as the motivating case.',
        'Recite the structure of BCBS 239 (BCBS, 2013) — its principle groups and its four data-aggregation dimensions: accuracy & integrity, completeness, timeliness, adaptability.',
        'Trace the direct line from data quality to every Part 4 number, and why a flawed input produces a confident wrong answer you cannot see in the output.',
        'Score your organization’s risk data against the BCBS 239 dimensions and find the weakest one (Artifact A12).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="The plumbing nobody sees until it bursts" />
      <p className="measure">After 2008 the Basel Committee on Banking Supervision issued <strong>BCBS 239 — “Principles for effective risk data aggregation and risk reporting”</strong> (January 2013), the canonical statement of what risk-data infrastructure must do. It is fourteen principles in four groups: <em>governance and infrastructure</em> (board ownership of risk data, and an IT architecture that holds up under stress, not just in calm), <em>risk-data aggregation capability</em>, <em>risk-reporting practices</em>, and a final group covering supervisors. The first three groups — eleven principles — bind the banks themselves. Critically, BCBS 239 frames the problem as governance and taxonomy <em>first</em>: aggregation breaks not mainly because the hardware is slow but because different units name and classify the same risk differently, hand data off through manual spreadsheets, and keep no record of where a number came from. Teach it as a transferable data-discipline checklist, not a banking rule — every principle restates as a generic requirement any organization with risks to add up must meet.</p>

      <p className="measure">The heart of the standard, for our purposes, is the four <strong>data-aggregation dimensions</strong> it demands (BCBS 239, Principles 3–6). <strong>Accuracy and integrity</strong>: the numbers are right and reconcile to source. <strong>Completeness</strong>: all material risks are captured, across the whole group — no entity, product, or geography silently missing. <strong>Timeliness</strong>: data is available fast enough to act on, and the test that matters is <em>under stress</em>, because a figure that takes a week to assemble is useless in the crisis it was meant to warn you about. <strong>Adaptability</strong>: you can answer a question you did <em>not</em> prepare for — a new concentration, a new scenario — in hours, not a six-week IT project. Two supporting concepts run underneath all four: <strong>data lineage</strong>, the ability to trace any reported number back to its source system, and a <strong>single source of truth</strong> under one common taxonomy, so that two reports of “total exposure to X” cannot disagree.</p>

      <p className="measure"><strong>GRC platforms</strong> (governance, risk, and compliance systems) are the machinery that holds the register, control library, KRI feeds, and audit trail — but the dangerous failure mode is believing that buying a GRC tool <em>is</em> doing the work. The tool is a filing cabinet; the discipline is whether the data inside it is governed, owned, lineage-traceable, and trustworthy.</p>

      <p className="measure">The track record is blunt, and that bluntness is part of the lesson. The Committee’s 2023 progress report found that of 31 global systemically important banks assessed, only <strong>two were fully compliant</strong> — roughly a decade after publication — citing fragmented IT, legacy systems, and manual processes (BCBS, 2023). These are the most heavily resourced, most heavily supervised financial institutions on earth, and a clear majority still cannot fully aggregate their own risk to the standard they have been told to meet. Aggregation infrastructure is a multi-year programme, not a project, and if the G-SIBs are still climbing that hill, a mid-cap manufacturer with three plants and fourteen countries should hold no illusions about its own data estate.</p>

      <p className="measure">Run the diagnosis on <strong>Meridian Industries</strong>, the firm carried through this course — a listed mid-cap consumer-goods maker, ~€1.2bn revenue, three plants, selling in fourteen countries, with a treasury that hedges currencies, extends customer credit, and runs a €60m reserve portfolio (Meridian case bible). Score its risk data against the four dimensions. On <em>completeness</em> it is middling: its starter register captures fourteen named risks across operational, financial, conduct, and climate families, but emerging-market exposures and the SE-Asia plant feed in through less mature systems than the European core. On <em>accuracy</em> its treasury numbers — FX positions, the reserve portfolio — are clean and reconcilable, because that is what treasury systems do; its operational-loss history (a five-year series the Part 4 Monte Carlo consumes) is thinner and partly hand-compiled.</p>

      <p className="measure">But the dimension that fails hardest is <em>timeliness under stress</em> combined with <em>adaptability</em>: ask Meridian “what is our total exposure — credit, supply, FX, and inventory together — to a demand downturn across all fourteen countries, right now?” and the honest answer is that it cannot assemble that in a crisis fast enough to act, because the data lives in separate plant, treasury, and commercial systems under inconsistent taxonomies. That is precisely the 2008 failure in miniature: the risks that worsen together (R4, R6, R11, R12 in a downturn) are stored in silos that were never built to be added together, so the one number a board would most want in a crisis is the one the plumbing cannot produce in time.</p>

      <DoNow>Before the build, read BCBS 239 (pathway step 2, ~25 min) — at minimum Principles 3–6, the four aggregation dimensions you are about to score your own organization against.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Garbage in, aggregated garbage out" />
      <p className="measure">There is a direct, unforgiving line from this lesson back to Part 4. Every simulation, every VaR, every aggregated economic-capital figure <em>consumes</em> this data and inherits its flaws <strong>silently</strong>. This is the property that makes bad risk data so dangerous: a beautifully constructed Monte Carlo run on incomplete or stale data does not crash, does not warn, does not widen its intervals — it produces a confident, precise-looking, wrong distribution, and the error is invisible in the output. You cannot find it by staring at the answer; you can only find it by interrogating the inputs. A VaR of “€12m at 99%” computed from a register that silently omits two emerging-market exposures is not a slightly-too-low VaR you can mentally adjust — it is a number with no defensible meaning, dressed in the authority of a model.</p>

      <p className="measure">So the “quantification” in this lesson is honest self-scoring rather than a new estimator. Rate each data dimension on a simple scale; a sensible <em>data-quality score</em> for a source is just the (optionally weighted) average of its dimension ratings, and a firm-wide <em>aggregation-readiness</em> index is the share of risk-data sources that clear a threshold on <em>every</em> BCBS-239-mapped dimension. The point of the number is not precision — it is to make “our data is not ready” undeniable, to locate <em>where</em> the foundation is thin, and to track it over time. Because that thin spot is exactly where your most impressive upstream numbers are quietly least trustworthy, the scorecard is really a map of which Part 4 outputs you are allowed to believe.</p>

      <MathBlock>
        <p>Score each dimension <span className="eq">d</span> on a source as <span className="eq">q_d ∈ [0,1]</span>. A source’s data-quality score is the weighted average</p>
        <p style={{ textAlign: 'center' }}><span className="eq">Q = Σ_d w_d · q_d</span>, with <span className="eq">Σ_d w_d = 1</span>.</p>
        <p>But aggregation readiness is governed by the <em>weakest</em> link, not the average: a source is ready only if <span className="eq">min_d q_d ≥ τ</span> for a threshold <span className="eq">τ</span>. One failed dimension — say timeliness under stress — invalidates the aggregate however high the others score, which is why a 3.5/4 average can still hide a number you cannot trust when it matters. The firm-wide index is then just the fraction of risk-data sources meeting that all-dimensions bar.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Score your data" />
      <p className="measure">Now rate your own organization against the BCBS 239 dimensions and find where the plumbing is weakest. Move each slider honestly — the temptation is to score the dimensions you have invested in and skip the one you fear. Treat “largely there” as a high bar: it means a number reconciles to source, covers the whole group, arrives in time <em>in a crisis</em>, and could answer a question you did not pre-build. The lowest sliders are your to-do list for the infrastructure that makes everything upstream trustworthy. Saved as Artifact A12.</p>

      <DataQualityScorecard lessonId="5a" artifactId="A12" />

      <p className="measure">Read your scorecard back through one question that exposes self-flattery: <em>in your last real crisis or near-miss, did the number you needed arrive in time, complete, and traceable to source?</em> If not, the dimension that failed then is the one to score down now, whatever your systems look like in calm. The standard to hold your data estate to:</p>

      <Rubric
        title="risk data fit to aggregate on"
        criteria={[
          { c: 'Owned and governed', good: 'risk data has named owners and board oversight — it is a governance issue, not an IT housekeeping one (BCBS 239, Principle 1)' },
          { c: 'Accurate & reconcilable', good: 'reported numbers tie back to source systems; lineage is traceable end to end' },
          { c: 'Complete across the group', good: 'no entity, product, or geography is silently missing — the whole organization is in scope' },
          { c: 'Timely under stress', good: 'the number arrives fast enough to act on in a crisis, not a week later' },
          { c: 'Adaptable', good: 'a question you did not prepare for can be answered in hours, off a single source of truth under one taxonomy' },
        ]}
        exemplar="Meridian: treasury data strong (accurate, timely); register completeness middling (emerging-market and SE-Asia feeds weaker); the binding gap is adaptability + timeliness under stress — it cannot aggregate total downturn exposure across 14 countries fast enough in a crisis. Weakest dimension drives the verdict."
      />

      <p className="measure">A worked correction, because this is the most common mistake. A risk team reports a polished firm-wide VaR and a clean heat map, and the board takes comfort. But three of the fourteen countries feed data through a separate system that updates monthly and uses a different risk taxonomy, so their exposures are either stale or quietly mapped to the wrong category. The aggregate looks complete and is not. The fix is not a better model — the model is fine — it is data lineage and a common taxonomy: trace each number to its source, reconcile the three lagging countries onto the same definitions and cadence as the rest, and only then trust the aggregate. Until then the right report to the board is not the confident VaR but the honest sentence: “we cannot yet aggregate this firm-wide to a standard we would defend.”</p>

      <ProblemSet items={[
        { q: 'Meridian’s board asks for its total exposure to a demand downturn across all fourteen countries. The model produces a precise figure in seconds. Why might a risk manager still refuse to present it as reliable?', solution: 'Because the figure’s precision comes from the model, not from the data feeding it. Meridian’s downturn-sensitive risks (top-customer loss R4, distributor default R6, covenant breach R11, private-label erosion R12) sit in separate commercial, treasury, and plant systems under inconsistent taxonomies, and the emerging-market feeds update slowly. The aggregate may silently omit or misclassify exposures, especially from the less mature systems — completeness and accuracy fail upstream, so the model gives a confident wrong answer with no visible flaw. The honest move is to present the number with its data caveats, or to fix lineage and taxonomy first.' },
        { q: 'A peer firm scores 3.8/4 on its data-quality average yet was blindsided in a crisis when it could not assemble a key exposure for two days. How is a high average consistent with that failure, and what does it teach about scoring?', solution: 'Aggregation readiness is governed by the weakest dimension, not the average. The firm could have scored 4/4 on accuracy, completeness, governance, and reporting, and still failed timeliness-under-stress — and one failed dimension invalidates the aggregate when it is needed (min_d q_d below threshold). A high average hid a single fatal gap. The lesson: judge data on its weakest BCBS 239 dimension, score timeliness specifically for the crisis case rather than calm operations, and never let a strong average buy comfort about a number you have never actually had to produce under pressure.' },
      ]} />

      <p className="measure">This lesson is the foundation the rest of Part 5 stands on: a board dashboard (5c) is only as honest as the data scorecard behind it, and the capstone (5e) grades on whether every number traces back to a trustworthy source. You now know why the most beautiful model in the course can still lie — quietly, confidently — if the plumbing underneath it is thin. Next: how to mature the whole risk function, of which this data infrastructure is one load-bearing pillar.</p>
    </LessonShell>
  );
}
