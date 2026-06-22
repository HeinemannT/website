import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { FrameworkSelector } from '../tools/FrameworkSelector.jsx';

const lesson = getLesson('1.3');

const pathway = [
  { kind: 'read', t: 'The Orange Book — risk management principles & process', src: 'HM Treasury (gov.uk)', href: 'https://www.gov.uk/government/publications/orange-book', min: 15, tier: 'warmup', why: 'A government framework built on the ISO process — the cleanest free worked example of principles → framework → process.' },
  { kind: 'read', t: 'ISO 31000:2018 — Principles, Framework, Process', src: 'official summary of the standard (the full text is paid)', min: 20, tier: 'core', why: 'The three-part spine you will run day to day; learn the process loop by name.' },
  { kind: 'read', t: 'COSO ERM 2017 — Executive Summary', src: 'COSO official summary: five components, twenty principles', min: 20, tier: 'core', why: 'How risk gets tied to strategy and performance in board language.' },
  { kind: 'read', t: "COSO's ERM Framework — overview", src: 'NC State ERM Initiative', href: 'https://erm.ncsu.edu/resource-center/cosos-erm-framework/', min: 12, tier: 'core', why: 'A trustworthy secondary walk-through, including why COSO ERM is not COSO Internal Control.' },
  { kind: 'do', t: 'Choose and map a framework emphasis for your organization', src: 'the selector in this lesson → Artifact A1', tier: 'apply', why: 'Turn the comparison into a defensible choice your charter can cite.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — the standards chapters', src: 'Hopkin & Thompson', tier: 'deeper' },
];

const retrieval = [
  {
    q: "ISO 31000's three parts, in order, are…",
    options: [
      { text: 'Principles (why), Framework (leadership and integration), and Process (the operational loop from scope through treatment to reporting).', correct: true },
      { text: 'Governance, Strategy, and Performance.' },
      { text: 'Identification, Analysis, and Evaluation.' },
    ],
  },
  {
    q: 'Inside the ISO process, "risk assessment" is itself made of three steps:',
    options: [
      { text: 'identification, then analysis, then evaluation — and treatment comes after.', correct: true },
      { text: 'communication, consultation, and reporting.' },
      { text: 'governance, culture, and review.' },
    ],
  },
  {
    q: 'COSO ERM 2017 and COSO Internal Control are…',
    options: [
      { text: 'two different frameworks — ERM has five components / twenty principles around strategy and performance; Internal Control has five components / seventeen principles. Confusing them is a common error.', correct: true },
      { text: 'the same document under two names.' },
      { text: 'rival standards you must choose between.' },
    ],
  },
  {
    q: 'A key fact about ISO 31000 is that it is…',
    options: [
      { text: 'guidance you cannot be certified against — designed to be adapted, not audited like ISO 9001.', correct: true },
      { text: 'a pass/fail checklist required to operate.' },
      { text: 'only applicable to financial institutions.' },
    ],
  },
  {
    q: 'A listed European mid-cap with US-listing exposure typically…',
    options: [
      { text: 'runs the ISO process operationally but reports to the board in COSO’s strategy-and-performance language — using both.', correct: true },
      { text: 'must pick exactly one framework and discard the other.' },
      { text: 'should avoid frameworks entirely until it is larger.' },
    ],
  },
];

export default function Lesson13() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>A risk raised on a factory floor and a risk raised in the boardroom only ever land on the same page if the organization runs them through one process and names them in one vocabulary. Supplying that process and that vocabulary is the entire job of a risk framework — and two of them, ISO 31000 and COSO ERM, define the field.</Lead>

      <p className="measure">A framework is not a list of risks and it is not software. It is the standing answer to four questions an organization would otherwise re-improvise every time: <em>what counts as a risk here, who decides about it, how do we assess it, and how do we report it.</em> Fix those answers once and two things become possible that are impossible without them. First, risks become <em>comparable</em> — scored on one scale, described in one cause-event-consequence form — so a plant outage and a covenant breach can sit in the same register and be ranked against each other. Second, they become <em>aggregable</em> — once everything is expressed the same way, the board can roll fourteen scattered exposures into an enterprise picture instead of fourteen disconnected stories. Ad hoc risk management can do neither; that is precisely what "enterprise" in ERM buys you, and a framework is the machinery that delivers it.</p>

      <p className="measure">Work the topic in this order: a government framework first (the Orange Book is the cleanest free example of the three-part shape), then the two official summaries that define the field, then the build.</p>

      <Pathway lessonId="1.3" items={pathway} />

      <Objectives items={[
        'State ISO 31000’s three parts (principles, framework, process) and name the steps of the process loop, including the three sub-steps of risk assessment.',
        'State COSO ERM 2017’s five components and its strategy-and-performance framing, and distinguish it from COSO Internal Control.',
        'Explain why ISO and COSO are complementary rather than rival, and map the steps of one onto the other.',
        'Choose a defensible framework emphasis for your organization and justify it (Artifact A1).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Two frameworks, in their real structure" />
      <p className="measure"><strong>ISO 31000:2018 ("Risk management — Guidelines")</strong> has three parts, and you should hold them apart because they answer different questions. The <strong>Principles</strong> (eight of them) say <em>why</em> and to what quality standard: value creation and protection sits deliberately at the centre, surrounded by seven qualities a good system has — integrated, structured and comprehensive, customised, inclusive, dynamic, based on the best available information, and accounting for human and cultural factors. The <strong>Framework</strong> says <em>how the organization holds the system up</em>: leadership and commitment at the core, plus the cycle of integration, design, implementation, evaluation and improvement — this is the mandate, the resourcing, the place ERM lives in the org chart. The <strong>Process</strong> is the operational loop you actually run on a given risk: <em>communication and consultation</em> (running alongside throughout), then <em>establishing scope, context and criteria</em>, then <em>risk assessment</em> — which is itself <em>identification → analysis → evaluation</em> — then <em>risk treatment</em>, with <em>monitoring and review</em> and <em>recording and reporting</em> wrapped around the whole thing. The single most useful fact about ISO 31000 is its stance: it is <em>guidance</em>, principles-based and deliberately non-certifiable. Unlike ISO 9001 there is no audit to pass and no certificate to hang on the wall — it is built to be adapted to a hospital, a startup or a ministry, not conformed to.</p>

      <p className="measure"><strong>COSO ERM 2017 ("Enterprise Risk Management — Integrating with Strategy and Performance")</strong> takes a different cut. Where ISO gives a clean universal process, COSO organises everything around <strong>strategy and performance</strong> — risk in the service of creating and preserving value — in the language a board already speaks. Its structure is <strong>five components</strong> carrying <strong>twenty principles</strong>: (1) <em>Governance and Culture</em>; (2) <em>Strategy and Objective-Setting</em>; (3) <em>Performance</em>; (4) <em>Review and Revision</em>; and (5) <em>Information, Communication and Reporting</em>. The headline move, versus the older 2004 "cube," is that risk is positioned as integral to choosing and pursuing strategy — the gravest risk is the wrong strategy, or a strategy that drifts from mission — rather than as a bolt-on control activity. Now the constant confusion to kill: <strong>COSO ERM is not COSO Internal Control</strong>. They are two separate COSO frameworks. Internal Control (the "ICIF," the one auditors invoke under SOX) has <em>five components and seventeen principles</em> and is about control over reporting and compliance; ERM has <em>five components and twenty principles</em> and is about risk across strategy and performance. Same publisher, different documents, different counts — say "ERM, twenty principles" and you will never mix them up.</p>

      <p className="measure">Two more pieces complete the landscape. <strong>ISO 31010 ("Risk assessment techniques")</strong> is ISO 31000's companion volume: not a framework but a <em>catalogue</em> of methods — bow-tie, FMEA, scenario analysis, Monte Carlo, and dozens more — that plug into the assessment step of the process. You name it now; you use it in the assessment lessons. And the reason there are two big frameworks rather than one winner is that they are <strong>complementary, not rival</strong>. ISO supplies a clean, organization-agnostic <em>process and set of principles</em>; COSO supplies the <em>strategy linkage and board-facing language</em> and is richer on governance and reporting. They map onto each other cleanly: ISO's "establishing context" lives inside COSO's <em>Strategy and Objective-Setting</em>; ISO's <em>assessment and treatment</em> are COSO's <em>Performance</em>; ISO's <em>monitoring and review</em> is COSO's <em>Review and Revision</em>; and both end in reporting — ISO's <em>recording and reporting</em>, COSO's <em>Information, Communication and Reporting</em>.</p>

      <p className="measure">Given that they are complementary, the choice is one of emphasis, and it follows exposure rather than taste: heavy <strong>US-listed / SEC / SOX</strong> exposure pulls toward <strong>COSO</strong> in the lead (it is the board's and the auditor's native tongue); an <strong>international, public-sector or general</strong> footprint pulls toward <strong>ISO</strong> (lighter, neutral, adoptable by any org type); and most <strong>mature firms run both</strong> — ISO as the process backbone, COSO as the strategy-and-board layer. The dominant failure mode, whichever you pick, is the same and is not about the choice at all: a framework adopted as a binder on a shelf that no real decision ever touches.</p>

      <p className="measure">Watch it land on the carried case. <strong>Meridian Industries</strong> is a listed European mid-cap consumer-goods maker — €1.2bn revenue, three plants, fourteen countries, a treasury that hedges FX and funds the firm through a €150m facility — and it has the classic profile: listed and audited, but international and operationally driven. So Meridian does what mature firms do: it <em>runs the ISO process day to day</em> and <em>reports to the board in COSO's language</em>. Concretely, the risk team uses the ISO loop to handle every entry in the register — establish context, identify, analyse, evaluate, treat, monitor — while the quarterly board pack is structured around COSO's five components, so the directors see risk against strategy and performance, not as a list. Take one risk to show the mapping is real. R3, product contamination (4% annual, €18m impact): under ISO it is <em>identified</em> in a plant workshop, <em>analysed</em> as likelihood × impact, <em>evaluated</em> against an averse safety appetite, and <em>treated</em> (hardened controls plus recall insurance), then <em>monitored</em> via the customer-complaint KRI. The very same risk reported to the board under COSO appears under <em>Governance and Culture</em> (the post-recall tone from four years ago), under <em>Strategy and Objective-Setting</em> (it threatens the "keep critical supply running" objective and shelf space), under <em>Performance</em> (its place in the assessed portfolio), and under <em>Review and Revision</em> (did the treatment hold this quarter?). One risk, one process to run it, one vocabulary to govern it — that is what using both frameworks actually means.</p>

      <DoNow>Before the build, open the COSO ERM Executive Summary (pathway step 3) and find the five components on its single summary diagram. Note which one your organization currently does worst — that gap is usually where adopting a framework would change the most.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Nothing here, and that is the teaching point" />
      <p className="measure">There is deliberately no maths in this lesson, because a framework is structural and qualitative — it is the <em>scaffolding</em> (who governs risk, how it is assessed and reported), not a calculation. That is worth stating plainly rather than apologising for: the organizing logic of the whole discipline is non-numeric, and recognising where measurement does and does not belong is itself part of the craft. The quantitative tools of Part 4 — Monte Carlo simulation, Value-at-Risk, frequency–severity loss models, stress testing — do not replace the framework; they <em>plug into one specific spot in it</em>. In ISO terms they live inside the <em>analysis</em> sub-step of risk assessment, and nowhere else: the framework decides what to assess, who owns it and how to report it, and the maths sharpens the single question "how big and how likely is this one?" Build the structure first and bolt the measurement onto the assessment step where it fits; a number with no framework around it has no owner, no threshold to be judged against, and no route to the board.</p>

      <Stage n={3} kicker="Build it — your organization" title="Choose and justify your emphasis" />
      <p className="measure">Now set the framework emphasis for your own organization. The selector asks about the things that actually decide it — listing status and SEC/SOX exposure, sector, international footprint, board maturity, size — and recommends ISO-led, COSO-led, or an explicit hybrid, then shows the side-by-side mapping so you can see the two describing the same work. Treat the recommendation as a starting position to defend, not an oracle: the deliverable is the <em>rationale</em>. Record which framework leads, which you borrow from, and the one sentence that says why your exposure points that way — that choice fixes the vocabulary your charter and every later lesson in this course will use.</p>

      <FrameworkSelector lessonId="1.3" artifactId="A1-framework" />

      <p className="measure">Read your choice back through one test: <em>name a decision in the next quarter that would be made differently because this framework is in place.</em> If you can — a board report restructured around COSO's components, a new risk pushed through the full ISO loop instead of a hallway conversation — the framework is live. If you cannot, you have selected a binder, and the fix is not a different framework but a real process attached to a real decision. The standard to hold the artifact to:</p>

      <Rubric
        title="a strong framework choice"
        criteria={[
          { c: 'Justified by exposure', good: 'the lead framework follows from listing status, sector and footprint — not from familiarity or fashion' },
          { c: 'Structurally accurate', good: 'names ISO’s principles/framework/process and COSO’s five components correctly, and does not confuse COSO ERM with COSO Internal Control' },
          { c: 'Complementary, not exclusive', good: 'states what each framework contributes and how they map onto each other, rather than discarding one' },
          { c: 'Operationalised', good: 'specifies which framework runs day-to-day and which structures board reporting, with at least one risk shown flowing through it' },
          { c: 'Decision-useful', good: 'identifies a concrete near-term decision the framework would change — proof it is not shelfware' },
        ]}
        exemplar="Meridian: ISO 31000 leads operationally (run the process on every register entry); COSO ERM frames the quarterly board pack (five components, strategy-and-performance language). Mapping shown on R3 contamination: ISO identify→analyse→evaluate→treat→monitor, reported under COSO Governance/Strategy/Performance/Review. Decision changed: next board pack restructured by COSO component."
      />

      <p className="measure">A worked correction, because this is the most common mistake teams make here. A risk lead proposes: "We will adopt COSO ERM as our framework." Asked which COSO, they cannot say — and that single gap usually means the org has copied a SOX internal-control template and called it ERM, so "risk management" quietly collapses into control-testing over financial reporting and never reaches strategy at all. The repair has three moves. First, name the framework precisely: <em>COSO ERM 2017, five components, twenty principles</em> — distinct from Internal Control's seventeen. Second, pick the lead by exposure: a SOX-exposed listed firm reasonably leads with COSO, but a manufacturer with plants in fourteen countries needs ISO's clean process to run those operations, so the honest answer is "ISO process, COSO board layer." Third, attach it to a decision: the next contamination risk goes through the full ISO loop and is reported under COSO's components — not discussed in a corridor. Adjective ("we have COSO") to operating process ("here is R3 flowing through both, and here is the board pack it produces") is the entire move this lesson asks for.</p>

      <ProblemSet items={[
        { q: 'A startup CEO says: "We can’t do ERM until we can afford ISO 31000 certification." What two things are wrong, and what should they do instead?', solution: 'Two errors. (1) ISO 31000 is non-certifiable guidance, not a certification like ISO 9001 — there is nothing to "afford" or pass; it is freely adaptable. (2) Framework adoption is not gated on size — the cost is process discipline, not a fee. What to do: take ISO’s process loop (context → identify → analyse → evaluate → treat → monitor → report) and run it on the handful of risks that could kill the company, in whatever lightweight form fits a small team. The framework is the shared process and vocabulary; you can have that on day one.' },
        { q: 'Meridian’s auditor reviews internal controls under SOX-style rules and tells the board "your COSO framework is solid." The CRO disagrees. Who is right, and why does the distinction matter?', solution: 'Both can be right because they mean different frameworks. The auditor is assessing COSO Internal Control (five components, seventeen principles) — control over financial reporting and compliance — and it may indeed be solid. The CRO is responsible for COSO ERM (five components, twenty principles) — risk across strategy and performance — which is a broader thing that includes strategic, operational and reputational risk the internal-control review never touches. The distinction matters because a board hearing "COSO is solid" may believe enterprise risk is covered when only the reporting-controls subset has been assured. Naming which COSO prevents that false comfort.' },
        { q: 'Map ISO 31000’s "establishing scope, context and criteria" step onto COSO ERM. Which component is it, and what does the mapping reveal?', solution: 'It maps onto COSO’s Strategy and Objective-Setting component. Both insist that you cannot assess risk until you have fixed the objectives risk is measured against and the criteria for what is tolerable (this is also the appetite link from Lesson 2a). The mapping reveals that the two frameworks are the same work in different order and language: ISO threads context through an operational loop, COSO embeds it in a strategy component — which is exactly why a firm can run ISO day-to-day and still report cleanly in COSO’s structure.' },
      ]} />

      <p className="measure">A framework gives the rest of the course its skeleton: every later lesson — appetite, identification, evaluation, treatment, monitoring — is one of these process steps done in depth, and Part 4’s maths is the analysis sub-step done quantitatively. But a process needs people who run it and a board that owns it. That is the next lesson: governance and the Three Lines Model — who owns a risk, who oversees it, and who provides independent assurance that the framework you just chose is actually working.</p>
    </LessonShell>
  );
}
