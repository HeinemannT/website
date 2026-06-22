import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { ControlMapper } from '../tools/ControlMapper.jsx';

const lesson = getLesson('2e');

const pathway = [
  { kind: 'watch', t: 'Inherent vs residual risk in 6 minutes', src: 'short practitioner explainer', min: 6, tier: 'warmup', why: 'Fix the one move controls make — inherent down to residual — before the framework detail.' },
  { kind: 'read', t: 'COSO Internal Control 2013 — Executive Summary', src: 'COSO (free PDF)', href: 'https://www.coso.org/_files/ugd/3059fc_1df7d5dd38074006bce8fdf621a942cf.pdf', min: 15, tier: 'core', why: 'The five components and seventeen principles, from the source — and note it is NOT COSO ERM.' },
  { kind: 'read', t: 'The Three Lines Model (2020)', src: 'IIA (free PDF)', href: 'https://www.theiia.org/globalassets/documents/resources/the-iias-three-lines-model-an-update-of-the-three-lines-of-defense-july-2020/three-lines-model-updated-english.pdf', min: 12, tier: 'core', why: 'Who owns a control, who oversees it, who independently assures it operates.' },
  { kind: 'do', t: 'Map controls and find your residual breaches', src: 'the mapper in this lesson → Artifact A6', tier: 'apply', why: 'Rate effectiveness honestly and surface the risks still above tolerance.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — the internal-control chapter', src: 'Hopkin & Thompson', tier: 'deeper' },
];

const retrieval = [
  { q: 'Residual risk is…', options: [
    { text: 'what remains after your controls act on the inherent risk — inherent × (1 − effectiveness).', correct: true },
    { text: 'the exposure before any control is in place.' },
    { text: 'always equal to the inherent risk for a serious threat.' }] },
  { q: 'A control that is well designed on paper but that nobody actually performs has…', options: [
    { text: 'design effectiveness without operating effectiveness — and reduces risk by zero until it operates.', correct: true },
    { text: 'operating effectiveness without design effectiveness.' },
    { text: 'both, since a documented control is a working control.' }] },
  { q: 'COSO Internal Control (2013) and COSO ERM (2017) are…', options: [
    { text: 'two distinct frameworks — five IC components / seventeen principles versus the ERM components — routinely and wrongly conflated.', correct: true },
    { text: 'the same document under two names.' },
    { text: 'both purely about insurance and risk transfer.' }] },
  { q: 'Overstating a control’s effectiveness is dangerous because…', options: [
    { text: 'it shrinks residual risk on paper, hiding a live exposure you have stopped watching — worse than a gap you know about.', correct: true },
    { text: 'it makes the control register longer than it needs to be.' },
    { text: 'it has no real consequence as long as the control exists.' }] },
];

export default function Lesson2e() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>A factory installs a sprinkler system and rates its fire risk “controlled.” Three years later a fire spreads because the valves were never tested and half were shut. The control existed on paper and did nothing in reality — and that gap, between a control’s design and its operation, is where this lesson lives.</Lead>

      <p className="measure">A <strong>control</strong> is any measure that changes a risk — a second signature on a payment, multi-factor authentication, a smoke detector, a rule that the person who creates a supplier record cannot also approve payments to it. Controls have exactly one job: to move a risk from its <strong>inherent</strong> level — the exposure before any control acts — to a <strong>residual</strong> level you are willing to live with. The whole value of a control programme is the size of that inherent-to-residual gap; if the gap is small, the controls are not earning the money, time, and friction they cost. That last clause matters: controls are never free, and an organization can over-control — pile on so much sign-off and checking that the cost and delay exceed the risk removed. Over-control is a failure mode in its own right, not the safe default.</p>

      <p className="measure">Work through the framework from the source — the COSO Executive Summary for the five components, the Three Lines Model for who owns and assures a control — then map your own register at the end.</p>

      <Pathway lessonId="2e" items={pathway} />

      <Objectives items={[
        'Explain what a control does — move inherent risk to residual — and why over-control is itself a failure.',
        'Name the five components of COSO Internal Control and distinguish it from COSO ERM.',
        'Classify controls by type (preventive/detective/corrective/directive, manual/automated, key/secondary) and separate design effectiveness from operating effectiveness.',
        'Read residual = inherent × (1 − effectiveness) and explain why overstating effectiveness is worse than a known gap.',
        'Map controls to your register and find the residual risks that still breach tolerance (Artifact A6).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Internal control, honestly" />
      <p className="measure">The reference frame is the <strong>COSO Internal Control — Integrated Framework (2013)</strong>, and it has five components: <strong>control environment</strong> (the tone, integrity, and governance that make controls credible — the foundation), <strong>risk assessment</strong> (identifying and analysing what could go wrong), <strong>control activities</strong> (the controls themselves — approvals, reconciliations, segregation of duties), <strong>information &amp; communication</strong> (getting the right risk and control information to the people who act on it), and <strong>monitoring activities</strong> (ongoing and separate checks that the controls are still working). Beneath the five sit <strong>seventeen principles</strong> that spell out what each component requires. One caution worth stating outright: COSO Internal Control is a <em>different document</em> from COSO ERM (2017), and the two are conflated constantly. Internal Control is about reliable operations, reporting, and compliance — keeping the machine honest; ERM is about managing risk to strategy and value across the enterprise. Citing “COSO’s five components” when you mean ERM’s components is a tell that someone has read neither.</p>

      <p className="measure">Controls come in <strong>types</strong>, and a serious risk needs more than one. <strong>Preventive</strong> controls stop the event before it happens (a locked door, MFA, segregation of duties). <strong>Detective</strong> controls catch it once it is underway (a reconciliation that spots a fraudulent payment, an intrusion-detection alert). <strong>Corrective</strong> controls limit the damage and restore operations afterward (a backup you can restore from, an incident-response plan). <strong>Directive</strong> controls mandate the desired behaviour up front (policies, training, standard operating procedures). Cutting the other way: controls are <strong>manual</strong> (a person checks something) or <strong>automated</strong> (a system enforces it) — automated controls are more consistent but fail silently and at scale, while manual controls degrade with fatigue and turnover. The archetypal preventive control is <strong>segregation of duties</strong>: split a sensitive process so no single person can both initiate and approve it. No individual can create a fictitious supplier <em>and</em> pay it, so the fraud needs collusion, which is far rarer and easier to detect.</p>

      <p className="measure">Not all controls matter equally. A <strong>key control</strong> is one that, on its own, addresses a significant risk — if it fails, the risk is largely unmitigated; a <strong>secondary control</strong> provides supporting comfort but is not load-bearing. The distinction drives where you spend assurance: test the key controls hard, do not waste the budget proving that a low-stakes secondary control works. And the most important distinction in the lesson is between two senses of “effective.” <strong>Design effectiveness</strong> asks: if this control operates as intended, would it actually address the risk? <strong>Operating effectiveness</strong> asks: is it in fact being performed, consistently, by someone, right now? A control can be beautifully designed and never executed — the sprinkler valves nobody tested — and a control that is designed well but not operating reduces risk by exactly zero. This is why control documentation is worthless on its own: an untested control is an assumption, not a mitigation.</p>

      <p className="measure">Someone has to test that assumption, which is where the <strong>Three Lines Model (IIA, 2020)</strong> connects. The <em>first line</em> — operational management — owns and performs the controls. The <em>second line</em> — risk, compliance, quality — provides expertise, sets policy, and oversees and challenges. The <em>third line</em> — internal audit — gives <strong>independent assurance</strong> that controls are designed and operating as claimed, reporting to the governing body, not to the managers it audits. Independence is the point: the people who run a control are the worst-placed to certify it works, because they are the ones who flatter it. The 2020 model deliberately drops the old “three lines of <em>defence</em>” language and its adversarial tone in favour of collaboration toward shared objectives — but the assurance role stays independent.</p>

      <p className="measure"><strong>Meridian worked example.</strong> Take R2, ransomware on the ERP — inherent annual expected loss of 12% × €6.0m = €720k. Meridian layers the types: <em>preventive</em> controls are email filtering at the gateway (the 18-month-ago near-miss was contained exactly there), MFA on remote access, and a disciplined patching cadence; <em>detective</em> control is continuous monitoring that flags anomalous encryption activity; <em>corrective</em> controls are offline, immutable backups and a rehearsed incident-response plan that together cap the outage at days, not weeks. That is defence in depth: the filter is the key preventive control, but because any single layer fails sometimes, the detective and corrective layers stand behind it. Now R3, contamination and recall — inherent 4% × €18.0m = €720k, the same expected loss but a far worse tail, and a live one: the €4m recall four years ago is exactly this risk realised. After that recall, the inherent risk is high and the board’s appetite is <em>averse</em> (near-zero tolerance, treat regardless of cost — set in lesson 2a). So the residual here cannot rest on a hopeful number. It must come from honest, <em>tested</em> controls — HACCP process controls, supplier and ingredient testing, line-clearance checks, traceability for rapid recall — each verified by internal audit (third line) to be operating, not merely written down, so that the residual genuinely sits within an averse safety appetite rather than only appearing to.</p>

      <DoNow>Before the build, read the COSO Executive Summary (pathway step 2, ~15 min) and list the five components from memory — then notice how its “monitoring activities” component is the formal name for “who tests that the control operates.”</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Residual = inherent × (1 − effectiveness), and the honesty trap" />
      <p className="measure">The arithmetic is deliberately simple, because its purpose is to expose a single lever, not to produce a precise number. Take the inherent expected loss and reduce it by how effective the controls are: a control suite rated 40% effective leaves 60% of the inherent risk standing. For Meridian’s R2, an honest 40% turns €720k of inherent expected loss into €720k × (1 − 0.40) = €432k of residual. The lever is the effectiveness figure, and the whole danger lives in how it is chosen. Slide R2 from an honest 40% to a hopeful 80% and the residual collapses to €144k — the risk appears to melt away. Nothing about the actual exposure changed; only the number you assumed did. That is the trap: residual risk is only as real as the effectiveness estimate is honest, and the estimate is the one input nobody independently checks unless the third line forces it.</p>

      <p className="measure">This is why <strong>overstating effectiveness is worse than a known gap.</strong> A risk you know is uncontrolled stays on the register, gets watched, and competes for treatment budget. A risk you have <em>rated</em> as controlled — wrongly — drops off the worry list: you have removed not the risk but your awareness of it, and you find out the rating was fiction only when the loss arrives. A high effectiveness number is therefore a claim that must be earned by testing operating effectiveness, never assumed from the existence of a control. The related intuition is <strong>defence in depth</strong>: if independent layers each let a fraction through, the combined miss is roughly the product of the individual misses — three layers each 50% effective leave 0.5 × 0.5 × 0.5 = 12.5% standing, far better than any one of them. The catch is the word <em>independent</em>: if all three layers share a common cause — one administrator, one mis-set configuration, one ignored alert culture — they fail together, the product rule breaks, and the layered comfort was an illusion.</p>

      <MathBlock>
        <p>Model controls as a fractional reduction of an inherent expected loss <span className="eq">EL_inh = p · I</span>. With combined control effectiveness <span className="eq">e ∈ [0, 1]</span>:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">EL_res = EL_inh · (1 − e)</span>.</p>
        <p>Meridian R2 (ransomware): <span className="eq">EL_inh = 0.12 · €6.0m = €720k</span>. Honest <span className="eq">e = 0.40</span> → <span className="eq">EL_res = €432k</span>; overstated <span className="eq">e = 0.80</span> → <span className="eq">EL_res = €144k</span>. The exposure is unchanged; only the assumed <span className="eq">e</span> moved, which is exactly why <span className="eq">e</span> must be earned by testing, not assumed.</p>
        <p>For <span className="eq">n</span> independent layers with individual effectiveness <span className="eq">e_k</span>, the fraction getting through is the product of the misses, so combined effectiveness is <span className="eq">e = 1 − Π_k (1 − e_k)</span>. Three layers at <span className="eq">e_k = 0.5</span> give <span className="eq">e = 1 − 0.5³ = 0.875</span>. The product rule holds <em>only</em> under independence; a shared common cause collapses the layers to a single point of failure and the formula overstates protection — the quantitative face of correlated control failure.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Map your controls" />
      <p className="measure">Now map controls onto your own register. For each risk, set how effective the controls <em>really</em> are — not how effective the policy says they should be — and watch the inherent bar shrink to a residual bar against your tolerance line. Rate operating effectiveness, not design intent: if a control is well designed but unevenly performed, mark it down. The risks whose residual stays above the line after honest controls are the ones that need <strong>treatment</strong> — the next lesson — rather than just monitoring. Saved as Artifact A6.</p>

      <ControlMapper lessonId="2e" artifactId="A6" />

      <p className="measure">Read the result back through one question per risk: <em>has anyone independently tested that these controls operate, or am I rating the design?</em> If the high effectiveness number rests on an untested control, it is a guess wearing a number, and the honest move is to lower the rating until the third line has confirmed it. Note also where you slid effectiveness high to get a residual “within tolerance” — those are precisely the lines to test hardest, because that is where an overstated control would be hiding a live risk. The standard to hold the map to:</p>

      <Rubric
        title="a strong control map"
        criteria={[
          { c: 'Inherent stated honestly', good: 'rated before controls, so the gap controls must close is visible' },
          { c: 'Layered by type', good: 'serious risks carry preventive + detective + corrective controls, not one control doing all the work' },
          { c: 'Operating, not just designed', good: 'effectiveness reflects whether controls are actually performed and tested — design alone scores low' },
          { c: 'Effectiveness defensible', good: 'each high rating is backed by assurance evidence, not optimism; the third line could confirm it' },
          { c: 'Residual compared to appetite', good: 'every residual is read against the 2a tolerance, and breaches are named for treatment' },
        ]}
        exemplar="Meridian R3 (contamination): inherent €720k with a fat tail; HACCP + supplier testing + line clearance + traceability, audited as operating; residual driven within the board’s averse safety appetite by tested controls, not by an assumed effectiveness number."
      />

      <p className="measure">A worked correction, because it is the most common and most dangerous mistake. A plant manager reports Meridian’s contamination control as “90% effective — we have full HACCP.” Apply the two-effectiveness test: HACCP is a strong <em>design</em>, but is every critical control point actually monitored on every shift, and has the third line confirmed it this year? If the line-clearance check is skipped under production pressure, the operating effectiveness is far below 90%, and rating it at 90% turns €720k of inherent expected loss into €72k of residual — a figure that says, falsely, that an averse-appetite risk is comfortably handled, so it leaves the worry list. The repair is to rate operating effectiveness from assurance evidence (drop it to, say, 55% until tested, giving €324k residual), keep R3 visibly above the averse line, and route it to treatment. The discipline of this lesson is refusing to let a documented control masquerade as a working one.</p>

      <ProblemSet items={[
        { q: 'A bank states it “has a control” for fraudulent payments: a four-eyes approval policy. An audit finds approvers routinely batch-approve dozens of payments in seconds without reviewing them. Diagnose this in design/operating terms, and say what the residual risk really is.', solution: 'The control is design-effective (four-eyes approval is a sound preventive control with segregation of duties) but operating-ineffective — rubber-stamped approval is not approval, so the control is performed in form but not in substance. The true operating effectiveness is near zero, so residual ≈ inherent: the risk is essentially uncontrolled despite a green status on the register. This is the quiet danger — an overstated control has hidden a live exposure. The fix is to enforce and test actual review (e.g. mandatory hold time, sampling by the second line, audit re-performance by the third) before crediting any effectiveness.' },
        { q: 'Meridian’s CISO proposes adding three more cyber controls on top of the existing email filter, MFA, monitoring, and backups for R2, all aimed at the same phishing entry point. Is more always better here? What two questions decide it?', solution: 'Not always. First, the over-control question: do the added controls remove more expected loss than they cost in money, friction, and slowed operations? R2’s residual is already modest after the existing layers, so extra controls on the same risk may cost more than the risk they remove. Second, the independence question: do the new controls fail for the same reason as the existing ones (e.g. all depend on one security team, one configuration, or one alert-handling culture)? Correlated controls do not multiply protection — the product rule for defence in depth only holds when layers are independent. Better risk reduction usually comes from a genuinely different layer (a corrective backup independent of the preventive layer) than from a fourth control guarding the same door.' },
      ]} />

      <p className="measure">Controls hold a risk within appetite only when they are honestly rated and actually tested — and even then, some residuals stay above the line. Those are not failures of control; they are decisions waiting to be made: reduce further, transfer the financial consequence, accept it deliberately, or stop the activity. That is the next lesson — treating and financing risk, where the residuals this map surfaced become explicit choices.</p>
    </LessonShell>
  );
}
