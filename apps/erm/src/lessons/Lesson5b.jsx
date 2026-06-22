import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { MaturityRadar } from '../tools/MaturityRadar.jsx';

const lesson = getLesson('5b');

const pathway = [
  { kind: 'read', t: 'RIMS Risk Maturity Model — the seven attributes and five levels', src: 'NC State ERM Initiative (erm.ncsu.edu)', href: 'https://erm.ncsu.edu/resource-center/rmm-for-erm/', min: 15, tier: 'core', why: 'The canonical model, laid out attribute by attribute and level by level.' },
  { kind: 'read', t: 'Risk Maturity Model — the official tool and FAQ', src: 'RIMS', href: 'https://www.rims.org/Tools/risk-maturity-model', min: 12, tier: 'core', why: 'How the model is actually scored, and what each maturity level is meant to mean.' },
  { kind: 'read', t: 'The Three Lines Model (2020 update of Three Lines of Defence)', src: 'Institute of Internal Auditors (IIA, July 2020)', href: 'https://www.theiia.org/globalassets/documents/resources/the-iias-three-lines-model-an-update-of-the-three-lines-of-defense-july-2020/three-lines-model-updated-english.pdf', min: 18, tier: 'core', why: 'The accountability spine an embedded function runs on — who owns, who challenges, who assures.' },
  { kind: 'do', t: 'Score your function and turn its two weakest attributes into a roadmap', src: 'the assessment in this lesson → Artifact A13', tier: 'apply', why: 'Convert “improve risk management” into a sequenced, owned plan.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — implementing and embedding risk management', src: 'Hopkin & Thompson', tier: 'deeper' },
];

const retrieval = [
  { q: 'Higher risk maturity, on the RIMS model, mainly means…', options: [
    { text: 'ERM is embedded in how real decisions get made — not that more is written down or recorded.', correct: true },
    { text: 'the risk team is larger and the policy is longer.' },
    { text: 'more risks are entered in the register.' }] },
  { q: 'The natural way to use a maturity model to mature a function is to…', options: [
    { text: 'find the lowest-scoring attributes and sequence a multi-year roadmap that lifts them in priority order.', correct: true },
    { text: 'improve every attribute at once so nothing is left behind.' },
    { text: 'buy a GRC platform and treat the purchase as the capability.' }] },
  { q: 'Maturity self-assessments are gameable, which means…', options: [
    { text: 'honest scoring — rating the function as it is, not as the policy claims — is the entire source of the model’s value.', correct: true },
    { text: 'they are worthless and should be skipped.' },
    { text: 'a higher score is always the goal regardless of the firm’s risk profile.' }] },
];

export default function Lesson5b() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>You can have every artifact this course produces — register, appetite statement, KRI dashboard, capital model, data scorecard — and still have a risk function that changes nothing. Maturity is not how thick the policy is; it is whether ERM is embedded in how real decisions actually get made.</Lead>

      <p className="measure">A function can be fully equipped and still inert. The register exists but no project is ever reshaped because of it; the appetite statement is approved but no decision is ever vetoed by it; the board receives the risk report and reads it the way it reads the minutes — for the record, not for the choice in front of it. That is the central fact of this lesson: an ERM programme is only as real as the decisions it changes. A mature function is not the one with the biggest team or the longest manual; it is the one where risk thinking is woven into go/no-go calls, capital allocation, and pricing, where the board genuinely uses what it is sent, and where bad news travels fast because everyone knows it is wanted. Maturity models exist to make that distinction measurable — to give you a mirror for where you honestly are and a roadmap for where to move next, so that “improve risk management” stops being an aspiration and becomes a sequence of concrete, owned moves.</p>

      <p className="measure">Work the topic in this order — the RIMS model first (NC State’s summary lists all seven attributes and five levels cleanly; the RIMS pages show how it is scored), then the IIA’s Three Lines Model for the accountability structure an embedded function runs on, then the build.</p>

      <Pathway lessonId="5b" items={pathway} />

      <Objectives items={[
        'Explain why risk maturity is about embedding ERM in decisions, not about accumulating documents — and tell activity (meetings held, registers filed) apart from outcome (better decisions).',
        'Describe the RIMS Risk Maturity Model: its seven attributes and the five levels from Ad hoc to Leadership, and what moving up a level actually looks like.',
        'Treat maturing as a multi-year change-management effort, using the model to find the lowest attributes and sequence a roadmap rather than improving everywhere at once.',
        'Score your own function honestly and turn its two weakest attributes into the first roadmap steps (Artifact A13).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="From ad hoc to leadership" />
      <p className="measure">The <strong>RIMS Risk Maturity Model</strong> is the canonical ERM maturity model, and its structure is the thing to learn. It scores a function on <strong>seven attributes</strong>: (1) <em>ERM-based approach</em> — how far ERM is adopted, with executive sponsorship and culture behind it rather than sitting as a parallel compliance exercise; (2) <em>ERM process management</em> — whether the cycle of identify–assess–treat–monitor is a repeatable process or improvised each time; (3) <em>risk appetite management</em> — whether an articulated appetite actually constrains decisions; (4) <em>root-cause discipline</em> — whether the function chases the cause behind an event rather than logging the event; (5) <em>uncovering risks</em> — how systematically and how early new and emerging risks are surfaced, including the willingness to hear bad news; (6) <em>performance management</em> — whether risk is built into planning, objectives, and how performance is judged; and (7) <em>business resilience &amp; sustainability</em> — whether risk thinking reaches into continuity and the longer-horizon viability of the business.</p>

      <p className="measure">Each attribute is rated on <strong>five levels</strong> (RIMS, with NC State’s summary): <em>Ad hoc → Initial → Repeatable → Managed → Leadership</em>. The levels are not grades; they describe a transformation in <em>how the organization thinks</em>. At <strong>Ad hoc</strong> a thing happens only when someone happens to remember — risk work is reactive, undocumented, dependent on a particular individual. At <strong>Initial</strong> it exists but is inconsistent: some units do it, the language differs, it does not aggregate. At <strong>Repeatable</strong> there is a defined, documented process applied consistently, so the same situation gets handled the same way twice. At <strong>Managed</strong> the process produces information that is actually used — risk data informs real decisions and is monitored against appetite. At <strong>Leadership</strong> it is simply how the organization thinks: risk is embedded in strategy and day-to-day choices, surfaced proactively, and the function creates value rather than only avoiding loss. Moving up one level is the move from “it happens when someone remembers” toward “it is how we think,” one attribute at a time.</p>

      <p className="measure">The accountability structure beneath this is the <strong>Three Lines Model</strong> (IIA, July 2020, updating the older “Three Lines of Defence”): the first line owns and manages risk in the business; the second line — where the ERM/CRO function sits — provides expertise, oversight, and challenge; the third line, internal audit, gives independent assurance; the governing body sits above all three. The 2020 update deliberately dropped the word “defence” to stress that the function exists to help create value, not only to police it — which is exactly the Ad-hoc-to-Leadership arc restated as accountability. The most common failure modes map straight onto low attributes: ERM run as a compliance checkbox, a register never used in a decision, heat maps with no calibration, a CRO with no real access to the board, a tool purchase mistaken for capability, and “everyone’s risk so no one’s risk.” And the single most common mistake in <em>maturing</em> a function is treating it as a one-off project and trying to improve everywhere at once. It is a multi-year change-management effort; the model’s job is to tell you where the leverage is, so you sequence.</p>

      <p className="measure">Watch this land on <strong>Meridian Industries</strong>, the listed mid-cap consumer-goods maker (~€1.2bn revenue, three plants, fourteen countries) carried through the course. Rate its function honestly against the recall in its history — a €4m precautionary recall four years ago that hardened the board’s safety appetite. On <em>ERM process management</em> and <em>appetite management</em> Meridian now scores well (Repeatable–Managed): the recall forced a defined safety process and a differentiated appetite that genuinely treats contamination risk rather than tolerating it; competence around safety is real. But the very fact that it took a recall to produce that discipline is itself a finding. On <em>uncovering risks</em> Meridian is likely thin (Initial): the labelling error that triggered the recall was a foreseeable failure that nobody surfaced early, which says emerging risks are not being chased proactively and the speak-up channel that should have caught it was weak. On <em>root-cause discipline</em> it is probably middling — the recall taught it to ask why, but only for that one event. Read across the profile, Meridian sits around <strong>Initial-to-Repeatable overall</strong>: competent where pain has already been felt, immature where it has not. Its two weakest attributes — uncovering risks and root-cause discipline — are not embarrassments to hide; they are the first two steps of its roadmap.</p>

      <DoNow>Before the build, skim the NC State summary (pathway step 1, ~15 min) so all seven attributes and all five levels are in front of you — you will score your own function against exactly these.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="An ordinal mirror, only as good as its honesty" />
      <p className="measure">Be honest about what the “maths” here is: it is <strong>ordinal self-assessment</strong>, not measurement. You rate each of the seven attributes 1–5 and average (or weight) them into a composite maturity score, and the radar plots the seven points so you can see the <em>shape</em> of the function — strong on one axis, hollow on another. The composite is a conversation tool and a benchmark, nothing more precise: a 3.1 is not meaningfully different from a 3.0, and the average can flatter a function that is excellent on two attributes and absent on two others. What the number is genuinely good for is the <em>gap</em> — current level versus target level, attribute by attribute — because that gap, read in priority order from the lowest points, <em>is</em> the roadmap.</p>

      <p className="measure">Which is why honesty is not a nicety here; it is the entire value of the exercise. A maturity self-assessment is trivially <strong>gameable</strong> — every attribute can be scored to the level the policy claims rather than the level the organization lives at, and a function under pressure to look mature will do exactly that. But a gamed score points the roadmap at the wrong attributes and is therefore worse than no score at all: it spends a multi-year change effort polishing what already works. The discipline is to score each attribute by evidence of <em>outcome</em>, not <em>activity</em>. The trap is that activity is easy to count and feels like progress — meetings held, registers filed, reports issued, training completed — while none of it proves a single decision changed. Score appetite management by whether an appetite line ever vetoed a real decision, not by whether an appetite statement exists; score uncovering risks by whether a risk was surfaced early and acted on, not by whether a workshop was held. The honest test for any attribute: <em>what would still happen here if the risk team went on holiday for a month?</em> Whatever survives that is the maturity you actually have.</p>

      <MathBlock>
        <p>The composite is a deliberately blunt average over the seven RIMS attributes <span className="eq">A₁…A₇</span>, each scored on the ordinal scale 1 (Ad hoc) to 5 (Leadership):</p>
        <p style={{ textAlign: 'center' }}><span className="eq">M = (1/7) Σ level(Aᵢ)</span>, &nbsp; and the roadmap = <span className="eq">argmin_i level(Aᵢ)</span> first.</p>
        <p>The treatment is intentionally ordinal: these are levels, not metres, so adding and averaging them is a convenience for conversation, not a true quantity. The load-bearing output is therefore not <span className="eq">M</span> but the <em>ranking</em> of attributes by level — and that ranking is only meaningful if each <span className="eq">level(Aᵢ)</span> was scored on outcome honestly. Garbage in, wrong roadmap out.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Assess, read your level, sequence the roadmap" />
      <p className="measure">Now rate your own function across the seven attributes, as it really is. For each one, before you move the slider, name the evidence — the decision that was actually changed, the risk that was actually surfaced early — and if you cannot name one, that attribute is lower than you want it to be. The tool reads off your overall level and, more usefully, surfaces your two thinnest attributes as the start of the roadmap. Saved as Artifact A13, which the board report (5c) and the capstone (5e) both consume.</p>

      <MaturityRadar lessonId="5b" artifactId="A13" />

      <p className="measure">Read the radar by its <em>shape</em>, not its average: a function spiky on appetite and process but collapsed on uncovering-risks is a function that manages the risks it already knows about and is blind to the ones it does not — which is the dangerous profile, and the average hides it. Take the two lowest attributes and turn each into one concrete, owned move that would lift it a single level, mapped to a Three Lines owner. Do not try to move all seven; sequencing the weakest two and finishing them is what a multi-year maturing effort actually looks like. The standard to hold the result to:</p>

      <Rubric
        title="a strong maturity assessment and roadmap"
        criteria={[
          { c: 'Honest, not aspirational', good: 'each attribute scored on evidence of outcome (a decision changed), not on whether a document or process exists' },
          { c: 'Read by shape, not just average', good: 'the hollow attributes are named, not buried in a flattering composite' },
          { c: 'Focused', good: 'the roadmap targets the two weakest attributes, not a vague “improve everywhere”' },
          { c: 'One level at a time', good: 'each move lifts a specific attribute by one defined level, with a concrete action' },
          { c: 'Owned via the Three Lines', good: 'each roadmap step has a named owner (first line, second line, or assurance), so it is someone’s job' },
        ]}
        exemplar="Meridian: overall Initial-to-Repeatable; strong on appetite/process (recall-forced), thin on uncovering-risks and root-cause discipline. Roadmap step 1 — uncovering risks: stand up a real speak-up channel and an emerging-risk scan, owned by the CRO (2nd line). Step 2 — root-cause discipline: require a 5-whys root-cause analysis on every amber KRI breach, not only after a loss, owned by quality/operations (1st line)."
      />

      <p className="measure">A worked correction, because it is the most common self-deception. A function rates itself <em>Managed</em> (4) on appetite management because it has an approved, board-signed appetite statement updated annually. Apply the outcome test: can anyone name a decision the appetite statement actually vetoed or reshaped in the last year? If not, the statement is an artifact, not a control, and the honest level is <em>Initial</em> (2) — it exists but does not bite. The gamed 4 would have sent the roadmap off to polish appetite; the honest 2 puts appetite near the top of the queue, where the real work is. The discipline of the whole lesson is in that downgrade.</p>

      <ProblemSet items={[
        { q: 'A firm proudly reports a composite maturity of 3.4/5, up from 3.1 last year, as evidence its risk programme is improving. Why is that a weak claim, and what would a stronger one look like?', solution: 'The composite is an ordinal average and a 0.3 move is within the noise of a self-assessment that is gameable and not a true metric — it may reflect scoring optimism, not change. Worse, the average hides shape: the rise could come from polishing already-strong attributes while uncovering-risks stays at Ad hoc. A stronger claim is attribute-specific and outcome-anchored: “root-cause discipline moved Initial→Repeatable because we now run a documented 5-whys on every amber breach, and three this year changed a control.” Maturity is shown by decisions changed, not by a composite ticking up.' },
        { q: 'Meridian’s board, stung by the recall, wants to raise maturity fast and proposes a year-one push to improve all seven attributes at once. As CRO, what do you advise, and where do you start?', solution: 'Advise against the broad push: maturing is multi-year change management, and trying to lift everything at once spreads effort thin and improves nothing to completion. Use the model to sequence. Meridian’s strengths (appetite, process) came from felt pain; its weaknesses are uncovering-risks and root-cause discipline — the exact gaps the recall exposed. Start there: an emerging-risk scan plus a working speak-up channel (uncovering risks, 2nd-line owned), and mandatory root-cause analysis on near-misses and amber KRIs, not only on losses (root-cause discipline, 1st-line owned). Finish those two, lift them one level, then reassess — rather than nudging all seven and embedding none.' },
      ]} />

      <p className="measure">This is the discipline turned on itself: the same honesty you demanded of every risk owner, now demanded of the risk function. A maturity profile that flatters you is the most expensive document in the building, because it sends a multi-year effort to the wrong place. Scored honestly, it does the one thing this lesson is about — it tells you where ERM is not yet embedded, so the next move makes a real decision better. Next, you take the embedded function to the people who govern it: the board report, where all of this has to inform a choice in a single page.</p>
    </LessonShell>
  );
}
