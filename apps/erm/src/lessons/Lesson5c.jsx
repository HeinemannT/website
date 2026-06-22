import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { BoardDashboard } from '../tools/BoardDashboard.jsx';

const lesson = getLesson('5c');

const pathway = [
  { kind: 'read', t: 'COSO ERM framework — the summary', src: 'NC State ERM Initiative (erm.ncsu.edu)', href: 'https://erm.ncsu.edu/resource-center/cosos-erm-framework/', min: 12, tier: 'core', why: 'The free named summary of COSO ERM 2017 — its five components and the strategy-integration argument.' },
  { kind: 'read', t: 'A risk practitioner’s guide to the COSO ERM frameworks', src: 'IRM (free PDF, compares 2004 vs 2017)', href: 'https://www.theirm.org/media/6885/irm-report-review-of-the-coso-erm-frameworks-v2.pdf', min: 20, tier: 'core', why: 'Why 2017 moved risk into strategy-setting — and what changed from the 2004 cube.' },
  { kind: 'do', t: 'Assemble your organization’s board one-pager', src: 'the dashboard in this lesson → Artifact A14', tier: 'apply', why: 'Turn everything built so far into one page a board could actually decide from.' },
  { kind: 'book', t: 'Enterprise Risk Management — Corporate Governance & Portfolio Management', src: 'James Lam, 2nd ed. (Wiley, 2014)', tier: 'deeper' },
];

const retrieval = [
  { q: 'A board risk report earns its place when it is…', options: [
    { text: 'a decision aid on roughly one page: largest exposures, what’s moving, the capital behind it, where we’re thin, and whether we’re still inside appetite.', correct: true },
    { text: 'every risk in the register, in full detail, with all controls listed.' },
    { text: 'a backward-looking record of last quarter’s incidents.' }] },
  { q: 'COSO ERM 2017’s central argument for integrating risk with strategy is that…', options: [
    { text: 'the biggest risk is choosing the wrong strategy, and you can only influence that before the ink dries — so risk belongs inside strategy-and-objective-setting.', correct: true },
    { text: 'risk and strategy should be kept in separate meetings so each gets full attention.' },
    { text: 'the risk function should set the strategy.' }] },
  { q: 'Judging a strategic option on a risk-adjusted basis (RAROC-style) can flip the ranking because…', options: [
    { text: 'a high-return option that consumes huge capital or concentrates exposure can earn less per unit of risk than a steadier one.', correct: true },
    { text: 'risk-adjusting always favours the highest-return option.' },
    { text: 'it removes the need for a board judgment about appetite.' }] },
];

export default function Lesson5c() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>A board gives all of enterprise risk roughly forty minutes a meeting. The whole craft of this lesson is compressing everything you have built — register, KRIs, capital model, maturity score — onto the one page that answers the only question a board can act on: “are we still inside the appetite we set, and what is moving against us?”</Lead>

      <p className="measure">Two things separate a risk function that matters from one that doesn’t, and neither is analytical skill. First, it <em>reports to the board in a form the board can use</em> — not a hundred-page appendix that proves the team was thorough, but a one-page answer to a handful of decisions. Second, and harder, it is <em>present when strategy is set</em>, not wheeled in afterwards to rubber-stamp a choice already made. These are the two failure points where competent risk work dies quietly: the analysis is sound but never reaches the decider, or it reaches them too late to change anything. This lesson is the last mile — turning accumulated analysis into governance.</p>

      <p className="measure">Work the topic in this order: the NC State summary for COSO ERM 2017’s strategy-integration argument, the IRM guide for what changed from the 2004 cube, and the dashboard build at the end where you assemble the one-pager itself.</p>

      <Pathway lessonId="5c" items={pathway} />

      <Objectives items={[
        'Write a board risk report as a decision aid — largest exposures, movement, capital, gaps, and position against appetite — on roughly one page.',
        'Explain the board’s role (owns appetite, holds management accountable) and the risk committee’s, and set a reporting cadence with escalation.',
        'State COSO ERM 2017’s argument for integrating risk into strategy-and-objective-setting, not bolting it on afterwards.',
        'Rank strategic options on a risk-adjusted (RAROC-style) basis and assemble your organization’s board dashboard (Artifact A14).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="The one page that earns the seat" />
      <p className="measure">A board governs; it does not manage. Per COSO ERM 2017 and standard governance practice, the board <em>owns the risk appetite</em> and <em>holds management accountable</em> for staying inside it — it does not run controls or work the register. Most boards delegate the detailed oversight to a <strong>risk committee</strong> (at Meridian, three non-executives) that reviews the framework between full-board meetings; the CRO reports into it. That structure dictates what a board report is <em>for</em>: not to inform the board of everything, but to let it discharge two duties — confirm the firm is operating inside the appetite it set, and challenge management where it isn’t. A report that doesn’t serve those two acts is a data dump, however accurate.</p>

      <p className="measure">So a board risk report is a <strong>decision aid</strong>, and a good one answers five questions cleanly. <em>Where is our largest exposure?</em> — the few risks that could actually hurt, by expected loss or severity, not all of them. <em>What is moving against us?</em> — the KRIs and trends, because a risk drifting toward its limit is more governable than one already there. <em>How much capital or buffer stands behind it?</em> — the modelled number from Part 4, so size is concrete, not adjectival. <em>Where are we strong and where thin?</em> — the maturity read, so the board knows which numbers to trust. And, the load-bearing one, <em>are we still inside the appetite the board itself set?</em> Everything else is supporting detail; this is the question only the board can answer and only a report framed against appetite lets it ask.</p>

      <p className="measure">The constraint that makes this hard is time. A board has perhaps forty minutes for all of ERM across a packed agenda, so the report must fit on roughly <em>one page</em> — the discipline of selection, not compression. NC State’s ERM Initiative summary of COSO ERM 2017 puts reporting under its fifth component (Information, Communication & Reporting) and stresses <em>clarity and usefulness</em> over comprehensiveness: a board needs decision-relevant summaries against appetite, with drill-down available on request, not the register. The skill being taught is ruthless prioritisation — which three exposures, which two moving indicators, which single appetite breach — because a page that says everything says nothing a board can act on in the time it has.</p>

      <p className="measure">Crucially, none of this is new work. <strong>Everything built so far feeds the report.</strong> The register (Part 1) supplies the exposures; the KRIs (lesson 2g) supply the movement; the Monte Carlo and capital/loss machinery (Part 4) supplies the buffer; the maturity self-assessment (lesson 5b) supplies the candour about how far to trust the rest. Reporting is not a separate skill bolted on at the end — it is the assembly of everything into the language of decisions. The value was created upstream; this lesson speaks it in the board’s tongue.</p>

      <p className="measure"><strong>Meridian worked example.</strong> Assemble Meridian’s board one-pager from the artifacts already built. <em>Top exposures</em>, ranked by expected loss and severity: R4 (top retailer, 18% of revenue, drops the contract — €40m impact, the single largest severity) and R11 (downturn breaches the RCF covenant — €25m, and the one that ends the firm’s independence) lead, with R3 (contamination/recall — €18m, and explicitly an <em>averse</em> appetite line) close behind. <em>What is moving against us:</em> two amber KRIs — FX hedge coverage has fallen 80→60% (amber at 70, red at 50) and days of cash on hand has slid 48→35 (amber at 40, red at 25); both feed the financial risks above. <em>Capital behind it:</em> the modelled annual-loss distribution from Part 4 against €60m of cash and a €150m facility. <em>Maturity:</em> the 5b score, which tells the board how settled these numbers are. <em>Inside appetite?</em> — the financial appetite line allows at most a 1-in-20 covenant-breach chance, and the cash/FX drift is the early signal that this line is under pressure. That is the page: three exposures, two ambers, one capital figure, one maturity level, one appetite verdict.</p>

      <DoNow>Before the build, read the NC State COSO ERM summary (pathway step 1, ~12 min) for the five components and where reporting and strategy-setting sit — the structure you’ll reproduce on one page for your own organization.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Judge strategy risk-adjusted, not risk-blind" />
      <p className="measure">COSO ERM 2017’s central argument is that risk belongs <em>inside</em> strategy-and-objective-setting, because the biggest risk an organization runs is choosing the wrong strategy — and you can only influence that choice <em>before the ink dries</em>. The 2017 framework (revised from the 2004 cube precisely to make this point) names two strategy risks the old overlay view missed: the risk that the chosen strategy doesn’t align with mission, and the risk in the strategy itself. The contrast is sharp: risk wheeled in <em>after</em> a strategy is set can only flag problems with a decision already made; risk present <em>when</em> it is set can change the decision. Integration is a question of timing as much as analysis.</p>

      <p className="measure">The quantitative edge that integration gives a board is judging opportunities on a <strong>risk-adjusted</strong> basis — the RAROC logic from Part 4 lifted to the strategic level. Raw expected return ranks options by reward alone; a risk-adjusted measure divides that return by the capital or risk the option consumes, so a high-return strategy that devours capital or concentrates exposure can rank <em>below</em> a steadier one. This is not new maths — it is bringing the capital and loss numbers you already have into the strategy conversation, so the board chooses with risk in view. The point to internalise is that the ranking can <em>flip</em> when you divide by risk: the apparently best option on return is often not the best on return-per-unit-of-capital.</p>

      <MathBlock title="Return per unit of risk — why the ranking flips">
        <p>Risk-adjusted return on capital compares strategic options on reward <em>per unit of capital consumed</em>, not raw reward:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">RAROC = (expected return − expected loss) ⁄ risk capital</span>.</p>
        <p>Two Meridian options. <strong>Aggressive emerging-market expansion:</strong> expected return €18m, but it concentrates exposure (FX, single-country, agent-conduct risk per R8) and the model assigns it €60m of risk capital → RAROC ≈ 30%. <strong>Premiumisation of the core European range:</strong> expected return €11m on €25m of risk capital → RAROC ≈ 44%. On raw return the expansion wins (€18m &gt; €11m); risk-adjusted, the steadier option wins. The board still chooses — but it now chooses against the <em>appetite</em> it set (hungry on strategy, cautious on finance), not against return alone. Choosing the percentile of comfort, and the weight on concentration, remains a board value judgment, which is exactly why it belongs in the strategy room.</p>
      </MathBlock>

      <p className="measure">Cadence and escalation are the last quantitative discipline of reporting. A fixed quarterly pack is wrong for fast-moving risks: cadence should match risk <em>velocity</em>, and pre-agreed KRI thresholds (amber/red) should escalate <em>between</em> meetings so the board hears about a risk as it emerges, not months later — the lag-time trap COSO’s reporting guidance warns against. At Meridian, the covenant and cash KRIs hitting amber are exactly the trigger that should reach the risk committee before the next scheduled board date rather than waiting for it.</p>

      <Stage n={3} kicker="Build it — your organization" title="Assemble the board view" />
      <p className="measure">Now assemble the one-page board view for your own organization. The dashboard pulls together what you have already built — top exposures, KRI status with trend, the modelled capital, the maturity level — into the page a board would actually see, and lets you frame a strategic option against appetite. Notice how little new work it takes: the value was created upstream; this just speaks it in the board’s language. Saved as Artifact A14.</p>

      <BoardDashboard lessonId="5c" artifactId="A14" />

      <p className="measure">Read your dashboard back through the board’s own test: <em>could a non-executive with forty minutes confirm we are inside appetite and name the one thing to challenge management on?</em> If the page is a list of every risk, it fails — it informs without enabling a decision. If it leads with the three exposures that matter, the two indicators moving, the capital behind them, and a clear inside/outside-appetite verdict, it earns the seat. The standard to hold it to:</p>

      <Rubric
        title="a board risk report that earns its seat"
        criteria={[
          { c: 'Decision aid, not data dump', good: 'roughly one page; leads with the few exposures that matter, not the whole register' },
          { c: 'Framed against appetite', good: 'states plainly whether the firm is inside the appetite the board set, per category' },
          { c: 'Shows movement', good: 'KRIs with trend and RAG status — what is getting worse, not just current levels' },
          { c: 'Capital made concrete', good: 'a modelled buffer/capital figure behind the top exposures, not adjectives' },
          { c: 'Strategy-integrated & risk-adjusted', good: 'supports a strategic choice on a risk-adjusted basis, available when strategy is set' },
        ]}
        exemplar="Meridian: top exposures R4 (€40m), R11 (€25m), R3 (€18m, averse line); ambers on FX coverage (60%) and days-cash (35); modelled annual loss vs €60m cash + €150m facility; maturity level stated; verdict — covenant appetite (≤1-in-20) under pressure, escalate. Expansion vs premiumisation ranked on RAROC against appetite, before the decision."
      />

      <p className="measure">A worked correction, because this is the most common board-reporting mistake. A CRO presents a forty-slide deck: every one of the fourteen register risks, each control, last quarter’s incident log. The board, with forty minutes, skims it and approves — having governed nothing, because the deck never told them whether the firm was inside appetite or what was moving. Apply the discipline: cut to the three exposures that could actually hurt (R4, R11, R3), the two KRIs trending amber (FX coverage, days-cash), one capital figure, one appetite verdict, and one strategic decision framed risk-adjusted. The drill-down stays available on request. Now the board can do the only two things it is there to do — confirm appetite and challenge management — in the time it has. That cut, from comprehensive to decision-useful, is the entire craft of this lesson.</p>

      <ProblemSet items={[
        { q: 'Meridian’s board is offered two growth strategies: aggressive emerging-market expansion (expected return €18m) and core-range premiumisation (expected return €11m). On raw return the board would pick expansion. Why might the dashboard recommend the opposite, and how does appetite enter?', solution: 'On a risk-adjusted basis the ranking flips. Expansion consumes far more risk capital and concentrates exposure (FX, single-country, agent-conduct per R8) — RAROC ≈ 30% on €60m of capital — while premiumisation earns less but on far less risk — RAROC ≈ 44% on €25m. Per-unit-of-capital, premiumisation is the better use of the firm’s risk-taking. Appetite then arbitrates: Meridian is *hungry* on strategy but *cautious* on finance with a ≤1-in-20 covenant-breach tolerance, so the board must weigh the expansion’s concentration against the covenant pressure already showing in the amber cash/FX KRIs. The dashboard’s job is to put return, risk-adjusted return, and appetite in the room *when the choice is made* — not to make the choice, but to stop it being made on return alone.' },
        { q: 'A risk function complains that the board “ignores our work — they only see it after decisions are made.” Diagnose the failure in COSO ERM 2017 terms, and name the fix.', solution: 'This is the integration failure COSO ERM 2017 was revised to address: risk is being treated as an overlay reviewed *after* strategy is set, when its whole premise is that risk belongs inside strategy-and-objective-setting because the biggest risk is choosing the wrong strategy — influenceable only before the ink dries. The fix is structural, not cosmetic: get the risk view (risk-adjusted option ranking, appetite position) into the strategy-setting meeting itself, and set a reporting cadence with escalation so material movements reach the board/risk committee between cycles rather than after the fact. A better deck does not fix a function present at the wrong moment.' },
      ]} />

      <p className="measure">This is the last operating discipline before the capstone. Everything built across the course converges here: the appetite of Part 2 gives the yardstick, the register and KRIs give the exposures and their movement, Part 4 gives the capital, and the maturity model gives the candour to say how far the numbers can be trusted. The board report is where they become governance. What remains is to interrogate the judgment behind all of it — the biases and model blind spots that can make even a clean one-pager confidently wrong — which is the next lesson.</p>
    </LessonShell>
  );
}
