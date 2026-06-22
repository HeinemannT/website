import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { CapstoneAssembler } from '../tools/CapstoneAssembler.jsx';

const lesson = getLesson('5e');

const pathway = [
  { kind: 'read', t: 'COSO ERM 2017 — the five components, re-read', src: 'IRM practitioner guide / NC State summary', href: 'https://www.theirm.org/media/6885/irm-report-review-of-the-coso-erm-frameworks-v2.pdf', min: 15, tier: 'warmup', why: 'You read this in 1.3 as theory. Re-read it now — every component (governance, strategy, performance, review, reporting) is a thing you actually built.' },
  { kind: 'read', t: 'ISO 31000 — the framework clause, re-read', src: 'NC State / ISO summary', href: 'https://erm.ncsu.edu/resource-center/cosos-erm-framework/', min: 10, tier: 'warmup', why: 'ISO’s “framework” (leadership, integration, design, implementation, evaluation, improvement) is the loop your operating model runs. Recognise your own artifacts in it.' },
  { kind: 'do', t: 'Assemble your full operating model', src: 'the assembler in this lesson → Artifact CAP', tier: 'apply', why: 'Pull fifteen artifacts into one system, read the completeness × coherence score, and close the gaps it flags.' },
  { kind: 'book', t: 'Enterprise Risk Management — the closing chapters', src: 'James Lam', tier: 'deeper', why: 'Lam’s integrated, end-state programme and his “Predictions” — what a complete function looks like, and where the discipline goes next.' },
];

const retrieval = [
  { q: 'What turns a pile of artifacts (register, appetite, KRIs, controls…) into an operating model?', options: [
    { text: 'Traceability — every top risk links to an owner, an appetite line, a control, a KRI, a treatment, and (where measurable) a quantified estimate.', correct: true },
    { text: 'Having all of them in the same folder.' },
    { text: 'A high completeness score on its own.' }] },
  { q: 'A top risk that appears in the register but has no KRI watching it is…', options: [
    { text: 'a coherence gap — the broken trace is the remaining work, exactly what the assembler flags.', correct: true },
    { text: 'fine, because it is already in the register.' },
    { text: 'a reason to delete the risk.' }] },
  { q: 'A high capstone score (completeness × coherence) means…', options: [
    { text: 'a coherent, defensible programme — not a guarantee against surprise; the limits from 5d still bind.', correct: true },
    { text: 'the organization is now safe from loss.' },
    { text: 'no further review is needed.' }] },
];

export default function Lesson5e() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>You have fifteen artifacts for one organization — a charter, an appetite statement, a register, an evaluation, controls, treatments, KRIs, a taxonomy, family deep-dives, quantified losses, a data score, a maturity rating, a board view, a judgment audit. The capstone asks one question of them: do they form a <em>system</em>, or just a pile? That question — coherence — is the whole lesson.</Lead>

      <p className="measure">A complete risk operating model is not a document; it is the running machinery by which an organization governs uncertainty, and it has a definable parts list. A <strong>charter</strong> fixes the mandate, the governance (three lines, a risk committee, a CRO), and the framework chosen. An <strong>appetite statement</strong> sets the board’s posture per category and cascades into tolerances and delegated limits. A populated <strong>register</strong> names each risk as cause → event → consequence with an owner. An <strong>evaluation</strong> scores likelihood and impact and ranks by expected loss. A <strong>control map</strong> shows inherent versus residual. A <strong>treatment / financing plan</strong> applies the four Ts and decides insure-versus-retain. <strong>KRIs</strong> with thresholds feed a <strong>board report</strong>. A <strong>taxonomy</strong> gives one common language so a <strong>portfolio / aggregation view</strong> can find common drivers. The <strong>risk families</strong> are each covered, the <strong>measurable</strong> ones carry a quantified analysis (loss distribution, capital, scenario), and three honesty layers wrap the rest: a <strong>data-quality baseline</strong> (can the numbers be trusted), a <strong>maturity assessment</strong> (how good is the function), and a <strong>judgment / model-risk audit</strong> (where will it fool itself). That list is the checklist you assemble against — but having every part is only half the test.</p>

      <p className="measure">Before assembling, re-read the two framework summaries you met in lesson 1.3 — but read them differently now. The first time, COSO’s five components and ISO 31000’s framework loop were abstractions. Now every clause names something you have actually produced, and the re-read is a recognition exercise: your charter <em>is</em> COSO’s “governance &amp; culture,” your appetite-to-strategy linkage <em>is</em> “strategy &amp; objective-setting,” your KRIs and board pack <em>are</em> “information, communication &amp; reporting.” Then read Lam’s closing chapters for the picture of a complete, integrated programme — the end state you are now within reach of.</p>

      <Pathway lessonId="5e" items={pathway} />

      <Objectives items={[
        'State what a complete risk operating model contains, as a checklist you can judge any programme against.',
        'Apply the coherence test: trace every top risk to an owner, an appetite line, a control, a KRI, a treatment, and a quantified estimate where measurable.',
        'Read the assembler’s completeness × coherence score honestly — and know why a high score is a coherent programme, not a guarantee against surprise.',
        'Assemble, defend, and export your organization’s full risk operating model (Artifact CAP).',
      ]} />

      <Stage n={3} kicker="Assemble everything" title="Your risk operating model" />
      <p className="measure">There is almost no new content here, and that is the point: the capstone is synthesis, and the skill it tests is <em>coherence-checking</em>, not recall. So be precise about what assembly means. It is not collecting the artifacts in one place — it is verifying the <strong>traces between them</strong>. The single question that turns a pile into a system is this: does every top risk trace, unbroken, to an owner who holds it, a line in the appetite statement that says how much of it the board will accept, a control that acts on it, a KRI that watches it, a treatment that decides what to do about it, and — where the risk is measurable — a quantified estimate of what it could cost? A risk that breaks that chain anywhere is an orphan, and the broken link is not a cosmetic flaw: it <em>is</em> the remaining work. A top risk with no KRI is a risk no one is watching; an appetite line with no limit beneath it is a slogan; a quantified loss with no model-risk note is a number pretending to be certain. The assembler exists to find these breaks for you.</p>

      <p className="measure">The assembler builds two things on top of the trace. <strong>Completeness</strong> asks whether each of the fifteen components is present at all — the parts list above, checked off. <strong>Coherence</strong> asks the harder questions: do <em>all</em> your risks have named owners, do your appetite categories carry real decisions rather than adjectives, are your <em>top</em> exposures actually treated, did the judgment audit happen, is at least one risk quantified? The headline score weights these 60% completeness, 40% coherence — deliberately, because a complete-but-incoherent model (every box ticked, nothing connected) is worth less than the boxes suggest, and the 40% is there to dock it. Where a check fails, the flag points at the exact gap to close; closing it is the last act of the course. When the traces hold, export the model: a defensible enterprise risk programme for your organization, built from first principles and usable next quarter.</p>

      <CapstoneAssembler lessonId="5e" artifactId="CAP" />

      <p className="measure">Read the score the way 5d taught you to read any number. A high score certifies that your programme is <em>coherent</em> — every top risk is owned, bounded, controlled, watched, treated, and costed — which is a real and rare achievement. It does <em>not</em> certify that you are safe. The register only holds the risks you identified; the quantified slice rests on models calibrated to a past that the next shock will ignore; the appetite lines hold only if the culture honours them when a quarter goes bad. A perfect operating model run by a turkey still gets to Thanksgiving. So the honest reading is: the score measures the quality of your <em>preparation</em>, not the kindness of the world. That distinction is the whole discipline, and the judgment audit (A15) is in the coherence checks precisely so the model never lets you forget it.</p>

      <Rubric
        title="a complete, coherent risk operating model"
        criteria={[
          { c: 'Complete', good: 'all components present — charter, appetite, register, evaluation, controls, treatment, KRIs, taxonomy/portfolio, family coverage, quantification, data baseline, maturity, board view, judgment audit' },
          { c: 'Traceable', good: 'every top risk links to an owner, an appetite line, a control, a KRI, a treatment, and (where measurable) a quantified estimate — no orphans' },
          { c: 'Quantified with limits', good: 'measurable risks carry an estimate, and each estimate carries a model-risk / bias note rather than standing as bare certainty' },
          { c: 'Board-ready', good: 'the one-pager would actually inform a board: top risks vs. appetite, KRI status, capital, maturity — a decision report, not a data dump' },
          { c: 'Honest', good: 'the limits layer (data quality, maturity gaps, tail/judgment audit) constrains the quant layer instead of being decoration' },
        ]}
        exemplar="Meridian: 15/15 components, top-3 (R4 retailer loss, R11 covenant breach, R3 contamination) each owned, appetite-bounded, controlled, watched by a KRI, treated, and quantified — with R3 carrying its recall-tail and bias note. Score in the 80s reads as ‘coherent programme,’ not ‘nothing can go wrong.’"
      />

      <p className="measure">Walk Meridian’s assembled model the way the assembler does, top-down. Its register carries fourteen risks summing to a sizeable expected loss; ranked by likelihood × impact, the top exposures are R4 (lose the 18%-of-revenue retailer, €40m), R11 (downturn breaches the leverage covenant, €25m), and R3 (contamination → recall, €18m). Now run the trace on each. R4: owned by the CEO, sits under the <em>hungry</em> strategic appetite line, watched indirectly by the top-customer-concentration KRI (now 34%, amber at 30, red at 45), treated by diversifying the customer base — but notice it has no <em>dedicated</em> early-warning KRI on that single relationship’s health, only the aggregate concentration measure. R11: owned by the CFO, bounded by the explicit financial appetite line (≤1-in-20 covenant breach), watched by days-of-cash (35, amber at 40 — already amber) and FX-hedge coverage (60%, below the 70% trigger), treated by the hedging limit, and quantified by the “Recession 2027” reverse-stress that asks how far EBITDA can fall before net debt/EBITDA hits 3.0×. R3: owned by the Quality Director, under the <em>averse</em> safety line, watched by the customer-complaint-rate KRI (8, amber at 6), treated by insurance plus prevention, and quantified by the fat-tailed loss history that remembers the real €4m recall four years ago — with a model-risk note that a 5-year history under-counts the genuine tail.</p>

      <p className="measure">That walk is what a coherent model lets you do in two minutes, and it also surfaces the one gap worth naming. Of Meridian’s top three, R4 is the soft trace: the board’s single largest exposure — €40m if the top retailer walks — is watched only through an <em>aggregate</em> concentration percentage, not through any indicator of that specific account’s health (order trend, contract renewal date, the ESG-shelf-space notice in §9 that is effectively a notice on this relationship). The risk is owned, bounded, treated, and quantified; what is missing is the KRI. That is exactly the kind of broken link the coherence check flags as “a top risk without a dedicated early-warning indicator,” and the fix is a one-line addition to the KRI set, not a new programme. Coherence-checking is mostly this: finding the single thread that doesn’t reach all the way through, and pulling it.</p>

      <MathBlock>
        <p>The capstone score makes the two tests explicit. With <span className="eq">C</span> the count of components present out of 15 and <span className="eq">K</span> the coherence checks passed out of their total:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">score = 0.6 · (C / 15) · 100 + 0.4 · (K / K_total) · 100</span>.</p>
        <p>Completeness (60%) rewards having the parts; coherence (40%) rewards the parts connecting. A model can score high on the first and fail the second — every artifact present, but a top risk with no KRI, an appetite of adjectives, a top exposure left untreated. The 40% term is what stops a tidy binder from masquerading as a working system; it is the mathematical form of “a pile is not a model.”</p>
      </MathBlock>

      <ProblemSet items={[
        { q: 'A learner’s assembler shows 15/15 components but a coherence flag: “Top-3 risks with a treatment chosen: 2/3.” Completeness is perfect. Is the model done?', solution: 'No. Completeness only confirms each artifact exists; coherence confirms they connect. One of the three largest exposures has no treatment — it has been identified, evaluated, perhaps even quantified, but nothing has been decided about it. That broken trace is the remaining work, and the fix is to make a treat/tolerate/transfer/terminate call on that specific risk, not to add another artifact. The flag is pointing at the exact gap; a perfect completeness score does not buy it off.' },
        { q: 'Meridian’s R4 (lose the top retailer) is owned, sits under the strategic appetite line, is being treated by customer diversification, and is the largest single exposure — yet the only indicator touching it is the aggregate top-customer-concentration KRI. What is the coherence gap, and why does it matter more than it looks?', solution: 'The trace breaks at the KRI link: the board’s single biggest risk has no dedicated early-warning indicator on that one relationship — only an aggregate concentration measure that could stay green while this specific account quietly deteriorates (declining orders, a non-renewal, the ESG shelf-space ultimatum). It matters because the whole point of a KRI is to fire before the loss, inside the limit; an un-watched €40m exposure means the board would learn of it when the contract is already gone. The fix is small and surgical — add a KRI on that account’s health — which is exactly why coherence-checking is high-leverage: a one-line addition closes a gap on the largest risk in the book.' },
        { q: 'Two organizations both score 84/100. One concludes “we are now well-protected against loss.” Why is that the wrong reading, and what is the right one?', solution: 'The score measures the coherence and completeness of the *programme*, not the benignity of the world. An 84 says every top risk is owned, bounded, controlled, watched, treated, and costed — superb preparation. It says nothing about the risks not in the register, the tail the loss model under-counts, or whether the culture will honour the appetite lines under pressure (5d’s whole lesson). The right reading: “our preparation is coherent and defensible; surprise is still possible, the limits layer tells us where, and we keep challenging the numbers.” Confusing a high score with safety is precisely the overconfidence the judgment audit exists to catch.' },
      ]} />

      <DoNow>Open your assembler, find your single softest trace — the top risk whose chain to owner / appetite / control / KRI / treatment / estimate breaks somewhere — and close that one link before you export. That is the assembly work.</DoNow>

      <p className="measure">That is the course. You arrived thinking risk management meant avoiding bad things; you leave able to do the actual work of the discipline — to <em>govern</em> risk through a charter and an appetite, to <em>run the process</em> of identify-evaluate-treat-monitor, to <em>map the whole universe</em> under one taxonomy and see where its drivers converge, to <em>quantify the measurable slice</em> with Monte Carlo and VaR and stress, to <em>report it to a board</em> in a page that informs a decision, and to <em>stay honest</em> about the limits of every number you produced. That is what enterprise risk management always was: organized judgment under uncertainty, with the mathematics serving only the part that can be measured and never standing in for the judgment that governs the rest. Your operating model is the proof you can do it. The score grades the preparation; the world will keep its own counsel; and the judgment — about what to watch, what to bound, what to accept, and where to distrust your own machine — is, and remains, yours.</p>
    </LessonShell>
  );
}
