import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { RegisterIntake } from '../tools/RegisterIntake.jsx';

const lesson = getLesson('2c');

const pathway = [
  { kind: 'watch', t: 'How to run a risk workshop', src: 'short practitioner explainer', min: 8, tier: 'warmup', why: 'See the room before you read the techniques — who speaks, who doesn’t.' },
  { kind: 'read', t: 'Risk identification & assessment explainers', src: 'NC State ERM Initiative', href: 'https://erm.ncsu.edu/resource-center/category/risk-identification-and-assessment/', min: 15, tier: 'core', why: 'Plain-English, and honest about how the conversations actually go.' },
  { kind: 'read', t: 'ISO/IEC 31010 technique catalogue — overview', src: 'the named methods: brainstorming, Delphi, SWIFT, bow-tie', href: 'https://en.wikipedia.org/wiki/ISO/IEC_31010', min: 12, tier: 'core', why: 'The menu of identification techniques and what each is for.' },
  { kind: 'do', t: 'Build your organization’s risk register', src: 'the intake in this lesson → Artifact A4', tier: 'apply', why: 'Turn the conversation into cause→event→consequence entries you can assess.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — identification & risk description', src: 'Hopkin & Thompson', tier: 'deeper' },
];

const retrieval = [
  { q: 'Identification is called a social act rather than an analytical one because…', options: [
    { text: 'the knowledge you need is distributed in people’s heads and getting it out depends on trust and facilitation, not calculation.', correct: true },
    { text: 'it is always done in large rooms.' },
    { text: 'it never involves any data.' }] },
  { q: 'The defining feature of the Delphi method is…', options: [
    { text: 'anonymous, iterative expert polling with feedback between rounds, so estimates converge without the loudest voice dominating.', correct: true },
    { text: 'a single facilitated meeting with open discussion.' },
    { text: 'multiplying likelihood by impact.' }] },
  { q: 'Bow-tie analysis is built around…', options: [
    { text: 'a central event with causes (and preventive controls) on the left and consequences (and mitigating controls) on the right.', correct: true },
    { text: 'a 5×5 grid of likelihood and impact.' },
    { text: 'an anonymous survey repeated over several rounds.' }] },
];

export default function Lesson2c() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>The risk that does the most damage is almost always one nobody wrote down — the supplier everyone assumed was solid, the clause no one read. Identification is the gate: a risk that never makes the list isn’t managed badly, it isn’t managed at all. And the surprise of this lesson is that getting risks onto the list is not an analytical problem. It is a social one.</Lead>

      <p className="measure">Here is the claim, stated plainly so you can argue with it: the limiting factor in risk identification is not technique, it is access to what people already know and won’t say. The knowledge that matters is <em>distributed</em> — the engineer knows the workaround the whole line secretly depends on; the salesperson has heard what a customer is privately planning; the clerk in accounts payable has watched one supplier’s invoices slip later each quarter. None of it is written down anywhere you can query. So the entire job is extraction: building a process and a room in which that knowledge surfaces, gets phrased so it can be assessed, and lands on a register. That is why a fear-driven culture (lesson 2b) produces a tidy list of safe risks and nothing else, and why facilitation craft — not the cleverness of the technique — dominates the quality of the output.</p>

      <p className="measure">Work the topic in this order — watch a real workshop to see the dynamics, read the NC State explainers and the ISO/IEC 31010 technique menu, then build your register at the end.</p>

      <Pathway lessonId="2c" items={pathway} />

      <Objectives items={[
        'Triangulate risks from the five identification sources, not from a single workshop.',
        'Select and run a named technique — brainstorming, Delphi, bow-tie, SWIFT, pre-mortem, checklist — for the context at hand.',
        'Write every risk as cause → event → consequence so it is assessable, not a bare topic.',
        'Facilitate against hierarchy, groupthink, and the biases that distort what gets named.',
        'Build the risk register for your organization (Artifact A4) — the spine of the rest of the course.',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Sources, techniques, language, and the biases that hide risks" />

      <p className="measure">Because the knowledge is distributed, no single channel sees all of it, so identification is an act of <strong>triangulation</strong> across five sources, each blind to what the others catch. <em>Facilitated workshops</em> surface the shared, widely-known risks fast and build common language, but they suppress anything embarrassing to say in front of the boss. <em>One-to-one interviews</em> recover exactly that — the quiet concerns, the workarounds, the “I’ve been worried about…” that never survives a group. <em>Loss, incident, and near-miss data</em> are your only record of what has already bitten or nearly bitten; the near-miss especially is a free lesson about a control that almost failed. <em>External and peer events and regulatory actions</em> tell you what has happened to organizations like yours — the competitor’s breach, the enforcement action against a rival, the recall in your sector — risks you have only been lucky to avoid. And <em>horizon scanning</em> reaches for emerging risk that has no loss history yet: new regulation in draft, a technology shift, a slow climate trend. Lean on workshops alone and your register becomes a portrait of what is already obvious to the people loud enough to say it.</p>

      <p className="measure">Within those channels you run <strong>named techniques</strong>, and the skill is matching the technique to the group dynamic you need to manage. <strong>Structured brainstorming</strong> uses a taxonomy as a prompt and — critically — runs <em>silent generation first</em> (each person writes privately, “brainwriting”) before anything is shared, so the first idea spoken doesn’t anchor the room. The <strong>Delphi method</strong> goes further: experts are polled <em>anonymously</em>, the facilitator feeds back the spread of answers, and they re-estimate over several rounds — anonymity defeats the loudest-voice effect and iteration lets estimates converge on evidence rather than on whoever spoke first. <strong>Bow-tie analysis</strong> puts a single event in the centre, fans its <em>causes</em> out to the left and its <em>consequences</em> to the right, and hangs preventive controls on the left arm and mitigating controls on the right — it is identification and control mapping in one diagram, and it forces the cause→event→consequence discipline visually.</p>

      <p className="measure">Three lighter techniques round out the kit. <strong>SWIFT (Structured What-If Technique)</strong> walks a system with prompted “what if…?” questions (“what if this supplier can’t deliver?”, “what if this data is wrong?”) — lighter than a formal HAZOP, structured enough to be systematic. A <strong>pre-mortem</strong> inverts the frame: “assume it’s eighteen months from now and this project has failed badly — write the story of why,” which licenses people to voice doubts that optimism normally censors. And <strong>checklist or taxonomy prompting</strong> sweeps a standard list of categories to catch what open generation missed — but it goes <em>last</em>, because a checklist handed out first anchors the room to its contents and caps creativity.</p>

      <p className="measure">Whatever technique surfaces a risk, it is useless until it is <strong>worded</strong> correctly. A bare topic — “cyber,” “supply chain,” “people” — cannot be assessed, owned, or treated, because it names a domain, not a risk. A well-formed risk separates three things: a <strong>cause</strong> (the trigger or source condition), an <strong>event</strong> (the uncertain thing that happens), and a <strong>consequence</strong> (the effect on a specific objective). “Cyber” becomes “a phishing email (cause) lets ransomware encrypt the order-management system (event), so fulfilment halts for days and we miss retailer service levels (consequence).” That structure is what makes everything downstream possible: the cause is where you put preventive controls, the consequence is what you size in 2d and finance in 2f, and the split is exactly the left and right arms of a bow-tie. Discipline the language here and the register becomes a working object; skip it and you have a list of worries.</p>

      <p className="measure">The hard part is the room, because identification fails in predictable, human ways. Separate <strong>identification from evaluation</strong> — the instant someone says “that’ll never happen” or “that’s not material,” generation stops and people stop offering the half-formed risk that turns out to matter; capture everything first, judge later. Engineer the room <em>against hierarchy</em>: a deliberately diverse group (functions, levels, tenure) sees more of the elephant than a room of senior peers, and devices like anonymous entry and silent brainwriting exist specifically to neutralise the <strong>HiPPO effect</strong> (the highest-paid person’s opinion sets the answer) and <strong>groupthink</strong> (the group converges on consensus to preserve harmony). Then there are the <strong>cognitive biases</strong> that distort what even an honest room produces: <em>availability</em> (vivid, recent, easily-recalled events feel more likely — last year’s outage dominates, the silent slow risk is ignored), <em>recency</em> (the latest incident crowds out the base rate), and <em>optimism bias</em> (we systematically underweight what could go wrong with our own plans, which is precisely what the pre-mortem is engineered to counter). The facilitator’s real job is not to run a technique; it is to manage these dynamics so the room’s distributed knowledge actually comes out.</p>

      <p className="measure"><strong>Meridian in the room.</strong> Watch one workshop do this work. Meridian’s CRO convenes a half-day session on the flood-prone SE-Asia plant and deliberately stacks the room across hierarchy and function: the plant manager, a line supervisor, the procurement lead, a treasury analyst, and a junior quality engineer — not just the COO and his deputies. They run silent brainwriting first against a category prompt, then share. Two risks surface that a top-down list would have buried. The procurement lead, writing privately so she isn’t contradicting the COO, names the resin: the speciality packaging resin comes from <em>one</em> supplier with no qualified second source. Phrased to the discipline, that becomes <strong>R1</strong> — <em>cause:</em> the sole resin supplier suffers a failure or stoppage; <em>event:</em> the packaging line halts with no substitute feedstock; <em>consequence:</em> Meridian cannot ship for roughly two weeks, missing retailer orders (≈€9m). The line supervisor, prompted by a “what if?” about the site itself, raises the obvious-once-said: the plant sits in a river valley that floods. That becomes <strong>R7</strong> — <em>cause:</em> seasonal flooding inundates the SE-Asia site; <em>event:</em> production stops and equipment is damaged; <em>consequence:</em> output loss plus rebuild cost (≈€15m) and weeks of disrupted supply. Note what happened: separating identification from evaluation kept R1 alive long enough to be written down (the COO’s instinct was “the supplier’s been fine for years” — availability bias, no recent loss), and the diverse, partly-anonymous room let two non-executives name the risks their seniors had normalised.</p>

      <DoNow>Before the build, skim the ISO/IEC 31010 overview (pathway step 3, ~12 min) for the technique menu — brainstorming, Delphi, SWIFT, bow-tie — so you can name which one you’d reach for in your own organization’s context.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Coverage is the only number, and it isn’t really a metric" />

      <p className="measure">This is the least quantitative step in the whole process, and pretending otherwise does active harm. There is exactly one thing you can count — <strong>coverage</strong> — and you must be honest that it is a diagnostic signal, not a true metric, because the quantity it would measure is unknowable. You cannot compute how complete a register is: completeness would require knowing the size of the set of all real risks, and that set is exactly what you don’t have. (This is the same humility Part 5 calls the limits of models — identification narrows the gap but never closes it; some risks always sit outside the register, and a mature team says so out loud.) What you <em>can</em> do is read the symptoms of an <em>incomplete</em> register, the way you read warning lights without computing a total.</p>

      <p className="measure">Three coverage signals are worth watching. <strong>Composition:</strong> if every entry is operational and none is strategic, conduct, or emerging, the room only looked where it was comfortable — real risk universes span categories, so a lopsided one is a search failure, not a calm business. <strong>Contributor concentration:</strong> if every risk traces back to the same two or three people, you have sampled a fraction of the distributed knowledge — and possibly a culture where others don’t feel safe to speak (the 2b link, made measurable). <strong>Staleness:</strong> the same count of risks two years running, with no additions and no retirements, means identification stopped being a living habit and became an annual ritual. One genuinely useful proxy exists for whether you’ve searched enough in a single session: track how many <em>new</em> distinct risks each successive technique or round adds — when a fresh technique yields almost nothing new, you’re seeing diminishing returns and have probably saturated what this room can surface. That is as quantitative as honest identification gets.</p>

      <MathBlock>
        <p>“Coverage” is a search-saturation signal, not a completeness measure. Across techniques or rounds <span className="eq">1…k</span>, let <span className="eq">n_k</span> be the count of <em>new</em> distinct risks the k-th adds. Diminishing returns shows up as a <em>downward trend</em> — noisy, not a strict rule, since any one technique can surprise you:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">n_1, n_2, …, n_k  →  0  (on average)</span></p>
        <p>When <span className="eq">n_k</span> falls near zero, this room is saturated — stop here, or change the room. Crucially this says nothing about the <em>true</em> total <span className="eq">N</span> of real risks: <span className="eq">N</span> is unobservable, so the fraction <span className="eq">(Σ n_k)/N</span> you’d want as a completeness metric cannot be formed. Read the slope, never claim the percentage.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Build the register" />

      <p className="measure">Now run the discipline on your own organization. The intake will not let you log a bare topic — it demands a cause, an event, a consequence, an owner, and a category for every entry, so each one comes out assessable rather than as a one-word worry. Work as if you’d just facilitated the workshop: pull from more than one source (something a workshop would surface, something only an interview or a loss log would, something from a peer’s failure or the horizon), and aim for spread across categories rather than a pile of operational items. Name a real owner for each — an unownable risk is one nobody will act on.</p>

      <RegisterIntake lessonId="2c" artifactId="A4" />

      <p className="measure">This register is not a deliverable you file; it is the same object you will evaluate in 2d, attach controls to in 2e, treat in 2f, and monitor in 2g. Saved as Artifact A4, it is the spine of your whole operating model — which is why the wording discipline matters now: a vague entry here is a risk you cannot size or finance three lessons from now. Hold each line to this standard:</p>

      <Rubric
        title="a well-formed risk register"
        criteria={[
          { c: 'Cause → event → consequence', good: 'every entry separates the trigger, the uncertain event, and the effect on a named objective — not a bare topic like “cyber”' },
          { c: 'Multi-source', good: 'risks come from several channels (workshop, interview, loss data, peer/regulatory events, horizon), not one workshop' },
          { c: 'Spread across categories', good: 'strategic, financial, operational, conduct, cyber, climate — not all-operational' },
          { c: 'Owned', good: 'each risk names a real person accountable for it, so it can be acted on' },
          { c: 'Assessable', good: 'phrased so likelihood and impact could be estimated in 2d — the consequence is concrete enough to size' },
        ]}
        exemplar="Meridian R1: cause = sole resin supplier fails → event = packaging line halts, no substitute → consequence = cannot ship ~2 weeks, miss retailer orders (≈€9m); owner = COO; category = Operational. A topic (“supply chain”) became an assessable, ownable risk."
      />

      <p className="measure">A worked correction, because this is the most common mistake. A workshop participant offers “we have cyber risk.” It names a domain, so it can be neither owned nor sized nor controlled — there is no specific event to attach a probability to. Apply the discipline: pick the actual scenario, then split it. <em>Cause:</em> a phishing email gets an employee to surrender credentials. <em>Event:</em> ransomware encrypts the order-management ERP. <em>Consequence:</em> order capture and dispatch are down for several days, missing retailer service levels and incurring recovery cost (Meridian sizes this as R2, ≈€6m). Now there is a cause to put a preventive control on, a consequence to size in 2d and finance in 2f, and an owner who can plausibly be the CISO. That move — from one-word topic to a three-part, ownable, assessable line — is what turns a worry into a working register entry.</p>

      <ProblemSet items={[
        { q: 'A division’s register lists fourteen risks; all fourteen are operational (plant outages, IT failures, logistics) and twelve of them were raised by the same operations director. What two coverage problems does this show, and what would you do?', solution: 'Two incomplete-coverage signals fire at once. (1) Composition: an all-operational register means strategic, financial, conduct, and emerging risks were never searched — the room looked only where it was comfortable. (2) Contributor concentration: twelve of fourteen from one person means the distributed knowledge was barely sampled, and possibly that others didn’t feel safe to contribute (a 2b culture flag). The fix is a source and room change, not more analysis: run one-to-one interviews to recover what wasn’t said in the group, bring in commercial, finance, and compliance people, add a horizon-scanning prompt for emerging risk, and use anonymous brainwriting so the operations director doesn’t anchor the session.' },
        { q: 'Rewrite this bare entry into an assessable risk and say which identification technique you’d use to surface it well: “key person risk.”', solution: 'Bare topic → cause→event→consequence. Cause: the sole engineer who maintains the plant’s legacy automation system has no documented backup or trained deputy. Event: that engineer leaves or is unavailable for an extended period. Consequence: the automation cannot be maintained or recovered, risking unplanned line downtime (size it against a day’s lost output). Technique: one-to-one interviews are best here — key-person dependencies are exactly the “everyone quietly relies on me” facts people won’t volunteer in a group; a workshop would miss it, and a checklist would only flag the category, not the specific person and system.' },
      ]} />

      <p className="measure">Identification gives you the population every later step works on — evaluate, control, treat, monitor all operate only on the risks that made this list. But a named risk is still just a topic with a sentence around it until you know how much it matters: how likely, how large, and how it ranks against the others. That is the next lesson — analysing and evaluating risk, where the temptation is to reach for a heat map and the discipline is knowing exactly when that tool lies to you.</p>
    </LessonShell>
  );
}
