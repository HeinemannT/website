import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { RiskStatementBuilder } from '../tools/RiskStatementBuilder.jsx';

const lesson = getLesson('1.1');

const pathway = [
  { kind: 'watch', t: 'Risk = effect of uncertainty on objectives', src: 'short ISO 31000 explainer', min: 6, tier: 'warmup', why: 'Hear the one-sentence definition before you dissect it word by word.' },
  { kind: 'read', t: 'ISO 31000:2018 — overview & key terms', src: 'NC State ERM Initiative', href: 'https://erm.ncsu.edu/resource-center/cosos-erm-framework/', min: 12, tier: 'core', why: 'A trustworthy plain-language treatment of the definition and the assessment vocabulary.' },
  { kind: 'read', t: '“Standard Deviations” — a practitioner’s guide to ISO 31000', src: 'IRM (free PDF)', href: 'https://www.theirm.org/media/6884/irm-report-iso-31000-2018-v2.pdf', min: 20, tier: 'core', why: 'Walks the principles/framework/process spine and the cause–event–consequence model.' },
  { kind: 'do', t: 'Write five well-formed risk statements for your org', src: 'the builder in this lesson → Artifact A1', tier: 'apply', why: 'Force each into source → event → consequence and tag its upside and downside.' },
  { kind: 'book', t: 'Fundamentals of Risk Management — the opening chapters', src: 'Hopkin & Thompson, 6e', tier: 'deeper' },
];

const retrieval = [
  {
    q: 'ISO 31000:2018 defines risk as…',
    options: [
      { text: 'the effect of uncertainty on objectives — where the effect is a deviation that can be positive or negative.', correct: true },
      { text: 'the probability that something bad will happen.' },
      { text: 'any threat to the organisation’s assets.' },
    ],
  },
  {
    q: 'Why does the “on objectives” clause carry so much weight?',
    options: [
      { text: 'A risk only exists relative to a goal, so you must know the objectives before you can name what threatens them.', correct: true },
      { text: 'It makes risks easier to insure.' },
      { text: 'It guarantees every risk can be measured numerically.' },
    ],
  },
  {
    q: 'The gap between inherent and residual risk represents…',
    options: [
      { text: 'the work your controls are actually doing — exposure removed between “before controls” and “after controls.”', correct: true },
      { text: 'measurement error in the estimate.' },
      { text: 'risk that has been transferred to an insurer only.' },
    ],
  },
  {
    q: 'Knight’s distinction separates…',
    options: [
      { text: 'risk (outcomes you can put estimable odds on) from true uncertainty (outcomes you cannot meaningfully assign probabilities to).', correct: true },
      { text: 'financial risk from operational risk.' },
      { text: 'inherent risk from residual risk.' },
    ],
  },
];

export default function Lesson11() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Ask ten managers what “risk” means and most say some version of “bad things that might happen.” That answer throws away half the subject and points your attention at the wrong thing — a list of hazards instead of a set of objectives you’re trying to protect and advance.</Lead>

      <p className="measure">The whole discipline runs on one definition, from ISO 31000:2018 (clause 3.1): risk is <em>the effect of uncertainty on objectives</em>. Three words are load-bearing, and you cannot do the rest of the course without each of them. <strong>Effect</strong> is a <em>deviation from the expected</em> — and the standard says explicitly it can be positive, negative, or both; risk is not a synonym for loss. <strong>Uncertainty</strong> is the <em>source</em>: the state of not being sure, whether about wheat prices, a competitor’s move, or whether a control will hold. <strong>Objectives</strong> is the anchor: risk does not exist in the abstract, only in relation to something you are trying to achieve. Change the objective and the same uncertainty becomes a different risk, or no risk at all. That is why this course makes you understand your organization’s objectives (the next lesson) before it lets you list a single risk.</p>

      <p className="measure">This is a deliberate break from the older view, in which risk meant “hazards” — fire, fraud, flood, the catalogue of bad things — and risk management meant minimising them. The objectives-based view reverses the starting point. You no longer begin with a list of threats; you begin with what the organization is trying to do and ask what uncertainty could move it. The practical consequence is large: a risk register built from hazards is a list of someone else’s worries, while a register built from objectives is a map of what could derail <em>your</em> plan, which is the only thing a board can act on. Here is how to work the topic — the explainer for the shape of the idea, then the NC State and IRM reads for the vocabulary, then the build.</p>

      <Pathway lessonId="1.1" items={pathway} />

      <Objectives items={[
        'State the ISO 31000 definition and dissect its three load-bearing words: effect, uncertainty, objectives.',
        'Explain why treating risk as downside-only destroys value, and separate upside from downside on a single exposure.',
        'Name a risk by its anatomy — cause → event → consequence — and say why a “topic” like cyber is not a risk.',
        'Distinguish inherent from residual risk, and Knightian risk from true uncertainty.',
        'Write several well-formed risk statements for your own organization (the start of Artifact A1).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="What a risk is, and how to name one" />
      <p className="measure">Start with the upside, because it is the half the folk definition deletes. If an effect is a deviation that can go either way, then a single uncertainty is usually one risk with two faces. Treat it as only the downside and you make a specific, expensive error: you hedge away the danger and discard the opportunity attached to it, and you never see that you did. A firm that buys insurance against every fluctuation has bought certainty at the price of every gain those fluctuations could have delivered — and a competitor who understood both sides is now beating it. This is why ERM is not the art of avoiding loss. It is the art of taking the <em>right</em> uncertainties, knowingly, in pursuit of objectives, while refusing the ones that pay you nothing.</p>

      <p className="measure">A risk also has anatomy, and naming the parts is what turns a worry into something you can manage. There is a <strong>cause</strong> (the source that sets it off), an <strong>event</strong> (the thing that happens), and a <strong>consequence</strong> (what it does to an objective). “Cyber” is not a risk — it is a topic, a heading, a category with no handle on it. “A phishing email lets attackers encrypt our order system, so we cannot ship for a week” is a risk, because each part tells you where to act: the cause invites staff training and email filtering, the event invites backups and segmentation, the consequence invites a manual fallback and customer communications. A statement that names only the topic gives you nothing to do; the three-part statement assigns three different jobs to three different controls.</p>

      <p className="measure">Two distinctions you will use in every later lesson. <strong>Inherent risk</strong> is the exposure before you do anything about it; <strong>residual risk</strong> is what remains after your controls. The gap between them is the work the controls are doing — and if there is no gap, the controls are not earning their keep and should be questioned. Second, Frank Knight (1921) separated <strong>risk</strong>, where you can put estimable odds on the outcomes, from genuine <strong>uncertainty</strong> (or ambiguity), where you honestly cannot. A coin flip is risk; “will this novel product category exist in five years” is uncertainty. Much of the measurable machinery later in the course works only on the first kind, and the best risk thinkers never forget how much of the world sits in the second — a humility this course returns to deliberately in Part 5. A related split sits underneath: some uncertainty is <em>natural variability</em> (aleatory — the spread of next year’s demand even if you knew the market perfectly) and some is <em>epistemic</em> (lack of knowledge — you simply don’t know the true default rate yet). Variability you manage by buffering; epistemic uncertainty you can sometimes shrink by gathering information.</p>

      <p className="measure">Watch all of this land on Meridian Industries, the listed mid-cap consumer-goods maker you will carry through the course. Take its risk R5, the commodity-price exposure, against its stated objective of lifting operating margin from 10% to 13%. Written by anatomy: <em>cause</em> — Meridian buys grain and cocoa priced in global markets and cannot fully pass cost through to retailers; <em>event</em> — those commodity prices move sharply in a year; <em>consequence</em> — the input-cost line swings, moving operating margin toward or away from the 13% target. Now hold both faces of the effect. A price <em>spike</em> squeezes margin and pushes the objective out of reach (the downside, the ~€12m hit in the register). But a price <em>fall</em> widens margin and could hand Meridian the 13% almost for free (the upside). The two-sided framing changes the decision: if the treasurer hedges the exposure to zero to kill the downside, the same hedge also surrenders the windfall when prices drop. The correct question is not “how do we eliminate commodity risk” but “how much of this two-sided exposure do we want, given a margin objective we are actively chasing” — which is exactly the appetite conversation of Part 2. A downside-only mindset never asks it.</p>

      <DoNow>Before the build, read the NC State overview (pathway step 2, ~12 min) for the definition and the source/event/consequence vocabulary — the exact structure the builder will hold you to.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Almost none, and that is the point" />
      <p className="measure">There is essentially no mathematics in this lesson, and saying so plainly is itself a teaching point. The discipline resists premature numbers here for a concrete reason: a number attached to a badly-named risk launders a guess into a fact. If “cyber: probability 12%, impact €6m” sits in your register before anyone has separated the cause from the event from the consequence, the figure looks rigorous and decides nothing, because there is no handle for a control to grip. Naming comes first precisely so the numbers, when they arrive in Part 4, have something solid to attach to.</p>

      <p className="measure">The one quantitative idea worth planting now is the intuition that an “effect” is a <em>distribution</em>, not a single bad number. When ISO says risk is a deviation from the expected, the honest picture is a spread of possible outcomes around your plan — most near the centre, some far out on either tail. That spread is what later lessons will measure: variance and standard deviation capture how wide it is, and a value-at-risk threshold (Part 4) picks a point in the bad tail. Seeing risk as the whole distribution, rather than one feared outcome, is what makes the upside visible at all — the favourable tail is part of the same picture as the unfavourable one. Hold the picture; the arithmetic that quantifies it comes later, and only for the risks that genuinely support it.</p>

      <MathBlock>
        <p>Think of an objective’s outcome <span className="eq">X</span> as a distribution around its expected value <span className="eq">E[X]</span>. “Risk” is the deviation <span className="eq">X − E[X]</span> — and it spreads both ways:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">deviation = X − E[X]</span>, &nbsp; with spread measured by <span className="eq">σ = √Var(X)</span>.</p>
        <p>A downside-only view looks at just one tail, e.g. <span className="eq">P(X &lt; target)</span>, and silently ignores the mass above the mean. The full object is the whole distribution; the favourable tail is as real as the unfavourable one. This lesson teaches you to see that object. Part 4 estimates it — Monte Carlo builds the distribution, and value-at-risk reads a point off its bad tail. The maths waits because it can only describe a risk you have first named correctly.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Your first risk statements" />
      <p className="measure">Now build the start of your charter. Take the objectives you set in orientation and, for each, name an uncertainty that could move it and walk it through the anatomy — cause, event, consequence — then say whether the effect runs downside, upside, or both. The builder forces each entry into the canonical structure <em>“[source/cause] may lead to [event], which could affect [objective] by [consequence]”</em> and flags any line that is still just a topic. These are not your full register yet (that arrives in 2c); they are the first entries in Artifact A1, and the proof that you can see risk the way the discipline does.</p>

      <RiskStatementBuilder lessonId="1.1" artifactId="A1-statements" />

      <p className="measure">Read each statement back through one test: <em>could someone act on this without asking a clarifying question?</em> If the line names a topic (“supply chain,” “reputation”), it fails — there is no cause to attack and no consequence to plan around. If it names a cause, an event, and a hit to a named objective, it passes, and you can already see which control attaches where. The standard to hold it to:</p>

      <Rubric
        title="a well-formed risk statement"
        criteria={[
          { c: 'Tied to an objective', good: 'names the specific goal the effect would move, not “the business” in general' },
          { c: 'Full anatomy', good: 'a distinct cause, event, and consequence — not a one-word topic standing in for all three' },
          { c: 'Direction stated', good: 'flagged downside, upside, or both — so two-sided exposures aren’t silently treated as pure loss' },
          { c: 'Actionable', good: 'each part points to a place a control could attach (the cause, the event, or the consequence)' },
          { c: 'Honest about uncertainty type', good: 'distinguishes a measurable, estimable risk from genuine ambiguity you can only judge' },
        ]}
        exemplar="Meridian R5: grain/cocoa priced in global markets, not fully passable to retailers (cause) → prices move sharply in a year (event) → input cost swings, moving operating margin toward or away from the 13% target (consequence). Direction: both — a spike hurts, a fall helps; so hedging it to zero discards the upside."
      />

      <p className="measure">A worked correction, because it is the most common mistake. A manager writes: “Reputational risk is a major concern for us.” It names a topic and a feeling, controls nothing, and could not be tested against any decision. Apply the anatomy: <em>cause</em> — a contamination escapes our quality checks; <em>event</em> — a product recall and the press coverage that follows; <em>consequence</em> — retailers pull shelf space and the contract-renewal objective is missed, with a brand-trust hit that outlasts the recall. Now there is something to manage at each part: tighten the checks (cause), rehearse the recall and holding statement (event), and pre-agree retailer communications (consequence). The same move — from topic to cause/event/consequence on a named objective — is what turns a worry into something you can manage.</p>

      <ProblemSet items={[
        { q: 'A team lists “climate change” as one of its top risks. Why is that not yet a risk in the ISO sense, and how would you repair it?', solution: 'It is a topic, not a risk: no cause, no event, and no named objective it would move. Repair it by forcing the anatomy onto a specific exposure — e.g. cause: one plant sits in a flood-prone river valley; event: a severe flood halts production for weeks; consequence: lost output threatens the “keep critical supply running” objective and triggers rebuild cost. Now it is actionable (flood defences, a backup site, business-interruption cover) and could be one of several distinct climate risks, each tied to a different objective.' },
        { q: 'Meridian’s treasurer proposes hedging 100% of the commodity exposure (R5) to “remove the risk.” Using the two-sided definition of effect, what is wrong with that goal, and what is the better question?', solution: 'It treats a two-sided effect as pure downside. A full hedge kills the margin squeeze from a price spike, but it equally surrenders the margin windfall from a price fall — and Meridian is actively chasing a 10%→13% margin goal that a favourable move could help deliver almost for free. The better question is not “how do we eliminate this” but “how much of this two-sided exposure do we want, given the margin objective and our appetite?” — which sets up the partial-hedge / appetite decision in Part 2, not a blanket hedge here.' },
        { q: 'A control reduces a risk’s inherent rating from high to low. A colleague says “then the risk is gone.” What is the precise correction?', solution: 'The low rating is the residual risk — what remains after the control — not zero. The gap between inherent (high) and residual (low) measures the work the control is doing, and that work only persists while the control keeps working; if it fails or degrades, exposure reverts toward inherent. The risk is not gone, it is being held down by something that itself needs monitoring (the basis for 2e and 2g).' },
      ]} />

      <p className="measure">You now have a definition that admits upside, an anatomy that turns topics into manageable statements, and the inherent/residual and risk/uncertainty distinctions that the rest of the course leans on. The next lesson supplies the missing anchor: to know what threatens your objectives, you first have to understand the organization and its objectives in detail — its business model, its money, and its strategy. Risk only exists relative to a goal, so we go and read the goal.</p>
    </LessonShell>
  );
}
