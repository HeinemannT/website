import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage, Pull } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { AppetiteBuilder } from '../tools/AppetiteBuilder.jsx';

const lesson = getLesson('2a');

const pathway = [
  { kind: 'watch', t: 'Risk appetite, explained', src: 'short practitioner explainer', min: 7, tier: 'warmup', why: 'Get the posture-vs-boundary idea before the detail.' },
  { kind: 'read', t: 'The Orange Book — appetite & tolerance', src: 'HM Treasury (gov.uk), the appetite section', href: 'https://www.gov.uk/government/publications/orange-book', min: 12, tier: 'core', why: 'The clearest official treatment; sober and concrete.' },
  { kind: 'read', t: 'Risk Appetite & Tolerance', src: 'Institute of Risk Management guidance', min: 15, tier: 'core', why: 'Appetite vs tolerance vs capacity, and the cascade problem.' },
  { kind: 'do', t: 'Draft your organization’s appetite statement', src: 'the builder below → Artifact A2', tier: 'apply', why: 'Turn the reading into a statement that would change a decision.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — risk appetite chapter', src: 'Hopkin & Thompson', tier: 'deeper' },
  { kind: 'read', t: 'Risk appetite articles', src: 'NC State ERM Initiative', href: 'https://erm.ncsu.edu/', tier: 'deeper' },
];

const readings = [
  { kind: 'FREE', title: 'The Orange Book (HM Treasury, 2023)', note: 'Official, concrete guidance on setting appetite.', href: 'https://www.gov.uk/government/publications/orange-book' },
  { kind: 'FREE', title: 'Risk Appetite and Tolerance — IRM', note: 'Appetite, tolerance, capacity, and the cascade.' },
  { kind: 'BOOK', title: 'Fundamentals of Risk Management', note: 'Hopkin & Thompson — the risk appetite chapter.' },
];

const retrieval = [
  { q: 'Appetite vs. capacity — which must contain the other?', options: [
    { text: 'Appetite must sit inside capacity: never want more risk than you could survive.', correct: true },
    { text: 'Capacity must sit inside appetite.' },
    { text: 'They are the same thing.' }] },
  { q: 'The test of a working appetite statement is…', options: [
    { text: 'whether it would ever make someone make a different decision.', correct: true },
    { text: 'whether it uses the word “low”.' },
    { text: 'whether the board has approved it.' }] },
  { q: 'Meridian’s financial appetite is “≤1-in-20 chance of breaching the covenant.” That is…', options: [
    { text: 'a tolerance expressed as a probability — a line you can check a real number against.', correct: true },
    { text: 'a strategic objective.' },
    { text: 'a statement of risk capacity.' }] },
];

export default function Lesson2a() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval} readings={readings}>
      <Lead>A bank decides that no single borrower will ever exceed 5% of its loan book. That one sentence is a risk appetite — and it tells every lending officer exactly when to say no.</Lead>

      <Pathway lessonId="2a" items={pathway} />

      <p className="measure">Without that line, “no” is just an argument waiting to be lost. With it, the board has answered a question that sounds simple and runs deep: how much risk should we take? Not how much we face — that’s the register — but how much we should knowingly accept to get what we’re after. A team that can’t answer can’t tell a smart risk from a reckless one, because recklessness isn’t a property of a risk by itself. The same open currency position is prudent treasury management in one company and a firing offence in another. Appetite is what tells them apart.</p>
      <p className="measure">And appetite is not the language of caution — it’s the language of <em>deliberate</em> risk-taking. Meridian wants to lift its margin from 10% to 13% and double its emerging-market sales; it cannot do either by hiding. Appetite is how its board says, out loud and in advance, which risks it wants taken and how far, so the people close to the action can move without escorting every decision upstairs.</p>

      <Objectives items={[
        'Distinguish risk appetite, tolerance, and capacity, and order them correctly.',
        'Judge whether an appetite statement is decision-useful or decorative.',
        'Express a tolerance as a checkable probability where the risk is measurable.',
        'Draft an appetite statement for your own organization (Artifact A2).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Appetite, tolerance, capacity" />
      <p className="measure">Pin the vocabulary down with a meal. Risk <em>appetite</em> is how hungry you are: the broad amount and type of risk you’ll pursue to hit your objectives. Risk <em>tolerance</em> is where you push the plate away: the specific variation you’ll accept around one objective before someone escalates. And <em>capacity</em> is the most you could absorb before survival is in question. One rule rises above the rest: appetite must sit inside capacity. An appetite bigger than your capacity isn’t ambition — it’s a plan to fail.</p>
      <p className="measure">A good appetite statement earns its keep three ways: it ties to real objectives (an appetite that names nothing you’re trying to achieve is just a mood); it <em>separates categories</em>, because almost every organization is hungry for some risks and allergic to others; and it <em>cascades</em>, translating the board’s posture into limits the people downstairs can actually use. The usual failure is the appetite that’s really a wish — “we have a low appetite for risk” gives nobody a way to choose between two real options.</p>

      <p className="measure"><strong>How Meridian did it (worked example).</strong> Meridian’s board, scarred by a €4m recall four years ago, wrote a statement that deliberately differs by category:</p>
      <ul className="measure">
        <li><em>Strategic — hungry.</em> It will take real bets to hit the margin and emerging-market goals.</li>
        <li><em>Financial — cautious, and quantified.</em> “No more than a 1-in-20 chance of breaching the leverage covenant (net debt/EBITDA &lt; 3.0×) in any year,” and FX hedged to at least 70% coverage. Notice this is a number you can test — today it sits at 1.75×, with room that a downturn would eat.</li>
        <li><em>Food safety & conduct — averse.</em> Near-zero tolerance; any credible safety risk is treated regardless of cost. That single line is why, later, Meridian <em>treats</em> its contamination risk rather than tolerating it.</li>
      </ul>
      <p className="measure">Each line passes the test: each would visibly change a decision. The strategic line greenlights a risky market entry; the financial line vetoes a deal that pushes leverage too far; the safety line overrides a cost saving. That is what an appetite statement is <em>for</em>.</p>

      <DoNow>Before the next section, skim the Orange Book’s appetite section (pathway step 2, ~12 min) — it’ll make the cascade from board posture to working limits concrete.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Tolerances as checkable lines" />
      <p className="measure">Appetite is mostly judgment, but it has a numerical spine. Where a risk is measurable, a tolerance is just a line drawn on a range of outcomes — and Meridian’s covenant tolerance is the model case. “≤1-in-20 chance of breaching the covenant in a year” is a statement about the *distribution* of next year’s EBITDA: it says the 5th-percentile outcome must still keep net debt/EBITDA under 3.0×. You’ll build exactly that kind of distribution in Part 4; the point here is that a good tolerance is phrased so a number can be checked against it. Press on any vague “low appetite” and it should resolve into something of that shape.</p>

      <MathBlock>
        <p>A quantified tolerance is a constraint on a quantile. If <span className="eq">L</span> is the annual loss (or the covenant headroom), an appetite of “at most an <span className="eq">α</span> chance of a breach” is</p>
        <p style={{ textAlign: 'center' }}><span className="eq">P(L &gt; L_limit) ≤ α</span>, equivalently <span className="eq">VaR_(1−α)(L) ≤ L_limit</span>.</p>
        <p>So a tolerance is the same object as a Value-at-Risk threshold (lesson 4.4), read from the other side: appetite sets the line, the loss distribution tells you whether you’re inside it. This is why appetite (Part 2) and capital/VaR (Part 4) are the same conversation in two languages — and why setting a tolerance you can’t yet measure is still useful: it tells you which distribution you now have to go and estimate.</p>
      </MathBlock>
      <Pull>If a stated appetite would never change a single real decision, it isn’t an appetite. It’s wallpaper.</Pull>

      <Stage n={3} kicker="Build it — your organization" title="Draft your appetite" />
      <p className="measure">Now do for your organization what Meridian did. Go category by category: choose a posture, set a tolerance where the risk is measurable, and — the part that matters most — name a real decision the appetite would change. The builder flags any line that fails that test. Saved as Artifact A2, this becomes the line every risk in your register is finally judged against.</p>

      <AppetiteBuilder lessonId="2a" artifactId="A2" />

      <Rubric
        title="a strong risk appetite statement"
        criteria={[
          { c: 'Tied to objectives', good: 'each line references something the organization is actually trying to do' },
          { c: 'Differentiated', good: 'postures genuinely differ across categories, not “low” everywhere' },
          { c: 'Quantified where it can be', good: 'measurable categories carry a number or probability, not an adjective' },
          { c: 'Decision-useful', good: 'each line names a concrete decision it would change (passes the wallpaper test)' },
          { c: 'Inside capacity', good: 'nothing in it would threaten survival if fully used' },
        ]}
        exemplar="Strategic = hungry (greenlights a market entry); Financial = ≤1-in-20 covenant breach + ≥70% FX hedged (vetoes an over-leveraged deal); Safety = averse (overrides a cost saving). Every line moves a real decision."
      />

      <ProblemSet items={[
        { q: 'Meridian’s treasurer proposes the tolerance “we are comfortable with reasonable FX risk.” Rewrite it so it’s decision-useful and checkable.', solution: 'Something like: “Net unhedged FX exposure on input costs is hedged to at least 70% rolling 12 months; we accept at most a 1-in-20 chance that an FX move adds more than €7m to annual input cost.” It names a measurable limit and a probability, so a treasurer can test a hedging decision against it — “reasonable” cannot.' },
        { q: 'A division says it has “zero appetite for operational risk.” Why is that incoherent, and what would a sane version say?', solution: 'Zero operational risk means stopping operations — impossible for a business that makes things. Operational risk is inherent to creating value. A coherent version sets tolerances on specific, unwanted outcomes (e.g., “no single plant outage longer than 48 hours for critical lines; near-zero tolerance for safety incidents”) while accepting that routine operational variability is the cost of operating.' },
      ]} />

      <p className="measure">With appetite set, you have the yardstick. Everything that follows — identifying risks, evaluating them, deciding what to treat — is ultimately a comparison against this. Next: why even the best appetite statement is worthless if the culture won’t honour it.</p>
    </LessonShell>
  );
}
