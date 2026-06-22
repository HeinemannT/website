import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.6');

const pathway = [
  { kind: 'read', t: 'NIST Cybersecurity Framework 2.0 — the six functions', src: 'NIST (CSWP 29, 2024)', href: 'https://www.nist.gov/cyberframework', min: 15, tier: 'core', why: 'The free, standard spine for cyber risk: Govern, Identify, Protect, Detect, Respond, Recover.' },
  { kind: 'read', t: 'FAIR — putting credible money ranges on cyber risk', src: 'The FAIR Institute', href: 'https://www.fairinstitute.org/', min: 15, tier: 'core', why: 'Loss-event frequency × loss magnitude, each a range — the method that ends the “unquantifiable” excuse.' },
  { kind: 'read', t: 'Climate-related Disclosures (IFRS S2) and the TCFD transfer', src: 'IFRS Foundation / ISSB', href: 'https://www.ifrs.org/sustainability/tcfd/', min: 12, tier: 'core', why: 'Why advising a board on “TCFD reporting” in 2026 is out of date — the recommendations now live in IFRS S2.' },
  { kind: 'read', t: 'NGFS climate scenarios for central banks and supervisors', src: 'Network for Greening the Financial System', href: 'https://www.ngfs.net/en/publications-and-statistics/publications/ngfs-climate-scenarios-central-banks-and-supervisors', min: 12, tier: 'apply', why: 'The standard set of plausible futures you stress the business against, instead of forecasting one.' },
  { kind: 'do', t: 'Add tech, cyber & climate risks to your register', src: 'the FamilyLens in this lesson → Artifact A10-tech', tier: 'apply', why: 'Turn the frameworks into register entries with owners and a sizing method that fits each.' },
  { kind: 'book', t: 'How to Measure Anything in Cybersecurity Risk', src: 'Hubbard & Seiersen, 2nd ed. (2023)', tier: 'deeper' },
];

const retrieval = [
  { q: 'Why are cyber, technology, and climate grouped as one risk family?', options: [
    { text: 'All three are deeply uncertain and fast-moving, so the past is a weak guide and they are best handled by scenarios rather than point forecasts.', correct: true },
    { text: 'They are all owned by the IT department.' },
    { text: 'They are the only risks that can be insured.' }] },
  { q: 'Cyber risk can be quantified credibly using…', options: [
    { text: 'methods like FAIR that express it as ranges (loss-event frequency × loss magnitude), fed into Monte Carlo to produce a loss distribution.', correct: true },
    { text: 'a single exact euro figure for next year’s losses.' },
    { text: 'value-at-risk computed on the company’s share price.' }] },
  { q: 'Advising a board to report climate risk “under the TCFD” in 2026 is out of date because…', options: [
    { text: 'the TCFD disbanded in 2023 and its recommendations were folded into IFRS S2 under the ISSB (effective 2024); NGFS supplies the standard scenarios.', correct: true },
    { text: 'the TCFD is still the active standalone body and the answer is fine.' },
    { text: 'climate risk no longer needs to be disclosed at all.' }] },
  { q: 'Under NIST CSF 2.0, offline backups and a tested incident-response plan map mainly to which function?', options: [
    { text: 'Recover — the assume-breach posture that restores operations after an incident.', correct: true },
    { text: 'Identify — cataloguing assets and exposures.' },
    { text: 'Govern — setting the risk-management strategy.' }] },
];

export default function Lesson36() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>In 2017 a single piece of malware, NotPetya, jumped from an accounting-software update to global shipping and froze Maersk’s terminals for days. No model trained on the past predicted it — and that is exactly why cyber, technology, and climate are taught together: they are the risks where history is the weakest guide.</Lead>

      <p className="measure">These three families share a structural property that sets them apart from credit or market risk: they are <em>deeply uncertain</em>, <em>fast-moving</em>, and <em>increasingly material</em>. The threat landscape, the technology stack, and the climate are all changing faster than any loss history can keep up with, so extrapolating the past — the move that works for a well-behaved trading book — actively misleads here. The disciplined response is to reason in <strong>scenarios</strong> about plausible futures rather than to publish a single point forecast. A point estimate of “next year’s cyber loss” or “our 2040 climate cost” projects a false confidence; a spread of outcomes across several futures is the honest object, and it is also the more decision-useful one, because it tells a board how exposed it is to being wrong.</p>

      <p className="measure">Here is how to work through the topic — NIST’s framework for the shape of cyber, the FAIR method for how cyber gets quantified, then the current climate-disclosure landscape (IFRS S2) and the standard scenarios (NGFS), before you add these risks to your own register.</p>

      <Pathway lessonId="3.6" items={pathway} />

      <Objectives items={[
        'Explain why technology, cyber, and climate are grouped, and why scenarios beat point forecasts for deeply uncertain, fast-moving risks.',
        'Frame cyber risk with the NIST Cybersecurity Framework 2.0 — its six functions and its assume-breach, plan-to-recover posture.',
        'Distinguish physical from transition climate risk, and name the current disclosure landscape (IFRS S2 / ISSB; NGFS scenarios) — not the disbanded TCFD body.',
        'Show that cyber is quantifiable as a range via FAIR + Monte Carlo, and that climate is sized by scenario analysis — both yielding a spread, not a point.',
        'Add technology, cyber, and climate risks to your own register with a fitting owner and sizing method (Artifact A10-tech).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Old systems, new threats, a changing planet" />
      <p className="measure"><strong>Technology and cyber risk</strong> runs across a wide range. At the mundane end sits <em>legacy-system and IT-resilience risk</em>: an ageing core system nobody dares patch, a single un-redundant data centre, an undocumented dependency that fails silently. At the existential end sits the adversarial threat — ransomware that halts the business, or a breach that empties customer trust.</p>

      <p className="measure">The unifying frame, as of 2026, is the <strong>NIST Cybersecurity Framework 2.0</strong> (NIST, released February 2024), which organises the whole sprawling topic into six functions: <strong>Govern</strong> (set the cyber-risk strategy, roles, and oversight — the function added in version 2.0), <strong>Identify</strong> (know your assets, data, and exposures), <strong>Protect</strong> (safeguards that reduce the chance of an incident), <strong>Detect</strong> (find incidents quickly), <strong>Respond</strong> (contain and manage one in progress), and <strong>Recover</strong> (restore operations afterwards). The two functions practitioners most often under-build are the last two, and that is the framework’s deliberate emphasis: <em>assume breach</em>. Perfect prevention is unattainable against a capable adversary, so a mature programme invests as hard in detecting, responding to, and recovering from an incident as in trying to stop it — the same resilience logic that runs through the operational-resilience lesson.</p>

      <p className="measure"><strong>Climate risk</strong> comes in two distinct channels, and confusing them is a common error. <em>Physical</em> risk is the direct hit of a changing climate on operations and supply: <em>acute</em> events (floods, storms, heatwaves that stop a plant or sever a logistics route) and <em>chronic</em> shifts (rising sea levels, water stress, gradually falling crop yields that raise input costs over years). <em>Transition</em> risk is the cost of moving to a lower-carbon economy: carbon pricing and regulation, technology shifts that strand high-carbon assets, and — often the sharpest edge for a consumer business — changing customer and retailer demands, where a major buyer makes decarbonisation a condition of keeping shelf space. The two channels can pull in opposite directions and must be assessed separately.</p>

      <p className="measure">The disclosure landscape here moves fast, and naming it correctly is part of the competence. As of 2026: the <strong>TCFD</strong> (Task Force on Climate-related Financial Disclosures), long the reference, was <strong>disbanded in 2023</strong>, and its recommendations — the four pillars of governance, strategy, risk management, and metrics and targets — were folded into <strong>IFRS S2 “Climate-related Disclosures”</strong> under the <strong>ISSB</strong> (effective for annual periods from 1 January 2024), now the global baseline that mandates disclosure of both physical and transition risk. The <strong>NGFS</strong> (Network for Greening the Financial System) supplies the standard reference scenarios — Net Zero 2050, Delayed Transition, Current Policies, and others — that firms test against. The practical point: advising a board in 2026 to “report under the TCFD” marks you as out of date, because the body no longer exists; the right reference is IFRS S2.</p>

      <p className="measure"><strong>Meridian worked example.</strong> Three live entries on its register sit in this family. <strong>R2 — ransomware on the ERP</strong> (12% annual probability, ~€6.0m impact, owned by the CISO): order and dispatch go dark for days. Map its controls straight onto the NIST functions — multi-factor authentication and disciplined patching are <em>Protect</em>; security monitoring that catches the intrusion early is <em>Detect</em>; <em>offline</em> backups plus a tested incident-response plan are <em>Recover</em>, the assume-breach insurance that turns a catastrophe into an outage. (Meridian’s real near-miss ransomware event 18 months ago, contained at the email gateway, is what funds this programme today.) <strong>R14 — customer-data breach</strong> (9%, ~€5.0m, also CISO): a GDPR penalty plus a trust hit, where <em>Protect</em> and <em>Detect</em> dominate but <em>Respond</em> — disclosure and regulatory handling — drives the reputational outcome. <strong>R13 — climate transition</strong> (45%, ~€6.0m, owned by the Sustainability Lead): a textbook transition risk, driven by carbon and packaging regulation plus a major retailer’s decarbonisation demands. This is the case’s live edge — a key retailer has put Meridian on notice that it must publish a credible decarbonisation plan within <em>18 months</em> to keep premium shelf space, the deadline that makes R13 a near-term financial risk, not a distant ESG aspiration.</p>

      <DoNow>Before the build, skim the NIST CSF 2.0 overview (pathway step 1, ~15 min) and locate each of the six functions. You will use them in a moment to classify your own organization’s cyber controls — and to spot which function you have under-built.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Ranges and scenarios, not point estimates" />
      <p className="measure">Cyber risk was for years declared “unquantifiable,” and boards defaulted to red/amber/green heat maps. That was always a confusion: “unquantifiable” really meant “badly served by a single number.” The <strong>FAIR</strong> method (Factor Analysis of Information Risk; the FAIR Institute and The Open Group) fixes this by decomposing a cyber risk into two factors and estimating each as a <em>range</em>, not a point: <strong>loss-event frequency</strong> (how many times a year the loss event occurs) and <strong>loss magnitude</strong> (how large the loss is when it does). Crucially you estimate each as a calibrated range — a plausible low, a most-likely, and a high — which is honest precisely because nobody knows the exact value. You then feed those ranges through Monte Carlo simulation: draw a frequency and a magnitude many thousands of times, multiply, and accumulate, and the result is a full <em>loss distribution</em> — the same Part 4 engine that simulates Meridian’s operational losses. The output is a loss-exceedance curve a CFO can read directly (“a 10% chance of losing more than €X to cyber next year”), which informs a budget decision in a way a coloured square never can.</p>

      <p className="measure">Climate is quantified differently, because the deep uncertainty there is about the <em>state of the world</em>, not the size of a known event. You do not forecast 2050; you <strong>stress the business against several plausible 2050s</strong> — the NGFS scenarios — and read how value changes under each. Run Meridian’s exposures through “Net Zero 2050” and “Delayed Transition” and physical and transition risks move in opposite directions: an orderly, early transition raises near-term transition costs but limits physical damage, while a delayed one defers transition cost only to face larger physical and abrupt-policy shocks later. The deliverable is a table of impacts across scenarios, not one number. In both methods — FAIR for cyber, scenario analysis for climate — the honest output is the same shape: a <em>spread</em> of outcomes that exposes how much rides on assumptions, never a false point estimate.</p>

      <MathBlock>
        <p>FAIR’s core decomposition treats annual cyber loss as frequency times magnitude, each a random quantity rather than a fixed number:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">Risk = LEF × LM</span>,&nbsp; with&nbsp; <span className="eq">LEF ~ Range(low, likely, high)</span>&nbsp; and&nbsp; <span className="eq">LM ~ Range(low, likely, high)</span>.</p>
        <p>Each Monte Carlo trial <span className="eq">i</span> draws a frequency and a magnitude and forms a loss <span className="eq">L_i = Σ LM</span> over the <span className="eq">LEF_i</span> events drawn that year; repeat thousands of times to build the distribution of annual loss <span className="eq">L</span>. The board then reads a quantile off it — the loss-exceedance curve — exactly the VaR/ES object of Part 4: <span className="eq">P(L &gt; ℓ) = p</span> answers “what loss will we exceed only <span className="eq">p</span> of the time.” The point: appetite chooses the percentile to govern; the simulated distribution says whether you are inside it. Climate replaces the single distribution with one outcome <em>per scenario</em> — the uncertainty is carried by which scenario obtains, not by a tail draw.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it on your organization" title="Add your tech, cyber & climate risks" />
      <p className="measure">Now extend your register with this family. Walk your <strong>technology and cyber</strong> exposure through the six NIST functions — legacy and resilience gaps surface under Identify and Protect; the under-built functions are usually Detect and Recover — and name the owner (CISO or CTO). Then add <strong>climate</strong> in both channels, physical and transition, with the board engaged because transition risk reaches into strategy and disclosure. For each entry, record not just a probability and impact but a <em>sizing method that fits the family</em>: a FAIR-style range for cyber, a scenario set for climate. The FamilyLens below captures exactly that.</p>

      <FamilyLens lessonId="3.6" artifactId="A10-tech" family="Technology & cyber" ownerHint="CISO / CTO"
        sizing="Cyber → FAIR-style ranges (event frequency × loss magnitude) run through Monte Carlo. Climate → scenario analysis against NGFS-style futures, not a single forecast." />

      <p className="measure">Read your entries back through the test that separates a real risk line from theatre: <em>does each one name a method by which it could be sized and monitored, or does it just assert a colour?</em> A cyber line with no frequency-and-magnitude logic behind it, or a climate line with no scenario behind it, is a heat-map square in disguise. The standard to hold the family to:</p>

      <Rubric
        title="a strong technology, cyber & climate register entry"
        criteria={[
          { c: 'Right owner, board-engaged', good: 'cyber owned by CISO/CTO; climate transition reaches the board because it touches strategy and disclosure' },
          { c: 'Cyber framed by a standard', good: 'mapped to NIST CSF 2.0 functions, with explicit Detect and Recover (assume-breach), not just Protect' },
          { c: 'Climate split correctly', good: 'physical (acute + chronic) and transition (policy, technology, customer/retailer demand) assessed as separate channels' },
          { c: 'Sized by a fitting method', good: 'cyber as a FAIR-style frequency × magnitude range via Monte Carlo; climate as impacts across NGFS-style scenarios — a spread, not a point' },
          { c: 'Current on the landscape', good: 'references IFRS S2 / ISSB and NGFS as of 2026 — not the TCFD body, disbanded 2023' },
        ]}
        exemplar="Meridian R2 (ransomware): Protect = MFA + patching, Detect = monitoring, Recover = offline backups + tested IR plan; sized FAIR-style (LEF × LM → Monte Carlo). R13 (transition): retailer decarbonisation demand + carbon/packaging regulation, 18-month deadline; sized across NGFS scenarios."
      />

      <p className="measure">A worked correction, because this is the family’s signature mistake. A team writes: “Cyber risk — High (red).” It names no event, no frequency, no money, and no control function, so it can neither be budgeted against nor monitored. Apply the discipline: pick the concrete loss event (ransomware halting the ERP), map controls to NIST functions (Protect: MFA/patching; Detect: monitoring; Recover: offline backups + IR plan), then size it FAIR-style — loss-event frequency of, say, 0.1–0.3 per year and loss magnitude of €3–9m per event, run through Monte Carlo to a loss-exceedance curve. Now the board sees “roughly a 1-in-8 chance of losing more than €6m to ransomware next year,” which a security budget can be tested against. That move — from a coloured square to a sized, monitorable distribution — is what makes the risk something a budget can be set against.</p>

      <ProblemSet items={[
        { q: 'A board asks you to prepare its climate report “under the TCFD framework.” What is wrong with the instruction, and what do you actually deliver in 2026?', solution: 'The TCFD as a body was disbanded in 2023; you cannot report “under” a defunct task force. Its four pillars survive, but they now live inside IFRS S2 “Climate-related Disclosures” under the ISSB (effective from 2024), which is the current global baseline and mandates both physical and transition risk. So you deliver an IFRS S2-aligned disclosure, using NGFS scenarios for the scenario-analysis section. Naming the live standard correctly is itself a signal of competence to the board.' },
        { q: 'A CISO reports that Meridian is strong on firewalls, MFA, and patching, so cyber risk is “well controlled.” Using NIST CSF 2.0, what is the gap, and why does it matter?', solution: 'Firewalls, MFA, and patching are all Protect — prevention. The CISO has said nothing about Detect (will an intrusion be caught quickly?), Respond (is there a tested incident-response plan?), or Recover (are there offline, tested backups?). Against a capable adversary, prevention will eventually fail, which is the framework’s assume-breach premise. A programme heavy on Protect and light on Detect/Recover turns a containable incident into the multi-day ERP halt of R2. Strong prevention is necessary but not sufficient; resilience lives in the last three functions.' },
        { q: 'Why is a single point estimate the wrong output for both Meridian’s cyber risk (R2/R14) and its climate transition risk (R13), and what is the right output for each?', solution: 'Both are deeply uncertain, so a point estimate projects false precision and hides how much rides on assumptions. For cyber, the right output is a loss distribution: estimate loss-event frequency and loss magnitude as ranges and Monte Carlo them (FAIR) to a loss-exceedance curve the board reads as a probability of exceeding a euro threshold. For climate transition, the uncertainty is about which future obtains, so the right output is a table of impacts across NGFS scenarios (e.g., Net Zero 2050 vs Delayed Transition), showing how the 18-month retailer deadline and carbon/packaging costs bite differently in each. In both cases the deliverable is a spread, not a number.' },
      ]} />

      <p className="measure">These three families complete the risk universe with the ones that least respect the past — which is why they force the move from forecasting to scenarios, and from coloured squares to honest ranges. They also feed the same engine everything else does: the FAIR distribution and the climate scenario table are inputs to the portfolio and aggregation view, where a single cloud vendor or a single flood-prone plant can turn risks you booked as independent into one correlated exposure. That aggregation is where the register stops being a list and becomes a picture of the whole firm.</p>
    </LessonShell>
  );
}
