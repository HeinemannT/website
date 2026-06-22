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
  { kind: 'watch', t: 'Risk appetite, explained', src: 'short practitioner explainer', min: 7, tier: 'warmup', why: 'Get the posture-vs-boundary idea in your head before the detail.' },
  { kind: 'read', t: 'The Orange Book — the appetite section', src: 'HM Treasury (gov.uk)', href: 'https://www.gov.uk/government/publications/orange-book', min: 12, tier: 'core', why: 'The clearest official treatment of how a board’s posture becomes working limits.' },
  { kind: 'read', t: 'Risk Appetite & Tolerance', src: 'Institute of Risk Management', min: 15, tier: 'core', why: 'Appetite vs tolerance vs capacity, and the cascade problem in depth.' },
  { kind: 'do', t: 'Draft your organization’s appetite statement', src: 'the builder in this lesson → Artifact A2', tier: 'apply', why: 'Turn the reading into a statement that would actually change a decision.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — the appetite chapter', src: 'Hopkin & Thompson', tier: 'deeper' },
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
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>A bank decides that no single borrower will ever exceed 5% of its loan book. That one sentence is a risk appetite — and it tells every lending officer, on every deal, exactly when to say no.</Lead>

      <p className="measure">Sit with how much work that sentence does. It didn’t come from a risk manager; it came from the board. It isn’t a warning or a worry; it’s a permission and a limit in the same breath — go ahead and lend, but not past here. And because it’s a number, nobody downstream has to relitigate it deal by deal. The hardest word in any organization to say convincingly is “no,” and an appetite statement is how the board says it once, in advance, so that the lending officer doesn’t have to win the argument alone at 6pm on a Friday. That is what this lesson is really about: not caution, but the machinery that lets an organization take risk <em>on purpose</em>, and stop at a line it chose while it was calm.</p>

      <p className="measure">Here’s how I’d work through the topic — a short video to get the shape of the idea, two readings that go deeper than I can here, then the build at the end. Tick them off as you go.</p>

      <Pathway lessonId="2a" items={pathway} />

      <Objectives items={[
        'Distinguish risk appetite, tolerance, and capacity, and order them correctly.',
        'Judge whether an appetite statement is decision-useful or merely decorative.',
        'Express a tolerance as a checkable probability where the risk is measurable.',
        'Draft an appetite statement for your own organization (Artifact A2).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="Appetite, tolerance, capacity" />
      <p className="measure">Three words get used interchangeably in practice, and the confusion is expensive, so let’s pin them down with something physical: a meal. Your <em>appetite</em> is how hungry you are when you sit down — broad, directional, set before the food arrives. Your <em>tolerance</em> is the specific point at which you push the plate away — concrete, and different for the rich dish than the plain one. And your <em>capacity</em> is how much you could physically eat before you’re ill — a hard ceiling that has nothing to do with how hungry you feel.</p>

      <p className="measure">Map that back to risk and the relationships fall out cleanly. Risk <em>appetite</em> is the broad amount and kind of risk you’ll pursue to reach your objectives. Risk <em>tolerance</em> is the specific variation you’ll accept around a particular objective before someone has to act or escalate. Risk <em>capacity</em> is the most you could absorb before survival itself is in question. And here is the one rule that matters above all the others, the one that organizations violate right before they fail: <strong>appetite must sit inside capacity.</strong> Wanting more risk than you could survive isn’t boldness; it’s a countdown. A great deal of risk management, stripped down, is just keeping those three quantities in the right order.</p>

      <p className="measure">A statement of appetite earns its keep in three ways, and it’s worth seeing why each matters. First, it has to <em>tie to objectives</em> — appetite for what? An appetite that doesn’t name something the organization is trying to achieve is just a temperament, and you can’t manage a temperament. Second, it has to <em>differentiate</em>. Almost every organization is genuinely hungry for some risks and genuinely allergic to others — eager to bet on a new product, unwilling to gamble with safety — and a statement that says “low” everywhere has quietly admitted it hasn’t thought about any of them. Third, it has to <em>cascade</em>: the board’s broad posture is useless until it becomes a limit the lending officer or the plant manager can actually apply without phoning head office. Most appetite statements fail on one of these three, and they fail in the same way — by being a wish (“we have a low appetite for risk”) rather than an instruction.</p>

      <p className="measure">It’s easier to see all this working on a real organization than in the abstract, so meet the company you’ll carry through the rest of the course. <strong>Meridian Industries</strong> is a mid-sized, listed maker of packaged consumer goods — three plants, sales in fourteen countries, a treasury that hedges currencies and funds the business through a bank facility. Four years ago a labelling error forced a €4m product recall and knocked 9% off the share price for a month, and that scar shows up in how its board now writes appetite. Watch how deliberately it differs by category.</p>

      <p className="measure">On <em>strategy</em>, Meridian’s board is openly hungry: it wants to lift operating margin from 10% to 13% and double emerging-market sales, and it knows it cannot do either by playing safe — so the statement actively invites well-judged strategic bets. On its <em>finances</em>, it is cautious, and it says so in a number rather than an adjective: “no more than a one-in-twenty chance of breaching our leverage covenant in any year.” That covenant — net debt to EBITDA below three times — currently sits at a comfortable 1.75, but a downturn closes that gap fast, and pinning the appetite to a probability means a treasurer can test a proposed financing against it instead of arguing about it. And on <em>food safety</em>, the board is near-zero: any credible safety risk is treated regardless of cost, full stop. That single averse line is the reason that, three lessons from now, Meridian will <em>treat</em> its contamination risk rather than tolerate it — the appetite written here reaches forward and makes that decision for them.</p>

      <p className="measure">Notice what every one of those lines has in common: each would visibly change a real decision. The strategic line green-lights a risky market entry that a blanket “low appetite” would have strangled. The financial line vetoes a deal that pushes leverage past the chosen probability. The safety line overrides a tempting cost saving on the production floor. An appetite statement that couldn’t change any of those decisions wouldn’t be an appetite at all — it would be décor. That is the single test to carry away from this section, and it’s the test the builder at the end will hold you to.</p>

      <DoNow>Before the next section, skim the Orange Book’s appetite pages (step 2 in the pathway, ~12 min). It walks through the cascade from board posture to working limit far more fully than I have here, and it’ll make the build feel obvious.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="A tolerance is a line on a distribution" />
      <p className="measure">Most of appetite is judgment, but there’s a quantitative spine running through the measurable parts, and Meridian’s covenant tolerance is the cleanest place to see it. “At most a one-in-twenty chance of breaching the covenant this year” is not a vague comfort level — it is a precise statement about the <em>distribution</em> of next year’s earnings. It says: of all the ways next year could plausibly turn out, the worst one-in-twenty must still leave net debt to EBITDA under three times. Draw next year’s possible EBITDA as a spread of outcomes, mark the point that only 5% of outcomes fall below, and the appetite is simply the requirement that even that point stays inside the covenant.</p>

      <p className="measure">You don’t have the tools to build that distribution yet — that’s the whole of Part 4 — but you don’t need them to grasp the move, and it’s worth seeing now because it links two halves of the course. The discipline of appetite (here, in Part 2) and the machinery of capital and Value-at-Risk (later, in Part 4) are the same conversation in two languages. Appetite draws the line; the loss distribution tells you whether you’re behind it. This is also why it’s perfectly sensible to set a tolerance you can’t yet measure: doing so tells you precisely which distribution you now have to go and estimate. A good tolerance, in other words, is a measurement request in disguise.</p>

      <MathBlock>
        <p>Formally, a quantified tolerance is a constraint on a quantile. If <span className="eq">L</span> is the annual loss (or the shortfall in covenant headroom), an appetite of “at most an <span className="eq">α</span> chance of a breach” is just</p>
        <p style={{ textAlign: 'center' }}><span className="eq">P(L &gt; L_limit) ≤ α</span>, equivalently <span className="eq">VaR_(1−α)(L) ≤ L_limit</span>.</p>
        <p>So an appetite tolerance and a Value-at-Risk threshold (lesson 4.4) are the same object read from opposite sides: appetite fixes <span className="eq">L_limit</span> and <span className="eq">α</span>; the estimated distribution of <span className="eq">L</span> tells you whether the constraint holds. Setting <span className="eq">α</span> — one-in-twenty? one-in-a-hundred? — is a board judgment dressed as a number, which is exactly why this belongs in Part 2 and not Part 4.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Draft your appetite" />
      <p className="measure">Now do for your own organization what Meridian’s board did. The builder below takes you category by category. For each one, settle on a posture — averse, cautious, open, or hungry — then, where the risk is measurable, set a tolerance as a number or a probability rather than an adjective. And for every category, force yourself to write down one real decision the line would change; that last column is the wallpaper test made unavoidable, and the tool will flag any line that fails it. Don’t aim for a perfect statement on the first pass — aim for one that would genuinely make someone act differently, and refine from there.</p>

      <AppetiteBuilder lessonId="2a" artifactId="A2" />

      <p className="measure">When you’ve drafted it, read each line back and ask the question that separates a real appetite statement from a laminated one: <em>if a manager took the opposite of this line, would your statement stop them?</em> If yes, you’ve written an instrument. If no, you’ve written a mood, and the fix is almost always to add the missing number or the missing named decision. Here is the standard I’d hold a strong version to:</p>

      <Rubric
        title="a strong risk appetite statement"
        criteria={[
          { c: 'Tied to objectives', good: 'every line references something the organization is actually trying to do' },
          { c: 'Differentiated', good: 'the postures genuinely differ across categories — not “low” everywhere' },
          { c: 'Quantified where it can be', good: 'measurable categories carry a number or probability, not an adjective' },
          { c: 'Decision-useful', good: 'each line names a concrete decision it would change' },
          { c: 'Inside capacity', good: 'nothing in it would threaten survival if fully used' },
        ]}
        exemplar="Strategic = hungry (green-lights a market entry); Financial = ≤1-in-20 covenant breach, ≥70% FX hedged (vetoes an over-leveraged deal); Safety = averse (overrides a cost saving). Every line moves a real decision."
      />

      <p className="measure">One worked problem before you go, because the most common mistake here is so common it’s worth rehearsing. Suppose Meridian’s treasurer proposes the tolerance: “we are comfortable with reasonable FX risk.” It sounds responsible and it is completely useless — “reasonable” can’t veto anything, so it will veto nothing. Rewrite it the way the rubric demands and you get something like: “we hedge at least 70% of forecast FX exposure on a rolling twelve months, and accept at most a one-in-twenty chance that currency moves add more than €7m to annual input cost.” Now a treasurer staring at a hedging decision has a line to check it against. That move — from adjective to checkable boundary — is the whole skill of this lesson.</p>

      <ProblemSet items={[
        { q: 'A division states it has “zero appetite for operational risk.” Why is that incoherent, and what would a sane version say?', solution: 'Zero operational risk means ceasing operations — impossible for a business that makes things, since operating *is* the risk. A coherent version sets tolerances on specific unwanted outcomes (e.g. “no single plant outage beyond 48 hours on critical lines; near-zero tolerance for safety incidents”) while accepting that routine operational variability is the cost of operating at all.' },
        { q: 'Meridian’s board sets its covenant tolerance at one-in-twenty. The CFO argues for one-in-a-hundred “to be safe.” What is that choice actually trading off, and who should make it?', solution: 'Tightening α from 1/20 to 1/100 demands far more headroom — less leverage, more retained cash, slower growth — to survive rarer years. It trades growth and return for resilience. That is not a technical question but a value judgment about how much upside to forgo for safety, so it belongs to the board (informed by the numbers), not to the treasury function alone.' },
      ]} />

      <p className="measure">With appetite set, you finally have a yardstick. Everything that follows — finding risks, sizing them, deciding which to treat — is at bottom a comparison against the lines you’ve just drawn. But a yardstick only works if people honour it under pressure, and that depends on something no statement can guarantee. That’s the next lesson: the culture that decides whether any of this survives contact with a bad quarter.</p>
    </LessonShell>
  );
}
