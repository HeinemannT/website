import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { AppetiteBuilder } from '../tools/AppetiteBuilder.jsx';

const lesson = getLesson('2a');

const pathway = [
  { kind: 'watch', t: 'Risk appetite, explained', src: 'short practitioner explainer', min: 7, tier: 'warmup', why: 'Get the posture-vs-boundary idea before the detail.' },
  { kind: 'read', t: 'The Orange Book — the appetite section', src: 'HM Treasury (gov.uk)', href: 'https://www.gov.uk/government/publications/orange-book', min: 12, tier: 'core', why: 'How a board’s posture becomes working limits, from the official source.' },
  { kind: 'read', t: 'Principles for an Effective Risk Appetite Framework', src: 'Financial Stability Board (2013)', min: 20, tier: 'core', why: 'The post-2008 structure: appetite statement, limits, roles, monitoring.' },
  { kind: 'do', t: 'Draft your organization’s appetite statement', src: 'the builder in this lesson → Artifact A2', tier: 'apply', why: 'Turn the concepts into a statement that would change a decision.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — the appetite chapter', src: 'Hopkin & Thompson', tier: 'deeper' },
];

const retrieval = [
  { q: 'In the appetite hierarchy, what sits between a board’s qualitative appetite and a frontline KRI trigger?', options: [
    { text: 'Tolerances (acceptable variation around an objective) and then hard limits delegated to the business.', correct: true },
    { text: 'Nothing — appetite is applied directly by the board on each decision.' },
    { text: 'The risk register.' }] },
  { q: 'Risk profile differs from risk appetite in that the profile is…', options: [
    { text: 'the risk you’re actually running now; appetite is the risk you’ve chosen to be willing to run.', correct: true },
    { text: 'the same thing, measured twice.' },
    { text: 'always larger than appetite.' }] },
  { q: 'A risk profile sitting far *below* appetite is…', options: [
    { text: 'potentially a problem too — you may be leaving value on the table by under-taking risk.', correct: true },
    { text: 'always ideal — less risk is always better.' },
    { text: 'impossible by definition.' }] },
];

export default function Lesson2a() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>A bank sets a rule: no single borrower may exceed 5% of the loan book. That one sentence is risk appetite made operational — and tracing how it got from a boardroom value to a frontline limit is the whole subject of this lesson.</Lead>

      <p className="measure">COSO and ISO 31000 define risk appetite as <em>the amount and type of risk an organization is willing to pursue or retain in pursuit of its objectives</em>. The load-bearing word is <em>pursue</em>: appetite is not a cap on danger, it is a deliberate statement of how much uncertainty you will accept to create value. An organization with too little appetite fails as surely as one with too much — it just fails slowly, by ceding ground to competitors willing to act. So the board’s task is not to minimise risk; it is to choose a level and shape of risk on purpose, and then make that choice bite on real decisions made by people who will never be in the room.</p>

      <p className="measure">Here is how to work through the topic — the video for the shape of the idea, then two readings (the Orange Book for the public-sector treatment, the FSB’s framework for the structure banks use), and the build at the end.</p>

      <Pathway lessonId="2a" items={pathway} />

      <Objectives items={[
        'Trace the appetite → tolerance → limit → trigger hierarchy that turns a board posture into a frontline control.',
        'Distinguish risk appetite from risk profile, and explain why a profile below appetite can also be a failure.',
        'Choose appropriate appetite metrics for different risk categories.',
        'Draft an appetite statement for your own organization that would actually change a decision (Artifact A2).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="From boardroom value to frontline limit" />
      <p className="measure">The reason vague appetite statements are useless is that they stop at the top of a four-level hierarchy and never descend it. Learn the four levels and you can diagnose almost any broken appetite framework. <strong>Appetite</strong> is the board’s qualitative posture, set per risk category — “hungry for strategic risk, averse to safety risk.” <strong>Tolerance</strong> translates that posture into the acceptable variation around a specific objective — “we will accept earnings swinging by up to ±€20m a year, but no more.” <strong>Limits</strong> turn tolerance into hard, delegated boundaries the business operates within day to day — a Value-at-Risk limit on the trading desk, a maximum single-name credit exposure, a cap on net open FX position. And <strong>triggers</strong> (the key risk indicators of lesson 2g) are escalation points set <em>inside</em> the limit, so someone acts before the boundary is breached rather than after. Appetite that never becomes a limit is a slogan; a limit with no appetite behind it is an arbitrary number nobody can defend. The framework only works as the full chain.</p>

      <p className="measure">The second idea you need is the distinction between <strong>risk appetite</strong> and <strong>risk profile</strong>. Appetite is the risk you have <em>chosen</em> to be willing to run; profile is the risk you are <em>actually</em> running right now, as measured. Risk management, operationally, is the work of keeping the profile aligned with the appetite — and the gap cuts both ways. A profile above appetite means you’re over-exposed and must reduce, hedge, or transfer. But a profile sitting far <em>below</em> appetite is also a finding: you are under-using your licence to take risk, almost certainly leaving return on the table, and a board that only ever congratulates itself for low risk is quietly destroying value. This is why “we have a low appetite for risk” is not the safe answer it sounds like.</p>

      <p className="measure">Where does the metric come from? Match it to what the category actually threatens. For <em>capital/solvency</em>, appetite is usually a minimum capital ratio or a maximum probability of breaching it. For <em>earnings</em>, it is a ceiling on earnings volatility or “earnings-at-risk.” For <em>liquidity</em>, a minimum coverage ratio or days of cash. For <em>credit</em>, concentration limits by name, sector, and geography. For <em>operational</em> and <em>safety</em>, maximum tolerable downtime on critical processes and, typically, zero tolerance for serious safety or compliance breaches. The skill is choosing a metric that a manager can actually read off a report and act on — and after the 2008 crisis, regulators formalised all of this into the <strong>Risk Appetite Framework</strong> (the FSB’s 2013 principles): the appetite statement, the limits beneath it, the roles that own each, and the monitoring that connects them. That four-part structure is now the expected standard for any serious institution.</p>

      <p className="measure">Meet the organization you’ll carry through the course, and watch the hierarchy descend on a real case. <strong>Meridian Industries</strong> is a listed mid-cap consumer-goods maker — three plants, fourteen countries, a treasury that hedges currencies and funds the firm through a bank facility. Its single financial appetite line reads: “cautious — no more than a one-in-twenty chance of breaching our leverage covenant in any year.” Watch it cascade. That <em>appetite</em> implies a <em>tolerance</em>: the covenant (net debt / EBITDA below 3.0×) must hold even in a bad year, and today the ratio sits at 1.75×, so the tolerance is roughly “keep at least that much headroom.” The tolerance becomes <em>limits</em> delegated to the CFO and treasurer: a cap on net new debt, and a rule to hedge at least 70% of forecast FX exposure (because unhedged currency swings are one of the things that could push EBITDA down into covenant territory). And the limit gets a <em>trigger</em>: when FX hedge coverage drifts to 70%, an amber KRI fires and treasury must act — well before any covenant is at risk. One board sentence, four levels, ending in a number a treasurer checks on a Tuesday.</p>

      <p className="measure">Notice that the appetite genuinely <em>differs by category</em>, which is the mark of a board that has actually thought. Meridian is <em>hungry</em> on strategy (it wants margin from 10% to 13% and to double emerging-market sales, and says so to license bold bets), <em>cautious</em> on finance (the covenant line above), and <em>averse</em> on food safety (near-zero tolerance, any credible safety risk treated regardless of cost — a posture hardened by a €4m recall four years ago). That single averse line is why, three lessons from now, Meridian will <em>treat</em> its contamination risk rather than tolerate it: the appetite written here reaches forward and makes that decision in advance. A statement that said “low appetite” across the board would have done none of this work.</p>

      <DoNow>Before the build, skim the FSB framework (pathway step 3, ~20 min) for how appetite statement, limits, roles, and monitoring fit together — the structure you’ll reproduce in miniature for your own organization.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="A tolerance is a line on a distribution" />
      <p className="measure">A quantified tolerance is more precise than it first looks: it is a statement about the <em>distribution</em> of an outcome, not a single forecast. “At most a one-in-twenty chance of breaching the covenant” means that across all the ways next year could plausibly unfold, the worst 5% must still keep net debt / EBITDA under 3.0×. Equivalently, the 5th-percentile EBITDA must clear the covenant. The general form of any measurable tolerance is the same: pick the bad-case percentile you care about, and require the outcome there to stay inside the line. Financial firms give this named expressions — <em>earnings-at-risk</em> (the earnings shortfall at a chosen percentile) and <em>capital-at-risk</em> — but they are all the same move: appetite chooses the percentile and the limit; the estimated distribution tells you whether you’re inside it.</p>

      <p className="measure">This is also the bridge between the two halves of the course. The distribution you’d need to check Meridian’s covenant tolerance is exactly what the Monte Carlo and Value-at-Risk machinery of Part 4 produces — appetite (Part 2) and capital/VaR (Part 4) are the same conversation in two languages. It follows that setting a tolerance you cannot yet measure is still useful work: it specifies precisely which distribution you now have to go and estimate. A good tolerance is, in effect, a measurement request.</p>

      <MathBlock>
        <p>A quantified tolerance is a constraint on a quantile. With <span className="eq">L</span> the annual loss (or shortfall in covenant headroom) and appetite “at most an <span className="eq">α</span> chance of a breach”:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">P(L &gt; L_limit) ≤ α</span> &nbsp;⇔&nbsp; <span className="eq">VaR_(1−α)(L) ≤ L_limit</span>.</p>
        <p>So an appetite tolerance and a Value-at-Risk threshold (lesson 4.4) are one object read from opposite sides: appetite fixes <span className="eq">L_limit</span> and <span className="eq">α</span>; the estimated distribution of <span className="eq">L</span> says whether the constraint holds. Choosing <span className="eq">α</span> — 1-in-20, 1-in-100, 1-in-1000 — is a board value judgment, not a calculation, which is exactly why this lives in Part 2.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Draft your appetite" />
      <p className="measure">Now build the top of that hierarchy for your own organization: a statement of appetite by category that could later cascade into tolerances and limits. The builder takes each category in turn. Set a posture, and where the risk is measurable, state a tolerance as a number or probability using the metric menu above — a capital ratio, an earnings-volatility ceiling, a concentration limit — not an adjective. Then, for every line, name one real decision it would change; that column is the test that catches empty appetite, and the tool flags any line that fails it.</p>

      <AppetiteBuilder lessonId="2a" artifactId="A2" />

      <p className="measure">Read your draft back through the one question that exposes a fake: <em>if a manager did the opposite of this line, would the statement stop them?</em> If yes, it’s a control; if no, it’s décor, and the repair is almost always a missing number or a missing named decision. The standard to hold it to:</p>

      <Rubric
        title="a strong risk appetite statement"
        criteria={[
          { c: 'Tied to objectives', good: 'every line references something the organization is trying to achieve' },
          { c: 'Differentiated by category', good: 'postures genuinely differ — hungry somewhere, averse elsewhere, not “low” throughout' },
          { c: 'Quantified where measurable', good: 'a metric or probability (capital ratio, earnings-at-risk, concentration limit), not an adjective' },
          { c: 'Cascadable', good: 'each line could plausibly become a tolerance and then a delegated limit' },
          { c: 'Decision-useful & inside capacity', good: 'each line would change a real decision, and none would threaten survival if fully used' },
        ]}
        exemplar="Meridian: Strategic = hungry (licenses a market entry); Financial = ≤1-in-20 covenant breach → ≥70% FX hedge limit → amber trigger at 70%; Safety = averse (overrides a cost saving). Each line descends the hierarchy to a checkable number."
      />

      <p className="measure">A worked correction, because this is the most common mistake. A treasurer proposes: “we are comfortable with reasonable FX risk.” It cannot veto anything, so it controls nothing. Apply the hierarchy: posture (cautious) → tolerance (“currency moves should add at most €7m to annual input cost, 1-in-20 year”) → limit (“hedge ≥70% of rolling 12-month forecast exposure”) → trigger (“escalate at 70% coverage”). Now every level is checkable, and a hedging decision has something to be tested against. That descent from adjective to delegated limit is the entire craft of this lesson.</p>

      <ProblemSet items={[
        { q: 'A division states “zero appetite for operational risk.” Why is that incoherent, and what would a sane version say?', solution: 'Zero operational risk means ceasing operations — operating *is* the risk for a business that makes things. A coherent version sets tolerances on specific unwanted outcomes (max 48-hour outage on critical lines; near-zero tolerance for safety incidents) while accepting routine operational variability as the cost of operating. It differentiates the catastrophic (averse) from the everyday (tolerated).' },
        { q: 'Meridian’s risk profile shows it is using only 40% of its stated strategic risk appetite. Is that good news? What should the board do?', solution: 'Not necessarily — it suggests Meridian is under-taking strategic risk relative to a posture it called “hungry,” likely leaving growth and return unclaimed (its 10%→13% margin goal may be starved of bold bets). The board should ask why the gap exists: is the appetite statement not reaching decision-makers, are incentives too conservative, or is the stated appetite not the real one? A profile far below appetite is a prompt to act, not to relax.' },
      ]} />

      <p className="measure">Appetite gives you the yardstick every later step measures against — identifying, evaluating, treating are all comparisons to these lines. But a yardstick only bites if people honour it when a quarter goes bad, and no statement can guarantee that. That is the next lesson: risk culture, the thing that decides whether any of this survives contact with pressure.</p>
    </LessonShell>
  );
}
