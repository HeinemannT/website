import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { Pathway, DoNow } from '../components/Pathway.jsx';
import { MathBlock, ProblemSet } from '../components/MathBlock.jsx';
import { Rubric } from '../components/Rubric.jsx';
import { FamilyLens } from '../tools/FamilyLens.jsx';

const lesson = getLesson('3.2');

const pathway = [
  { kind: 'watch', t: 'What is strategic risk?', src: 'short practitioner explainer', min: 6, tier: 'warmup', why: 'Get the “risk to the business model” framing before the detail.' },
  { kind: 'read', t: 'Managing Risks: A New Framework', src: 'Kaplan & Mikes, HBR (2012) — free FERMA reprint', href: 'https://www.ferma.eu/app/uploads/2013/03/hbr-managing-risks-a-new-framework.pdf', min: 20, tier: 'core', why: 'The three risk types, and why strategy risk needs an open dialogue, not a control checklist.' },
  { kind: 'read', t: 'Strategic risk management resources', src: 'NC State ERM Initiative', href: 'https://erm.ncsu.edu', min: 15, tier: 'core', why: 'Why the largest risks are usually strategic and why they sit at the top of the house.' },
  { kind: 'do', t: 'Add your strategic risks to the register', src: 'the builder in this lesson → Artifact A10', tier: 'apply', why: 'Name the bets and the assumptions that could break the model.' },
  { kind: 'book', t: 'Strategic Risk Taking — the case for taking risk well', src: 'Aswath Damodaran', tier: 'deeper' },
];

const retrieval = [
  { q: 'Strategic risk is best defined as risk to…', options: [
    { text: 'the business model, the strategy chosen, and the execution of that strategy.', correct: true },
    { text: 'the data centre and its backups.' },
    { text: 'next quarter’s reported earnings only.' }] },
  { q: 'Kodak invented the digital camera in 1975 yet was bankrupted by digital. The lesson is that…', options: [
    { text: 'the threat was visible; the response wasn’t — strategic risk fails on the response, not the foresight.', correct: true },
    { text: 'the threat was genuinely impossible to see coming.' },
    { text: 'digital photography was a fad that caught them by surprise.' }] },
  { q: 'The right primary tool for most strategic risk is…', options: [
    { text: 'scenario analysis, war-gaming, and real-options thinking — not a single probability × impact score.', correct: true },
    { text: 'a Value-at-Risk model on the strategy.' },
    { text: 'an insurance policy against the strategy failing.' }] },
];

export default function Lesson32() {
  return (
    <LessonShell lesson={lesson} retrieval={retrieval}>
      <Lead>Kodak invented the digital camera in 1975, patented it, and then shelved it to protect its film business — which digital later destroyed. Blockbuster was offered Netflix for $50m in 2000 and declined. Neither failure was an operational slip; each was a strategic risk that ended the company.</Lead>

      <p className="measure">Strategic risk is the effect of uncertainty on the things only the board and CEO can change: the <strong>business model</strong> (how you create and capture value), the <strong>strategy you choose</strong> (which markets, which bets), and the <strong>execution</strong> of that strategy. It is almost always the <em>largest</em> risk family by potential impact — it is what destroys whole firms rather than a quarter’s earnings — and almost always the <em>least quantified</em>, because you cannot put a credible probability on “a competitor reinvents our industry.” That mismatch is the central problem of this lesson: the biggest exposure sits in the box hardest to score, so it routinely goes unmanaged precisely because it won’t fit the register. COSO ERM (2017), retitled <em>Integrating with Strategy and Performance</em>, exists to correct exactly this — it pulls risk forward into strategy-setting rather than leaving it as an operational afterthought.</p>

      <p className="measure">Here is how to work through the topic — a short video for the framing, then Kaplan and Mikes for the governance logic and NC State for why strategic risk lives at the top, and the build at the end.</p>

      <Pathway lessonId="3.2" items={pathway} />

      <Objectives items={[
        'Define strategic risk across its three sub-types — disruption, business-model risk, and execution risk — and explain why it is usually the largest yet least-quantified family.',
        'Explain why strategic risk is owned at board/CEO level and why the risk function must contribute to strategy-setting, not review it afterward.',
        'Choose the right tools — scenario analysis, war-gaming, real-options thinking — and say why probability × impact manufactures false confidence here.',
        'Add your organization’s strategic risks to the register, owned at the top, with their critical assumptions named (Artifact A10).',
      ]} />

      <Stage n={1} kicker="Understand the discipline" title="The risks that end companies" />
      <p className="measure">Strategic risk splits into three sub-types, and naming which one you face changes who must respond. <strong>Disruption</strong> is when a new technology or competitor reshapes the market you compete in — the demand or the cost structure shifts beneath you (streaming versus video rental; ride-hailing versus taxi medallions). <strong>Business-model risk</strong> is when the specific way <em>you</em> make money stops working even if the market survives — your margin source, channel, or customer relationship erodes (a newspaper’s classified-ads revenue evaporating to Craigslist while readers still want news). <strong>Execution risk</strong> is a sound strategy delivered badly — the right bet, mistimed, under-resourced, or fumbled in integration (most large M&A deals destroy value not because the logic was wrong but because the integration failed). The first two are about <em>what</em> world you’re in; the third is about <em>whether you can actually do</em> what you decided.</p>

      <p className="measure">The canonical cautionary cases share one lesson worth memorising: the threat was visible; the response wasn’t. Kodak’s own engineer built the first digital camera in 1975, and Kodak held early digital patents — the firm saw the future clearly and chose to defend film, the business it understood, until digital bankrupted it in 2012. Blockbuster understood the late-fee resentment that Netflix was built to exploit and was offered Netflix outright in 2000; it passed, kept optimising stores, and was gone by 2010. In neither case did the company fail to <em>see</em> the disruption. They failed to <em>act</em>, because acting meant cannibalising the profitable present to fund an uncertain future — the structurally hardest decision a board makes. This is why strategic risk so rarely yields to better forecasting: the foresight is usually there; the willingness to respond is the scarce thing.</p>

      <p className="measure">Strategic risk is owned at the very top — board and CEO — for a structural reason, not a ceremonial one: <em>only they can change the strategy.</em> No risk committee, control owner, or second-line function can decide to exit a market or rebuild the business model; that authority lives only with those who set strategy. The implication for the risk function is sharp. Kaplan and Mikes (HBR, 2012) classify strategy risks as a category that cannot be managed with the rules-and-compliance toolkit used for preventable risks; it needs an open, embedded <em>dialogue</em> with the strategy-setters. So the risk function’s job here is to be a <strong>contributor to strategy-setting</strong> — surfacing assumptions, running scenarios, challenging the base case <em>while the bet is being made</em> — not an after-the-fact reviewer who audits a strategy already chosen. A risk function that only audits operations and never sits in the strategy room is guarding the windows while the roof comes off.</p>

      <p className="measure">Watch this land on Meridian. Two register entries are strategic, and both attach to objectives the firm has actually set — lifting operating margin from 10% to 13%, and doubling emerging-market revenue. <strong>R4 — the top retailer (18% of revenue) drops the contract</strong> is concentration risk reframed as strategic risk: it is not that any single sale is risky, but that the business model leans 18% of its weight on one relationship and 45% on the top five. The €40m impact (the largest single number in the register) dwarfs any operational loss, the annual probability is judged around 6%, and the owner is the CEO because the only real mitigations are strategic — diversify the customer base, deepen the relationship, or accept the concentration as the price of scale. <strong>R12 — private-label erosion of a core brand</strong> is business-model risk: retailers’ own-label products steadily undercut the branded margin that the 13% target depends on. It is judged a near-even chance over the horizon (≈50%) with a smaller per-year impact (~€10m), the slow-grinding kind of strategic risk that never triggers an alarm but quietly removes the premium the whole strategy assumes. Neither is something the CISO or the treasurer can fix; both are bets the board is making whether or not it names them.</p>

      <DoNow>Before the build, read Kaplan &amp; Mikes (pathway step 2, ~20 min) for the three risk categories — it is the cleanest argument for why strategy risk needs a different management style from the preventable risks you logged earlier.</DoNow>

      <Stage n={2} kicker="Quantify — what the maths does" title="Why the number lies, and what to do instead" />
      <p className="measure">Be honest about the limit here: most strategic risk genuinely resists numbers, and forcing a probability × impact score on it does active harm — it launders a guess into a statistic and manufactures false confidence a board may then act on. The reason is structural, not a lack of effort. Probability × impact assumes a repeatable event with a stable base rate (the way a flood or a fraud loss does); a strategic bet is a near-unique event whose probability is unknowable and whose impact depends on choices not yet made. A “6% chance, €40m” entry for losing the top retailer looks precise, but the 6% is judgement, not data, and treating it as data is the false confidence. The honest move is to use the score as a rough <em>ranking</em> signal — which strategic risks are big enough to demand board attention — and nothing more.</p>

      <p className="measure">The tools that actually do work on strategic risk are qualitative and structured. <strong>Scenario analysis</strong> asks “what worlds could we plausibly be living in, and are we robust to each?” — you build two or three internally-consistent futures (private label takes 30% share; the top retailer halves its orders) and test whether the strategy survives each, rather than betting everything on one forecast. <strong>War-gaming</strong> role-plays the competitor’s and the disruptor’s moves and your responses, surfacing the threats a static plan misses. And <strong>real-options / staged-commitment thinking</strong> reframes the bet itself: instead of one large irreversible commitment, structure it as small, reversible bets that buy information and keep the future open — a pilot in one emerging market before the full roll-out, a brand-relaunch test in one country before all fourteen. The value of an option is that it lets you wait, learn, and abandon cheaply; under deep uncertainty, preserving optionality is often worth more than committing early to the highest expected-value plan. You’ll meet scenario methods formally in Part 4; here the discipline is to name the strategic risks, stress the assumptions behind them, and resist turning a judgement into a false statistic.</p>

      <MathBlock>
        <p>The honest “sizing” of a strategic bet is a key-assumption stress, not a probability. Write the bet’s value as a function of its critical assumptions and ask how much rides on each:</p>
        <p style={{ textAlign: 'center' }}><span className="eq">Value(strategy) = f(a₁, a₂, …, aₙ)</span>, &nbsp; sensitivity<sub>i</sub> = <span className="eq">∂Value / ∂aᵢ</span>.</p>
        <p>For Meridian’s margin bet, the load-bearing assumptions are <em>premium price holds</em> and <em>volumes don’t shift to private label</em>. Scenario analysis evaluates <span className="eq">f</span> at a few coherent settings of those assumptions (a base, a private-label-wins case, a top-retailer-exit case) and reports a <em>band</em> of value, not a point. Real-options thinking then adds a term most plans omit — the value of being able to <em>wait and abandon</em>: <span className="eq">Value = NPV(commit now) + Value(flexibility)</span>. A single probability × impact figure collapses all of this into one number and discards exactly the information — which assumption breaks the bet — that a board needs.</p>
      </MathBlock>

      <Stage n={3} kicker="Build it — your organization" title="Add your strategic risks" />
      <p className="measure">Now log the strategic family for your own organization. The discipline is different from the operational families: for each entry, name the <em>bet or assumption</em> it threatens (the market you’re entering, the model you depend on, the integration you must execute), and tie it to a stated objective the way Meridian’s R4 and R12 tie to its 13%-margin and emerging-market goals. Set an owner at board or CEO level — if a strategic risk’s owner is anyone lower, it is mis-owned, because no one below the top can change the strategy that drives it. Rough probability and impact numbers are fine as a ranking signal; the real value is naming risks that would otherwise have no home in the register at all.</p>

      <FamilyLens lessonId="3.2" artifactId="A10-strategic" family="Strategic" ownerHint="the board / CEO"
        sizing="Mostly judgement and scenarios, not arithmetic. Ask 'what world would have to be true for this to happen, and would we survive it?' rather than reaching for a single probability." />

      <p className="measure">Read each entry back through one test that catches a fake strategic risk: <em>could anyone below the board actually change the exposure?</em> If the honest mitigation is “diversify customers,” “exit the market,” or “rebuild the model,” it belongs here and at the top. If the mitigation is a control or a checklist, you have mis-filed an operational or compliance risk as strategic. The standard to hold the strategic lines to:</p>

      <Rubric
        title="a strong strategic-risk register entry"
        criteria={[
          { c: 'Tied to a stated objective', good: 'each entry names the strategy or objective it threatens, not a vague “market risk”' },
          { c: 'Correct sub-type named', good: 'identified as disruption, business-model, or execution risk — they need different responses' },
          { c: 'Owned at the top', good: 'board or CEO, because only they can change the strategy that drives it' },
          { c: 'Critical assumption surfaced', good: 'states the assumption that, if wrong, breaks the bet — the thing scenarios will stress' },
          { c: 'Right tool flagged', good: 'response framed as scenario / staged bet / war-game, not a single probability × impact score' },
        ]}
        exemplar="Meridian R4: business-model concentration (18% of revenue in one retailer) → threatens the growth objective → owned by CEO → assumption “the relationship holds” → response is diversify-or-deepen, tested by a top-retailer-exit scenario. Not a number; a bet made visible."
      />

      <p className="measure">A worked correction, because this is the most common strategic-risk mistake. A team logs: “Risk: we might lose market share. Probability 30%, impact €20m, owner: Head of Sales.” Three things are wrong, and fixing them is the whole craft. First, “lose market share” names a symptom, not a cause — apply the sub-types and ask <em>why</em>: is private label eroding the model (business-model risk) or is a new entrant disrupting the category (disruption)? Each demands a different response. Second, the owner is wrong: a Head of Sales can run a promotion, but cannot decide to reposition the brand or exit the segment — re-own it at the board. Third, the 30%/€20m precision is false comfort; replace it with a scenario (“if private label reaches 30% share, branded margin falls to X — do we still hit the 13% target?”) and a staged response (relaunch one brand in one country first). The repaired entry is less tidy and far more useful: it tells the board which assumption to watch and what reversible first step to take.</p>

      <ProblemSet items={[
        { q: 'Meridian’s R4 (lose the 18%-of-revenue top retailer) is filed as Strategic, but a colleague argues it is really a credit or operational risk. Who is right, and why does the classification matter?', solution: 'It is strategic. The exposure is not that the retailer might fail to pay (credit) or that a shipment might be disrupted (operational) — it is that the business model concentrates 18% of revenue, and 45% across the top five, in a handful of relationships the firm chose to build. The only real mitigations are strategic decisions only the board can take: diversify the customer base, deepen the relationship to raise switching costs, or knowingly accept the concentration as the price of scale. Classification matters because it sets the owner and the toolkit: filed as credit risk it would go to the treasurer with a probability-of-default lens; filed as strategic it goes to the CEO with a scenario-and-diversification lens. The wrong label sends the largest risk in the register to someone who cannot fix it.' },
        { q: 'Kodak saw digital photography coming — it built the first digital camera in 1975. If foresight wasn’t the problem, what was, and what would a risk function that took strategic risk seriously have done differently?', solution: 'The failure was in the response, not the foresight. Digital threatened to cannibalise Kodak’s high-margin film business, so acting on the visible threat meant deliberately destroying the profitable present to fund an uncertain future — the structurally hardest call a board makes, and the one Kodak ducked. A risk function treating strategic risk seriously would not have produced a better forecast; it would have forced the dialogue: naming “our core revenue model becomes obsolete” as the firm’s largest risk, owned by the board; running scenarios in which film volumes collapse and testing whether the strategy survives each; and pushing for staged, real-options bets in digital that kept the future open rather than an all-or-nothing defence of film. The point of strategic risk management is not prediction — it is making the board confront a threat it can already see but would rather not act on.' },
      ]} />

      <p className="measure">Strategic risk is the family that justifies the whole discipline: it is where the largest losses live and where risk management earns its seat at the strategy table or forfeits its relevance. But naming the bets is only half of it — a strategic risk almost never sits alone, and Meridian’s R4 worsens in the same downturn that hits R6, R11, and R12 together. Seeing how the families move <em>jointly</em>, rather than as a tidy list of silos, is the portfolio view that the rest of Part 3 builds toward.</p>
    </LessonShell>
  );
}
