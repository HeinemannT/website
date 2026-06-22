import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.4');

const pathway = [
  { kind: 'read', t: 'Revisions to the Principles for the Sound Management of Operational Risk', src: 'Basel Committee — BCBS d515 (March 2021)', href: 'https://www.bis.org/bcbs/publ/d515.htm', min: 20, tier: 'core', why: 'The current Basel definition and the eleven management principles, from the source.' },
  { kind: 'read', t: 'Principles for Operational Resilience', src: 'Basel Committee — BCBS d516 (March 2021)', href: 'https://www.bis.org/bcbs/publ/d516.htm', min: 15, tier: 'core', why: 'The deliver-through-disruption reframe and the role of impact tolerances.' },
  { kind: 'read', t: 'Operational resilience: impact tolerances for important business services (SS1/21)', src: 'Bank of England / PRA (March 2021)', href: 'https://www.bankofengland.co.uk/prudential-regulation/publication/2021/march/operational-resilience-impact-tolerances-for-important-business-services-ss', min: 18, tier: 'core', why: 'The UK regime firms actually follow: important business services, impact tolerances, mapping, testing.' },
  { kind: 'do', t: 'Add your operational risks and a service tolerance', src: 'the FamilyLens in this lesson → Artifact A10', tier: 'apply', why: 'Turn the concepts into register rows and a recover-by time for one critical service.' },
  { kind: 'book', t: 'Risk Management and Financial Institutions — the operational-risk chapters', src: 'John C. Hull, 6th ed. (2023)', tier: 'deeper' },
];

const retrieval = [
  { q: 'The Basel definition of operational risk is loss from…', options: [
    { text: 'inadequate or failed people, processes, and systems, or external events — including legal risk, but excluding strategic and reputational risk.', correct: true },
    { text: 'any event that damages the firm’s reputation or its strategy.' },
    { text: 'adverse moves in market prices or a counterparty default.' }] },
  { q: 'Why does an average badly understate operational risk?', options: [
    { text: 'The total is dominated by rare high-severity tail events that barely appear in the data, so the mean reflects the frequent small losses and misses the disaster.', correct: true },
    { text: 'Operational losses are always larger than the average suggests.' },
    { text: 'Averages are never useful for any risk family.' }] },
  { q: 'An impact tolerance is…', options: [
    { text: 'the maximum tolerable level of disruption to an important business service — set in advance and tested against severe-but-plausible scenarios.', correct: true },
    { text: 'the probability that a given system will fail in a year.' },
    { text: 'the amount of insurance bought against an outage.' }] },
];

export default function Lesson34() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>A mis-keyed trade, a burned-out team, a failed overnight batch, a flood at the only warehouse, a supplier who goes dark — every one of these is operational risk, and not one of them is a price moving against you. This is the risk of running the place.</Lead>

      <p className="measure">The Basel Committee fixes the definition precisely (BCBS, <em>Principles for the Sound Management of Operational Risk</em>, 2021): operational risk is <em>the risk of loss resulting from inadequate or failed internal processes, people and systems, or from external events</em>. Read the four buckets as a checklist for where loss originates — <strong>people</strong> (error, fraud, key-person loss), <strong>processes</strong> (a broken handoff, a missed reconciliation), <strong>systems</strong> (an ERP outage, a failed batch), and <strong>external events</strong> (a flood, a supplier collapse, a power cut). The definition also draws two hard boundaries that the exam and the regulator both care about: it <em>includes legal risk</em> (losses from litigation, fines, unenforceable contracts) but <em>explicitly excludes strategic and reputational risk</em>. Those last two are real and dangerous, but Basel keeps them out of the operational-risk capital number because they behave differently and are owned elsewhere — strategic risk is a bet taken on purpose (lesson 3.3), reputational risk is usually a second-order consequence of something else failing.</p>

      <p className="measure">Work the topic in this order — the two Basel texts for the definition and the resilience reframe, then the UK PRA/FCA supervisory statement for the regime firms actually operate, then the build at the end where you add your own operational risks and set a recover-by time for one critical service.</p>

      <Pathway lessonId="3.4" items={pathway} />

      <Objectives items={[
        'State the Basel definition of operational risk across people, processes, systems, and external events — and what it includes (legal) and excludes (strategic, reputational).',
        'Explain the characteristic loss shape (high-frequency/low-severity body plus low-frequency/high-severity tail) and why any average understates it.',
        'Distinguish operational resilience from prevention: important business services, impact tolerances, and severe-but-plausible testing.',
        'Define BCP, DR, RTO, and RPO, and add operational risks with a service tolerance to your register (Artifact A10).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="From preventing incidents to surviving them" />
      <p className="measure">For decades the operational-risk goal was <strong>prevention</strong>: find the failure modes, control them, drive the incident count toward zero. The trouble is that you cannot prevent every outage, pandemic, cyberattack, or flood — and a firm that has staked everything on prevention discovers it has no plan for the morning a disruption it didn’t prevent actually lands. So the regulatory emphasis has shifted to <strong>operational resilience</strong>: assume disruption <em>will</em> happen, and ensure you can keep delivering your <strong>important business services</strong> through it and recover within a tolerable window. This is the reframe codified in the early-2020s by the Basel Committee (<em>Principles for Operational Resilience</em>, 2021) and, in the UK, by the PRA and FCA together (PRA supervisory statement SS1/21 and the FCA’s parallel rules, both effective March 2021, with full compliance required by March 2025). The question moves from “how do we stop this from ever happening?” to “when it happens, can we take the hit and keep serving customers?”</p>

      <p className="measure">The machinery of the resilience regime is concrete, and three terms carry it. First, identify your <strong>important business services</strong> — the outward-facing services whose failure would harm customers or market integrity, not the internal systems beneath them (the service is “process a customer payment”, not “the payments server”). Second, set an <strong>impact tolerance</strong> for each one: the <em>maximum tolerable level of disruption</em>, almost always expressed as a time — “payments must be restored within four hours” — fixed in advance by the board, not negotiated during the crisis. Third, <strong>map and test</strong>: trace each service down to the people, processes, systems, and third parties it depends on, then run it against <em>severe-but-plausible</em> scenarios to prove you can stay inside the tolerance, or expose the gap if you can’t. An impact tolerance you can’t meet under test is the finding — it tells you exactly where to invest before the real event arrives.</p>

      <p className="measure">Underneath resilience sit the older operational disciplines, now reframed as the means of honouring those tolerances. <strong>Business continuity planning (BCP)</strong> is the plan for keeping critical activities running during disruption — alternate sites, manual workarounds, who does what when the building is shut (the requirements standard is ISO 22301:2019). <strong>Disaster recovery (DR)</strong> is the narrower, technical subset: restoring IT systems and data after an outage. Two DR metrics turn “recover fast” into testable numbers. The <strong>recovery time objective (RTO)</strong> is the maximum acceptable time to restore a service after it goes down — how long can we be off? The <strong>recovery point objective (RPO)</strong> is the maximum acceptable amount of <em>data</em> loss, measured as time — how far back must our last good backup be? An RTO of four hours with an RPO of fifteen minutes says: back within four hours, having lost at most the last fifteen minutes of data. The impact tolerance is the outcome the board demands; RTO and RPO are the engineering targets that have to be met to deliver it.</p>

      <p className="measure">Watch this land on Meridian. Two of its register entries are pure operational risk, and they show the family’s two faces. <strong>R1</strong> is concentration: a single supplier provides a critical packaging resin with no qualified second source, so if that supplier fails the packaging line halts and Meridian cannot ship for roughly two weeks — an 8%-per-year, ~€9m exposure that is really a <em>third-party operational</em> risk hiding inside the supply chain (this is the same dependency lesson 3.8 treats as supplier risk). The resilience question for R1 is not “how do we stop the supplier failing?” — Meridian doesn’t control that — but “what is the important business service here (supplying product to key retailers), what is our impact tolerance for it, and what closes the gap?” The honest answer is that with no second source, Meridian cannot currently meet any tight tolerance, which is exactly why qualifying an alternate resin supplier becomes the priority investment. <strong>R7</strong> is physical disruption: one of the three plants sits in a flood-prone river valley in SE Asia, a 5%-per-year, ~€15m output-loss-plus-rebuild event. Here you can set a concrete target — say the affected service (“supply from the SE-Asia plant to its regional customers”) carries an <strong>impact tolerance of 10 business days</strong> maximum disruption, met by an <strong>RTO of 10 days</strong> for re-routing volume to the German and Polish plants plus a flood-protection and inventory-buffer plan to bridge the gap. R1 and R7 together make the point: operational risk is managed by deciding in advance how long you can be down, not by pretending you’ll never be.</p>

      <DoNow>Before the build, skim the PRA/FCA SS1/21 sections on important business services and impact tolerances (pathway step 3, ~18 min) — you’ll set one tolerance of your own in the FamilyLens.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Loss data, frequency × severity, and the fat tail" />
      <p className="measure">Operational risk is sized mainly from <strong>loss data</strong> — a history of what has gone wrong, how often, and how badly — and modelled as <strong>frequency × severity</strong>: a distribution for how many loss events occur in a year, and a separate distribution for how large each one is. Two data sources feed it. <em>Internal</em> loss-event databases record the firm’s own history; because no single firm sees enough rare disasters to estimate the tail, firms also pool <em>external</em> loss data (industry consortia) to glimpse events they have been lucky enough to avoid. The defining feature of the family is its <strong>shape</strong>. There is a high-frequency, low-severity <em>body</em> — the daily drizzle of small losses (a fat-fingered order, a minor reconciliation break, a small refund) that recurs so reliably you can almost budget for it. And there is a low-frequency, high-severity <em>tail</em> — the rare disaster (a major recall, a ransomware shutdown, a destroyed plant) that almost never happens but, when it does, dominates the entire annual total.</p>

      <p className="measure">Meridian’s own five-year loss history shows it exactly: several small losses of roughly €0.1–0.6m most years, and then a single €4m precautionary recall in year four. The recall is one event out of a dozen, yet it is larger than every other loss combined. This is why <strong>the average is the least interesting number for operational risk</strong>: a mean is pulled by the frequent small losses and barely registers the rare large one, so it describes the drizzle while missing the deluge that actually threatens the firm. The number that matters is a high percentile of the <em>total</em> annual loss — the tail — which is what the frequency × severity simulation in Part 4 (Monte Carlo and the loss-distribution approach, lessons 4.2–4.3) is built to estimate, modelling the body and the tail separately. (Basel’s current Standardised Approach to operational-risk <em>capital</em>, OPE25 in the consolidated framework, scales a firm’s charge by its size and its own loss history for the same reason — your past tail informs your future capital.)</p>

      <MathBlock>
        <p>Why the mean understates. Annual operational loss is a <em>compound</em> sum: a random number of events <span className="eq">N</span> (frequency), each of random size <span className="eq">X_i</span> (severity), so the total is <span className="eq">S = X_1 + X_2 + … + X_N</span>. Its mean is just</p>
        <p style={{ textAlign: 'center' }}><span className="eq">E[S] = E[N] · E[X]</span>.</p>
        <p>But severity is heavy-tailed: a few enormous losses sit far out in the right tail, so the <em>distribution</em> of <span className="eq">S</span> is sharply right-skewed and the mean lands well below the dangerous percentiles. Concretely, with the Meridian-style history — many losses near €0.3m and a rare ~€4m event — the average annual loss might be on the order of €1m, while the 1-in-20 or 1-in-100 <em>total</em> is several times that, because in a bad year the tail event fires. Managing to <span className="eq">E[S]</span> would leave you capitalised for the drizzle and wiped out by the deluge; the quantity that protects you is a high quantile <span className="eq">VaR_(1−α)(S)</span> (lesson 4.4), driven almost entirely by the severity tail, not the mean.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it on your organization" title="Add your operational risks" />
      <p className="measure">Now do for your own organization what Meridian did for R1 and R7. Walk the four buckets — what in your <em>people</em>, <em>processes</em>, <em>systems</em>, or the <em>external</em> world could fail — and write each as a cause → event → consequence. Then, for at least one of them, name the important business service it threatens and set an impact tolerance: the maximum disruption you could survive, as a recover-by time, with an RTO (and where data is involved, an RPO) underneath it. Use the loss-shape thinking from Stage 2 to size each: a frequency and a severity, with a deliberate eye on whether this one belongs to the drizzle or the tail.</p>

      <FamilyLens lessonId="3.4" artifactId="A10-operational" family="Operational" ownerHint="operations / COO"
        sizing="Frequency × severity from loss data — but watch the fat tail: rare events dominate the total and hide from the average. Pair with resilience: time-to-recover for critical services." />

      <p className="measure">Read each entry back through the question that separates a real resilience plan from a comforting one: <em>if this fails tomorrow, can I name the service, the recover-by time, and what delivers it — or am I just hoping it won’t fail?</em> The standard to hold your entries to:</p>

      <Rubric
        title="a strong operational-risk + resilience entry"
        criteria={[
          { c: 'Correctly scoped', good: 'a genuine people / process / system / external failure — not a strategic bet or a reputational consequence dressed up as operational' },
          { c: 'Cause → event → consequence', good: 'the chain is explicit, so the control point is obvious (e.g. supplier fails → line halts → cannot ship two weeks)' },
          { c: 'Sized as frequency × severity', good: 'an annual likelihood and an impact, with the tail acknowledged rather than averaged away' },
          { c: 'Tied to an important business service', good: 'names the outward-facing service at risk, not just the internal system beneath it' },
          { c: 'Has an impact tolerance with RTO/RPO', good: 'a board-set maximum tolerable disruption, made concrete by a recover-by time (and a data-loss limit where relevant)' },
        ]}
        exemplar="Meridian R7: flood at the SE-Asia plant (external, 5%/yr, ~€15m) → service ‘supply SE-Asia plant’s regional customers’ → impact tolerance 10 business days → RTO 10 days via re-routing to Germany/Poland + inventory buffer. R1: sole-source resin supplier fails (third-party, 8%/yr, ~€9m) → no tolerance currently met → qualify a second source."
      />

      <ProblemSet items={[
        { q: 'A team logs “we have low operational risk because we’ve had no major incident in five years.” Why is that reasoning dangerous, and what number would you ask for instead?', solution: 'Five quiet years is exactly what the loss shape predicts even for a firm carrying serious tail risk — the low-frequency/high-severity event is, by definition, rare, so its absence is uninformative about whether it can happen. The clean track record describes the body (the drizzle), not the tail (the deluge). Ask instead for the estimated total annual loss at a high percentile (e.g. the 1-in-100), built from frequency × severity using internal *and* external loss data so the tail the firm hasn’t personally seen is still represented. The right question is “what is our fat tail?”, not “when did we last get hurt?”' },
        { q: 'Distinguish Meridian R7’s impact tolerance from its RTO and RPO. If the board sets the impact tolerance for SE-Asia supply at 10 business days, what must be true of the RTO, and where would an RPO even come in?', solution: 'The impact tolerance (10 business days) is the board-level *outcome* limit — the maximum disruption to the important business service before customers are harmed; it is set top-down and is regime-mandated. The RTO is the *operational target* that has to be met to deliver that outcome: restoring the service (here, re-routing volume to Germany/Poland) must complete within 10 days, so the RTO must be ≤ the impact tolerance — if your RTO exceeds the tolerance, you fail under test and must invest. The RPO concerns *data* loss and is largely irrelevant to a physical flood at a plant (you lose output, not transactions); it would bite on R2 instead (the ransomware/ERP risk), where the question becomes how much order/dispatch data you can afford to lose — i.e. how recent the last clean backup must be.' },
      ]} />

      <p className="measure">Operational risk taught you the family that lives in the running of the organization, and the resilience discipline that assumes it will eventually break and plans to keep delivering anyway. Two threads run forward from here: the frequency × severity machinery you previewed becomes the loss-distribution and Monte Carlo modelling of Part 4, and the third-party dependency inside R1 becomes the supplier-risk treatment of lesson 3.8. Next, though, the family that sits just outside Basel’s operational boundary on purpose — conduct, compliance, legal, and the reputational damage they feed.</p>
    </LessonShell>
  );
}
