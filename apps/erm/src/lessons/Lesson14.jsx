import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { GovernanceDesigner } from '../tools/GovernanceDesigner.jsx';

const lesson = getLesson('1.4');

const pathway = [
  { kind: 'watch', t: 'Who owns risk — first, second, third line', src: 'short practitioner explainer', min: 6, tier: 'warmup', why: 'Get the three-line shape before the role detail.' },
  { kind: 'read', t: 'The Three Lines Model — the position paper', src: 'IIA (2020)', href: 'https://www.theiia.org/en/content/position-papers/2020/the-iias-three-lines-model-an-update-of-the-three-lines-of-defense/', min: 18, tier: 'core', why: 'The authoritative source: six principles, the governing body on top, external assurance outside.' },
  { kind: 'read', t: 'The role of the CRO and the board', src: 'NC State ERM Initiative', href: 'https://erm.ncsu.edu/resource-center/cosos-erm-framework/', min: 12, tier: 'core', why: 'How the CRO mandate and reporting lines work in practice.' },
  { kind: 'do', t: 'Design your organization’s three lines', src: 'the designer in this lesson → Artifact A1', tier: 'apply', why: 'Assign real activities to lines and let the tool flag the independence breaches.' },
  { kind: 'book', t: 'Enterprise Risk Management — the CRO and risk-function chapters', src: 'James Lam', tier: 'deeper' },
];

const retrieval = [
  { q: 'In the three lines model, who owns and manages risk?', options: [
    { text: 'The first line — operational management, in the course of doing the work that creates the risk.', correct: true },
    { text: 'The third line — internal audit.' },
    { text: 'The board’s risk committee.' }] },
  { q: 'Why is the third line’s assurance worth listening to?', options: [
    { text: 'Its independence — it has no stake in making the controls look good because it neither owns nor runs them.', correct: true },
    { text: 'It does the most detailed operational work.' },
    { text: 'It sets the risk appetite.' }] },
  { q: 'A third line that helped design the controls it now audits has…', options: [
    { text: 'destroyed its own independence — it is effectively assuring its own work.', correct: true },
    { text: 'become more efficient, which is the goal.' },
    { text: 'moved into the first line, which is correct.' }] },
];

export default function Lesson14() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>“Who owns this risk?” If the honest answer is “the risk team,” the governance has already failed — because the risk team is the one group that structurally cannot own it.</Lead>

      <p className="measure">Risk is owned by the people who run the business and make the decisions that create it. The head of operations owns plant-outage risk because she decides how the plant is run; the treasurer owns liquidity risk because he decides how the firm is funded; the board owns the appetite for all of it because it sets the strategy. The risk function’s job is to help those people see and manage their risk well — to set the method, advise, and challenge — not to take it onto its own books. The moment a risk register becomes “the risk team’s problem,” the people who are actually taking the risk stop feeling responsible for it, and the register turns into theatre maintained by people who can’t change the exposures it lists. Everything in this lesson is machinery for keeping ownership where the decisions are.</p>

      <p className="measure">Here is how to work through the topic — the video for the three-line shape, then the IIA position paper (the authoritative source) and the NC State material on the CRO and board, then the build at the end.</p>

      <Pathway lessonId="1.4" items={pathway} />

      <Objectives items={[
        'Lay out the IIA Three Lines Model and say precisely what each line does — own, oversee, assure — and what the governing body and external assurance do.',
        'Explain why the third line’s independence is the entire source of its value, and name the failure modes that destroy it.',
        'Describe the board, the risk committee, and the CRO role — mandate, reporting lines, and why a seat at the strategy table matters.',
        'Design a three-lines governance structure for your own organization, including a delegation-of-authority hierarchy (Artifact A1, your charter).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Three lines, one place ownership lives" />
      <p className="measure">The cleanest map of who does what is the IIA’s <strong>Three Lines Model</strong>. Learn its three roles and you can diagnose almost any broken risk function. The <strong>first line</strong> is operational management — the people who own and manage risk in the course of delivering products and services. They run the controls because the controls are part of doing the work properly; the risk is theirs because the decisions that create it are theirs. The <strong>second line</strong> is the risk, compliance, and quality functions: they set policy and methodology, advise, monitor, and crucially <em>challenge</em> the first line’s assessments — but they do not own the risks they oversee. The <strong>third line</strong> is internal audit, which gives the governing body <em>independent</em> assurance that the first two lines are actually working. On top sits the <strong>governing body</strong> (the board), accountable to stakeholders, which sets direction and risk appetite and delegates the rest. Outside all of it sit <strong>external auditors and regulators</strong> — assurance providers who are not part of management at all.</p>

      <p className="measure">The 2020 version is a deliberate update of the older “Three Lines of Defence,” and the changes are not cosmetic. It dropped the words “of defence” because the defensive metaphor framed risk work as purely about stopping bad things, when the same structure also exists to seize opportunity and create value — the same value-creation framing ISO 31000 and COSO use. It softened the rigid “lines = silos = policing” picture into <em>roles</em>: one person in a small firm can wear several first- and second-line hats, and the lines collaborate rather than guard fixed borders. What it did <em>not</em> soften is the one hard rule that makes the model worth anything: the third line stays independent of the first two.</p>

      <p className="measure">That word, <strong>independent</strong>, is the source of the third line’s entire value. Internal audit is worth listening to precisely because it has no stake in making the controls look good — it neither owns the risks nor runs the controls, so it can tell the board the uncomfortable truth without grading its own homework. This is why the third line reports to the governing body, not to the management it audits: its line of accountability has to bypass the people whose work it judges. Three failure modes destroy this and recur in real blow-ups. <em>First</em>, the second line quietly starts “owning” risks — the register lists the CRO as owner of cyber risk, so the CISO and the business stop feeling accountable, and the advice-and-challenge role collapses into a fake ownership that controls nothing. <em>Second</em>, the third line loses its independence by helping design the very controls it later audits, so it is assuring its own work and will never flag its own design as weak. <em>Third</em>, there is no senior risk voice in the room where decisions are made — the second line exists on the org chart but is not present when the bet is taken, so its challenge arrives, if at all, after the loss.</p>

      <p className="measure">Two structures hold the top of the model together. The <strong>board’s risk committee</strong> (commonly a few non-executive directors) is where oversight actually happens between full board meetings: it owns the appetite on the board’s behalf, reviews the risk profile against it, and — critically — is the body the third line reports to, which is what keeps internal audit independent of management. The <strong>Chief Risk Officer</strong> leads the second line. The CRO’s mandate is to set the risk methodology, aggregate the enterprise risk picture the siloed business units cannot see on their own, facilitate the appetite discussion, and challenge the business — but explicitly <em>not</em> to own individual risks. Reporting lines are the tell: a CRO who reports only to the CFO can be overruled by the person whose numbers she might have to challenge, so the strong pattern is a <em>dual</em> line — administratively to the CFO or CEO, but with a direct, independent line to the board or risk committee so the CRO can escalate past management when she has to. And the CRO needs a seat at the strategy table for the same reason the third failure mode above is fatal: if the risk voice is briefed after the strategy is set, it can only audit decisions, never shape them. Regulation has hard-wired much of this — Sarbanes-Oxley forced formal accountability and independent audit on US listed firms after Enron, and Solvency II’s <strong>ORSA</strong> (Own Risk and Solvency Assessment) requires European insurers to run and document a board-owned risk-and-capital process — so for many organizations a formal governance structure is not optional, it is the law.</p>

      <p className="measure">Watch the model land on the case you carry through the course. <strong>Meridian Industries</strong> is a listed mid-cap consumer-goods maker — three plants, fourteen countries, a treasury that hedges currency and funds the firm. Its <em>first line</em> is the plant and commercial management who run operations and own the risks they create: the COO owns the plant-outage and flood risks, the treasurer owns liquidity and FX. Its <em>second line</em> bundles risk, compliance, quality, and treasury policy — they set the rules, monitor, and challenge, but the COO still owns the outage. Its <em>third line</em> is a small internal audit function giving the board independent assurance; the external auditor and the food-safety regulators sit outside. A <strong>Risk Committee</strong> of three non-executives oversees the framework and is where internal audit reports. The <strong>CRO</strong> leads the second line and reports to the CFO with a <em>dotted line</em> to the Risk Committee — exactly the dual structure that lets her escalate past the CFO if a financing decision would breach appetite. And here is the one place it could fail: because the CRO sits under the CFO, in a quarter where hitting the leverage covenant gets tense, a CFO under earnings pressure could lean on her to soften a risk report — which is precisely what the dotted line to the committee exists to defend against, and precisely the thing a board that never tests that dotted line will discover too late.</p>

      <DoNow>Before the build, read the IIA position paper (pathway step 2, ~18 min) for the six principles and the picture of the governing body on top and external assurance outside — the structure you’ll reproduce for your own organization.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Mostly structure — except where appetite cascades into limits" />
      <p className="measure">Be honest about this: governance is structural and qualitative, not arithmetic, and that is the through-line of Part 1. What risk is, how the business creates value, which framework you use, who owns what — these are organizing judgments, not calculations. They are also where most real failures begin: spectacular blow-ups rarely trace to a miscalculated number; they trace to unclear ownership, a second line that was silenced, a third line that wasn’t independent, a board that didn’t want to hear it. The Part 4 maths sits on top of this scaffolding, and the cleverest model cannot survive weak foundations beneath it.</p>

      <p className="measure">The one place governance does become near-quantitative is the <strong>delegation of authority</strong> — the limit hierarchy that decides who can approve what. This is the structural face of risk appetite (lesson 2a): the board’s qualitative posture cascades downward into a chain of numeric approval thresholds. A frontline manager may commit up to €X; above that it needs the division head; above that the CFO; above that the full board. The thresholds are where appetite stops being a slogan and becomes who-can-say-yes — a treasurer authorised to hedge up to a notional limit, a plant manager authorised to approve capital spend up to a cap, a credit committee required for any single customer exposure above a line. The “maths” here is just the hierarchy of numbers itself: pick the level of authority each decision requires, and the limit at each level is the operational expression of how much risk the board is willing to delegate before it wants to be asked.</p>

      <MathBlock>
        <p>A delegation hierarchy is appetite turned into approval authority. For a decision committing amount <span className="eq">A</span>, the required approver is the lowest level whose limit clears it:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">approver(A) = min level L such that A ≤ limit_L</span>,&nbsp; with&nbsp; <span className="eq">limit_frontline &lt; limit_division &lt; limit_CFO &lt; limit_board</span>.</p>
        <p>So the same appetite that lesson 2a expressed as a probability (“≤ 1-in-20 covenant breach”) reappears here as a ladder of euro thresholds: where the board sets <span className="eq">limit_board</span> low, it is choosing to be asked about smaller bets — keeping more risk under its own eye. The numbers are the only quantitative thing in the lesson; everything above them is structure.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Design your governance — and finish the charter" />
      <p className="measure">Now build the three lines for your own organization. Decide whether it has a risk committee, a CRO, and an internal audit function, then assign each real activity to a line: operations and risk ownership to the first, policy-setting and challenge to the second, independent assurance to the third. The tool flags assignments that break the model — especially the second line “owning” a risk, or any gap where no one provides independent assurance. Assign a named owner to each, and sketch the delegation thresholds that say who can approve what.</p>

      <GovernanceDesigner lessonId="1.4" artifactId="A1-governance" />

      <p className="measure">Read your design back through the one question that exposes weak governance: <em>for every key risk, is the owner someone who actually makes the decisions that create it — and is the assurance coming from someone with nothing to gain from it looking fine?</em> If the owner is the risk function, ownership has leaked into the second line; if the assurer helped build the controls, independence is gone. With this saved, the four pieces you’ve built across Part 1 — your risk statements, value map, framework choice, and governance — together form your <strong>risk management charter</strong>, the first complete artifact in your operating model. The standard to hold the governance design to:</p>

      <Rubric
        title="a sound governance design"
        criteria={[
          { c: 'Ownership in the first line', good: 'every key risk is owned by the operational manager whose decisions create it, never by the risk function' },
          { c: 'Second line oversees, doesn’t own', good: 'risk/compliance/quality set policy, monitor, and challenge — and own no risks themselves' },
          { c: 'Independent third line', good: 'internal audit reports to the board/committee and never audits controls it helped design' },
          { c: 'A senior risk voice with reach', good: 'a CRO (or named equivalent) with a direct line to the board and a seat where decisions are made' },
          { c: 'Delegated authority that cascades appetite', good: 'limit thresholds that say who can approve what, tracing back to the board’s appetite' },
        ]}
        exemplar="Meridian: plant/commercial own (1st); risk + compliance + quality + treasury policy oversee & challenge (2nd); small internal audit assures, reporting to the Risk Committee (3rd); CRO reports to CFO with a dotted line to the committee; external auditor + food-safety regulator outside."
      />

      <p className="measure">A worked correction, because this is the most common mistake. A draft register lists the CRO as the owner of Meridian’s cyber risk (R2) “because she understands it best.” That destroys the model: the CRO is second line, so naming her owner means the CISO and IT — the people who actually run the systems and decide the controls — no longer feel accountable, and the CRO is left owning a risk she has no operational power to change. The repair applies the lines: the <em>CISO owns</em> R2 (first line, runs the controls), the <em>CRO’s function advises and challenges</em> the cyber programme and reports the residual exposure (second line), and <em>internal audit assures</em> the board that the programme works (third line) — provided it didn’t design that programme. Now expertise still informs the risk without ownership leaking out of the business. That separation — owner runs it, second line challenges it, independent third line assures it — is the entire craft of this lesson.</p>

      <ProblemSet items={[
        { q: 'Your organization has no CRO and no internal audit function. Which roles still *must* be performed, and by whom?', solution: 'The roles are mandatory even when the titles are absent. Risk ownership stays with operational management (first line) — that never disappears. The second-line work (setting policy, monitoring, challenging) must be assigned to someone — often the CFO or a finance/compliance lead wearing a clear second-line hat. The third-line independent assurance is the hard one: a small org may buy it in (external auditor, an outside review) or have it given by a board committee that is independent of management — but it cannot simply be dropped, because without independent assurance no one is checking that the first two lines actually work. The lesson: assign the roles, even if one person wears several first/second-line hats; only the third line’s independence is non-negotiable.' },
        { q: 'Meridian’s CRO reports to the CFO. In a quarter where the leverage covenant is tightening, what is the specific governance risk, and what control is supposed to contain it?', solution: 'The risk is that the CFO — under pressure to protect EBITDA and covenant headroom — leans on the CRO (who reports to him) to soften or delay a risk report that would alarm the board, since he controls her position and pay. A CRO with only a solid line to the CFO has no defence. The control is the *dotted line to the Risk Committee*: a direct, independent reporting channel that lets the CRO escalate past the CFO to the non-executives, so she can raise the uncomfortable thing without going through the person it implicates. But the control only works if the committee actually uses it — meets the CRO without management present, and would notice if her reports went quiet. A dotted line nobody ever pulls is decoration.' },
      ]} />

      <p className="measure">Governance decides whether everything else in the course survives contact with pressure: a flawless risk assessment is worthless if its owner can be leaned on into silence, or its assurance can be captured. With ownership placed, appetite owned by the board, and an independent line to escalate, the discipline now has a structure to run inside. The next part turns to making that structure bite — starting with the appetite the board owns and how it cascades into the limits people actually work within.</p>
    </LessonShell>
  );
}
