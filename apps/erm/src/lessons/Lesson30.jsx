import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { TaxonomyBuilder } from '../tools/TaxonomyBuilder.jsx';

const lesson = getLesson('3.0');

const pathway = [
  { kind: 'read', t: 'Risk categories & how to build a taxonomy', src: 'NC State ERM Initiative', href: 'https://erm.ncsu.edu', min: 12, tier: 'core', why: 'Why a shared taxonomy is the precondition for an enterprise view, from a teaching source.' },
  { kind: 'read', t: 'Managing Risks: A New Framework', src: 'Kaplan & Mikes, HBR (2012)', href: 'https://hbr.org/2012/06/managing-risks-a-new-framework', min: 20, tier: 'core', why: 'The most teachable top-level cut: preventable, strategy, and external risks each need a different management style.' },
  { kind: 'read', t: 'Risk taxonomy — a structured reference', src: 'Open Risk Manual', min: 10, tier: 'core', why: 'A free, MECE-disciplined reference tree to borrow families and definitions from.' },
  { kind: 'do', t: 'Set your organization’s taxonomy', src: 'the builder in this lesson → Artifact A9', tier: 'apply', why: 'Lay your register over the families and read which boxes are full, thin, and empty.' },
  { kind: 'book', t: 'Enterprise Risk Management — the risk-types chapter', src: 'James Lam (2nd ed., 2014)', tier: 'deeper' },
];

const retrieval = [
  { q: 'A single “cyber” incident knocks out order processing, triggers a regulator’s data-breach inquiry, and dents the brand. In a well-built taxonomy you classify it by…', options: [
    { text: 'where the loss lands — operational, compliance, and reputational consequences — not by its shared cause, so each landing point gets an owner.', correct: true },
    { text: 'its cause, filing all three under a single “cyber” box.' },
    { text: 'whichever family the person logging it works in.' }] },
  { q: 'The single biggest payoff of one shared taxonomy across the firm is…', options: [
    { text: 'comparability and aggregation — you can add up and rank risks because everyone names the same exposure the same way.', correct: true },
    { text: 'a longer, more impressive risk register.' },
    { text: 'satisfying the external auditor, and nothing beyond that.' }] },
  { q: 'A top-level family with zero risks recorded against it usually means…', options: [
    { text: 'a blind spot — nobody with the right vantage point has looked there yet — more often than it means the area is genuinely risk-free.', correct: true },
    { text: 'the family is redundant and should be deleted at once.' },
    { text: 'that area is perfectly controlled.' }] },
];

export default function Lesson30() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Operations logs a “supplier disruption,” treasury logs an “exposure,” IT logs an “incident” — three teams, three words, one resin supplier that could halt the packaging line. Until they all file it the same way, that single risk is invisible to anyone trying to see the whole company at once. A taxonomy is the agreement that fixes this.</Lead>

      <p className="measure">A <strong>risk taxonomy</strong> is a structured classification of the kinds of risk an organization faces — top-level families broken into sub-categories — built so that everyone names the same exposure the same way. Part 2 handed you a process for working a risk one at a time. Part 3 widens the lens to the whole universe of them, and the first move is to organise that universe, because you cannot compare, rank, or add up risks that are described in a dozen private vocabularies. The taxonomy does four concrete jobs, and it is worth holding all four in mind because each fails differently when the taxonomy is weak.</p>

      <p className="measure">First, a common <strong>language</strong>: one name per kind of risk, so the resin-supplier risk is filed once rather than three times under three labels. Second, <strong>comparability and aggregation</strong>: once everyone uses the same families you can roll risks up, rank them, and see the enterprise total — which is exactly the precondition for the portfolio view built in lesson 3.1, where the same families get summed across the firm. Third, <strong>ownership</strong>: each family maps to an accountable function (financial risk to the treasurer and CFO, technology and cyber to the CISO, conduct to the general counsel), so no family is everyone’s job and therefore nobody’s. Fourth, <strong>blind-spot detection</strong>: the taxonomy is a set of boxes, and an empty box asks an uncomfortable question that a flat list never could.</p>

      <p className="measure">Here is how to work through the topic — the NC State note for why a shared taxonomy underpins an enterprise view, Kaplan and Mikes for the governance logic of why different risk types need different handling, the Open Risk Manual as a reference tree to borrow from, and the builder at the end where you lay your own register over the families.</p>

      <Pathway lessonId="3.0" items={pathway} />

      <Objectives items={[
        'Explain the four jobs a taxonomy does — language, aggregation, ownership, and blind-spot detection — and why a shared one is the precondition for an enterprise view.',
        'Apply the design principles: levels, mutually-exclusive/collectively-exhaustive families, and classifying by the risk rather than its cause or consequence.',
        'Use the standard top-level families as a checklist against omission, and reconcile a top-down board view with a bottom-up process view.',
        'Set a defensible taxonomy for your own organization and read its distribution for blind spots (Artifact A9).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Families, levels, and the discipline of classifying by where the loss lands" />
      <p className="measure">A taxonomy has <strong>levels</strong>. The top level is a handful of broad families; each family then breaks into sub-categories. A common top level — drawn from COSO ERM (2017) and practitioner schemes such as James Lam’s — runs: <strong>strategic, financial, operational, compliance and conduct, technology and cyber, climate and ESG, model, and reputational</strong>. Financial then splits into market, credit, and liquidity; operational into people, process, systems, and external events; and so on down. The exact list is not sacred — Kaplan and Mikes (HBR, 2012) cut the top level a different way, into preventable, strategy, and external risks, precisely because each demands a different management style. What matters far more than which list you adopt is that the whole organization uses <em>one</em>. A taxonomy that is everywhere-but-shared is no taxonomy at all.</p>

      <p className="measure">Two design principles make a taxonomy usable. The first is to aim for families that are <strong>clear and as mutually-exclusive and collectively-exhaustive as is practical</strong> — “MECE” — so that any given risk has one natural home (no double-counting) and nothing falls through the cracks (no gaps). Perfect MECE is unattainable in risk because the world overlaps; the goal is categories distinct enough that two reasonable people file the same risk in the same box. This is also why “more categories is better” is a trap: extra sub-divisions create overlap, and overlap quietly double-counts exposure and hides concentration.</p>

      <p className="measure">The second principle is the one practitioners most often get wrong: <strong>classify by the risk, not by its cause or its consequence</strong>. A single cause — say a ransomware attack, conventionally tagged “cyber” — can drive an operational loss (order processing stops), a compliance loss (a data-breach penalty), and a reputational loss (customers leave). If you file everything a cyber event touches under one “cyber” box, three different consequences with three different owners collapse into one, and you lose the ability to size and assign them. Classify instead by <em>where the loss lands</em>: the outage is operational and sits with the COO; the penalty is compliance and sits with the GC; the trust hit is reputational. The cause is a useful tag for finding common drivers later (that is lesson 3.1’s job), but it is not the filing category.</p>

      <p className="measure">Taxonomies are also built from two directions, and a mature function reconciles both. A <strong>top-down</strong> taxonomy is the board’s view: the families a director would expect to see — strategic, financial, reputational — imposed as the structure the firm must populate. A <strong>bottom-up</strong> taxonomy emerges from the process view: walk a plant or a payments flow and record the risks each step actually generates, then group them. Top-down guarantees the big existential families are present; bottom-up guarantees the gritty, real risks aren’t abstracted away. Reconciling them — mapping every bottom-up risk into a top-down family, and checking that every top-down family has bottom-up risks under it — is how you catch both invented categories with nothing in them and real risks with nowhere to go.</p>

      <p className="measure">Watch this on Meridian Industries, the listed mid-cap consumer-goods maker carried through the course. Its starter register holds <strong>fourteen risks</strong>, and laying them over the standard families is instructive. <em>Financial</em> is the fullest box — commodity-price spikes (R5), an FX move on input costs (R9), a distributor default (R6), and a downturn-driven covenant breach (R11), spanning market, credit, and liquidity. <em>Operational</em> holds the resin-supplier failure (R1) and the SE-Asia plant flood (R7, which also tags climate). <em>Compliance and conduct</em> holds a contamination recall (R3) and an emerging-market bribery case (R8). <em>Technology and cyber</em> holds ransomware on the ERP (R2) and a customer-data breach (R14, which also amplifies reputationally). <em>Strategic</em> holds the loss of the 18%-of-revenue top retailer (R4) and private-label erosion of a core brand (R12). <em>Climate and ESG</em> holds the decarbonisation/reformulation pressure (R13), and <em>model</em> holds the demand-forecast error (R10).</p>

      <p className="measure">Now read the distribution. Financial is full, operational and compliance are healthy, but several boxes are <em>thin</em> — model has a single risk, climate one, technology and cyber two — and the question is whether that reflects Meridian’s real exposure or just who filled the register in. The most powerful move is the hypothetical empty box. Suppose Meridian had recorded <em>no strategic risks at all</em>. That would not mean its strategy is safe; for a firm betting its three-year plan on lifting margin from 10% to 13% and doubling emerging-market revenue, it would almost certainly mean no one senior enough sat in the room when the register was built. The empty strategic box is the taxonomy telling you who is missing, not that the risk is absent. Notice too that R3 (contamination) classifies as compliance/conduct by where it lands — a recall and regulatory action — even though its cause is an operational process failure; that is the classify-by-the-risk rule doing its work.</p>

      <DoNow>Before the build, list — from memory, in two minutes — the top-level families you’d expect for your own organization, then read the NC State note (pathway step 1) and Kaplan and Mikes (step 2). The gap between your list and theirs is your first blind-spot check.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Counting is coverage, not a metric" />
      <p className="measure">There is no real mathematics in a taxonomy, and it is honest to say so: counting how many risks sit in each family is not a risk metric — it tells you nothing about how large or likely those risks are. What the count <em>is</em> is a <strong>coverage check</strong>. The distribution of risks across families is a portrait of attention, not of the business. A register that is 90% operational and 10% everything-else is not telling you the firm is mostly exposed to operational risk; it is telling you that the people who filled it in were operations people. Read the histogram of counts the same way you would read a survey’s response rate: full boxes show where attention has pooled, thin and empty boxes show where it has not reached.</p>

      <p className="measure">Two derived numbers are worth glancing at, both still coverage rather than risk. <strong>Empty-box count</strong> — how many top-level families have zero entries — is the blind-spot tally; on Meridian’s fourteen-risk register it is currently zero, which is a good sign for breadth even though individual boxes are thin. <strong>Overlap count</strong> — risks that plausibly belong in two families (R7 operational/climate, R14 cyber/reputational) — flags where your MECE discipline is straining and a classify-by-where-it-lands decision is needed. Neither number sizes a risk. The sizing comes later: lesson 3.1 takes these same families and aggregates the loss inside them into an enterprise total, and that is where the actual maths begins.</p>

      <MathBlock>
        <p>The only computation here is a tally. With families <span className="eq">F₁…F_k</span> and each risk assigned to exactly one family, coverage is the vector of counts <span className="eq">(n₁, …, n_k)</span> where <span className="eq">{'n_j = #{risks in F_j}'}</span>.</p>
        <p style={{ textAlign: 'center' }}><span className="eq">{'blind spots = #{ j : n_j = 0 }'}</span></p>
        <p>The number that matters is <em>not</em> any <span className="eq">n_j</span> on its own — a big count signals attention, not danger. It is the <em>shape</em> of the vector against what you’d expect the business to generate, and especially the zeros. The taxonomy’s job is to make those zeros impossible to overlook; turning the non-zero counts into sized, comparable risk is the aggregation step of lesson 3.1.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Set your taxonomy" />
      <p className="measure">Now build the families for your own organization and lay your register over them. The builder starts from the standard top-level set; rename, add, or remove families so they fit your business, then watch how your recorded risks distribute. Set families that are clear and as mutually-exclusive as you can manage, classify each risk by where its loss lands rather than by its cause, and treat any family you add as a promise to populate it — an invented category with nothing in it is as much a finding as an expected category left empty.</p>

      <TaxonomyBuilder lessonId="3.0" artifactId="A9-taxonomy" />

      <p className="measure">When the bars are drawn, read them as coverage, not as a ranking. Walk the empty and thin boxes first and ask the diagnostic question for each: <em>is this box thin because the risk is genuinely small, or because no one with the right vantage point looked?</em> A thin strategic or model box on a firm whose future plainly turns on strategy and models is the second case far more often than the first. Then check your overlaps — any risk you were tempted to file twice — and force a single home based on where the loss lands, tagging the cause separately for lesson 3.1. Hold the result to this standard:</p>

      <Rubric
        title="a strong risk taxonomy"
        criteria={[
          { c: 'Shared', good: 'one taxonomy the whole organization uses, so the same exposure is named the same way everywhere' },
          { c: 'Levelled', good: 'a handful of clear top-level families, each broken into sub-categories where it earns the detail' },
          { c: 'MECE-as-practical', good: 'families distinct enough that two people file the same risk the same way; minimal overlap, no obvious gaps' },
          { c: 'Classified by the risk', good: 'each risk sits in the family where its loss lands, not under its cause; causes tagged separately for aggregation' },
          { c: 'Owned & complete', good: 'every family maps to an accountable function, and the empty/thin boxes have been examined rather than ignored' },
        ]}
        exemplar="Meridian: 8 families, financial split into market/credit/liquidity; R3 (contamination) filed under compliance/conduct by where it lands, not under operations where it starts; R14 forced into cyber with a reputational tag; every family carries a named owner (CFO, COO, CISO, GC)."
      />

      <p className="measure">A worked correction, because this is the most common taxonomy mistake. A team logs Meridian’s ransomware risk (R2) as one entry in a “Cyber” box and stops. But that single entry hides three distinct losses with three distinct owners: order and dispatch go down for days (operational, COO), a data-breach inquiry may follow (compliance, GC), and customers’ trust erodes (reputational). Filed as one “cyber” line, none of those consequences can be sized or assigned, and when 3.1 tries to aggregate, the operational hit is missing from the operational total. The fix is to classify by where each loss lands — keeping “ransomware” as a <em>cause tag</em> across the entries so the common driver is still visible — which is exactly the distinction between a taxonomy that merely files risks and one that lets you see the enterprise.</p>

      <ProblemSet items={[
        { q: 'Meridian’s register has fourteen risks but only one in the “model” family (R10, the demand-forecast error). Is the model box thin because Meridian runs little model risk? How would you check?', solution: 'Almost certainly not. A firm that hedges FX, prices commodity exposure, runs a demand-forecast model, and faces a downturn-stress on its covenant relies on models throughout — pricing, hedging, planning, and stress-testing all sit on models. A single model-risk entry is more likely a coverage gap than a true picture. Check it bottom-up: walk each function and ask “what models do you rely on, and what happens if one is wrong?” — the planning model (R10) is just the one that already broke visibly. Expect pricing/hedging and stress-model risks to surface, populating the box.' },
        { q: 'A new analyst proposes adding a top-level “Pandemic” family because COVID was significant. Good idea? Apply the design principles.', solution: 'No — “pandemic” is a cause, not a place a loss lands, and classifying by cause is the error to avoid. A pandemic drives operational losses (plant closures, absence), financial losses (demand collapse, liquidity strain), and strategic losses (channel shifts) — risks that already have homes in existing families. Adding a “Pandemic” box would double-count those risks and break MECE. The right move is to keep the existing families and add “pandemic” as a cause tag (alongside “cyber,” “commodities,” “downturn”), so 3.1 can still surface it as a common driver across families.' },
      ]} />

      <p className="measure">You now have the families and a register laid across them, with the empty and thin boxes flagged. But the families are still standing in silos — fourteen risks in eight boxes, summed as if independent. The next lesson takes exactly this structure and makes the move that is the whole point of Part 3: turning a list of families into a portfolio, where common drivers (Meridian’s commodities-and-climate cluster, its downturn cluster) mean the enterprise total is not the sum of the parts.</p>
    </LessonShell>
  );
}
