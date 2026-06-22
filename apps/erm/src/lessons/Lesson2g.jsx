import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { KRIDashboard } from '../tools/KRIDashboard.jsx';

const lesson = getLesson('2g');

const pathway = [
  { kind: 'read', t: 'Developing Key Risk Indicators to Strengthen ERM', src: 'Beasley, Branson & Hancock — COSO / NC State (2010)', href: 'https://erm.ncsu.edu/resource-center/developing-kri-coso/', min: 18, tier: 'core', why: 'The canonical free account of what a KRI is, how it differs from a KPI, and how to design leading ones.' },
  { kind: 'read', t: 'The Orange Book — monitoring & reporting', src: 'HM Treasury (2023)', href: 'https://assets.publishing.service.gov.uk/media/6453acadc33b460012f5e6b8/HMT_Orange_Book_May_2023.pdf', min: 12, tier: 'core', why: 'The official view of monitoring as the loop that keeps a register alive, plus what board reporting is for.' },
  { kind: 'do', t: 'Build your KRI dashboard and board summary', src: 'the builder in this lesson → Artifact A8', tier: 'apply', why: 'Turn your tolerances into thresholds and draft the report that closes the Part 2 loop.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — monitoring & reporting', src: 'Hopkin & Thompson', tier: 'deeper' },
];

const retrieval = [
  { q: 'A KRI differs from a KPI in that it tracks…', options: [
    { text: 'exposure to a specific risk; a KPI tracks performance — though one metric can be read as both.', correct: true },
    { text: 'nothing — the two terms are interchangeable.' },
    { text: 'only financial results, where a KPI tracks everything else.' }] },
  { q: 'Why is a leading indicator worth more than a lagging one?', options: [
    { text: 'It moves before the loss arrives, leaving time to act; a lagging one only reports what already happened.', correct: true },
    { text: 'It is cheaper and easier to collect.' },
    { text: 'It is always more accurate.' }] },
  { q: 'An indicator sitting well inside its limit but rising every month for five months is…', options: [
    { text: 'often more alarming than one just over amber and falling — the trend is the warning the level misses.', correct: true },
    { text: 'safe, because it has not crossed amber yet.' },
    { text: 'irrelevant until it crosses red.' }] },
];

export default function Lesson2g() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>A risk register written last year is a photograph of a world that has already moved. The supplier you trusted got acquired; the control you rated effective began failing quietly. Monitoring is the discipline of looking again — and a key risk indicator is the instrument that does the looking.</Lead>

      <p className="measure">A register decays for two reasons, and both are mechanical, not careless. First, the world moves: probabilities and impacts you estimated in lesson 2d shift as customers concentrate, regulations grow teeth, and new exposures appear. Second, controls drift: a control rated effective in 2e degrades as people leave, systems change, and procedures quietly stop being followed. Either way, the residual risk you treated down to appetite in 2f does not stay there. Monitoring closes the loop that the rest of Part 2 opened — it is the explicit <em>monitoring &amp; review</em> step of the ISO 31000 process — by feeding current reality back against the appetite you set in 2a. Without it, ERM is an annual ritual that produces a document; with it, ERM is a living system that produces decisions.</p>

      <p className="measure">Here is how to work the topic — the COSO/NC State paper for what separates a KRI from a KPI and how to design a leading one, the Orange Book for monitoring-as-loop and what a board report is for, then the build that turns your tolerances into a watched dashboard.</p>

      <Pathway lessonId="2g" items={pathway} />

      <Objectives items={[
        'Explain why a register decays and how monitoring closes the ISO 31000 loop back to appetite.',
        'Distinguish a KRI from a KPI, and a leading indicator from a lagging one, and say why you want leading ones.',
        'Design a KRI against four criteria, and set amber/red thresholds that trace to the appetite→tolerance→limit→trigger cascade.',
        'Read a dashboard by trend, not just level, and draft a board report that aids a decision (Artifact A8).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Indicators that look forward" />
      <p className="measure">A <strong>key risk indicator</strong> is a metric that tracks your <em>exposure</em> to a specific risk. That one word is the line between a KRI and a <strong>KPI</strong>, which tracks <em>performance</em> — how the business is doing against an objective. The distinction is about which side you read the metric from, not about the metric itself: a single number can be both. On-time delivery is a KPI to operations (are we performing?) and a KRI to risk (is our exposure to a customer-loss event rising?). Days of cash on hand is a treasury KPI and a liquidity KRI at once. So the test is never "is this a KRI or a KPI" but "what risk does this number give me early sight of," and a metric that gives sight of no risk is a KPI masquerading as risk monitoring.</p>

      <p className="measure">The property that makes a KRI worth collecting is whether it is <strong>leading</strong> or <strong>lagging</strong>. A <em>leading</em> indicator moves <em>before</em> the loss does, so it buys you time to act: rising staff turnover leads operational failures (the people who hold the process leave before it breaks); a creeping phishing click-rate leads a data breach; growing concentration in one customer leads a revenue shock. A <em>lagging</em> indicator reports what already happened — last quarter's loss events, incidents recorded, fines paid. Lagging numbers are not useless; they calibrate your estimates and prove whether controls worked. But by the time a lagging indicator moves, the loss has occurred and your only choice is to clean up. You want a dashboard weighted toward leading indicators, because monitoring exists to let you intervene, and you can only intervene before. The hard part is that leading indicators are usually noisier and more arguable than lagging ones — which is precisely why their selection is a judgment, not a data-pull.</p>

      <p className="measure">Designing a good KRI means passing four criteria, and a metric that fails any one is a vanity metric. It must be (1) <strong>relevant</strong> — tied to a specific named risk in your register, not "general health"; (2) <strong>measurable</strong> — objective and repeatable, the same definition every period, so a move means a real change and not a change in who counted; (3) <strong>predictive</strong> — leading where possible, sitting upstream of the loss; and (4) <strong>actionable</strong> — when it moves, a named owner can do something specific. Actionability is the criterion teams forget: a number that rises and triggers nothing but a shrug is decoration. The discipline is to choose <em>few</em> indicators that each pass all four, against the standing temptation to build a wall of metrics that looks comprehensive and signals nothing. A dashboard of forty vanity numbers is worse than five real ones, because it buries the signal and breeds the habit of ignoring amber.</p>

      <p className="measure">Where do the thresholds come from? They are the bottom of the cascade you built in 2a. Recall the chain: <strong>appetite</strong> (the board's posture) → <strong>tolerance</strong> (acceptable variation around an objective) → <strong>limit</strong> (the hard delegated boundary) → <strong>trigger</strong> (the escalation point set inside the limit). A KRI threshold <em>is</em> the trigger layer — this is the lesson where appetite finally acquires teeth. <strong>Amber</strong> means "approaching the tolerance": act now, while there is still slack. <strong>Red</strong> means "at or past the limit": the boundary the board drew is breached and escalation is mandatory. Set this way, an amber light is not a vague worry; it is a specific statement that a frontline number has reached a point the board defined in advance. A threshold pulled from thin air ("looks reasonable") signals nothing, because nobody can say what crossing it means.</p>

      <p className="measure">Watch the whole chain run on Meridian. Its dashboard carries five indicators, each wired to a tolerance set in 2a. <strong>Overdue high-risk audit actions</strong> (5, 7, 9, 11, 12 over five quarters; amber 10, red 20) is a leading indicator of control decay — assurance findings that nobody is closing. <strong>Top-supplier concentration</strong> (28→34%; amber 30, red 45) is leading for the single-source resin risk R1; its amber traces straight to the operational-resilience appetite. <strong>Customer complaint rate per 100k units</strong> (4→8; amber 6, red 12) is a leading indicator of the food-safety risk R3 — complaints rise before a contamination event surfaces, which is why the <em>averse</em> safety appetite earns a tight amber. Two indicators are "<strong>lower is worse</strong>," so the logic inverts: <strong>days of cash on hand</strong> (48→35; amber 40, red 25) and <strong>FX hedge coverage</strong> (80→60%; amber 70, red 50). Hedge coverage is the literal trigger from 2a — the financial appetite said "hedge at least 70% of forecast exposure," so 70% is precisely where amber must sit, and Meridian's coverage has just fallen through it. The board sentence from lesson 2a ends here, as a colour on a treasurer's screen.</p>

      <DoNow>Before the build, read the COSO/NC State KRI paper (pathway step 1, ~18 min) for the four design criteria and the KRI-vs-KPI line — you will apply both to your own indicators in a few minutes.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Thresholds and the trend" />
      <p className="measure">The maths of monitoring is reading, not deriving, but it has two distinct moves and most dashboards do only the first. The first is the <strong>threshold test</strong>: compare the latest reading against amber and red. For a "higher is worse" indicator the status is red if the value is at or above red, amber if at or above amber, else green; for a "lower is worse" indicator (days of cash, hedge coverage) the comparisons flip — red when the value falls <em>to or below</em> red. Getting the direction right matters, because a tool that treats falling cash as "green because it's a small number" is worse than no tool. The second move is reading the <strong>trend</strong> — the rate of change across periods — and this is where judgment lives. A number sitting well inside its limit but climbing every month can be more alarming than a number just over amber and falling, because the level tells you where you are while the slope tells you where you will be. Meridian's complaint rate is the case in point: at 8 it is amber, not red, but it has risen every quarter from 4, so at that pace its trajectory crosses red in about four more quarters — the trend is the warning the threshold has not yet given.</p>

      <p className="measure">A second quantitative judgment hides in <em>where</em> you place amber: it is a sensitivity trade-off. Set amber close to red and you get warning only at the last moment, but few false alarms; set it far below red and you get early warning, but more amber lights that resolve into nothing. Too many false alarms breed alert fatigue, and a team that has learned to ignore amber will ignore the one that mattered. There is no formula for the right placement — it is the same board value judgment that chose the tolerance, pushed down one level. And one piece of arithmetic is simply forbidden: do not average the colours to report "overall risk = amber." Averaging ordinal RAG statuses is the same illegitimate ordinal arithmetic flagged in lesson 2d; a board report aggregates by <em>exception and worst case</em>, never by a mean.</p>

      <MathBlock>
        <p>An indicator's status is a piecewise rule on the latest value <span className="eq">x</span> against thresholds <span className="eq">a</span> (amber) and <span className="eq">r</span> (red). For a higher-is-worse indicator:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">status = red if x ≥ r ; amber if x ≥ a ; else green</span>.</p>
        <p>For a lower-is-worse indicator (days of cash, hedge coverage) the inequalities reverse: <span className="eq">red if x ≤ r ; amber if x ≤ a ; else green</span>. But the level is only half the read. Across periods <span className="eq">x₁…x_t</span> the slope <span className="eq">Δ = x_t − x_(t−1)</span> (and the run of same-sign Δ) projects when the line crosses: at constant slope, periods-to-red ≈ <span className="eq">(r − x_t) / Δ</span>. Meridian's complaint rate (4,4,6,7,8; amber 6, red 12) reads amber on level but Δ ≈ +1/quarter and rising — projected red in ~4 quarters. That is why a climbing green can outrank a falling amber: the threshold tells you the present, the slope tells you the future.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Build the dashboard, then write the report" />
      <p className="measure">Now build the monitoring layer for your own organization. For each top risk, define one or two indicators that pass the four criteria — relevant, measurable, predictive, actionable — and prefer leading ones. Enter a short history so the dashboard can draw the trend, then set amber and red by tracing each threshold back to a tolerance from your appetite statement: amber where you are approaching the line, red at it. The tool computes each status, draws the trend against the thresholds, and drafts a board summary; for every indicator, satisfy yourself that it is genuinely leading and that someone can act when it moves.</p>

      <KRIDashboard lessonId="2g" artifactId="A8" />

      <p className="measure">The drafted summary is a starting point, not the deliverable. A board report is a <em>decision aid, not a data dump</em>, and it must answer three questions a director actually has: <em>what is our biggest exposure right now</em> (the reds, named, with the loss they foreshadow); <em>what is moving</em> (the ambers and the climbing greens, by trend not just level); and <em>are we still inside appetite</em> (which thresholds trace to which tolerance, and where the line has been crossed). Anything that answers none of those three is noise, and cutting it makes the report more useful, not less. Hold the dashboard to this standard:</p>

      <Rubric
        title="a strong KRI dashboard and board report"
        criteria={[
          { c: 'Relevant', good: 'every indicator is tied to a specific named risk in the register, not a generic health metric' },
          { c: 'Leading where possible', good: 'indicators move before the loss; lagging ones are labelled as such and used to calibrate, not to warn' },
          { c: 'Thresholds trace to appetite', good: 'amber sits at "approaching the tolerance," red at the limit — each traceable to a 2a tolerance' },
          { c: 'Trend, not just level', good: 'the report flags climbing indicators still inside their limits, not only those over a line' },
          { c: 'A decision aid, not a dump', good: 'it answers biggest exposure / what is moving / inside appetite — and carries few indicators, not a vanity wall' },
        ]}
        exemplar="Meridian: FX hedge coverage (leading, lower-is-worse) amber at 70% = the 2a limit, now breached at 60%; complaint rate amber on level but climbing toward red on R3 (safety, averse); board summary leads with the breach, names what is drifting, states which tolerance each touches."
      />

      <p className="measure">A worked reading, because the common failure is reporting the wrong indicator as the worst. Meridian's dashboard shows <em>overdue audit actions</em> at 12 (amber, red 20) and <em>FX hedge coverage</em> at 60% (red 50, amber 70 — lower is worse). A level-only reader flags neither as urgent: 12 is comfortably below 20, and 60 is "above 50, so not red." Both readings are wrong. Hedge coverage has already fallen <em>through</em> its amber of 70 — the exact limit the board set in 2a — and is sliding toward red; it is the live appetite breach and leads the report. Overdue actions, though only amber, have risen every quarter (5→12) with no sign of slowing, so its trend earns a place in "what is moving" even though its level has not breached. The summary writes itself once you read direction alongside level: <em>"One indicator is below its appetite limit (FX hedge coverage, 60% vs 70% required) and falling — treasury to act this week. One is amber and climbing with no inflection (overdue audit actions) — assurance backlog to be cleared before next quarter."</em> That is a board report: an exposure, a movement, an appetite line, and an owner — not a wall of colour.</p>

      <ProblemSet items={[
        { q: 'A team proposes "number of risk workshops held this quarter" as a KRI for operational risk. Which design criteria does it fail, and what would a real indicator look like?', solution: 'It fails *relevant* and *predictive*: it measures process activity, not exposure to any specific risk, and holding more workshops does not move ahead of a loss — it is a vanity/effort metric, and arguably a weak KPI for the risk function itself. A real leading KRI for operational risk ties to a named risk and sits upstream of the loss: staff turnover in a critical team (leads key-person and process failure), unplanned downtime hours on a critical line, or overdue high-risk audit actions (leads control failure). Each is relevant, objectively measurable, predictive, and actionable — an owner can respond when it moves.' },
        { q: 'Meridian’s days-of-cash indicator reads 35 (amber 40, red 25, lower is worse) and its overdue-audit-actions indicator reads 12 (amber 10, red 20, higher is worse). Both are amber. Which deserves more board attention, and why is "both amber" the wrong way to report it?', solution: 'Read trend, not just colour. Days of cash has fallen 48→35 every quarter — a steady slide toward the red of 25, and because liquidity depends on banks staying friendly under the €150m facility, it foreshadows a covenant/funding problem; project the slope and it hits red in ~2–3 quarters. Overdue actions (5→12) is also climbing but sits further from its red of 20. So days-of-cash leads the report. "Both amber" is the wrong report because it averages two very different situations into one flat colour, hiding the trajectory that matters — exactly the ordinal-aggregation error from 2d. Report by exception and trend: name each, state its direction and the tolerance it touches, and rank by how soon it crosses the line.' },
      ]} />

      <p className="measure">With this, the operating system is complete: appetite → culture → identify → evaluate → control → treat → monitor, each step writing to one register for one organization, and the loop now closing back on itself as reality drifts against the lines you drew. Part 3 widens the lens — from governing one risk at a time to seeing the whole universe of them at once, where the danger is no longer a single indicator going red but many of them moving together.</p>
    </LessonShell>
  );
}
